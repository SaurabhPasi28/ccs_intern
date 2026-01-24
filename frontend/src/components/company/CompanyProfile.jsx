
import { useEffect, useState, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { STATES_AND_CITIES } from "../data/statesAndCities";
import { 
    ProfileHeader, 
    SectionCard, 
    FormContainer, 
    EmptyState, 
    LoadingSpinner,
    QuickInfoCard 
} from "../customreuse";

const BACKEND_URL = "http://localhost:5000";

const COMPANY_TYPES = [
    "Public company",
    "Privately held",
    "Partnership",
    "Nonprofit",
    "Government Agency",
    "Self-employed",
];

export default function CompanyProfile() {
    const token = localStorage.getItem("token");

    const [company, setCompany] = useState({
        name: "", industry: "", company_type: "", founded_year: "", description: "",
        headquarters: "", state: "", city: "", address: "", zipcode: "", hr_email: "", phone: "",
        website: "", logo_url: "", banner_url: ""
    });

    const [socialLinks, setSocialLinks] = useState({
        linkedin: "", instagram: "", facebook: "", twitter: "", youtube: "", pinterest: ""
    });

    const [hasCompany, setHasCompany] = useState(false);
    const [hasSocialLinks, setHasSocialLinks] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [editingCompany, setEditingCompany] = useState(false);
    const [editingSocial, setEditingSocial] = useState(false);

    const apiCall = async (url, method, body, isFormData = false) => {
        const res = await fetch(url, {
            method,
            headers: isFormData
                ? { Authorization: `Bearer ${token}` }
                : { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });
        return res.json();
    };

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiCall(`${BACKEND_URL}/api/company`, "GET");
                if (data.company) { 
                    setCompany(data.company); 
                    setHasCompany(true); 
                }
                if (data.social_links) { 
                    setSocialLinks(data.social_links); 
                    setHasSocialLinks(true); 
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ================= COMPANY ================= */
    const saveCompany = async () => {
        const res = await apiCall(`${BACKEND_URL}/api/company`, "PUT", company);
        if (res.company) {
            toast.success(hasCompany ? "Company profile updated successfully" : "Company profile saved successfully");
            setCompany(res.company);
            setHasCompany(true);
            setEditingCompany(false);
        } else toast.error("Failed to save company profile");
    };

    const cancelEditCompany = () => {
        setEditingCompany(false);
    };

    /* ================= MEDIA ================= */
    const handleImageUpload = async (file, type) => {
        if (!file) return;

        try {
            const formData = new FormData();
            if (type === 'logo') {
                formData.append("logoImage", file);
            } else {
                formData.append("bannerImage", file);
            }

            const res = await apiCall(`${BACKEND_URL}/api/company/media`, "PATCH", formData, true);
            if (res.company) {
                toast.success(`${type === 'logo' ? 'Logo' : 'Banner'} updated successfully`);
                setCompany(res.company);
                setShowEditMenu(false);
            }
        } catch (err) {
            toast.error("Failed to upload");
        }
    };

    const clearImages = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/company/media/clear`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setCompany(prev => ({ ...prev, logo_url: "", banner_url: "" }));
                toast.success("Images cleared");
                setShowEditMenu(false);
            } else {
                toast.error("Failed to clear images");
            }
        } catch (err) {
            toast.error("Failed to clear images");
        }
    };

    /* ================= SOCIAL LINKS ================= */
    const saveSocialLinks = async () => {
        const res = await apiCall(
            `${BACKEND_URL}/api/company/social-links`,
            hasSocialLinks ? "PUT" : "POST",
            socialLinks
        );
        if (res.social_links) {
            toast.success(res.message);
            setSocialLinks(res.social_links);
            setHasSocialLinks(true);
            setEditingSocial(false);
        } else toast.error("Failed to save social links");
    };

    const cancelEditSocial = () => {
        setEditingSocial(false);
    };

    if (loading) {
        return <LoadingSpinner message="Loading company profile..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-5 py-7">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN - MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* HEADER with ProfileHeader component */}
                        <ProfileHeader
                            profile={company}
                            displayName={company.name || "Company Name"}
                            API_URL={BACKEND_URL}
                            showEditMenu={showEditMenu}
                            setShowEditMenu={setShowEditMenu}
                            handleImageUpload={handleImageUpload}
                            clearImages={clearImages}
                            setEditingIntro={() => {}}
                        >
                            <p className="text-base text-gray-700 mt-1">{company.industry || "Industry"}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                {company.city && company.state ? `${company.city}, ${company.state}` : "Add your location"}
                            </p>
                        </ProfileHeader>

                        {/* COMPANY INFO SECTION */}
                        <SectionCard 
                            title="Company Information"
                            onAdd={editingCompany ? null : () => setEditingCompany(true)}
                            addLabel="Edit"
                        >
                            <FormContainer onSubmit={(e) => { e.preventDefault(); saveCompany(); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field 
                                        label="Company Name" 
                                        value={company.name} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, name: v })} 
                                    />
                                    <Field 
                                        label="Industry" 
                                        value={company.industry} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, industry: v })} 
                                    />

                                    <div>
                                        <Label className="text-sm font-medium text-gray-900">Company Type</Label>
                                        <select 
                                            className="w-full border rounded-md p-2 mt-1 bg-white disabled:bg-gray-100" 
                                            disabled={!editingCompany} 
                                            value={company.company_type} 
                                            onChange={(e) => setCompany({ ...company, company_type: e.target.value })}
                                        >
                                            <option value="">Select</option>
                                            {COMPANY_TYPES.map((t) => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    <Field 
                                        label="Founded Year" 
                                        value={company.founded_year} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, founded_year: v })} 
                                    />
                                    <Field 
                                        label="Headquarters" 
                                        value={company.headquarters} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, headquarters: v })} 
                                    />

                                    <div>
                                        <Label className="text-sm font-medium text-gray-900">State</Label>
                                        <select 
                                            className="w-full border rounded-md p-2 mt-1 bg-white disabled:bg-gray-100" 
                                            disabled={!editingCompany} 
                                            value={company.state} 
                                            onChange={(e) => setCompany({ ...company, state: e.target.value, city: "" })}
                                        >
                                            <option value="">Select State</option>
                                            {Object.keys(STATES_AND_CITIES).map((s) => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-900">City</Label>
                                        <select 
                                            className="w-full border rounded-md p-2 mt-1 disabled:bg-gray-100 bg-white" 
                                            value={company.city} 
                                            disabled={!editingCompany || !company.state} 
                                            onChange={(e) => setCompany({ ...company, city: e.target.value })}
                                        >
                                            <option value="">Select City</option>
                                            {(STATES_AND_CITIES[company.state] || []).map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <Field 
                                        label="Address" 
                                        value={company.address} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, address: v })} 
                                    />
                                    <Field 
                                        label="Zip Code" 
                                        value={company.zipcode} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, zipcode: v })} 
                                    />
                                    <Field 
                                        label="Human Resources Email" 
                                        value={company.hr_email} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, hr_email: v })} 
                                    />
                                    <Field 
                                        label="Phone" 
                                        value={company.phone} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, phone: v })} 
                                    />
                                    <Field 
                                        label="Website" 
                                        value={company.website} 
                                        disabled={!editingCompany} 
                                        onChange={(v) => setCompany({ ...company, website: v })} 
                                    />

                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium text-gray-900">Description</Label>
                                        <textarea 
                                            rows={4} 
                                            disabled={!editingCompany} 
                                            className="w-full border rounded p-2 mt-1 disabled:bg-gray-100" 
                                            value={company.description} 
                                            onChange={(e) => setCompany({ ...company, description: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                {editingCompany && (
                                    <div className="flex justify-end gap-2 pt-4">
                                        <button 
                                            type="button"
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50" 
                                            onClick={cancelEditCompany}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </FormContainer>
                        </SectionCard>

                        {/* SOCIAL MEDIA SECTION */}
                        <SectionCard 
                            title="Social Media Links"
                            onAdd={editingSocial ? null : () => setEditingSocial(true)}
                            addLabel="Edit"
                        >
                            <FormContainer onSubmit={(e) => { e.preventDefault(); saveSocialLinks(); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field 
                                        label="LinkedIn" 
                                        value={socialLinks.linkedin} 
                                        disabled={!editingSocial} 
                                        onChange={(v) => setSocialLinks({ ...socialLinks, linkedin: v })} 
                                    />
                                    <Field 
                                        label="Instagram" 
                                        value={socialLinks.instagram} 
                                        disabled={!editingSocial} 
                                        onChange={(v) => setSocialLinks({ ...socialLinks, instagram: v })} 
                                    />
                                    <Field 
                                        label="Facebook" 
                                        value={socialLinks.facebook} 
                                        disabled={!editingSocial} 
                                        onChange={(v) => setSocialLinks({ ...socialLinks, facebook: v })} 
                                    />
                                    <Field 
                                        label="Twitter / X" 
                                        value={socialLinks.twitter} 
                                        disabled={!editingSocial} 
                                        onChange={(v) => setSocialLinks({ ...socialLinks, twitter: v })} 
                                    />
                                    <Field 
                                        label="YouTube" 
                                        value={socialLinks.youtube} 
                                        disabled={!editingSocial} 
                                        onChange={(v) => setSocialLinks({ ...socialLinks, youtube: v })} 
                                    />
                                    <Field 
                                        label="Pinterest" 
                                        value={socialLinks.pinterest} 
                                        disabled={!editingSocial} 
                                        onChange={(v) => setSocialLinks({ ...socialLinks, pinterest: v })} 
                                    />
                                </div>

                                {editingSocial && (
                                    <div className="flex justify-end gap-2 pt-4">
                                        <button 
                                            type="button"
                                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50" 
                                            onClick={cancelEditSocial}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </FormContainer>
                        </SectionCard>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-4">
                        <QuickInfoCard 
                            title="Quick Info"
                            items={[
                                {
                                    icon: (
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    ),
                                    label: "Company Type",
                                    value: company.company_type || "Not specified"
                                },
                                {
                                    icon: (
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    ),
                                    label: "Founded",
                                    value: company.founded_year || "Not specified"
                                },
                                {
                                    icon: (
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    ),
                                    label: "Headquarters",
                                    value: company.headquarters || "Not specified"
                                },
                                {
                                    icon: (
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    ),
                                    label: "HR Email",
                                    value: company.hr_email || "Not specified"
                                },
                                {
                                    icon: (
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    ),
                                    label: "Phone",
                                    value: company.phone || "Not specified"
                                }
                            ]}
                        />

                        <QuickInfoCard 
                            title="Public Profile"
                            items={[
                                {
                                    icon: (
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    ),
                                    label: "Profile URL",
                                    value: `www.ccs.com/company/${company.name ? company.name.toLowerCase().replace(/\s+/g, '-') : 'company-name'}`
                                },
                                {
                                    icon: (
                                        <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                    ),
                                    label: "LinkedIn",
                                    value: socialLinks.linkedin || "Not added"
                                }
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, disabled }) {
    return (
        <div>
            <Label className="text-sm font-medium text-gray-900">{label}</Label>
            <Input value={value || ""} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="mt-1" />
        </div>
    );
}