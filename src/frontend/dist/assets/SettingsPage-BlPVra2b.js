import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, u as ue, S as Skeleton } from "./index-BmkvLqip.js";
import { L as Label, I as Input } from "./label-DUjBUsjq.js";
import { S as Separator, U as User } from "./separator-C92i0fhl.js";
import { T as Textarea } from "./textarea-CU-vabGP.js";
import { u as useProducerSettings, a as useSetProducerSettings } from "./useSettings-CbXMUkjJ.js";
import "./backend-DxYwS8Zo.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
const emptyForm = {
  companyName: "",
  address: "",
  gstNumber: "",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  ifscCode: "",
  authorisedSignatory: ""
};
function settingsToForm(s) {
  return {
    companyName: s.companyName,
    address: s.address,
    gstNumber: s.gstNumber,
    bankName: s.bankName,
    accountHolder: s.accountHolder,
    accountNumber: s.accountNumber,
    ifscCode: s.ifscCode,
    authorisedSignatory: s.authorisedSignatory
  };
}
function FormSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "settings.loading_state", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
  ] }, i)) });
}
function SectionHeading({
  icon: Icon,
  title,
  description
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground leading-tight", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: description })
    ] })
  ] });
}
function SettingsPage() {
  const { data: settings, isLoading } = useProducerSettings();
  const setSettings = useSetProducerSettings();
  const [form, setForm] = reactExports.useState(emptyForm);
  reactExports.useEffect(() => {
    if (settings) setForm(settingsToForm(settings));
  }, [settings]);
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const companyName = form.companyName.trim();
    const address = form.address.trim();
    if (!companyName) return ue.error("Company name is required.");
    if (!address) return ue.error("Company address is required.");
    await setSettings.mutateAsync(
      {
        companyName,
        address,
        gstNumber: form.gstNumber.trim(),
        bankName: form.bankName.trim(),
        accountHolder: form.accountHolder.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim(),
        authorisedSignatory: form.authorisedSignatory.trim()
      },
      {
        onSuccess: () => ue.success("Settings saved successfully."),
        onError: () => ue.error("Failed to save settings.")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-5 h-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground leading-tight", children: "Business Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Company and bank details printed on bills" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-card border border-border shadow-warm p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormSkeleton, {}) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-warm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeading,
          {
            icon: Building2,
            title: "Company Details",
            description: "Printed at the top of every invoice"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "s-company-name", className: "text-sm font-medium", children: [
              "Company Name ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-company-name",
                "data-ocid": "settings.company_name_input",
                placeholder: "e.g. Cup Sambarani Trading Co.",
                value: form.companyName,
                onChange: (e) => handleChange("companyName", e.target.value),
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "s-address", className: "text-sm font-medium", children: [
              "Company Address ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "s-address",
                "data-ocid": "settings.address_input",
                placeholder: "Full address including city, state, PIN",
                rows: 3,
                value: form.address,
                onChange: (e) => handleChange("address", e.target.value),
                required: true,
                className: "resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "s-gst", className: "text-sm font-medium", children: [
              "GST Number",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-gst",
                "data-ocid": "settings.gst_number_input",
                placeholder: "e.g. 33AAACS0286G1ZZ",
                value: form.gstNumber,
                onChange: (e) => handleChange("gstNumber", e.target.value),
                className: "font-mono uppercase"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-warm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeading,
          {
            icon: User,
            title: "Authorised Signatory",
            description: "Name shown under the signature line in the invoice"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "s-signatory", className: "text-sm font-medium", children: [
            "Authorised Signatory Name",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "s-signatory",
              "data-ocid": "settings.authorised_signatory_input",
              placeholder: "e.g. Ramesh Kumar",
              value: form.authorisedSignatory,
              onChange: (e) => handleChange("authorisedSignatory", e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-warm p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeading,
          {
            icon: CreditCard,
            title: "Bank Details",
            description: "Shown at the bottom of invoices for payment"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "s-bank-name", className: "text-sm font-medium", children: [
              "Bank Name",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-bank-name",
                "data-ocid": "settings.bank_name_input",
                placeholder: "e.g. State Bank of India",
                value: form.bankName,
                onChange: (e) => handleChange("bankName", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "s-account-holder",
                className: "text-sm font-medium",
                children: [
                  "Account Holder Name",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-account-holder",
                "data-ocid": "settings.account_holder_input",
                placeholder: "e.g. Cup Sambarani Trading Co.",
                value: form.accountHolder,
                onChange: (e) => handleChange("accountHolder", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Label,
                {
                  htmlFor: "s-account-number",
                  className: "text-sm font-medium",
                  children: [
                    "Account Number",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "s-account-number",
                  "data-ocid": "settings.account_number_input",
                  placeholder: "e.g. 1234567890",
                  value: form.accountNumber,
                  onChange: (e) => handleChange("accountNumber", e.target.value),
                  className: "font-mono"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "s-ifsc", className: "text-sm font-medium", children: [
                "IFSC Code",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "s-ifsc",
                  "data-ocid": "settings.ifsc_code_input",
                  placeholder: "e.g. SBIN0001234",
                  value: form.ifscCode,
                  onChange: (e) => handleChange("ifscCode", e.target.value),
                  className: "font-mono uppercase"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          "data-ocid": "settings.submit_button",
          disabled: setSettings.isPending,
          className: "gap-2 min-w-32",
          children: setSettings.isPending ? "Saving…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
            " Save Settings"
          ] })
        }
      ) })
    ] })
  ] });
}
export {
  SettingsPage as default
};
