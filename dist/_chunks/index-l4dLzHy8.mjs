import { useRef, useEffect } from "react";
import { jsx } from "react/jsx-runtime";
import { Trash } from "@strapi/icons";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "soft-delete";
const Initializer = ({ setPlugin }) => {
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsx(Trash, {});
const getTrad = (id) => `${PLUGIN_ID}.${id}`;
const permissions = {
  main: [{ action: `plugin::${PLUGIN_ID}.read`, subject: null }],
  settings: [{ action: `plugin::${PLUGIN_ID}.settings`, subject: null }]
};
const prefixPluginTranslations = (trad, pluginId) => {
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {});
};
const index = {
  register(app) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID
      },
      Component: async () => {
        const { App } = await import("./App-C8Mx2UMa.mjs");
        return App;
      }
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
    app.createSettingSection(
      { id: PLUGIN_ID, intlLabel: { id: getTrad("name"), defaultMessage: "Soft Delete" } },
      [
        {
          intlLabel: { id: getTrad("setting.restorationBehavior"), defaultMessage: "Restoration Behavior" },
          id: `${PLUGIN_ID}.setting.restorationBehavior`,
          to: `/settings/${PLUGIN_ID}/restoration-behavior`,
          Component: async () => {
            const component = await import(
              /* webpackChunkName: "[request]" */
              "./index-18BBUw-t.mjs"
            );
            return component;
          },
          permissions: permissions.settings
        }
      ]
    );
  },
  async registerTrads(app) {
    const { locales } = app;
    const importedTranslations = await Promise.all(
      locales.map((locale) => {
        return __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("./en-DwWhQUNY.mjs"), "./translations/fr.json": () => import("./fr-BV_CMinc.mjs") }), `./translations/${locale}.json`, 3).then(({ default: data }) => {
          return {
            data: prefixPluginTranslations(data, PLUGIN_ID),
            locale
          };
        }).catch(() => {
          return {
            data: {},
            locale
          };
        });
      })
    );
    return Promise.resolve(importedTranslations);
  }
};
export {
  PLUGIN_ID as P,
  getTrad as g,
  index as i,
  permissions as p
};
