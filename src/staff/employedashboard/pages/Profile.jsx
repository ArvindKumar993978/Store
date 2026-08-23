import React, { useState } from "react";
import { User, Home, Landmark, HeartPulse, Pencil, Camera, Info } from "../components/icons.jsx";

const PHOTO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD4hZ-2TKl1S00wk5aRHGJKkyjasDiqmYPSW3aRAUAvzxcJ1EK12hUArZMF4Q9KdKO01KXYiOZLbvYusbTXhKzWd_tF0tLS564a9jtGnzbVS3RCPWRn5yi-3kdYcUK-OL4DEkSel9zQXsrev03y2ZIH6zIRoQo4PaZcGJqegXdC0tYLL_pz9PN6T6ehKMKQeFkgyJHOSgurHvwa5_xQ8BrecISvgYrWUU4BzTzOeQRABAqZptAuprHcow";

const initialState = {
  firstName: "Jane",
  lastName: "Doe",
  jobTitle: "Senior Administrator",
  department: "Operations",
  email: "jane.doe@efficientledger.com",
  phone: "+1 (555) 123-4567",
  street: "123 Corporate Blvd, Suite 400",
  city: "Metropolis",
  state: "NY",
  zip: "10001",
  country: "United States",
  bankName: "Chase Bank",
  accountHolder: "Jane A. Doe",
  routingNumber: "021000021",
  accountNumber: "456789123",
  emergencyName: "John Doe",
  emergencyRelationship: "Spouse",
  emergencyPhone: "+1 (555) 987-6543",
};

function Field({ label, value, onChange, disabled, type = "text", locked, mono }) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <input
        className={`input-field ${mono ? "font-tabular-nums" : ""} ${
          locked ? "bg-surface-container text-on-surface-variant cursor-not-allowed" : ""
        }`}
        type={type}
        value={value}
        disabled={disabled || locked}
        title={locked ? "Contact HR to change" : undefined}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
}

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialState);
  const [draft, setDraft] = useState(initialState);

  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));

  const startEdit = () => {
    setDraft(form);
    setEditMode(true);
  };
  const cancel = () => {
    setDraft(form);
    setEditMode(false);
  };
  const save = () => {
    setForm(draft);
    setEditMode(false);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-end mb-gutter">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Profile Settings
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage your personal information, bank details, and emergency contacts.
          </p>
        </div>
        {editMode ? (
          <div className="flex gap-3">
            <button
              onClick={cancel}
              className="px-4 py-2 border border-outline-variant text-on-surface rounded-lg font-body-md hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-body-md hover:bg-primary transition-colors active:scale-95 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2 border border-outline-variant text-on-surface rounded-lg font-body-md hover:bg-surface-container-low transition-colors"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Column 1: Personal Info & Address */}
        <div className="lg:col-span-2 space-y-gutter">
          <section className="tonal-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Personal Information
                </h3>
                <p className="text-body-md text-on-surface-variant mt-1">
                  Basic details and contact information.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container group">
                  <img src={PHOTO_URL} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-opacity">
                    <Camera size={22} className="text-white" />
                  </div>
                </div>
                <button className="text-label-md font-label-md text-primary hover:underline uppercase tracking-wider">
                  Change Photo
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                <Field label="First Name" value={draft.firstName} disabled={!editMode} onChange={set("firstName")} />
                <Field label="Last Name" value={draft.lastName} disabled={!editMode} onChange={set("lastName")} />
                <Field label="Job Title" value={draft.jobTitle} locked />
                <Field label="Department" value={draft.department} locked />
                <div className="md:col-span-2">
                  <Field
                    label="Email Address"
                    type="email"
                    value={draft.email}
                    disabled={!editMode}
                    onChange={set("email")}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    label="Phone Number"
                    type="tel"
                    value={draft.phone}
                    disabled={!editMode}
                    onChange={set("phone")}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="tonal-card">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-6">
              <Home size={20} className="text-primary" />
              Residential Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
              <div className="md:col-span-2">
                <Field label="Street Address" value={draft.street} disabled={!editMode} onChange={set("street")} />
              </div>
              <Field label="City" value={draft.city} disabled={!editMode} onChange={set("city")} />
              <Field label="State / Province" value={draft.state} disabled={!editMode} onChange={set("state")} />
              <Field label="Postal / Zip Code" value={draft.zip} disabled={!editMode} onChange={set("zip")} />
              <div>
                <label className="input-label">Country</label>
                <select
                  className="input-field"
                  disabled={!editMode}
                  value={draft.country}
                  onChange={(e) => set("country")(e.target.value)}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Column 2: Bank & Emergency */}
        <div className="space-y-gutter">
          <section className="tonal-card border-l-4 border-l-primary">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-2">
              <Landmark size={20} className="text-primary" />
              Bank Details
            </h3>
            <p className="text-label-md text-on-surface-variant mb-6">
              Account used for direct salary deposits.
            </p>
            <div className="space-y-5">
              <Field label="Bank Name" value={draft.bankName} disabled={!editMode} onChange={set("bankName")} />
              <Field
                label="Account Holder Name"
                value={draft.accountHolder}
                disabled={!editMode}
                onChange={set("accountHolder")}
              />
              <Field
                label="Routing Number"
                type="password"
                mono
                value={draft.routingNumber}
                disabled={!editMode}
                onChange={set("routingNumber")}
              />
              <Field
                label="Account Number"
                type="password"
                mono
                value={draft.accountNumber}
                disabled={!editMode}
                onChange={set("accountNumber")}
              />
              <div className="mt-4 p-3 bg-surface-container-low rounded-lg flex gap-3 items-start border border-outline-variant/30">
                <Info size={20} className="text-on-surface-variant flex-shrink-0" />
                <p className="text-label-md text-on-surface-variant leading-tight">
                  Changes to bank details may take up to 1-2 pay cycles to process. Contact payroll for
                  urgent updates.
                </p>
              </div>
            </div>
          </section>

          <section className="tonal-card">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-6">
              <HeartPulse size={20} className="text-error" />
              Emergency Contact
            </h3>
            <div className="space-y-5">
              <Field
                label="Contact Name"
                value={draft.emergencyName}
                disabled={!editMode}
                onChange={set("emergencyName")}
              />
              <Field
                label="Relationship"
                value={draft.emergencyRelationship}
                disabled={!editMode}
                onChange={set("emergencyRelationship")}
              />
              <Field
                label="Phone Number"
                type="tel"
                value={draft.emergencyPhone}
                disabled={!editMode}
                onChange={set("emergencyPhone")}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
