import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useFetchClient, useAuth, Layouts, Page as Page$1 } from "@strapi/strapi/admin";
import { NavLink, useParams, useNavigate, Routes, Route } from "react-router-dom";
import * as React from "react";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Flex, Loader, Link, Table, Thead, Tr, Th, Checkbox, Typography, IconButton, VisuallyHidden, Tbody, Td, Modal, Button, Alert, Box, SubNav, SubNavHeader, SubNavSections, SubNavSection, SubNavLink, DesignSystemProvider } from "@strapi/design-system";
import "react-dom/client";
import { L as Layouts$1 } from "./users-CKEDQRsj.mjs";
import { ArrowLeft, ArrowClockwise, Trash } from "@strapi/icons";
import { EmptyDocuments, EmptyPermissions } from "@strapi/icons/symbols";
import { P as PLUGIN_ID, g as getTrad, p as permissions } from "./index-l4dLzHy8.mjs";
const Title = ({ children: title }) => {
  React.useEffect(() => {
    document.title = `${title} | Strapi`;
  }, [
    title
  ]);
  return null;
};
const Page = {
  Title
};
const supportsContentType = (uid) => {
  return uid?.match(/^api::/) || false;
};
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument required, but only " + args.length + " present");
  }
}
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}
function parseISO(argument, options) {
  var _options$additionalDi;
  requiredArgs(1, arguments);
  var additionalDigits = toInteger((_options$additionalDi = void 0) !== null && _options$additionalDi !== void 0 ? _options$additionalDi : 2);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  }
  if (!(typeof argument === "string" || Object.prototype.toString.call(argument) === "[object String]")) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var dateStrings = splitDateString(argument);
  var date;
  if (dateStrings.date) {
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var timestamp = date.getTime();
  var time = 0;
  var offset;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  } else {
    var dirtyDate = new Date(timestamp + time);
    var result = /* @__PURE__ */ new Date(0);
    result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
    result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
    return result;
  }
  return new Date(timestamp + time + offset);
}
var patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimiter);
  var timeString;
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }
  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  var regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
  var captures = dateString.match(regex);
  if (!captures) return {
    year: NaN,
    restDateString: ""
  };
  var year = captures[1] ? parseInt(captures[1]) : null;
  var century = captures[2] ? parseInt(captures[2]) : null;
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  if (year === null) return /* @__PURE__ */ new Date(NaN);
  var captures = dateString.match(dateRegex);
  if (!captures) return /* @__PURE__ */ new Date(NaN);
  var isWeekDate = !!captures[4];
  var dayOfYear = parseDateUnit(captures[1]);
  var month = parseDateUnit(captures[2]) - 1;
  var day = parseDateUnit(captures[3]);
  var week = parseDateUnit(captures[4]);
  var dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    var date = /* @__PURE__ */ new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  var captures = timeString.match(timeRegex);
  if (!captures) return NaN;
  var hours = parseTimeUnit(captures[1]);
  var minutes = parseTimeUnit(captures[2]);
  var seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;
  var captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;
  var sign = captures[1] === "+" ? -1 : 1;
  var hours = parseInt(captures[2]);
  var minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  var date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}
const ContentTypeEntries = ({ contentType }) => {
  const { formatMessage, formatDate } = useIntl();
  const { get, put } = useFetchClient();
  const allPermissions = useAuth("MY_PLUGIN_ID", (state) => state.permissions);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [mainField, setMainField] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedEntriesId, setSelectedEntriesId] = useState([]);
  const [alert, setAlert] = useState(void 0);
  const canRestore = allPermissions.some(
    (permission) => permission.action === `plugin::${PLUGIN_ID}.explorer.restore` && permission.subject === contentType?.uid
  );
  const canDeletePermanantly = allPermissions.some(
    (permission) => permission.action === `plugin::${PLUGIN_ID}.explorer.delete-permanently` && permission.subject === contentType?.uid
  );
  const canReadMainField = mainField && allPermissions.some(
    (permission) => permission.action === "plugin::content-manager.explorer.read" && permission.subject === contentType?.uid && permission.properties.fields.includes(mainField)
  );
  useEffect(() => {
    setSelectedEntriesId([]);
    setEntries([]);
    setMainField(null);
    if (!contentType) return;
    setIsLoading(true);
    get(`/content-manager/content-types/${contentType.uid}/configuration`).then((response) => {
      setMainField(response.data.data.contentType.settings.mainField);
    }).catch((error) => {
      setLoadingError(error);
    });
    get(`/${PLUGIN_ID}/${contentType.kind}/${contentType.uid}`).then((response) => {
      setEntries(response.data);
    }).catch((error) => {
      setLoadingError(error);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [contentType]);
  const [restoreModalEntriesId, setRestoreModalEntriesId] = useState([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const confirmRestore = () => {
    if (isRestoring) return;
    setAlert(void 0);
    setIsRestoring(true);
    put(`/${PLUGIN_ID}/${contentType?.kind}/${contentType?.uid}/restore`, {
      data: {
        ids: restoreModalEntriesId
      }
    }).then(() => {
      setEntries(entries.filter((entry) => !restoreModalEntriesId.includes(entry.id)));
      setSelectedEntriesId([]);
      setAlert({
        variant: "success",
        message: formatMessage({ id: getTrad("explorer.restore.success"), defaultMessage: "Entries restored successfully" })
      });
    }).catch((error) => {
      setAlert({
        variant: "danger",
        message: formatMessage({ id: getTrad("explorer.restore.error"), defaultMessage: "Error restoring entries" })
      });
    }).finally(() => {
      setRestoreModalEntriesId([]);
      setIsRestoring(false);
      setTimeout(() => {
        setAlert(void 0);
      }, 3e3);
    });
  };
  const [deletePermanentlyModalEntriesId, setDeletePermanentlyModalEntriesId] = useState([]);
  const [isDeletingPermanently, setIsDeletingPermanently] = useState(false);
  const confirmDeletePermanently = () => {
    if (isDeletingPermanently) return;
    setAlert(void 0);
    setIsDeletingPermanently(true);
    put(`/${PLUGIN_ID}/${contentType?.kind}/${contentType?.uid}/delete`, {
      data: {
        ids: deletePermanentlyModalEntriesId
      }
    }).then(() => {
      setEntries(entries.filter((entry) => !deletePermanentlyModalEntriesId.includes(entry.id)));
      setSelectedEntriesId([]);
      setAlert({
        variant: "success",
        message: formatMessage({ id: getTrad("explorer.deletePermanently.success"), defaultMessage: "Entries deleted permanently successfully" })
      });
    }).catch((error) => {
      setAlert({
        variant: "danger",
        message: formatMessage({ id: getTrad("explorer.deletePermanently.error"), defaultMessage: "Error deleting entries permanently" })
      });
    }).finally(() => {
      setDeletePermanentlyModalEntriesId([]);
      setIsDeletingPermanently(false);
      setTimeout(() => {
        setAlert(void 0);
      }, 3e3);
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isLoading && /* @__PURE__ */ jsx(Flex, { justifyContent: "center", alignItems: "center", height: "100%", children: /* @__PURE__ */ jsx(Loader, {}) }),
    !isLoading && !loadingError && contentType && /* @__PURE__ */ jsx(
      Layouts.Header,
      {
        navigationAction: /* @__PURE__ */ jsx(Link, { tag: NavLink, startIcon: /* @__PURE__ */ jsx(ArrowLeft, {}), to: `/plugins/${PLUGIN_ID}`, children: formatMessage({ id: getTrad("back"), defaultMessage: "Back" }) }),
        title: contentType.label,
        subtitle: formatMessage({ id: getTrad("explorer.countEntriesFound"), defaultMessage: `${entries.length} entries found` }, { count: entries.length }),
        as: "h2"
      }
    ),
    !isLoading && !loadingError && contentType && /* @__PURE__ */ jsx(Layouts.Content, { children: /* @__PURE__ */ jsxs(
      Table,
      {
        colCount: mainField && mainField != "id" && canReadMainField ? 6 : 5,
        rowCount: entries.length + 1,
        children: [
          /* @__PURE__ */ jsx(Thead, { children: /* @__PURE__ */ jsxs(Tr, { children: [
            /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                "aria-label": "Select all entries",
                disabled: !canRestore && !canDeletePermanantly || !entries.length,
                checked: entries.length && selectedEntriesId.length === entries.length,
                indeterminate: entries.length && selectedEntriesId.length && selectedEntriesId.length !== entries.length,
                onCheckedChange: () => selectedEntriesId.length === entries.length ? setSelectedEntriesId([]) : setSelectedEntriesId(
                  entries.map((entry) => entry.id)
                )
              }
            ) }),
            /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: "ID" }) }),
            /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: formatMessage({ id: getTrad("explorer.softDeletedAt"), defaultMessage: "Soft Deleted At" }) }) }),
            /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: formatMessage({ id: getTrad("explorer.softDeletedBy"), defaultMessage: "Soft Deleted By" }) }) }),
            mainField && mainField != "id" && canReadMainField && /* @__PURE__ */ jsx(Th, { children: /* @__PURE__ */ jsx(Typography, { variant: "sigma", children: mainField }) }),
            /* @__PURE__ */ jsx(Th, { children: selectedEntriesId.length && /* @__PURE__ */ jsxs(Flex, { justifyContent: "end", gap: "1", width: "100%", children: [
              canRestore && /* @__PURE__ */ jsx(
                IconButton,
                {
                  onClick: () => {
                    setDeletePermanentlyModalEntriesId([]);
                    setRestoreModalEntriesId(selectedEntriesId);
                  },
                  label: formatMessage({ id: getTrad("explorer.restore"), defaultMessage: "Restore" }),
                  children: /* @__PURE__ */ jsx(ArrowClockwise, {})
                }
              ),
              canDeletePermanantly && /* @__PURE__ */ jsx(
                IconButton,
                {
                  onClick: () => {
                    setRestoreModalEntriesId([]);
                    setDeletePermanentlyModalEntriesId(
                      selectedEntriesId
                    );
                  },
                  label: formatMessage({ id: getTrad("explorer.deletePermanently"), defaultMessage: "Delete Permanently" }),
                  children: /* @__PURE__ */ jsx(Trash, {})
                }
              )
            ] }) || /* @__PURE__ */ jsx(VisuallyHidden, { children: formatMessage({ id: getTrad("explorer.actions"), defaultMessage: "Actions" }) }) })
          ] }) }),
          /* @__PURE__ */ jsx(Tbody, { children: entries.length && entries.map((entry) => /* @__PURE__ */ jsxs(Tr, { children: [
            /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(
              Checkbox,
              {
                "aria-label": `Select ${entry.name}`,
                disabled: !canRestore && !canDeletePermanantly,
                checked: selectedEntriesId.includes(entry.id),
                onCheckedChange: () => selectedEntriesId.includes(entry.id) ? setSelectedEntriesId(
                  selectedEntriesId.filter(
                    (item) => item !== entry.id
                  )
                ) : setSelectedEntriesId([
                  ...selectedEntriesId,
                  entry.id
                ])
              }
            ) }),
            /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: entry.id }) }),
            /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: formatDate(parseISO(entry._softDeletedAt), {
              dateStyle: "full",
              timeStyle: "short"
            }) }) }),
            /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Typography, { textColor: "neutral800", children: [
              entry._softDeletedBy.name || entry._softDeletedBy.id || "-",
              " (",
              entry._softDeletedBy.type,
              ")"
            ] }) }),
            mainField && mainField != "id" && canReadMainField && /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: entry[mainField] }) }),
            /* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsxs(Flex, { justifyContent: "end", gap: "1", children: [
              canRestore && /* @__PURE__ */ jsx(
                IconButton,
                {
                  onClick: () => {
                    setDeletePermanentlyModalEntriesId([]);
                    setRestoreModalEntriesId([entry.id]);
                  },
                  label: formatMessage({ id: getTrad("explorer.restore"), defaultMessage: "Restore" }),
                  children: /* @__PURE__ */ jsx(ArrowClockwise, {})
                }
              ),
              canDeletePermanantly && /* @__PURE__ */ jsx(
                IconButton,
                {
                  onClick: () => {
                    setRestoreModalEntriesId([]);
                    setDeletePermanentlyModalEntriesId([
                      entry.id
                    ]);
                  },
                  label: formatMessage({ id: getTrad("explorer.deletePermanently"), defaultMessage: "Delete Permanently" }),
                  children: /* @__PURE__ */ jsx(Trash, {})
                }
              )
            ] }) })
          ] }, entry.id)) || /* @__PURE__ */ jsx(Tr, { children: /* @__PURE__ */ jsx(Td, { colSpan: 5, children: /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: "6", padding: "4rem", children: [
            /* @__PURE__ */ jsx(EmptyDocuments, { width: "10rem", height: "5.5rem" }),
            /* @__PURE__ */ jsx(Typography, { variant: "delta", textColor: "neutral600", children: formatMessage({ id: getTrad("explorer.noEntriesFound"), defaultMessage: "No entries found" }) })
          ] }) }) }) })
        ]
      }
    ) }),
    !isLoading && loadingError && /* @__PURE__ */ jsxs(
      Flex,
      {
        direction: "column",
        gap: "2",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        children: [
          /* @__PURE__ */ jsx(Typography, { variant: "delta", textColor: "neutral500", children: formatMessage({ id: getTrad("explorer.errorLoadingEntries"), defaultMessage: "Error loading entries" }) }),
          /* @__PURE__ */ jsx(Typography, { variant: "delta", textColor: "neutral600", children: loadingError.message })
        ]
      }
    ),
    !isLoading && !loadingError && !contentType && /* @__PURE__ */ jsxs(
      Flex,
      {
        direction: "column",
        gap: "2",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        children: [
          /* @__PURE__ */ jsx(EmptyPermissions, { width: "10rem", height: "5.5rem" }),
          /* @__PURE__ */ jsx(Typography, { variant: "delta", textColor: "neutral600", children: formatMessage({ id: getTrad("explorer.noContentTypeSelected"), defaultMessage: "No type selected" }) })
        ]
      }
    ),
    restoreModalEntriesId.length && /* @__PURE__ */ jsx(Modal.Root, { open: restoreModalEntriesId.length > 0, onOpenChange: !isRestoring ? () => setRestoreModalEntriesId([]) : null, children: /* @__PURE__ */ jsxs(
      Modal.Content,
      {
        "aria-labelledby": "title",
        children: [
          /* @__PURE__ */ jsx(Modal.Header, { children: /* @__PURE__ */ jsx(
            Typography,
            {
              fontWeight: "bold",
              textColor: "neutral800",
              as: "h2",
              id: "title",
              children: formatMessage({ id: getTrad("explorer.confirmation.restore.title"), defaultMessage: "Confirm Restoration" })
            }
          ) }),
          /* @__PURE__ */ jsx(Modal.Body, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: formatMessage({ id: getTrad("explorer.confirmation.restore.description"), defaultMessage: "Are you sure you want to restore this?" }) }) }),
          /* @__PURE__ */ jsxs(Modal.Footer, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "tertiary",
                onClick: () => setRestoreModalEntriesId([]),
                disabled: isRestoring,
                children: formatMessage({ id: getTrad("cancel"), defaultMessage: "Cancel" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "default",
                onClick: confirmRestore,
                loading: isRestoring,
                startIcon: /* @__PURE__ */ jsx(ArrowClockwise, {}),
                children: formatMessage({ id: getTrad("explorer.restore"), defaultMessage: "Restore" })
              }
            )
          ] })
        ]
      }
    ) }) || /* @__PURE__ */ jsx(Fragment, {}),
    deletePermanentlyModalEntriesId.length && /* @__PURE__ */ jsx(Modal.Root, { open: deletePermanentlyModalEntriesId.length > 0, onOpenChange: !isDeletingPermanently ? () => setDeletePermanentlyModalEntriesId([]) : null, children: /* @__PURE__ */ jsxs(
      Modal.Content,
      {
        "aria-labelledby": "title",
        children: [
          /* @__PURE__ */ jsx(Modal.Header, { children: /* @__PURE__ */ jsx(
            Typography,
            {
              fontWeight: "bold",
              textColor: "neutral800",
              as: "h2",
              id: "title",
              children: formatMessage({ id: getTrad("explorer.confirmation.deletePermanently.title"), defaultMessage: "Confirm Delete Permanently" })
            }
          ) }),
          /* @__PURE__ */ jsx(Modal.Body, { children: /* @__PURE__ */ jsx(Typography, { textColor: "neutral800", children: formatMessage({ id: getTrad("explorer.confirmation.deletePermanently.description"), defaultMessage: "Are you sure you want to delete this permanently?" }) }) }),
          /* @__PURE__ */ jsxs(Modal.Footer, { children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => setDeletePermanentlyModalEntriesId([]),
                variant: "tertiary",
                disabled: isDeletingPermanently,
                children: formatMessage({ id: getTrad("cancel"), defaultMessage: "Cancel" })
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "danger-light",
                onClick: confirmDeletePermanently,
                loading: isRestoring,
                startIcon: /* @__PURE__ */ jsx(Trash, {}),
                children: formatMessage({ id: getTrad("explorer.deletePermanently"), defaultMessage: "Delete permanently" })
              }
            )
          ] })
        ]
      }
    ) }) || /* @__PURE__ */ jsx(Fragment, {}),
    alert && /* @__PURE__ */ jsx(
      Alert,
      {
        position: "fixed",
        top: "5%",
        left: "40%",
        zIndex: "100",
        variant: alert.variant,
        onClose: () => setAlert(void 0),
        children: alert.message
      }
    ) || /* @__PURE__ */ jsx(Fragment, {})
  ] });
};
const Explorer = () => {
  const params = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { get } = useFetchClient();
  const allPermissions = useAuth("MY_PLUGIN_ID", (state) => state.permissions);
  const [contentTypeNavLinks, setContentTypeNavLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(void 0);
  const [activeContentType, setActiveContentType] = useState(void 0);
  useEffect(() => {
    setIsLoading(true);
    setLoadingError(void 0);
    get("/content-manager/init").then((response) => {
      const collectionTypeNavLinks = response.data.data.contentTypes.filter(
        (contentType) => contentType.isDisplayed && contentType.kind === "collectionType" && supportsContentType(contentType.uid)
      ).filter(
        (contentType) => allPermissions.some(
          (permission) => permission.action === `plugin::${PLUGIN_ID}.explorer.view-deleted` && permission.subject === contentType.uid
        )
      ).map((contentType) => ({
        uid: contentType.uid,
        kind: contentType.kind,
        label: contentType.info.displayName,
        to: `/plugins/${PLUGIN_ID}/collectionType/${contentType.uid}`
      }));
      const singleTypeNavLinks = response.data.data.contentTypes.filter(
        (contentType) => contentType.isDisplayed && contentType.kind === "singleType" && supportsContentType(contentType.uid)
      ).filter(
        (contentType) => allPermissions.some(
          (permission) => permission.action === `plugin::${PLUGIN_ID}.explorer.view-deleted` && permission.subject === contentType.uid
        )
      ).map((contentType) => ({
        uid: contentType.uid,
        kind: contentType.kind,
        label: contentType.info.displayName,
        to: `/plugins/${PLUGIN_ID}/singleType/${contentType.uid}`
      }));
      setContentTypeNavLinks(collectionTypeNavLinks.concat(singleTypeNavLinks));
    }).catch((error) => {
      setLoadingError(error);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);
  useEffect(() => {
    const firstContentTypeNavLink = contentTypeNavLinks[0];
    if (firstContentTypeNavLink && (!params.kind || !params.uid)) {
      navigate(`/plugins/${PLUGIN_ID}/${firstContentTypeNavLink.kind}/${firstContentTypeNavLink.uid}`);
    } else if (params.kind && params.uid) {
      setActiveContentType(
        contentTypeNavLinks.filter(
          (contentType) => params.kind === contentType.kind && params.uid === contentType.uid
        )[0]
      );
    }
  }, [contentTypeNavLinks, params.kind, params.uid]);
  return /* @__PURE__ */ jsx(Box, { background: "neutral100", children: /* @__PURE__ */ jsxs(Layouts$1.Root, { children: [
    /* @__PURE__ */ jsx(Page.Title, { children: "Soft Delete" }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Flex, { alignItems: "stretch", gap: "4", children: [
      /* @__PURE__ */ jsx(Box, { background: "neutral100", hasRadius: true, padding: 4, style: { width: "300px" }, children: /* @__PURE__ */ jsxs(SubNav, { "aria-label": "Soft Delete sub nav", children: [
        /* @__PURE__ */ jsx(
          SubNavHeader,
          {
            label: formatMessage({ id: getTrad("name"), defaultMessage: "Soft Delete" }),
            searchable: true,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            onClear: () => setSearch(""),
            searchLabel: formatMessage({ id: getTrad("explorer.searchContentTypes"), defaultMessage: "Search Content Types" }),
            searchPlaceholder: formatMessage({ id: getTrad("explorer.searchContentTypes"), defaultMessage: "Search Content Types" })
          }
        ),
        /* @__PURE__ */ jsxs(SubNavSections, { children: [
          /* @__PURE__ */ jsx(
            SubNavSection,
            {
              label: formatMessage({ id: getTrad("explorer.collectionTypes"), defaultMessage: "Collection Types" }),
              collapsable: true,
              badgeLabel: contentTypeNavLinks.filter(
                (contentTypeNavLink) => contentTypeNavLink.kind === "collectionType"
              ).length.toString(),
              children: contentTypeNavLinks.filter(
                (contentTypeNavLink) => contentTypeNavLink.kind === "collectionType" && (search ? contentTypeNavLink.label.toLowerCase().includes(search.toLowerCase()) : true)
              ).map((contentType, index) => /* @__PURE__ */ jsx(
                SubNavLink,
                {
                  tag: NavLink,
                  to: `${contentType.to}`,
                  end: true,
                  children: contentType.label
                },
                index
              ))
            }
          ),
          /* @__PURE__ */ jsx(
            SubNavSection,
            {
              label: formatMessage({ id: getTrad("explorer.singleTypes"), defaultMessage: "Single Types" }),
              collapsable: true,
              badgeLabel: contentTypeNavLinks.filter(
                (contentTypeNavLink) => contentTypeNavLink.kind === "singleType"
              ).length.toString(),
              children: contentTypeNavLinks.filter(
                (contentTypeNavLink) => contentTypeNavLink.kind === "singleType" && (search ? contentTypeNavLink.label.toLowerCase().includes(search.toLowerCase()) : true)
              ).map((contentType, index) => /* @__PURE__ */ jsx(
                SubNavLink,
                {
                  tag: NavLink,
                  to: `${contentType.to}`,
                  end: true,
                  children: contentType.label
                },
                index
              ))
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { style: { width: "-webkit-fill-available" }, children: [
        isLoading && /* @__PURE__ */ jsx(Flex, { direction: "column", gap: "2", justifyContent: "center", alignItems: "center", height: "100%", children: /* @__PURE__ */ jsx(Loader, {}) }),
        !isLoading && loadingError && /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: "2", justifyContent: "center", alignItems: "center", height: "100%", children: [
          /* @__PURE__ */ jsx(Typography, { variant: "delta", textColor: "neutral500", children: formatMessage({ id: getTrad("explorer.errorLoadingContentTypes"), defaultMessage: "Error loading types" }) }),
          /* @__PURE__ */ jsx(Typography, { variant: "delta", textColor: "neutral600", children: loadingError.message })
        ] }),
        !isLoading && !loadingError && activeContentType && /* @__PURE__ */ jsx(ContentTypeEntries, { contentType: activeContentType })
      ] })
    ] }) })
  ] }) });
};
const App = () => {
  return /* @__PURE__ */ jsx(DesignSystemProvider, { children: /* @__PURE__ */ jsx(Page$1.Protect, { permissions: permissions.main, children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: `/:kind?/:uid?`, element: /* @__PURE__ */ jsx(Explorer, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Page$1.Error, {}) })
  ] }) }) });
};
export {
  App
};
