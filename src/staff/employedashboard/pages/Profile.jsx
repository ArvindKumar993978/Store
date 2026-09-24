import React, { useRef, useState } from "react";

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
      <label className="text-[12px] text-[#40474f] mb-1 block">{label}</label>
      <input
        className={`w-full h-[44px] px-3 rounded-lg border border-[#bfc7d2] bg-white text-[14px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006194] disabled:text-[#40474f] ${
          mono ? "tabular-nums" : ""
        } ${locked ? "bg-[#eff4ff] text-[#40474f] cursor-not-allowed" : ""}`}
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
  const [photo, setPhoto] = useState(PHOTO_URL);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

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
    setToast("Profile settings updated successfully!");
    setTimeout(() => setToast(null), 4000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
      setToast("Profile picture updated!");
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#004870] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[#86f2e4]">check_circle</span>
          <span className="text-[14px] font-medium">{toast}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#191c1e]">
            Profile Settings
          </h1>
          <p className="text-[14px] text-[#40474f] mt-1">
            Manage your personal information, bank details, and emergency contacts.
          </p>
        </div>
        {editMode ? (
          <div className="flex gap-3">
            <button
              onClick={cancel}
              className="px-4 py-2 border border-[#bfc7d2] text-[#191c1e] rounded-lg text-[14px] hover:bg-[#eff4ff] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="px-4 py-2 bg-[#006194] text-white rounded-lg text-[14px] hover:bg-[#004870] transition-colors active:scale-95 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2 border border-[#bfc7d2] text-[#191c1e] rounded-lg text-[14px] hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Personal Info & Address */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-semibold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#006194]">person</span>
                  Personal Information
                </h3>
                <p className="text-[14px] text-[#40474f] mt-1">
                  Basic details and contact information.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#eff4ff] group cursor-pointer"
                  title="Click to change photo"
                >
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-opacity">
                    <span className="material-symbols-outlined text-[22px] text-white">photo_camera</span>
                  </div>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[12px] text-[#006194] hover:underline uppercase tracking-wider font-semibold"
                >
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

          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]">
            <h3 className="text-[16px] font-semibold text-[#191c1e] flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[20px] text-[#006194]">home</span>
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
                <label className="text-[12px] text-[#40474f] mb-1 block">Country</label>
                <select
                  className="w-full h-[44px] px-3 rounded-lg border border-[#bfc7d2] bg-white text-[14px] text-[#191c1e] focus:outline-none focus:ring-2 focus:ring-[#006194]"
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
        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2] border-l-4 border-l-[#006194]">
            <h3 className="text-[16px] font-semibold text-[#191c1e] flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px] text-[#006194]">account_balance</span>
              Bank Details
            </h3>
            <p className="text-[12px] text-[#40474f] mb-6">
              Account used for direct salary deposits.
            </p>
            <div className="flex flex-col gap-5">
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
              <div className="mt-1 p-3 bg-[#eff4ff] rounded-lg flex gap-3 items-start border border-[#bfc7d2]/50">
                <span className="material-symbols-outlined text-[20px] text-[#40474f] flex-shrink-0">info</span>
                <p className="text-[12px] text-[#40474f] leading-tight">
                  Changes to bank details may take up to 1-2 pay cycles to process. Contact payroll for
                  urgent updates.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-[#bfc7d2]">
            <h3 className="text-[16px] font-semibold text-[#191c1e] flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">emergency</span>
              Emergency Contact
            </h3>
            <div className="flex flex-col gap-5">
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
