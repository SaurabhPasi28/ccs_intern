
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
    LoadingSpinner
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

    const [userId, setUserId] = useState(null);
    const [hasCompany, setHasCompany] = useState(false);
    const [hasSocialLinks, setHasSocialLinks] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [editingCompany, setEditingCompany] = useState(false);
    const [editingSocial, setEditingSocial] = useState(false);
    
    // Loading states for duplicate prevention
    const [savingCompany, setSavingCompany] = useState(false);
    const [savingSocial, setSavingSocial] = useState(false);
    const [uploadingImage, setUploadingImage] = useState({ profile: false, banner: false });
    
    // Store original data for cancel functionality
    const [originalCompany, setOriginalCompany] = useState({});
    const [originalSocialLinks, setOriginalSocialLinks] = useState({});

    const apiCall = async (url, method, body, isFormData = false) => {
        const res = await fetch(url, {
            method,
            headers: isFormData
                ? { Authorization: `Bearer ${token}` }
                : { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });
        return await res.json();
    };

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiCall(`${BACKEND_URL}/api/company`, "GET");
                if (data.company) { 
                    setCompany(data.company);
                    setOriginalCompany(data.company);
                    setHasCompany(true); 
                }
                if (data.social_links) { 
                    setSocialLinks(data.social_links);
                    setOriginalSocialLinks(data.social_links);
                    setHasSocialLinks(true); 
                }
                setUserId(data.id);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ================= COMPANY ================= */
    const saveCompany = async () => {
        if (savingCompany) return;
        setSavingCompany(true);
        try {
            const res = await apiCall(`${BACKEND_URL}/api/company`, "PUT", company);
            if (res.company) {
                toast.success(hasCompany ? "Company profile updated successfully" : "Company profile saved successfully");
                setCompany(res.company);
                setOriginalCompany(res.company);
                setHasCompany(true);
                setEditingCompany(false);
            } else toast.error("Failed to save company profile");
        } finally {
            setSavingCompany(false);
        }
    };

    const cancelEditCompany = () => {
        setCompany(originalCompany);
        setEditingCompany(false);
    };
    
    const startEditingCompany = () => {
        setOriginalCompany({...company});
        setEditingCompany(true);
    };

    /* ================= MEDIA ================= */
    const handleImageUpload = async (file, type) => {
        if (!file) return;
        const imageType = type === 'profile' ? 'profile' : 'banner';
        if (uploadingImage[imageType]) return;
        
        setUploadingImage(prev => ({ ...prev, [imageType]: true }));
        try {
            const formData = new FormData();
            if (type === 'profile') {
                formData.append("logoImage", file);
            } else {
                formData.append("bannerImage", file);
            }

            const res = await apiCall(`${BACKEND_URL}/api/company/media`, "PATCH", formData, true);
            if (res.company) {
                toast.success(`${type === 'profile' ? 'Logo' : 'Banner'} updated successfully`);
                setCompany(res.company);
                setShowEditMenu(false);
            }
        } catch (err) {
            toast.error("Failed to upload");
        } finally {
            setUploadingImage(prev => ({ ...prev, [imageType]: false }));
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
        if (savingSocial) return;
        setSavingSocial(true);
        try {
            const res = await apiCall(
                `${BACKEND_URL}/api/company/social-links`,
                hasSocialLinks ? "PUT" : "POST",
                socialLinks
            );
            if (res.social_links) {
                toast.success(res.message);
                setSocialLinks(res.social_links);
                setOriginalSocialLinks(res.social_links);
                setHasSocialLinks(true);
                setEditingSocial(false);
            } else toast.error("Failed to save social links");
        } finally {
            setSavingSocial(false);
        }
    };

    const cancelEditSocial = () => {
        setSocialLinks(originalSocialLinks);
        setEditingSocial(false);
    };
    
    const startEditingSocial = () => {
        setOriginalSocialLinks({...socialLinks});
        setEditingSocial(true);
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
                            uploadingImage={uploadingImage}
                        >
                            <p className="text-base text-gray-700 mt-1">{company.industry || "Industry"}</p>
                            <p className="text-sm text-gray-600 mt-2">
                                {company.city && company.state ? `${company.city}, ${company.state}` : "Add your location"}
                            </p>
                        </ProfileHeader>

                        {/* COMPANY INFO SECTION */}
                        <SectionCard 
                            title="Company Information"
                            onAdd={editingCompany ? null : startEditingCompany}
                            addLabel="Edit"
                        >
                            {editingCompany ? (
                                <form onSubmit={(e) => { e.preventDefault(); saveCompany(); }} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Industry</Label>
                                            <Input value={company.industry || ""} onChange={(e) => setCompany({ ...company, industry: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Company Type</Label>
                                            <select 
                                                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                value={company.company_type} 
                                                onChange={(e) => setCompany({ ...company, company_type: e.target.value })}
                                            >
                                                <option value="">Select</option>
                                                {COMPANY_TYPES.map((t) => <option key={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Founded Year</Label>
                                            <Input value={company.founded_year || ""} onChange={(e) => setCompany({ ...company, founded_year: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Headquarters</Label>
                                            <Input value={company.headquarters || ""} onChange={(e) => setCompany({ ...company, headquarters: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">State</Label>
                                            <select 
                                                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                value={company.state} 
                                                onChange={(e) => setCompany({ ...company, state: e.target.value, city: "" })}
                                            >
                                                <option value="">Select State</option>
                                                {Object.keys(STATES_AND_CITIES).map((s) => <option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">City</Label>
                                            <select 
                                                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5 disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                value={company.city} 
                                                disabled={!company.state} 
                                                onChange={(e) => setCompany({ ...company, city: e.target.value })}
                                            >
                                                <option value="">Select City</option>
                                                {(STATES_AND_CITIES[company.state] || []).map((c) => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Address</Label>
                                            <Input value={company.address || ""} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Zip Code</Label>
                                            <Input value={company.zipcode || ""} onChange={(e) => setCompany({ ...company, zipcode: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Human Resources Email</Label>
                                            <Input type="email" value={company.hr_email || ""} onChange={(e) => setCompany({ ...company, hr_email: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                            <Input value={company.phone || ""} onChange={(e) => setCompany({ ...company, phone: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Website</Label>
                                            <Input value={company.website || ""} onChange={(e) => setCompany({ ...company, website: e.target.value })} className="mt-1.5" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-gray-700">Description</Label>
                                            <textarea 
                                                rows={4} 
                                                className="w-full border border-gray-300 rounded-lg p-3 mt-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                                                value={company.description || ""} 
                                                onChange={(e) => setCompany({ ...company, description: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button 
                                            type="button"
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                            onClick={cancelEditCompany}
                                            disabled={savingCompany}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            disabled={savingCompany}
                                        >
                                            {savingCompany && (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {savingCompany ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {!hasCompany ? (
                                        <EmptyState message="Click Edit to add company information" />
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                <InfoItem label="Industry" value={company.industry} />
                                                <InfoItem label="Company Type" value={company.company_type} />
                                                <InfoItem label="Founded Year" value={company.founded_year} />
                                                <InfoItem label="Headquarters" value={company.headquarters} />
                                                <InfoItem label="Location" value={company.city && company.state ? `${company.city}, ${company.state}` : company.state || company.city} />
                                                <InfoItem label="Address" value={company.address} />
                                                <InfoItem label="Zip Code" value={company.zipcode} />
                                                <InfoItem label="HR Email" value={company.hr_email} icon="email" />
                                                <InfoItem label="Phone" value={company.phone} icon="phone" />
                                                <InfoItem label="Website" value={company.website} icon="link" />
                                            </div>
                                            {company.description && (
                                                <div className="pt-2 border-t border-gray-200">
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{company.description}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </SectionCard>

                        {/* SOCIAL MEDIA SECTION */}
                        <SectionCard 
                            title="Social Media Links"
                            onAdd={editingSocial ? null : startEditingSocial}
                            addLabel="Edit"
                        >
                            {editingSocial ? (
                                <form onSubmit={(e) => { e.preventDefault(); saveSocialLinks(); }} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">LinkedIn</Label>
                                            <Input value={socialLinks.linkedin || ""} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} placeholder="https://linkedin.com/company/..." className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Instagram</Label>
                                            <Input value={socialLinks.instagram || ""} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} placeholder="https://instagram.com/..." className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Facebook</Label>
                                            <Input value={socialLinks.facebook || ""} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} placeholder="https://facebook.com/..." className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Twitter / X</Label>
                                            <Input value={socialLinks.twitter || ""} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="https://twitter.com/..." className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">YouTube</Label>
                                            <Input value={socialLinks.youtube || ""} onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })} placeholder="https://youtube.com/..." className="mt-1.5" />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">Pinterest</Label>
                                            <Input value={socialLinks.pinterest || ""} onChange={(e) => setSocialLinks({ ...socialLinks, pinterest: e.target.value })} placeholder="https://pinterest.com/..." className="mt-1.5" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button 
                                            type="button"
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                            onClick={cancelEditSocial}
                                            disabled={savingSocial}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            disabled={savingSocial}
                                        >
                                            {savingSocial && (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {savingSocial ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3">
                                    {!hasSocialLinks || Object.values(socialLinks).every(v => !v) ? (
                                        <EmptyState message="Click Edit to add social media links" />
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {socialLinks.linkedin && <SocialLink platform="LinkedIn" url={socialLinks.linkedin} icon="linkedin" />}
                                            {socialLinks.instagram && <SocialLink platform="Instagram" url={socialLinks.instagram} icon="instagram" />}
                                            {socialLinks.facebook && <SocialLink platform="Facebook" url={socialLinks.facebook} icon="facebook" />}
                                            {socialLinks.twitter && <SocialLink platform="Twitter / X" url={socialLinks.twitter} icon="twitter" />}
                                            {socialLinks.youtube && <SocialLink platform="YouTube" url={socialLinks.youtube} icon="youtube" />}
                                            {socialLinks.pinterest && <SocialLink platform="Pinterest" url={socialLinks.pinterest} icon="pinterest" />}
                                        </div>
                                    )}
                                </div>
                            )}
                        </SectionCard>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-6">
                        <SectionCard title="Quick Info">
                            <div className="space-y-4">
                                <InfoDisplay 
                                    icon={(
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    )}
                                    label="Company Type"
                                    value={company.company_type || "Not specified"}
                                />
                                <InfoDisplay 
                                    icon={(
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                    label="Founded"
                                    value={company.founded_year || "Not specified"}
                                />
                                <InfoDisplay 
                                    icon={(
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                    label="Headquarters"
                                    value={company.headquarters || "Not specified"}
                                />
                                <InfoDisplay 
                                    icon={(
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                    label="HR Email"
                                    value={company.hr_email || "Not specified"}
                                />
                                <InfoDisplay 
                                    icon={(
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    )}
                                    label="Phone"
                                    value={company.phone || "Not specified"}
                                />
                            </div>
                        </SectionCard>

                        <SectionCard title="Public Profile & URL">
                            {userId ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 break-all">
                                        {window.location.origin}/company/{userId}
                                    </p>
                                    <button onClick={() => window.open(`/company/${userId}`, '_blank')}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View Public Profile →
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">Loading...</p>
                            )}
                        </SectionCard>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for sidebar info display
function InfoDisplay({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-sm text-gray-900 font-medium break-words">{value}</p>
            </div>
        </div>
    );
}

// Helper component for displaying information
function InfoItem({ label, value, icon }) {
    if (!value) return null;
    
    return (
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <div className="flex items-center gap-2">
                {icon === 'email' && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                )}
                {icon === 'phone' && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                )}
                {icon === 'link' && value ? (
                    <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                        {value}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                ) : (
                    <p className="text-sm text-gray-900 font-medium">{value}</p>
                )}
            </div>
        </div>
    );
}

// Helper component for social media links
function SocialLink({ platform, url, icon }) {
    const getIcon = () => {
        switch(icon) {
            case 'linkedin':
                return (
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                );
            case 'instagram':
                return (
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                );
            case 'facebook':
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                );
            case 'twitter':
                return (
                    <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                );
            case 'youtube':
                return (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                );
            case 'pinterest':
                return (
                    <svg className="w-5 h-5 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                    </svg>
                );
            default:
                return null;
        }
    };
    
    return (
        <a 
            href={url.startsWith('http') ? url : `https://${url}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
        >
            <div className="shrink-0">{getIcon()}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{platform}</p>
                <p className="text-xs text-gray-500 truncate group-hover:text-blue-600">{url}</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>
    );
}