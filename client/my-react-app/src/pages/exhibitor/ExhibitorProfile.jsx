
import { useEffect, useState } from "react";
import {
  Building2,
  Save,
  RefreshCw,
  Image,
  UserRound,
  Phone,
  Globe,
  MapPin,
  Package,
} from "lucide-react";

import { toast } from "react-toastify";
import  api  from "../../../api/axios";

const initialForm = {
  companyName: "",
  logoUrl: "",
  description: "",
  contactPerson: "",
  phone: "",
  website: "",
  address: "",
  productsServices: "",
};

const ExhibitorProfile = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing profile
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/exhibitor/profile");

      const profile = response.data.profile;

      if (profile) {
        setForm({
          companyName: profile.companyName || "",
          logoUrl: profile.logoUrl || "",
          description: profile.description || "",
          contactPerson: profile.contactPerson || "",
          phone: profile.phone || "",
          website: profile.website || "",
          address: profile.address || "",
          productsServices:
            profile.productsServices?.join("\n") || "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load company profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyName.trim()) {
      return toast.error("Company name is required");
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        productsServices: form.productsServices
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      const response = await api.patch(
        "/exhibitor/profile",
        payload
      );

      toast.success(
        response.data.message || "Profile saved successfully"
      );

      // Refresh saved data
      const profile = response.data.profile;

      setForm({
        companyName: profile.companyName || "",
        logoUrl: profile.logoUrl || "",
        description: profile.description || "",
        contactPerson: profile.contactPerson || "",
        phone: profile.phone || "",
        website: profile.website || "",
        address: profile.address || "",
        productsServices:
          profile.productsServices?.join("\n") || "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const labelClass =
    "text-sm font-semibold text-slate-700";

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center gap-3">
        <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
        <span className="text-sm text-slate-500">
          Loading company profile...
        </span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Page Heading */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Company Profile
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Manage your company information and exhibitor details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Company Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Company Information
              </h3>
              <p className="text-xs text-slate-500">
                Basic details about your company
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">
              <label className={labelClass}>
                Company Name *
              </label>

              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className={inputClass}
                required
                maxLength={100}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Company Logo URL
              </label>

              <div className="relative">
                <Image className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="url"
                  name="logoUrl"
                  value={form.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className={`${inputClass} pl-12`}
                />
              </div>

              {form.logoUrl && (
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={form.logoUrl}
                    alt="Company logo preview"
                    className="h-16 w-16 rounded-xl border border-slate-200 object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  <span className="text-xs text-slate-500">
                    Logo preview
                  </span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Company Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your company..."
                rows={4}
                maxLength={1000}
                className={inputClass}
              />
            </div>

          </div>
        </section>

        {/* Contact Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <UserRound className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Contact Information
              </h3>
              <p className="text-xs text-slate-500">
                How people can contact your company
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className={labelClass}>
                Contact Person
              </label>

              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Contact person's name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Website
              </label>

              <div className="relative">
                <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Company Address
              </label>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter company address"
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>

          </div>
        </section>

        {/* Products and Services */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Products & Services
              </h3>
              <p className="text-xs text-slate-500">
                Add each product or service on a separate line
              </p>
            </div>
          </div>

          <label className={labelClass}>
            Products / Services
          </label>

          <textarea
            name="productsServices"
            value={form.productsServices}
            onChange={handleChange}
            placeholder={"Web Development\nMobile Applications\nAI Solutions"}
            rows={5}
            className={inputClass}
          />
        </section>

        {/* Submit */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

          <button
            type="button"
            onClick={fetchProfile}
            disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Profile"}
          </button>

        </div>
      </form>
    </div>
  );
};

export default ExhibitorProfile;
