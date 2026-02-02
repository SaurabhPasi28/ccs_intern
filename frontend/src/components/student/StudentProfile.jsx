import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { STATES_AND_CITIES, SKILL_OPTIONS, CERTIFICATIONS } from "../data/statesAndCities";

const DEGREE_OPTIONS = [
    "B.Tech", "M.Tech", "B.E.", "M.E.", "BSc", "MSc", "BCA", "MCA",
    "BA", "MA", "BBA", "MBA", "B.Com", "M.Com", "LLB", "LLM",
    "MBBS", "MD", "BDS", "MDS", "B.Pharm", "M.Pharm", "PhD",
    "Diploma", "High School", "Other"
];

export default function StudentProfile() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("Your profile");
    const [profile, setProfile] = useState({
        state: "", city: "", dob: "", bio: "", profile_image_url: "", banner_image_url: "", headline: ""
    });
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [showSkillForm, setShowSkillForm] = useState(false);
    const [showCertificationForm, setShowCertificationForm] = useState(false);
    const [customSkillMode, setCustomSkillMode] = useState(false);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [selectedBannerImage, setSelectedBannerImage] = useState(null);
    const [mediaUploading, setMediaUploading] = useState(false);
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [editingIntro, setEditingIntro] = useState(false);
    const [editingAbout, setEditingAbout] = useState(false);

    const [educationForm, setEducationForm] = useState({
        degree: "", field_of_study: "", institution: "", start_year: "", end_year: "", is_current: false
    });
    const [experienceForm, setExperienceForm] = useState({
        title: "", company: "", start_date: "", end_date: "", is_current: false, description: ""
    });
    const [skillForm, setSkillForm] = useState({ skill_name: "" });
    const [certificationForm, setCertificationForm] = useState({
        name: "", issuing_organization: "", issue_date: "", expiry_date: "", credential_id: "", credential_url: ""
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/student`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                const p = data.profile || {};
                setProfile({
                    state: p.state || "", city: p.city || "", dob: p.dob ? p.dob.substring(0, 10) : "",
                    bio: p.bio || "", profile_image_url: p.profile_image_url || "",
                    banner_image_url: p.banner_image_url || "", headline: p.headline || ""
                });
                setDisplayName(data.full_name || "Your profile");
                setEducation(data.education || []);
                setExperience(data.experience || []);
                setSkills(data.skills || []);
                setCertifications(data.certifications || []);
            }
        } catch (err) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const apiCall = async (url, method, body) => {
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: body ? JSON.stringify(body) : undefined,
            });
            return { ok: res.ok, data: await res.json() };
        } catch (err) {
            return { ok: false };
        }
    };

    const updateProfile = async () => {
        if (savingProfile) return; // Prevent duplicate submissions
        setSavingProfile(true);
        try {
            const { ok } = await apiCall(`${API_URL}/student`, "PUT", profile);
            if (ok) {
                toast.success("Profile updated successfully!");
                setEditingIntro(false);
                setEditingAbout(false);
                fetchProfile();
            } else {
                toast.error("Failed to update");
            }
        } finally {
            setSavingProfile(false);
        }
    };

    const addEducation = async (e) => {
        e.preventDefault();
        if (savingEducation) return; // Prevent duplicate submissions
        setSavingEducation(true);
        try {
            const { ok } = await apiCall(`${API_URL}/student/education`, "POST", educationForm);
            if (ok) {
                toast.success("Education added");
                setShowEducationForm(false);
                setEducationForm({ degree: "", field_of_study: "", institution: "", start_year: "", end_year: "", is_current: false });
                fetchProfile();
            } else toast.error("Failed to add education");
        } finally {
            setSavingEducation(false);
        }
    };

    const deleteEducation = async (id) => {
        if (deletingItem === `edu-${id}`) return; // Prevent duplicate deletions
        setDeletingItem(`edu-${id}`);
        try {
            const { ok } = await apiCall(`${API_URL}/student/education/${id}`, "DELETE");
            if (ok) { toast.success("Deleted"); fetchProfile(); }
        } finally {
            setDeletingItem(null);
        }
    };

    const addExperience = async (e) => {
        e.preventDefault();
        if (savingExperience) return; // Prevent duplicate submissions
        setSavingExperience(true);
        try {
            const { ok } = await apiCall(`${API_URL}/student/experience`, "POST", experienceForm);
            if (ok) {
                toast.success("Experience added");
                setShowExperienceForm(false);
                setExperienceForm({ title: "", company: "", start_date: "", end_date: "", is_current: false, description: "" });
                fetchProfile();
            } else toast.error("Failed to add experience");
        } finally {
            setSavingExperience(false);
        }
    };

    const deleteExperience = async (id) => {
        if (deletingItem === `exp-${id}`) return; // Prevent duplicate deletions
        setDeletingItem(`exp-${id}`);
        try {
            const { ok } = await apiCall(`${API_URL}/student/experience/${id}`, "DELETE");
            if (ok) { toast.success("Deleted"); fetchProfile(); }
        } finally {
            setDeletingItem(null);
        }
    };

    const handleSkillSelect = (value) => {
        if (value === "Other") {
            setCustomSkillMode(true);
            setSkillForm({ skill_name: "" });
        } else {
            setCustomSkillMode(false);
            setSkillForm({ skill_name: value });
        }
    };

    const addSkill = async (e) => {
        e.preventDefault();
        if (savingSkill) return; // Prevent duplicate submissions
        setSavingSkill(true);
        try {
            const { ok } = await apiCall(`${API_URL}/student/skills`, "POST", skillForm);
            if (ok) {
                toast.success("Skill added");
                setShowSkillForm(false);
                setSkillForm({ skill_name: "" });
                setCustomSkillMode(false);
                fetchProfile();
            } else toast.error("Failed to add skill");
        } finally {
            setSavingSkill(false);
        }
    };

    const deleteSkill = async (skill_id) => {
        if (deletingItem === `skill-${skill_id}`) return; // Prevent duplicate deletions
        setDeletingItem(`skill-${skill_id}`);
        try {
            const { ok } = await apiCall(`${API_URL}/student/skills/${skill_id}`, "DELETE");
            if (ok) { toast.success("Deleted"); fetchProfile(); }
        } finally {
            setDeletingItem(null);
        }
    };

    const addCertification = async (e) => {
        e.preventDefault();
        if (savingCertification) return; // Prevent duplicate submissions
        setSavingCertification(true);
        try {
            const { ok } = await apiCall(`${API_URL}/student/certifications`, "POST", certificationForm);
            if (ok) {
                toast.success("Certification added");
                setShowCertificationForm(false);
                setCertificationForm({ name: "", issuing_organization: "", issue_date: "", expiry_date: "", credential_id: "", credential_url: "" });
                fetchProfile();
            } else toast.error("Failed to add certification");
        } finally {
            setSavingCertification(false);
        }
    };

    const deleteCertification = async (id) => {
        if (deletingItem === `cert-${id}`) return; // Prevent duplicate deletions
        setDeletingItem(`cert-${id}`);
        try {
            const { ok } = await apiCall(`${API_URL}/student/certifications/${id}`, "DELETE");
            if (ok) { toast.success("Deleted"); fetchProfile(); }
        } finally {
            setDeletingItem(null);
        }
    };

    const handleImageUpload = async (file, type) => {
        if (!file) return;
        setMediaUploading(true);
        try {
            const formData = new FormData();
            formData.append(type === 'profile' ? 'profileImage' : 'bannerImage', file);
            const res = await fetch(`${API_URL}/student/media`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`${type === 'profile' ? 'Profile picture' : 'Banner'} updated`);
                setProfile(prev => ({
                    ...prev,
                    [type === 'profile' ? 'profile_image_url' : 'banner_image_url']:
                        data[type === 'profile' ? 'profile_image_url' : 'banner_image_url'] + '?t=' + Date.now()
                }));
                setShowEditMenu(false);
            } else {
                toast.error(data.message || "Failed to upload");
            }
        } catch (err) {
            toast.error("Failed to upload");
        } finally {
            setMediaUploading(false);
        }
    };

    const clearImages = async () => {
        try {
            const res = await fetch(`${API_URL}/student/media/clear`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setProfile(prev => ({ ...prev, profile_image_url: "", banner_image_url: "" }));
                toast.success("Images cleared");
                setShowEditMenu(false);
            } else {
                toast.error("Failed to clear images");
            }
        } catch (err) {
            toast.error("Failed to clear images");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
        </div>
    );

    const bannerStyle = profile.banner_image_url
        ? { backgroundImage: `url(http://localhost:5000${profile.banner_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
        : {};

    const BUTTON_STYLES = {
        primary: "px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold transition flex items-center gap-2 justify-center",
        secondary: "px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 font-semibold transition flex items-center gap-2 justify-center",
        cancel: "px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 font-semibold transition flex items-center gap-2 justify-center"
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 py-5 sm:py-7">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="relative h-40 sm:h-50 bg-gradient-to-br from-gray-700 via-gray-600 to-amber-700 border-b-4 border-white" style={bannerStyle}>
                                <button onClick={() => setShowEditMenu(!showEditMenu)}
                                    className="absolute top-4 right-4 bg-white hover:bg-gray-100 p-2.5 rounded-full shadow-lg transition z-10">
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                                {showEditMenu && (
                                    <div className="absolute top-16 right-4 w-64 bg-white rounded-lg shadow-xl border z-20">
                                        <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm text-gray-700 font-medium">Change profile photo</span>
                                            <input type="file" accept="image/*" className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0], 'profile')} />
                                        </label>
                                        <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-700 font-medium">Change banner</span>
                                            <input type="file" accept="image/*" className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0], 'banner')} />
                                        </label>
                                        {(profile.profile_image_url || profile.banner_image_url) && (
                                            <button onClick={clearImages} className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 w-full text-left">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span className="text-sm text-red-600 font-medium">Remove images</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="px-4 sm:px-6 pb-6 relative">
                                <div className="absolute -top-16 sm:-top-20 left-4 sm:left-6">
                                    <div className="relative">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-45 md:h-45 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden">
                                            {profile.profile_image_url ? (
                                                <img src={`http://localhost:5000${profile.profile_image_url}`} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                                    <span className="text-4xl sm:text-5xl font-bold text-white">{displayName.charAt(0).toUpperCase()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg cursor-pointer transition">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <input type="file" accept="image/*" className="hidden"
                                                onChange={(e) => handleImageUpload(e.target.files?.[0], 'profile')} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 mb-16 sm:mb-20">
                                    <button onClick={() => setEditingIntro(true)} className={BUTTON_STYLES.secondary + " text-sm sm:text-base"}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit intro
                                    </button>
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{displayName}</h1>
                                    <p className="text-base text-gray-700 mt-1">{profile.headline || "Add a headline to describe yourself"}</p>
                                    <p className="text-sm text-gray-600 mt-2">{profile.city && profile.state ? `${profile.city}, ${profile.state}` : "Add your location"}</p>
                                </div>
                                {editingIntro && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="font-semibold text-lg mb-4">Edit Intro</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Headline</Label>
                                                <Input value={profile.headline}
                                                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                                                    placeholder="e.g., Student at University | Aspiring Developer" className="mt-1" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>State</Label>
                                                    <select value={profile.state}
                                                        onChange={(e) => setProfile({ ...profile, state: e.target.value, city: "" })}
                                                        className="w-full border rounded-md p-2 mt-1">
                                                        <option value="">Select state</option>
                                                        {Object.keys(STATES_AND_CITIES).map((state) => (
                                                            <option key={state} value={state}>{state}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <Label>City</Label>
                                                    <select value={profile.city}
                                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                                        disabled={!profile.state} className="w-full border rounded-md p-2 mt-1 disabled:bg-gray-100">
                                                        <option value="">Select city</option>
                                                        {profile.state && STATES_AND_CITIES[profile.state]?.map((city) => (
                                                            <option key={city} value={city}>{city}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => setEditingIntro(false)} className="btn-cancel">Cancel</button>
                                                <button onClick={updateProfile} className="btn-primary">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">About</h2>
                                <button onClick={() => setEditingAbout(!editingAbout)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                            {editingAbout ? (
                                <div className="space-y-4">
                                    <textarea className="w-full border rounded-md p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        placeholder="Write about yourself, your interests, and your goals..." />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingAbout(false)} className="btn-cancel">Cancel</button>
                                        <button onClick={updateProfile} className="btn-primary">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 whitespace-pre-wrap">{profile.bio || "Add information about yourself to help others understand your background and interests."}</p>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Experience</h2>
                                <button onClick={() => setShowExperienceForm(!showExperienceForm)} className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                            {showExperienceForm && (
                                <form onSubmit={addExperience} className="mb-6 p-4 bg-gray-50 rounded-lg border space-y-4">
                                    <div><Label>Title *</Label><Input required value={experienceForm.title}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                                        placeholder="Ex: Software Engineer Intern" className="mt-1" /></div>
                                    <div><Label>Company *</Label><Input required value={experienceForm.company}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                                        placeholder="Ex: Google" className="mt-1" /></div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><Label>Start Date</Label><Input type="date" value={experienceForm.start_date}
                                            onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })}
                                            className="mt-1" /></div>
                                        <div><Label>End Date</Label><Input type="date" value={experienceForm.end_date}
                                            onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })}
                                            disabled={experienceForm.is_current} className="mt-1" /></div>
                                    </div>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={experienceForm.is_current}
                                            onChange={(e) => setExperienceForm({ ...experienceForm, is_current: e.target.checked })}
                                            className="w-4 h-4" />I currently work here
                                    </label>
                                    <div><Label>Description</Label><textarea className="w-full border rounded-md p-2 mt-1 min-h-[100px]"
                                        value={experienceForm.description}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                                        placeholder="Describe your responsibilities and achievements" /></div>
                                    <div className="flex gap-2 justify-end">
                                        <Button type="button" variant="outline" onClick={() => setShowExperienceForm(false)} className="btn-cancel">Cancel</Button>
                                        <Button type="submit" className="btn-primary">Save</Button>
                                    </div>
                                </form>
                            )}
                            <div className="space-y-4 sm:space-y-6">
                                {experience.length === 0 && !showExperienceForm ? (
                                    <p className="text-gray-500 text-center py-8">No experience added yet</p>
                                ) : (
                                    experience.map((exp) => (
                                        <div key={exp.id} className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b last:border-0 hover:bg-gray-50 p-3 -m-3 rounded-lg transition-colors">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900">{exp.title}</h3>
                                                <p className="text-gray-700">{exp.company}</p>
                                                <p className="text-sm text-gray-500 mt-1">{exp.start_date} - {exp.is_current ? "Present" : exp.end_date}</p>
                                                {exp.description && <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>}
                                            </div>
                                            <button onClick={() => deleteExperience(exp.id)} className="p-2 hover:bg-red-50 rounded-full h-fit transition">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Education</h2>
                                <button onClick={() => setShowEducationForm(!showEducationForm)} className="p-2 hover:bg-purple-50 rounded-full transition-colors">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                            {showEducationForm && (
                                <form onSubmit={addEducation} className="mb-6 p-4 bg-gray-50 rounded-lg border space-y-4">
                                    <div><Label>Degree *</Label><select required value={educationForm.degree}
                                        onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                                        className="w-full border rounded-md p-2 mt-1">
                                        <option value="">Select degree</option>
                                        {DEGREE_OPTIONS.map((degree) => <option key={degree} value={degree}>{degree}</option>)}</select></div>
                                    <div><Label>Field of Study</Label><Input value={educationForm.field_of_study}
                                        onChange={(e) => setEducationForm({ ...educationForm, field_of_study: e.target.value })}
                                        placeholder="Ex: Computer Science" className="mt-1" /></div>
                                    <div><Label>School *</Label><Input required value={educationForm.institution}
                                        onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                                        placeholder="Ex: Harvard University" className="mt-1" /></div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><Label>Start Year</Label><Input type="number" value={educationForm.start_year}
                                            onChange={(e) => setEducationForm({ ...educationForm, start_year: e.target.value })}
                                            placeholder="2020" className="mt-1" /></div>
                                        <div><Label>End Year</Label><Input type="number" value={educationForm.end_year}
                                            onChange={(e) => setEducationForm({ ...educationForm, end_year: e.target.value })}
                                            placeholder="2024" disabled={educationForm.is_current} className="mt-1" /></div>
                                    </div>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={educationForm.is_current}
                                            onChange={(e) => setEducationForm({ ...educationForm, is_current: e.target.checked })}
                                            className="w-4 h-4" />I currently study here
                                    </label>
                                    <div className="flex gap-2 justify-end">
                                        <Button type="button" variant="outline" onClick={() => setShowEducationForm(false)} className="btn-cancel">Cancel</Button>
                                        <Button type="submit" className="btn-primary">Save</Button>
                                    </div>
                                </form>
                            )}
                            <div className="space-y-4 sm:space-y-6">
                                {education.length === 0 && !showEducationForm ? (
                                    <p className="text-gray-500 text-center py-8">No education added yet</p>
                                ) : (
                                    education.map((edu) => (
                                        <div key={edu.id} className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b last:border-0 hover:bg-gray-50 p-3 -m-3 rounded-lg transition-colors">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-900">{edu.institution}</h3>
                                                <p className="text-gray-700">{edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}` : ''}</p>
                                                <p className="text-sm text-gray-500 mt-1">{edu.start_year} - {edu.is_current ? "Present" : edu.end_year}</p>
                                            </div>
                                            <button onClick={() => deleteEducation(edu.id)} className="p-2 hover:bg-red-50 rounded-full h-fit transition">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                                <button onClick={() => setShowSkillForm(!showSkillForm)} className="p-2 hover:bg-amber-50 rounded-full transition-colors">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                            {showSkillForm && (
                                <form onSubmit={addSkill} className="mb-6 p-4 bg-gray-50 rounded-lg border space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <select value={customSkillMode ? "Other" : skillForm.skill_name}
                                            onChange={(e) => handleSkillSelect(e.target.value)}
                                            className="flex-1 border rounded-md p-2" required={!customSkillMode}>
                                            <option value="">Select skill</option>
                                            {SKILL_OPTIONS.map((skill) => (<option key={skill} value={skill}>{skill}</option>))}
                                        </select>
                                        {customSkillMode && (
                                            <Input required value={skillForm.skill_name}
                                                onChange={(e) => setSkillForm({ skill_name: e.target.value })}
                                                placeholder="Enter skill name" className="flex-1" />
                                        )}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button type="button" variant="outline" onClick={() => { setShowSkillForm(false); setCustomSkillMode(false); }} className="btn-cancel">Cancel</Button>
                                        <Button type="submit" className="btn-primary">Add skill</Button>
                                    </div>
                                </form>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {skills.length === 0 && !showSkillForm ? (
                                    <p className="text-gray-500 text-center py-8 w-full">No skills added yet</p>
                                ) : (
                                    skills.map((skill) => (
                                        <div key={skill.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-4 py-2 rounded-full flex items-center gap-2 hover:shadow-md transition-all group">
                                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                            <span className="text-sm font-medium text-amber-900">{skill.skill_name}</span>
                                            <button onClick={() => deleteSkill(skill.id)} className="text-amber-700 hover:text-amber-900 opacity-70 group-hover:opacity-100 transition">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Licenses & Certifications</h2>
                                <button onClick={() => setShowCertificationForm(!showCertificationForm)} className="p-2 hover:bg-green-50 rounded-full transition-colors">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                            {showCertificationForm && (
                                <form onSubmit={addCertification} className="mb-6 p-4 bg-gray-50 rounded-lg border space-y-4">
                                    <div><Label>Name *</Label><select required value={certificationForm.name}
                                        onChange={(e) => setCertificationForm({ ...certificationForm, name: e.target.value })}
                                        className="w-full border rounded-md p-2 mt-1">
                                        <option value="">Select certification</option>
                                        {CERTIFICATIONS.map((cert) => (<option key={cert} value={cert}>{cert}</option>))}</select></div>
                                    <div><Label>Issuing Organization</Label><Input value={certificationForm.issuing_organization}
                                        onChange={(e) => setCertificationForm({ ...certificationForm, issuing_organization: e.target.value })}
                                        placeholder="Ex: Amazon Web Services" className="mt-1" /></div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><Label>Issue Date</Label><Input type="date" value={certificationForm.issue_date}
                                            onChange={(e) => setCertificationForm({ ...certificationForm, issue_date: e.target.value })}
                                            className="mt-1" /></div>
                                        <div><Label>Expiry Date</Label><Input type="date" value={certificationForm.expiry_date}
                                            onChange={(e) => setCertificationForm({ ...certificationForm, expiry_date: e.target.value })}
                                            className="mt-1" /></div>
                                    </div>
                                    <div><Label>Credential ID</Label><Input value={certificationForm.credential_id}
                                        onChange={(e) => setCertificationForm({ ...certificationForm, credential_id: e.target.value })}
                                        placeholder="Optional" className="mt-1" /></div>
                                    <div><Label>Credential URL</Label><Input value={certificationForm.credential_url}
                                        onChange={(e) => setCertificationForm({ ...certificationForm, credential_url: e.target.value })}
                                        placeholder="Optional" className="mt-1" /></div>
                                    <div className="flex gap-2 justify-end">
                                        <Button type="button" variant="outline" onClick={() => setShowCertificationForm(false)} className="btn-cancel">Cancel</Button>
                                        <Button type="submit" className="btn-primary">Save</Button>
                                    </div>
                                </form>
                            )}
                            <div className="space-y-4 sm:space-y-6">
                                {certifications.length === 0 && !showCertificationForm ? (
                                    <p className="text-gray-500 text-center py-8">No certifications added yet</p>
                                ) : (
                                    certifications.map((cert) => (
                                        <div key={cert.id} className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b last:border-0 hover:bg-gray-50 p-3 -m-3 rounded-lg transition-colors">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                </svg>
                                            }
                                            title={cert.name}
                                            subtitle={cert.issuing_organization}
                                            period={`Issued ${formatDate(cert.issue_date)}${cert.expiry_date ? ` · Expires ${formatDate(cert.expiry_date)}` : ''}`}
                                            description={cert.credential_id ? `Credential ID: ${cert.credential_id}` : null}
                                            link={cert.credential_url ? { url: cert.credential_url, text: "Show credential" } : null}
                                            onDelete={() => deleteCertification(cert.id)}
                                            isDeleting={deletingItem === `cert-${cert.id}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </SectionCard>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">Profile language</h3>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-sm text-gray-700">English</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-gray-900">Public profile & URL</h3>
                                <button className="p-1.5 hover:bg-gray-100 rounded-full transition">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 break-all">www.ccs.com/in/{displayName.toLowerCase().replace(/\s+/g, '-')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}