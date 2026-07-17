import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Alert, Box, Button, Flex, SingleSelect, SingleSelectOption } from "@strapi/design-system";
import { Check } from "@strapi/icons";
import { g as getTrad, P as PLUGIN_ID } from "./index-l4dLzHy8.mjs";
import { useFetchClient } from "@strapi/strapi/admin";
import "react-dom/client";
import { L as Layouts } from "./users-CKEDQRsj.mjs";
import "react-router-dom";
import "@strapi/icons/symbols";
const RestorationBehavior = () => {
  const { formatMessage } = useIntl();
  const { get, put } = useFetchClient();
  const [initialSettings, setInitialSettings] = useState(void 0);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(void 0);
  const singleTypesRestorationOptions = [
    {
      label: formatMessage({ id: getTrad("setting.restorationBehavior.softDeleteExisting"), defaultMessage: "Soft Delete existing" }),
      value: "soft-delete"
    },
    {
      label: formatMessage({ id: getTrad("setting.restorationBehavior.deletePermanentlyExisting"), defaultMessage: "Delete Permanently existing" }),
      value: "delete-permanently"
    }
  ];
  const [singleTypesRestorationBehavior, setSingleTypesRestorationBehavior] = useState(singleTypesRestorationOptions[0].value);
  const draftPublishRestorationOptions = [
    {
      label: formatMessage({ id: getTrad("setting.restorationBehavior.draft"), defaultMessage: "Draft" }),
      value: "draft"
    },
    {
      label: formatMessage({ id: getTrad("setting.restorationBehavior.unchanged"), defaultMessage: "Unchanged" }),
      value: "unchanged"
    }
  ];
  const [draftPublishRestorationBehavior, setDraftPublishRestorationBehavior] = useState(draftPublishRestorationOptions[0].value);
  const [hasChanged, setHasChanged] = useState(false);
  useEffect(() => {
    if (initialSettings) {
      setHasChanged(
        initialSettings.singleTypesRestorationBehavior !== singleTypesRestorationBehavior || initialSettings.draftPublishRestorationBehavior !== draftPublishRestorationBehavior
      );
    }
  }, [initialSettings, singleTypesRestorationBehavior, draftPublishRestorationBehavior]);
  useEffect(() => {
    setIsLoading(true);
    get(`/${PLUGIN_ID}/settings`).catch((error) => {
      setAlert({
        variant: "danger",
        message: formatMessage({ id: getTrad("settings.load.error"), defaultMessage: "Error while loading Settings" }),
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
    put(`/${PLUGIN_ID}/settings`, {
      singleTypesRestorationBehavior,
      draftPublishRestorationBehavior
    }).catch((error) => {
      setAlert({
        variant: "danger",
        message: formatMessage({ id: getTrad("settings.save.error"), defaultMessage: "Error while saving Settings" }),
        error
      });
    }).then((response) => {
      setInitialSettings(response.data);
      setAlert({
        variant: "success",
        message: formatMessage({ id: getTrad("settings.save.success"), defaultMessage: "Successfully saved Setings" })
      });
    }).finally(() => {
      setIsLoading(false);
      setTimeout(() => {
        setAlert(void 0);
      }, 3e3);
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    alert && /* @__PURE__ */ jsxs(
      Alert,
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
    ) || /* @__PURE__ */ jsx(Fragment, {}),
    /* @__PURE__ */ jsx(Box, { background: "neutral100", children: /* @__PURE__ */ jsxs(Layouts.Root, { children: [
      /* @__PURE__ */ jsx(
        Layouts.Header,
        {
          title: formatMessage({ id: getTrad("setting.restorationBehavior"), defaultMessage: "Restoration Behavior" }),
          as: "h1",
          primaryAction: /* @__PURE__ */ jsx(
            Button,
            {
              startIcon: /* @__PURE__ */ jsx(Check, {}),
              disabled: !hasChanged || isLoading,
              onClick: save,
              loading: isLoading,
              children: formatMessage({ id: getTrad("save"), defaultMessage: "Save" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(Layouts.Content, { children: /* @__PURE__ */ jsxs(
        Flex,
        {
          hasRadius: true,
          background: "neutral0",
          width: "100%",
          padding: 6,
          direction: "column",
          alignItems: "stretch",
          gap: 6,
          children: [
            /* @__PURE__ */ jsx(
              SingleSelect,
              {
                disabled: isLoading,
                value: singleTypesRestorationBehavior,
                onChange: setSingleTypesRestorationBehavior,
                label: formatMessage({ id: getTrad("explorer.singleTypes"), defaultMessage: "Single Types" }),
                hint: formatMessage({ id: getTrad("setting.restorationBehavior.singleTypes.hint"), defaultMessage: "Single types cannot be restored in the same way as collections. You can choose to soft delete the existing unique type or delete it permanently." }),
                children: singleTypesRestorationOptions.map(({ label, value }) => /* @__PURE__ */ jsx(SingleSelectOption, { value, children: label }, value))
              }
            ),
            /* @__PURE__ */ jsx(
              SingleSelect,
              {
                disabled: isLoading,
                value: draftPublishRestorationBehavior,
                onChange: setDraftPublishRestorationBehavior,
                label: formatMessage({ id: getTrad("explorer.draftPublish"), defaultMessage: "Draft & Publish" }),
                hint: formatMessage({ id: getTrad("setting.restorationBehavior.draftPublish.hint"), defaultMessage: "You can choose to restore an entry supporting Draft & Publish to a draft or unchanged." }),
                children: draftPublishRestorationOptions.map(({ label, value }) => /* @__PURE__ */ jsx(SingleSelectOption, { value, children: label }, value))
              }
            )
          ]
        }
      ) })
    ] }) })
  ] });
};
export {
  RestorationBehavior as default
};
