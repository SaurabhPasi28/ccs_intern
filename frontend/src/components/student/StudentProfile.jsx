import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { STATES_AND_CITIES, SKILL_OPTIONS, CERTIFICATIONS } from "../data/statesAndCities";
const API_URL = import.meta.env.VITE_API_URL;

const DEGREE_OPTIONS = [
    "B.Tech", "M.Tech", "B.E.", "M.E.", "BSc", "MSc", "BCA", "MCA",
    "BA", "MA", "BBA", "MBA", "B.Com", "M.Com", "LLB", "LLM",
    "MBBS", "MD", "BDS", "MDS", "B.Pharm", "M.Pharm", "PhD",
    "Diploma", "High School", "Other"
];

export default function StudentProfile() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("Your profile");
    const [profile, setProfile] = useState({ state: "", city: "", dob: "", bio: "", profile_image_url: "", banner_image_url: "" });
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
            const res = await fetch(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                const p = data.profile || {};
                setProfile({
                    state: p.state || "",
                    city: p.city || "",
                    dob: p.dob ? p.dob.substring(0, 10) : "",
                    bio: p.bio || "",
                    profile_image_url: p.profile_image_url || "",
                    banner_image_url: p.banner_image_url || "",
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
        const { ok } = await apiCall(`${API_URL}/api/profile`, "PUT", profile);
        if (ok) {
            toast.success("Profile saved! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 1000);
        } else {
            toast.error("Failed to update");
        }
    };

    const addEducation = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall(`${API_URL}/api/profile/education`, "POST", educationForm);
        if (ok) {
            toast.success("Education added");
            setShowEducationForm(false);
            setEducationForm({ degree: "", field_of_study: "", institution: "", start_year: "", end_year: "", is_current: false });
            fetchProfile();
        } else toast.error("Failed to add education");
    };

    const deleteEducation = async (id) => {
        const { ok } = await apiCall(`${API_URL}/api/profile/education/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchProfile(); }
    };

    const addExperience = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall(`${API_URL}/api/profile/experience`, "POST", experienceForm);
        if (ok) {
            toast.success("Experience added");
            setShowExperienceForm(false);
            setExperienceForm({ title: "", company: "", start_date: "", end_date: "", is_current: false, description: "" });
            fetchProfile();
        } else toast.error("Failed to add experience");
    };

    const deleteExperience = async (id) => {
        const { ok } = await apiCall(`${API_URL}/api/profile/experience/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchProfile(); }
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
        const { ok } = await apiCall(`${API_URL}/api/profile/skills`, "POST", skillForm);
        if (ok) {
            toast.success("Skill added");
            setShowSkillForm(false);
            setSkillForm({ skill_name: "" });
            setCustomSkillMode(false);
            fetchProfile();
        } else toast.error("Failed to add skill");
    };

    const deleteSkill = async (skill_id) => {
        const { ok } = await apiCall(`${API_URL}/api/profile/skills/${skill_id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchProfile(); }
    };

    const addCertification = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall(`${API_URL}/api/profile/certifications`, "POST", certificationForm);
        if (ok) {
            toast.success("Certification added");
            setShowCertificationForm(false);
            setCertificationForm({ name: "", issuing_organization: "", issue_date: "", expiry_date: "", credential_id: "", credential_url: "" });
            fetchProfile();
        } else toast.error("Failed to add certification");
    };

    const deleteCertification = async (id) => {
        const { ok } = await apiCall(`${API_URL}/api/profile/certifications/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchProfile(); }
    };

    const uploadMedia = async (e) => {
        e.preventDefault();
        if (!selectedProfileImage && !selectedBannerImage) {
            toast.error("Select a profile or banner image first");
            return;
        }

        setMediaUploading(true);
        try {
            const formData = new FormData();
            if (selectedProfileImage) formData.append("profileImage", selectedProfileImage);
            if (selectedBannerImage) formData.append("bannerImage", selectedBannerImage);

            const res = await fetch(`${API_URL}/api/profile/media`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Images updated");
                setProfile((prev) => ({
                    ...prev,
                    profile_image_url: data.profile_image_url || prev.profile_image_url,
                    banner_image_url: data.banner_image_url || prev.banner_image_url,
                }));
                setSelectedProfileImage(null);
                setSelectedBannerImage(null);
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
            const res = await fetch(`${API_URL}/api/profile/media/clear`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setProfile((prev) => ({ ...prev, profile_image_url: "", banner_image_url: "" }));
                toast.success("Images cleared");
                setShowEditMenu(false);
            } else {
                toast.error("Failed to clear images");
            }
        } catch (err) {
            toast.error("Failed to clear images");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    const bannerStyle = profile.banner_image_url
        ? { backgroundImage: `${API_URL}${profile.banner_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
        : {};

    return (
        <div className="min-h-screen bg-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Profile */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero header */}
                        <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white relative">
                            {/* Edit Icon Dropdown */}
                            <div className="absolute top-4 right-4 z-10">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowEditMenu(!showEditMenu)}
                                        className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition"
                                    >
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    {showEditMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                                            <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span className="text-sm text-gray-700">Change profile picture</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        setSelectedProfileImage(e.target.files?.[0] || null);
                                                        if (e.target.files?.[0]) {
                                                            const formData = new FormData();
                                                            formData.append("profileImage", e.target.files[0]);
                                                            setMediaUploading(true);
                                                            fetch(`${API_URL}/api/profile/media`, {
                                                                method: "PATCH",
                                                                headers: { Authorization: `Bearer ${token}` },
                                                                body: formData,
                                                            })
                                                                .then(res => res.json())
                                                                .then(data => {
                                                                    if (data.profile_image_url) {
                                                                        setProfile(prev => ({ ...prev, profile_image_url: data.profile_image_url + '?t=' + Date.now() }));
                                                                        toast.success("Profile picture updated");
                                                                    }
                                                                })
                                                                .catch(() => toast.error("Failed to upload"))
                                                                .finally(() => {
                                                                    setMediaUploading(false);
                                                                    setShowEditMenu(false);
                                                                });
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm text-gray-700">Change banner</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        setSelectedBannerImage(e.target.files?.[0] || null);
                                                        if (e.target.files?.[0]) {
                                                            const formData = new FormData();
                                                            formData.append("bannerImage", e.target.files[0]);
                                                            setMediaUploading(true);
                                                            fetch(`${API_URL}/api/profile/media`, {
                                                                method: "PATCH",
                                                                headers: { Authorization: `Bearer ${token}` },
                                                                body: formData,
                                                            })
                                                                .then(res => res.json())
                                                                .then(data => {
                                                                    if (data.banner_image_url) {
                                                                        setProfile(prev => ({ ...prev, banner_image_url: data.banner_image_url + '?t=' + Date.now() }));
                                                                        toast.success("Banner updated");
                                                                    }
                                                                })
                                                                .catch(() => toast.error("Failed to upload"))
                                                                .finally(() => {
                                                                    setMediaUploading(false);
                                                                    setShowEditMenu(false);
                                                                });
                                                        }
                                                    }}
                                                />
                                            </label>
                                            {(profile.profile_image_url || profile.banner_image_url) && (
                                                <>
                                                    <div className="border-t border-gray-200 my-2"></div>
                                                    <button
                                                        onClick={clearImages}
                                                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 w-full text-left"
                                                    >
                                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        <span className="text-sm text-red-600">Remove images</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-32 md:h-36 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700" style={bannerStyle} />
                            <div className="px-6 pb-6 flex flex-wrap items-end gap-4 -mt-12">
                                <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center ring-4 ring-white overflow-hidden">
                                    {profile.profile_image_url ? (
                                        <img src={`${API_URL}${profile.profile_image_url}`} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-semibold text-sky-700">pfp</span>
                                    )}
                                </div>
                                <div className="my-2 flex-1 min-w-[200px]">
                                    <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                                    <p className="text-sm text-slate-500">
                                        {profile.city || "Add your city"} / {profile.state || "Add your state"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Profile Info */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>State</Label>
                                        <select value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value, city: "" })} className="w-full border rounded-md p-2">
                                            <option value="">Select state</option>
                                            {Object.keys(STATES_AND_CITIES).map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label>City</Label>
                                        <select value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} disabled={!profile.state} className="w-full border rounded-md p-2 disabled:bg-gray-100">
                                            <option value="">Select city</option>
                                            {profile.state && STATES_AND_CITIES[profile.state]?.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Date of Birth</Label>
                                        <Input type="date" value={profile.dob}
                                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Bio</Label>
                                    <textarea className="w-full border rounded-md p-2" rows="3" value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself" />
                                </div>
                                <Button onClick={updateProfile} className="">Save</Button>
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Education</CardTitle>
                                    <Button onClick={() => setShowEducationForm(!showEducationForm)} size="sm">
                                        {showEducationForm ? "Cancel" : "+ Add Education"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {showEducationForm && (
                                    <form onSubmit={addEducation} className="space-y-3 border p-4 rounded">
                                        <div>
                                            <Label>Degree</Label>
                                            <select required value={educationForm.degree}
                                                onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                                                className="w-full border rounded-md p-2">
                                                <option value="">Select degree</option>
                                                {DEGREE_OPTIONS.map((degree) => <option key={degree} value={degree}>{degree}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Field of Study</Label>
                                            <Input value={educationForm.field_of_study}
                                                onChange={(e) => setEducationForm({ ...educationForm, field_of_study: e.target.value })}
                                                placeholder="e.g., Computer Science" />
                                        </div>
                                        <div>
                                            <Label>Institution</Label>
                                            <Input required value={educationForm.institution}
                                                onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                                                placeholder="University/College name" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Start Year</Label>
                                                <Input type="number" value={educationForm.start_year}
                                                    onChange={(e) => setEducationForm({ ...educationForm, start_year: e.target.value })}
                                                    placeholder="2020" />
                                            </div>
                                            <div>
                                                <Label>End Year</Label>
                                                <Input type="number" value={educationForm.end_year}
                                                    onChange={(e) => setEducationForm({ ...educationForm, end_year: e.target.value })}
                                                    placeholder="2024" disabled={educationForm.is_current} />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={educationForm.is_current}
                                                onChange={(e) => setEducationForm({ ...educationForm, is_current: e.target.checked })} />
                                            Currently studying
                                        </label>
                                        <Button type="submit">Save</Button>
                                    </form>
                                )}

                                {education.map((edu) => (
                                    <div key={edu.id} className="border p-4 rounded flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{edu.degree}</h3>
                                            {edu.field_of_study && <p className="text-sm text-gray-600">{edu.field_of_study}</p>}
                                            <p className="text-sm">{edu.institution}</p>
                                            <p className="text-xs text-gray-500">
                                                {edu.start_year} - {edu.is_current ? "Present" : edu.end_year}
                                            </p>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => deleteEducation(edu.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Experience */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Experience</CardTitle>
                                    <Button onClick={() => setShowExperienceForm(!showExperienceForm)} size="sm">
                                        {showExperienceForm ? "Cancel" : "+ Add Experience"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {showExperienceForm && (
                                    <form onSubmit={addExperience} className="space-y-3 border p-4 rounded">
                                        <div>
                                            <Label>Title</Label>
                                            <Input required value={experienceForm.title}
                                                onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })} placeholder="Job title" />
                                        </div>
                                        <div>
                                            <Label>Company</Label>
                                            <Input required value={experienceForm.company}
                                                onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} placeholder="Company name" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Start Date</Label>
                                                <Input type="date" value={experienceForm.start_date}
                                                    onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })} />
                                            </div>
                                            <div>
                                                <Label>End Date</Label>
                                                <Input type="date" value={experienceForm.end_date}
                                                    onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })}
                                                    disabled={experienceForm.is_current} />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" checked={experienceForm.is_current}
                                                onChange={(e) => setExperienceForm({ ...experienceForm, is_current: e.target.checked })} />
                                            Currently working here
                                        </label>
                                        <div>
                                            <Label>Description</Label>
                                            <textarea className="w-full border rounded-md p-2" rows="3" value={experienceForm.description}
                                                onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                                                placeholder="Describe your role" />
                                        </div>
                                        <Button type="submit">Save</Button>
                                    </form>
                                )}

                                {experience.map((exp) => (
                                    <div key={exp.id} className="border p-4 rounded flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{exp.title}</h3>
                                            <p className="text-sm">{exp.company}</p>
                                            <p className="text-xs text-gray-500">
                                                {exp.start_date} - {exp.is_current ? "Present" : exp.end_date}
                                            </p>
                                            {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => deleteExperience(exp.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Skills</CardTitle>
                                    <Button onClick={() => setShowSkillForm(!showSkillForm)} size="sm">
                                        {showSkillForm ? "Cancel" : "+ Add Skill"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {showSkillForm && (
                                    <form onSubmit={addSkill} className="space-y-3">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <select
                                                value={customSkillMode ? "Other" : skillForm.skill_name}
                                                onChange={(e) => handleSkillSelect(e.target.value)}
                                                className="w-full border rounded-md p-2"
                                                required={!customSkillMode}
                                            >
                                                <option value="">Select skill</option>
                                                {SKILL_OPTIONS.map((skill) => (
                                                    <option key={skill} value={skill}>{skill}</option>
                                                ))}
                                            </select>
                                            {customSkillMode && (
                                                <Input
                                                    required
                                                    value={skillForm.skill_name}
                                                    onChange={(e) => setSkillForm({ skill_name: e.target.value })}
                                                    placeholder="Enter skill name"
                                                />
                                            )}
                                        </div>
                                        <Button type="submit">Save</Button>
                                    </form>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <div key={skill.id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                            <span>{skill.skill_name}</span>
                                            <button onClick={() => deleteSkill(skill.id)} className="text-red-500 hover:text-red-700">
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certifications */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Certifications and Licensing</CardTitle>
                                    <Button onClick={() => setShowCertificationForm(!showCertificationForm)} size="sm">
                                        {showCertificationForm ? "Cancel" : "+ Add Certification"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {showCertificationForm && (
                                    <form onSubmit={addCertification} className="space-y-3 border p-4 rounded">
                                        <div>
                                            <Label>Certification Name</Label>
                                            <select required value={certificationForm.name}
                                                onChange={(e) => setCertificationForm({ ...certificationForm, name: e.target.value })}
                                                className="w-full border rounded-md p-2">
                                                <option value="">Select certification</option>
                                                {CERTIFICATIONS.map((cert) => (
                                                    <option key={cert} value={cert}>{cert}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Issuing Organization</Label>
                                            <Input value={certificationForm.issuing_organization}
                                                onChange={(e) => setCertificationForm({ ...certificationForm, issuing_organization: e.target.value })}
                                                placeholder="e.g., Amazon Web Services" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Issue Date</Label>
                                                <Input type="date" value={certificationForm.issue_date}
                                                    onChange={(e) => setCertificationForm({ ...certificationForm, issue_date: e.target.value })} />
                                            </div>
                                            <div>
                                                <Label>Expiry Date</Label>
                                                <Input type="date" value={certificationForm.expiry_date}
                                                    onChange={(e) => setCertificationForm({ ...certificationForm, expiry_date: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Credential ID</Label>
                                            <Input value={certificationForm.credential_id}
                                                onChange={(e) => setCertificationForm({ ...certificationForm, credential_id: e.target.value })}
                                                placeholder="Optional" />
                                        </div>
                                        <div>
                                            <Label>Credential URL</Label>
                                            <Input value={certificationForm.credential_url}
                                                onChange={(e) => setCertificationForm({ ...certificationForm, credential_url: e.target.value })}
                                                placeholder="Optional" />
                                        </div>
                                        <Button type="submit">Save</Button>
                                    </form>
                                )}

                                {certifications.map((cert) => (
                                    <div key={cert.id} className="border p-4 rounded flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{cert.name}</h3>
                                            <p className="text-sm">{cert.issuing_organization}</p>
                                            <p className="text-xs text-gray-500">
                                                Issued: {cert.issue_date}
                                                {cert.expiry_date && ` | Expires: ${cert.expiry_date}`}
                                            </p>
                                            {cert.credential_id && <p className="text-xs">ID: {cert.credential_id}</p>}
                                            {cert.credential_url && (
                                                <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">
                                                    View Credential
                                                </a>
                                            )}
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => deleteCertification(cert.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Language */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Profile language</CardTitle>
                                    <button className="text-gray-600 hover:text-gray-800">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700">English</p>
                            </CardContent>
                        </Card>

                        {/* Public Profile & URL */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Public profile & URL</CardTitle>
                                    <button className="text-gray-600 hover:text-gray-800">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 break-all">
                                    www.ccs.com/profile/{displayName.toLowerCase().replace(/\s+/g, '-')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}


