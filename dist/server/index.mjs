const supportsContentType = (uid) => {
  return uid?.match(/^api::/) || false;
};
const PLUGIN_ID = "soft-delete";
const getSoftDeletedByAuth = (auth) => {
  const id = auth.credentials?.id || null;
  const strategy = auth.strategy.name;
  return { id, strategy };
};
const getService = (name) => {
  return strapi.plugin(PLUGIN_ID).service(name);
};
const eventHubEmit = async (params) => {
  const modelDef = strapi.getModel(params.uid);
  const sanitizedEntity = await strapi.contentAPI.sanitize.output(
    params.entity,
    modelDef
  );
  strapi.eventHub.emit(params.event, {
    model: modelDef.modelName,
    uid: params.uid,
    plugin: {
      id: PLUGIN_ID,
      action: params.action
    },
    entry: sanitizedEntity
  });
};
const sdWrapParams = (opts, uid) => {
  if (!supportsContentType(uid)) {
    return opts;
  }
  if (opts.data) {
    delete opts.data._softDeletedAt;
    delete opts.data._softDeletedById;
    delete opts.data._softDeletedByType;
  }
  return {
    ...opts,
    filters: opts.where ?? opts.filters,
    populate: opts.populate,
    locale: opts.locale,
    status: opts.publicationState,
    data: opts.data,
    documentId: opts.id ?? opts.documentId
  };
};
const bootstrap = async ({ strapi: strapi2 }) => {
  const pluginStore = strapi2.store({
    environment: strapi2.config.environment,
    type: "plugin",
    name: PLUGIN_ID
  });
  const pluginStoreSettings = await pluginStore.get({ key: "settings" });
  if (!pluginStoreSettings || !pluginStoreSettings.singleTypesRestorationBehavior || !pluginStoreSettings.draftPublishRestorationBehavior) {
    const defaultSettings = {
      singleTypesRestorationBehavior: pluginStoreSettings?.singleTypesRestorationBehavior || "soft-delete",
      draftPublishRestorationBehavior: pluginStoreSettings?.draftPublishRestorationBehavior || "unchanged"
    };
    await pluginStore.set({ key: "settings", value: defaultSettings });
  }
  strapi2.admin.services.permission.actionProvider.get("plugin::content-manager.explorer.delete").displayName = "Soft Delete";
  const migrationReadViewDeletedRan = await pluginStore.get({ key: "migration_explorer_read_to_view_deleted" });
  if (!migrationReadViewDeletedRan) {
    await strapi2.db.connection("admin_permissions").where({ action: "plugin::soft-delete.explorer.read" }).update({ action: "plugin::soft-delete.explorer.view-deleted" });
    await pluginStore.set({ key: "migration_explorer_read_to_view_deleted", value: true });
  }
  const contentTypeUids = Object.keys(strapi2.contentTypes).filter(supportsContentType);
  strapi2.admin.services.permission.actionProvider.register({
    uid: "read",
    displayName: "Read",
    pluginName: PLUGIN_ID,
    section: "plugins"
  });
  strapi2.admin.services.permission.actionProvider.register({
    uid: "settings",
    displayName: "Settings",
    pluginName: PLUGIN_ID,
    section: "plugins"
  });
  strapi2.admin.services.permission.actionProvider.register({
    uid: "explorer.view-deleted",
    options: { applyToProperties: ["locales"] },
    section: "contentTypes",
    displayName: "Deleted Read",
    pluginName: PLUGIN_ID,
    subjects: contentTypeUids
  });
  strapi2.admin.services.permission.actionProvider.register({
    uid: "explorer.restore",
    options: { applyToProperties: ["locales"] },
    section: "contentTypes",
    displayName: "Deleted Restore",
    pluginName: PLUGIN_ID,
    subjects: contentTypeUids
  });
  strapi2.admin.services.permission.actionProvider.register({
    uid: "explorer.delete-permanently",
    options: { applyToProperties: ["locales"] },
    section: "contentTypes",
    displayName: "Delete Permanently",
    pluginName: PLUGIN_ID,
    subjects: contentTypeUids
  });
  const defaultEventHubEmit = strapi2.eventHub.emit;
  strapi2.eventHub.emit = async (event, ...args) => {
    const data = args[0];
    if (supportsContentType(data.uid) && event === "entry.update" && data.plugin?.id !== PLUGIN_ID) {
      const entry = await strapi2.query(data.uid).findOne({
        select: "id",
        // Just select the id, we just need to know if it exists
        where: {
          id: data.entry.id,
          _softDeletedAt: null
        }
      });
      if (!entry) {
        return;
      }
    }
    await defaultEventHubEmit(event, ...args);
  };
  strapi2.documents.use(async (context, next) => {
    const { action, params, uid } = context;
    if (!supportsContentType(uid)) {
      return await next();
    }
    const reqCtx = strapi2.requestContext.get();
    const { id: authId, strategy: authStrategy } = getSoftDeletedByAuth(reqCtx.state.auth);
    if (action === "delete") {
      const wrapped = sdWrapParams(params, uid);
      context.params = {
        ...wrapped,
        data: {
          ...wrapped.data,
          _softDeletedAt: Date.now(),
          _softDeletedById: authId,
          _softDeletedByType: authStrategy
        }
      };
      const result = await strapi2.documents(uid).update({
        documentId: context.params.documentId,
        data: context.params.data
      });
      eventHubEmit({ uid, event: "entry.delete", action: "soft-delete", entity: result });
      return result;
    }
    if (action === "deleteMany") {
      const wrapped = sdWrapParams(params, uid);
      const entities = await strapi2.documents(uid).findMany({ ...wrapped, filters: wrapped.where });
      const deleted = [];
      for (const entity of entities) {
        const docParams = {
          ...wrapped,
          data: {
            ...wrapped.data,
            _softDeletedAt: Date.now(),
            _softDeletedById: authId,
            _softDeletedByType: authStrategy
          },
          documentId: entity.id
        };
        context.params = docParams;
        const res = await next();
        deleted.push(res);
        eventHubEmit({ uid, event: "entry.delete", action: "soft-delete", entity: res });
      }
      return deleted;
    }
    if (action === "findOne" || action === "findMany" || action === "count") {
      context.params = {
        ...params,
        filters: {
          ...params.filters || {},
          _softDeletedAt: { $null: true }
        }
      };
    }
    return await next();
  });
};
const destroy = ({ strapi: strapi2 }) => {
};
const register = ({ strapi: strapi2 }) => {
  for (let contentTypeRecord of Object.entries(strapi2.contentTypes)) {
    const [uid, contentType] = contentTypeRecord;
    if (supportsContentType(uid)) {
      const _softDeletedAt = {
        type: "datetime",
        configurable: false,
        writable: false,
        visible: false,
        private: true
      };
      contentType.attributes._softDeletedAt = _softDeletedAt;
      contentType.__schema__.attributes._softDeletedAt = _softDeletedAt;
      const _softDeletedById = {
        type: "integer",
        configurable: false,
        writable: false,
        visible: false,
        private: true
      };
      contentType.attributes._softDeletedById = _softDeletedById;
      contentType.__schema__.attributes._softDeletedById = _softDeletedById;
      const _softDeletedByType = {
        type: "string",
        configurable: false,
        writable: false,
        visible: false,
        private: true
      };
      contentType.attributes._softDeletedByType = _softDeletedByType;
      contentType.__schema__.attributes._softDeletedByType = _softDeletedByType;
    }
  }
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
const admin$1 = ({ strapi: strapi2 }) => ({
  async findOne(ctx) {
    const service = getService("admin");
    return await service.findOne(ctx);
  },
  async findMany(ctx) {
    const service = getService("admin");
    return await service.findMany(ctx);
  },
  async delete(ctx) {
    const service = getService("admin");
    return await service.delete(ctx);
  },
  async restore(ctx) {
    const service = getService("admin");
    return await service.restore(ctx);
  },
  async deleteMany(ctx) {
    const service = getService("admin");
    return await service.deleteMany(ctx);
  },
  async restoreMany(ctx) {
    const service = getService("admin");
    return await service.restoreMany(ctx);
  },
  async getSettings(ctx) {
    const service = getService("admin");
    return await service.getSettings(ctx);
  },
  async setSettings(ctx) {
    const service = getService("admin");
    return await service.setSettings(ctx.request.body);
  }
});
const controllers = {
  admin: admin$1
};
const middlewares = {};
const adminCanRead = (policyContext, config2, { strapi: strapi2 }) => {
  const { userAbility } = policyContext.state;
  return userAbility.can(`plugin::${PLUGIN_ID}.explorer.view-deleted`, policyContext.params.uid);
};
const adminCanRestore = (policyContext, config2, { strapi: strapi2 }) => {
  const { userAbility } = policyContext.state;
  return userAbility.can(`plugin::${PLUGIN_ID}.explorer.restore`, policyContext.params.uid);
};
const adminCanDeletePermanently = (policyContext, config2, { strapi: strapi2 }) => {
  const { userAbility } = policyContext.state;
  return userAbility.can(`plugin::${PLUGIN_ID}.explorer.delete-permanently`, policyContext.params.uid);
};
const policies = {
  adminCanRead,
  adminCanRestore,
  adminCanDeletePermanently
};
const adminContentTypes = [
  {
    method: "GET",
    path: "/:kind/:uid",
    handler: "admin.findMany",
    config: {
      policies: ["adminCanRead"]
    }
  },
  {
    method: "GET",
    path: "/:kind/:uid/:id",
    handler: "admin.findOne",
    config: {
      policies: ["adminCanRead"]
    }
  },
  {
    method: "DELETE",
    path: "/:kind/:uid/:id/delete",
    handler: "admin.delete",
    config: {
      policies: ["adminCanDeletePermanently"]
    }
  },
  {
    method: "PUT",
    path: "/:kind/:uid/:id/restore",
    handler: "admin.restore",
    config: {
      policies: ["adminCanRestore"]
    }
  },
  {
    method: "PUT",
    path: "/:kind/:uid/delete",
    handler: "admin.deleteMany",
    config: {
      policies: ["adminCanDeletePermanently"]
    }
  },
  {
    method: "PUT",
    path: "/:kind/:uid/restore",
    handler: "admin.restoreMany",
    config: {
      policies: ["adminCanRestore"]
    }
  }
];
const adminSettings = [
  {
    method: "GET",
    path: "/settings",
    handler: "admin.getSettings",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  },
  {
    method: "PUT",
    path: "/settings",
    handler: "admin.setSettings",
    config: {
      policies: ["admin::isAuthenticatedAdmin"]
    }
  }
];
const routes = {
  admin: {
    type: "admin",
    routes: [...adminContentTypes, ...adminSettings]
  }
};
const getSoftDeletedByEntry = async (entry) => {
  const _softDeletedBy = {
    id: entry._softDeletedById,
    type: entry._softDeletedByType
  };
  if (entry._softDeletedById && entry._softDeletedByType) {
    try {
      switch (entry._softDeletedByType) {
        case "admin":
          const adminUser = await strapi.entityService.findOne("admin::user", entry._softDeletedById);
          _softDeletedBy.name = adminUser.username || (adminUser.firstname || adminUser.lastname ? adminUser.firstname + " " + adminUser.lastname : false) || adminUser.email;
          break;
        case "api-token":
          const apiToken = await strapi.entityService.findOne("admin::api-token", entry._softDeletedById);
          _softDeletedBy.name = apiToken.name;
          break;
        case "transfer-token":
          const transferToken = await strapi.entityService.findOne("admin::transfer-token", entry._softDeletedById);
          _softDeletedBy.name = transferToken.name;
          break;
        case "users-premissions":
          const user = await strapi.entityService.findOne("plugin::users-permissions.user", entry._softDeletedById);
          _softDeletedBy.name = user.username || user.email;
          break;
      }
    } catch (error) {
    }
  }
  return _softDeletedBy;
};
const admin = ({ strapi: strapi2 }) => ({
  pluginStore: strapi2.store({
    environment: strapi2.config.environment,
    type: "plugin",
    name: PLUGIN_ID
  }),
  async findOne(ctx) {
    const entry = await strapi2.query(ctx.params.uid).findOne({
      select: "*",
      where: {
        id: ctx.params.id,
        _softDeletedAt: {
          $ne: null
        }
      }
    });
    return {
      ...entry,
      _softDeletedById: void 0,
      _softDeletedByType: void 0,
      _softDeletedBy: await getSoftDeletedByEntry(entry)
    };
  },
  async findMany(ctx) {
    return await Promise.all((await strapi2.query(ctx.params.uid).findMany({
      select: "*",
      where: {
        _softDeletedAt: {
          $ne: null
        }
      },
      orderBy: {
        _softDeletedAt: "desc"
      }
    })).map(async (entry) => {
      return {
        ...entry,
        _softDeletedById: void 0,
        _softDeletedByType: void 0,
        _softDeletedBy: await getSoftDeletedByEntry(entry)
      };
    }));
  },
  delete(ctx) {
    const entity = strapi2.query(ctx.params.uid).delete({
      where: {
        id: ctx.params.id
      }
    });
    eventHubEmit({
      uid: ctx.params.uid,
      event: "entry.delete",
      action: "delete-permanently",
      entity
    });
    return entity;
  },
  async restore(ctx) {
    const pluginSettings = await this.pluginStore.get({ key: "settings" });
    let publishedAt = void 0;
    if (strapi2.contentTypes[ctx.params.uid].options?.draftAndPublish && pluginSettings.draftPublishRestorationBehavior === "draft") {
      publishedAt = null;
    }
    const entry = await strapi2.query(ctx.params.uid).update({
      where: {
        id: ctx.params.id
      },
      data: {
        _softDeletedAt: null,
        _softDeletedById: null,
        _softDeletedByType: null,
        publishedAt
      }
    });
    eventHubEmit({
      uid: ctx.params.uid,
      event: "entry.update",
      action: "restore",
      entity: entry
    });
    if (strapi2.contentTypes[ctx.params.uid].options?.draftAndPublish && pluginSettings.draftPublishRestorationBehavior === "draft") {
      if (entry.publishedAt !== null) {
        eventHubEmit({
          uid: ctx.params.uid,
          event: "entry.unpublish",
          action: "restore",
          entity: { ...entry, publishedAt: null }
        });
      }
    }
    if (ctx.params.kind === "singleType") {
      const notTargettedEntriesWhere = {
        id: {
          $ne: ctx.params.id
        },
        _softDeletedAt: null
      };
      const notTargettedEntries = await strapi2.query(ctx.params.uid).findMany({
        select: "*",
        where: notTargettedEntriesWhere
      });
      switch (pluginSettings.singleTypesRestorationBehavior) {
        case "soft-delete":
          const { id: authId, strategy: authStrategy } = getSoftDeletedByAuth(ctx.state.auth);
          await strapi2.query(ctx.params.uid).updateMany({
            where: notTargettedEntriesWhere,
            data: {
              _softDeletedAt: Date.now(),
              _softDeletedById: authId,
              _softDeletedByType: authStrategy
            }
          });
          break;
        case "delete-permanently":
          await strapi2.query(ctx.params.uid).deleteMany({
            where: notTargettedEntriesWhere
          });
          break;
      }
      for (const notTargettedEntry of notTargettedEntries) {
        eventHubEmit({
          uid: ctx.params.uid,
          event: pluginSettings.singleTypesRestorationBehavior === "soft-delete" ? "entry.update" : "entry.delete",
          action: pluginSettings.singleTypesRestorationBehavior,
          entity: notTargettedEntry
        });
      }
    }
    strapi2.eventHub.emit("CM.listView.reload");
    return entry;
  },
  async deleteMany(ctx) {
    const entries = await strapi2.query(ctx.params.uid).findMany({
      select: "*",
      where: {
        id: ctx.request.body.data.ids
      }
    });
    const result = await strapi2.query(ctx.params.uid).deleteMany({
      where: {
        id: ctx.request.body.data.ids
      }
    });
    for (const entry of entries) {
      eventHubEmit({
        uid: ctx.params.uid,
        event: "entry.delete",
        action: "delete-permanently",
        entity: entry
      });
    }
    return result;
  },
  async restoreMany(ctx) {
    const entries = await strapi2.query(ctx.params.uid).findMany({
      select: "*",
      where: {
        id: ctx.request.body.data.ids
      }
    });
    const pluginSettings = await this.pluginStore.get({ key: "settings" });
    let publishedAt = void 0;
    if (strapi2.contentTypes[ctx.params.uid].options?.draftAndPublish && pluginSettings.draftPublishRestorationBehavior === "draft") {
      publishedAt = null;
    }
    const result = await strapi2.query(ctx.params.uid).updateMany({
      where: {
        id: ctx.request.body.data.ids
      },
      data: {
        _softDeletedAt: null,
        _softDeletedById: null,
        _softDeletedByType: null,
        publishedAt
      }
    });
    for (const entry of entries) {
      eventHubEmit({
        uid: ctx.params.uid,
        event: "entry.update",
        action: "restore",
        entity: entry
      });
      if (strapi2.contentTypes[ctx.params.uid].options?.draftAndPublish && pluginSettings.draftPublishRestorationBehavior === "draft") {
        if (entry.publishedAt !== null) {
          eventHubEmit({
            uid: ctx.params.uid,
            event: "entry.unpublish",
            action: "restore",
            entity: { ...entry, publishedAt: null }
          });
        }
      }
    }
    if (ctx.params.kind === "singleType") {
      const notTargettedEntriesWhere = {
        id: {
          $notIn: ctx.request.body.data.ids
        },
        _softDeletedAt: null
      };
      const notTargettedEntries = await strapi2.query(ctx.params.uid).findMany({
        select: "*",
        where: notTargettedEntriesWhere
      });
      switch (pluginSettings.singleTypesRestorationBehavior) {
        case "soft-delete":
          const { id: authId, strategy: authStrategy } = getSoftDeletedByAuth(ctx.state.auth);
          await strapi2.query(ctx.params.uid).updateMany({
            where: notTargettedEntriesWhere,
            data: {
              _softDeletedAt: Date.now(),
              _softDeletedById: authId,
              _softDeletedByType: authStrategy
            }
          });
          break;
        case "delete-permanently":
          await strapi2.query(ctx.params.uid).deleteMany({
            where: notTargettedEntriesWhere
          });
          break;
      }
      for (const notTargettedEntry of notTargettedEntries) {
        eventHubEmit({
          uid: ctx.params.uid,
          event: pluginSettings.singleTypesRestorationBehavior === "soft-delete" ? "entry.update" : "entry.delete",
          action: pluginSettings.singleTypesRestorationBehavior,
          entity: notTargettedEntry
        });
      }
    }
    return result;
  },
  async getSettings() {
    return await this.pluginStore.get({ key: "settings" });
  },
  async setSettings(settings) {
    await this.pluginStore.set({ key: "settings", value: settings });
    return await this.pluginStore.get({ key: "settings" });
  }
});
const services = {
  admin
};
const index = {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares
};
export {
  index as default
};
