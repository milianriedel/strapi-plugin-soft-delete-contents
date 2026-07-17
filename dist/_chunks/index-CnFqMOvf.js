"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const reactIntl = require("react-intl");
const designSystem = require("@strapi/design-system");
const icons = require("@strapi/icons");
const index = require("./index-DTajkfTQ.js");
const admin = require("@strapi/strapi/admin");
require("react-dom/client");
const users = require("./users-C_NekRcK.js");
require("react-router-dom");
require("@strapi/icons/symbols");
const RestorationBehavior = () => {
  const { formatMessage } = reactIntl.useIntl();
  const { get, put } = admin.useFetchClient();
  const [initialSettings, setInitialSettings] = React.useState(void 0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState(void 0);
  const singleTypesRestorationOptions = [
    {
      label: formatMessage({ id: index.getTrad("setting.restorationBehavior.softDeleteExisting"), defaultMessage: "Soft Delete existing" }),
      value: "soft-delete"
    },
    {
      label: formatMessage({ id: index.getTrad("setting.restorationBehavior.deletePermanentlyExisting"), defaultMessage: "Delete Permanently existing" }),
      value: "delete-permanently"
    }
  ];
  const [singleTypesRestorationBehavior, setSingleTypesRestorationBehavior] = React.useState(singleTypesRestorationOptions[0].value);
  const draftPublishRestorationOptions = [
    {
      label: formatMessage({ id: index.getTrad("setting.restorationBehavior.draft"), defaultMessage: "Draft" }),
      value: "draft"
    },
    {
      label: formatMessage({ id: index.getTrad("setting.restorationBehavior.unchanged"), defaultMessage: "Unchanged" }),
      value: "unchanged"
    }
  ];
  const [draftPublishRestorationBehavior, setDraftPublishRestorationBehavior] = React.useState(draftPublishRestorationOptions[0].value);
  const [hasChanged, setHasChanged] = React.useState(false);
  React.useEffect(() => {
    if (initialSettings) {
      setHasChanged(
        initialSettings.singleTypesRestorationBehavior !== singleTypesRestorationBehavior || initialSettings.draftPublishRestorationBehavior !== draftPublishRestorationBehavior
      );
    }
  }, [initialSettings, singleTypesRestorationBehavior, draftPublishRestorationBehavior]);
  React.useEffect(() => {
    setIsLoading(true);
    get(`/${index.PLUGIN_ID}/settings`).catch((error) => {
      setAlert({
        variant: "danger",
        message: formatMessage({ id: index.getTrad("settings.load.error"), defaultMessage: "Error while loading Settings" }),
        error
      });
    }).then((response) => {
      setInitialSettings(response.data);
      setSingleTypesRestorationBehavior(response.data.singleTypesRestorationBehavior);
      setDraftPublishRestorationBehavior(response.data.draftPublishRestorationBehavior);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);
  const save = () => {
    setIsLoading(true);
    put(`/${index.PLUGIN_ID}/settings`, {
      singleTypesRestorationBehavior,
      draftPublishRestorationBehavior
    }).catch((error) => {
      setAlert({
        variant: "danger",
        message: formatMessage({ id: index.getTrad("settings.save.error"), defaultMessage: "Error while saving Settings" }),
        error
      });
    }).then((response) => {
      setInitialSettings(response.data);
      setAlert({
        variant: "success",
        message: formatMessage({ id: index.getTrad("settings.save.success"), defaultMessage: "Successfully saved Setings" })
      });
    }).finally(() => {
      setIsLoading(false);
      setTimeout(() => {
        setAlert(void 0);
      }, 3e3);
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    alert && /* @__PURE__ */ jsxRuntime.jsxs(
      designSystem.Alert,
      {
        position: "fixed",
        top: "5%",
        left: "40%",
        zIndex: "100",
        variant: alert.variant,
        onClose: () => setAlert(void 0),
        children: [
          alert.message,
          " ",
          alert.error?.message
        ]
      }
    ) || /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {}),
    /* @__PURE__ */ jsxRuntime.jsx(designSystem.Box, { background: "neutral100", children: /* @__PURE__ */ jsxRuntime.jsxs(users.Layouts.Root, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        users.Layouts.Header,
        {
          title: formatMessage({ id: index.getTrad("setting.restorationBehavior"), defaultMessage: "Restoration Behavior" }),
          as: "h1",
          primaryAction: /* @__PURE__ */ jsxRuntime.jsx(
            designSystem.Button,
            {
              startIcon: /* @__PURE__ */ jsxRuntime.jsx(icons.Check, {}),
              disabled: !hasChanged || isLoading,
              onClick: save,
              loading: isLoading,
              children: formatMessage({ id: index.getTrad("save"), defaultMessage: "Save" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(users.Layouts.Content, { children: /* @__PURE__ */ jsxRuntime.jsxs(
        designSystem.Flex,
        {
          hasRadius: true,
          background: "neutral0",
          width: "100%",
          padding: 6,
          direction: "column",
          alignItems: "stretch",
          gap: 6,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.SingleSelect,
              {
                disabled: isLoading,
                value: singleTypesRestorationBehavior,
                onChange: setSingleTypesRestorationBehavior,
                label: formatMessage({ id: index.getTrad("explorer.singleTypes"), defaultMessage: "Single Types" }),
                hint: formatMessage({ id: index.getTrad("setting.restorationBehavior.singleTypes.hint"), defaultMessage: "Single types cannot be restored in the same way as collections. You can choose to soft delete the existing unique type or delete it permanently." }),
                children: singleTypesRestorationOptions.map(({ label, value }) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value, children: label }, value))
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              designSystem.SingleSelect,
              {
                disabled: isLoading,
                value: draftPublishRestorationBehavior,
                onChange: setDraftPublishRestorationBehavior,
                label: formatMessage({ id: index.getTrad("explorer.draftPublish"), defaultMessage: "Draft & Publish" }),
                hint: formatMessage({ id: index.getTrad("setting.restorationBehavior.draftPublish.hint"), defaultMessage: "You can choose to restore an entry supporting Draft & Publish to a draft or unchanged." }),
                children: draftPublishRestorationOptions.map(({ label, value }) => /* @__PURE__ */ jsxRuntime.jsx(designSystem.SingleSelectOption, { value, children: label }, value))
              }
            )
          ]
        }
      ) })
    ] }) })
  ] });
};
exports.default = RestorationBehavior;
