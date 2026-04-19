import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CreditCard, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useProducerSettings,
  useSetProducerSettings,
} from "../hooks/useSettings";
import type { ProducerSettings } from "../types";

type SettingsForm = {
  companyName: string;
  address: string;
  gstNumber: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  authorisedSignatory: string;
};

const emptyForm: SettingsForm = {
  companyName: "",
  address: "",
  gstNumber: "",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  ifscCode: "",
  authorisedSignatory: "",
};

function settingsToForm(s: ProducerSettings): SettingsForm {
  return {
    companyName: s.companyName,
    address: s.address,
    gstNumber: s.gstNumber,
    bankName: s.bankName,
    accountHolder: s.accountHolder,
    accountNumber: s.accountNumber,
    ifscCode: s.ifscCode,
    authorisedSignatory: s.authorisedSignatory,
  };
}

function FormSkeleton() {
  return (
    <div className="space-y-4" data-ocid="settings.loading_state">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h2 className="font-display text-base font-semibold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: settings, isLoading } = useProducerSettings();
  const setSettings = useSetProducerSettings();

  const [form, setForm] = useState<SettingsForm>(emptyForm);

  useEffect(() => {
    if (settings) setForm(settingsToForm(settings));
  }, [settings]);

  function handleChange(field: keyof SettingsForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const companyName = form.companyName.trim();
    const address = form.address.trim();
    if (!companyName) return toast.error("Company name is required.");
    if (!address) return toast.error("Company address is required.");

    await setSettings.mutateAsync(
      {
        companyName,
        address,
        gstNumber: form.gstNumber.trim(),
        bankName: form.bankName.trim(),
        accountHolder: form.accountHolder.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim(),
        authorisedSignatory: form.authorisedSignatory.trim(),
      },
      {
        onSuccess: () => toast.success("Settings saved successfully."),
        onError: () => toast.error("Failed to save settings."),
      },
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">
            Business Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Company and bank details printed on bills
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-card border border-border shadow-warm p-6">
          <FormSkeleton />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Details */}
          <div className="rounded-2xl bg-card border border-border shadow-warm p-6">
            <SectionHeading
              icon={Building2}
              title="Company Details"
              description="Printed at the top of every invoice"
            />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-company-name" className="text-sm font-medium">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="s-company-name"
                  data-ocid="settings.company_name_input"
                  placeholder="e.g. VJ Traders"
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-address" className="text-sm font-medium">
                  Company Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="s-address"
                  data-ocid="settings.address_input"
                  placeholder="Full address including city, state, PIN"
                  rows={3}
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                  className="resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-gst" className="text-sm font-medium">
                  GST Number{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="s-gst"
                  data-ocid="settings.gst_number_input"
                  placeholder="e.g. 33AAACS0286G1ZZ"
                  value={form.gstNumber}
                  onChange={(e) => handleChange("gstNumber", e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Authorised Signatory */}
          <div className="rounded-2xl bg-card border border-border shadow-warm p-6">
            <SectionHeading
              icon={User}
              title="Authorised Signatory"
              description="Name shown under the signature line in the invoice"
            />
            <div className="space-y-1.5">
              <Label htmlFor="s-signatory" className="text-sm font-medium">
                Authorised Signatory Name{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </Label>
              <Input
                id="s-signatory"
                data-ocid="settings.authorised_signatory_input"
                placeholder="e.g. Ramesh Kumar"
                value={form.authorisedSignatory}
                onChange={(e) =>
                  handleChange("authorisedSignatory", e.target.value)
                }
              />
            </div>
          </div>

          <Separator />

          {/* Bank Details */}
          <div className="rounded-2xl bg-card border border-border shadow-warm p-6">
            <SectionHeading
              icon={CreditCard}
              title="Bank Details"
              description="Shown at the bottom of invoices for payment"
            />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="s-bank-name" className="text-sm font-medium">
                  Bank Name{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="s-bank-name"
                  data-ocid="settings.bank_name_input"
                  placeholder="e.g. State Bank of India"
                  value={form.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="s-account-holder"
                  className="text-sm font-medium"
                >
                  Account Holder Name{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="s-account-holder"
                  data-ocid="settings.account_holder_input"
                  placeholder="e.g. VJ Traders"
                  value={form.accountHolder}
                  onChange={(e) =>
                    handleChange("accountHolder", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="s-account-number"
                    className="text-sm font-medium"
                  >
                    Account Number{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="s-account-number"
                    data-ocid="settings.account_number_input"
                    placeholder="e.g. 1234567890"
                    value={form.accountNumber}
                    onChange={(e) =>
                      handleChange("accountNumber", e.target.value)
                    }
                    className="font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="s-ifsc" className="text-sm font-medium">
                    IFSC Code{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="s-ifsc"
                    data-ocid="settings.ifsc_code_input"
                    placeholder="e.g. SBIN0001234"
                    value={form.ifscCode}
                    onChange={(e) => handleChange("ifscCode", e.target.value)}
                    className="font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              data-ocid="settings.submit_button"
              disabled={setSettings.isPending}
              className="gap-2 min-w-32"
            >
              {setSettings.isPending ? (
                "Saving…"
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
