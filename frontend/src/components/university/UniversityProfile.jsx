import { useEffect, useState } from "react";
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
import { ItemCard } from "../customreuse/ItemCard";

const API_URL = import.meta.env.VITE_API_URL;

const UNIVERSITY_TYPES = ["Public", "Private", "Deemed", "Central", "State"];
const ACCREDITATIONS = ["NAAC A++", "NAAC A+", "NAAC A", "NAAC B++", "NAAC B+", "UGC Approved", "Other"];
const PROGRAM_LEVELS = ["Undergraduate", "Postgraduate", "Doctoral", "Diploma", "Certificate"];
const RANKING_BODIES = ["NIRF", "QS World Rankings", "THE World Rankings", "Academic Ranking", "Other"];
const FACILITY_OPTIONS = [
    "Central Library", "Hostel", "Sports Complex", "Auditorium", "Laboratory",
    "Computer Center", "Medical Center", "Cafeteria", "Wi-Fi Campus", "Gym"
];

// Helper component for displaying information
function InfoItem({ label, value, icon }) {
    const renderValue = () => {
        if (!value) return <span className="text-gray-400">Not specified</span>;
        
        if (icon === 'email') {
            return (
                <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    {value}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            );
        }
        
        if (icon === 'phone') {
            return (
                <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-700">
                    {value}
                </a>
            );
        }
        
        if (icon === 'link') {
            return (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    {value}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            );
        }
        
        return <span className="text-gray-900 font-medium">{value}</span>;
    };

    return (
        <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</span>
            {renderValue()}
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

export default function UniversityProfile() {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState("Your University");
    const [showEditMenu, setShowEditMenu] = useState(false);

    // Loading states
    const [savingUniversity, setSavingUniversity] = useState(false);
    const [uploadingImage, setUploadingImage] = useState({ profile: false, banner: false });
    const [addingDepartment, setAddingDepartment] = useState(false);
    const [addingProgram, setAddingProgram] = useState(false);
    const [addingFacility, setAddingFacility] = useState(false);
    const [addingPlacement, setAddingPlacement] = useState(false);
    const [addingRanking, setAddingRanking] = useState(false);
    const [addingResearch, setAddingResearch] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);

    // Edit modes
    const [editingUniversity, setEditingUniversity] = useState(false);
    const [originalUniversity, setOriginalUniversity] = useState({});

    const [university, setUniversity] = useState({
        name: "", established_year: "", university_type: "", accreditation: "",
        state: "", city: "", zipcode: "", address: "", phone: "", email: "",
        website_url: "", vice_chancellor_name: "", vice_chancellor_email: "",
        vice_chancellor_phone: "", total_students: "", total_faculty: "",
        campus_area: "", logo_url: "", banner_url: "", referral_code: ""
    });

    const [departments, setDepartments] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [research, setResearch] = useState([]);

    const [showDepartmentForm, setShowDepartmentForm] = useState(false);
    const [showProgramForm, setShowProgramForm] = useState(false);
    const [showFacilityForm, setShowFacilityForm] = useState(false);
    const [showPlacementForm, setShowPlacementForm] = useState(false);
    const [showRankingForm, setShowRankingForm] = useState(false);
    const [showResearchForm, setShowResearchForm] = useState(false);

    const [departmentForm, setDepartmentForm] = useState({ department_name: "", hod_name: "" });
    const [programForm, setProgramForm] = useState({
        program_level: "", program_name: "", department: "", duration_years: "",
        annual_fees: "", total_seats: "", eligibility: ""
    });
    const [facilityForm, setFacilityForm] = useState({ facility_name: "" });
    const [placementForm, setPlacementForm] = useState({
        academic_year: "", placement_percent: "", average_package: "",
        highest_package: "", companies_visited: "", top_recruiters: ""
    });
    const [rankingForm, setRankingForm] = useState({
        ranking_body: "", rank_value: "", year: "", category: "", certificate_url: ""
    });
    const [researchForm, setResearchForm] = useState({
        research_title: "", area: "", publication_year: "", description: ""
    });

    useEffect(() => {
        fetchUniversityProfile();
    }, []);

    const fetchUniversityProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/api/university`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                if (data.university) {
                    setUniversity(data.university);
                    setOriginalUniversity(data.university);
                    setDisplayName(data.university.name || "Your University");
                }
                setDepartments(data.departments || []);
                setPrograms(data.programs || []);
                setFacilities(data.facilities || []);
                setPlacements(data.placements || []);
                setRankings(data.rankings || []);
                setResearch(data.research || []);
            }
        } catch (err) {
            toast.error("Failed to load university profile");
        } finally {
            setLoading(false);
        }
    };

    const startEditingUniversity = () => {
        setOriginalUniversity({ ...university });
        setEditingUniversity(true);
    };

    const cancelEditUniversity = () => {
        setUniversity(originalUniversity);
        setEditingUniversity(false);
    };

    const updateUniversity = async () => {
        if (savingUniversity) return;
        
        setSavingUniversity(true);
        try {
            const res = await fetch(`${API_URL}/api/university`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(university),
            });
            if (res.ok) {
                const data = await res.json();
                toast.success("University information updated!");
                setUniversity(data.university || university);
                setOriginalUniversity(data.university || university);
                setDisplayName(data.university?.name || university.name || "Your University");
                setEditingUniversity(false);
            } else {
                toast.error("Failed to update");
            }
        } catch (err) {
            toast.error("Failed to update");
        } finally {
            setSavingUniversity(false);
        }
    };

    const handleImageUpload = async (file, type) => {
        if (!file) return;
        
        setUploadingImage(prev => ({ ...prev, [type]: true }));
        try {
            const formData = new FormData();
            formData.append(type === 'profile' ? 'logoImage' : 'bannerImage', file);
            const res = await fetch(`${API_URL}/api/university/media`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`${type === 'profile' ? 'Logo' : 'Banner'} updated`);
                fetchUniversityProfile();
                setShowEditMenu(false);
            } else {
                toast.error(data.message || "Failed to upload");
            }
        } catch (err) {
            toast.error("Failed to upload");
        } finally {
            setUploadingImage(prev => ({ ...prev, [type]: false }));
        }
    };

    const clearImages = async () => {
        toast.info("Clear images functionality needs to be implemented");
        setShowEditMenu(false);
    };

    const addDepartment = async (e) => {
        e.preventDefault();
        if (addingDepartment) return;
        
        setAddingDepartment(true);
        try {
            const res = await fetch(`${API_URL}/api/university/departments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(departmentForm),
            });
            if (res.ok) {
                toast.success("Department added");
                setShowDepartmentForm(false);
                setDepartmentForm({ department_name: "", hod_name: "" });
                fetchUniversityProfile();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to add department");
            }
        } catch (err) {
            toast.error("Failed to add department");
        } finally {
            setAddingDepartment(false);
        }
    };

    const deleteDepartment = async (id) => {
        if (deletingItem) return;
        
        setDeletingItem(id);
        try {
            const res = await fetch(`${API_URL}/api/university/departments/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Department deleted");
                fetchUniversityProfile();
            }
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeletingItem(null);
        }
    };

    const addProgram = async (e) => {
        e.preventDefault();
        if (addingProgram) return;
        
        setAddingProgram(true);
        try {
            const res = await fetch(`${API_URL}/api/university/programs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(programForm),
            });
            if (res.ok) {
                toast.success("Program added");
                setShowProgramForm(false);
                setProgramForm({
                    program_level: "", program_name: "", department: "", duration_years: "",
                    annual_fees: "", total_seats: "", eligibility: ""
                });
                fetchUniversityProfile();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to add program");
            }
        } catch (err) {
            toast.error("Failed to add program");
        } finally {
            setAddingProgram(false);
        }
    };

    const deleteProgram = async (id) => {
        if (deletingItem) return;
        
        setDeletingItem(id);
        try {
            const res = await fetch(`${API_URL}/api/university/programs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Program deleted");
                fetchUniversityProfile();
            }
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeletingItem(null);
        }
    };

    const addFacility = async (e) => {
        e.preventDefault();
        if (addingFacility) return;
        
        setAddingFacility(true);
        try {
            const res = await fetch(`${API_URL}/api/university/facilities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(facilityForm),
            });
            if (res.ok) {
                toast.success("Facility added");
                setShowFacilityForm(false);
                setFacilityForm({ facility_name: "" });
                fetchUniversityProfile();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to add facility");
            }
        } catch (err) {
            toast.error("Failed to add facility");
        } finally {
            setAddingFacility(false);
        }
    };

    const deleteFacility = async (id) => {
        if (deletingItem) return;
        
        setDeletingItem(id);
        try {
            const res = await fetch(`${API_URL}/api/university/facilities/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Facility deleted");
                fetchUniversityProfile();
            }
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeletingItem(null);
        }
    };

    const addPlacement = async (e) => {
        e.preventDefault();
        if (addingPlacement) return;
        
        setAddingPlacement(true);
        try {
            const res = await fetch(`${API_URL}/api/university/placements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(placementForm),
            });
            if (res.ok) {
                toast.success("Placement added");
                setShowPlacementForm(false);
                setPlacementForm({
                    academic_year: "", placement_percent: "", average_package: "",
                    highest_package: "", companies_visited: "", top_recruiters: ""
                });
                fetchUniversityProfile();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to add placement");
            }
        } catch (err) {
            toast.error("Failed to add placement");
        } finally {
            setAddingPlacement(false);
        }
    };

    const deletePlacement = async (id) => {
        if (deletingItem) return;
        
        setDeletingItem(id);
        try {
            const res = await fetch(`${API_URL}/api/university/placements/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Placement deleted");
                fetchUniversityProfile();
            }
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeletingItem(null);
        }
    };

    const addRanking = async (e) => {
        e.preventDefault();
        if (addingRanking) return;
        
        setAddingRanking(true);
        try {
            const res = await fetch(`${API_URL}/api/university/rankings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(rankingForm),
            });
            if (res.ok) {
                toast.success("Ranking added");
                setShowRankingForm(false);
                setRankingForm({
                    ranking_body: "", rank_value: "", year: "", category: "", certificate_url: ""
                });
                fetchUniversityProfile();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to add ranking");
            }
        } catch (err) {
            toast.error("Failed to add ranking");
        } finally {
            setAddingRanking(false);
        }
    };

    const deleteRanking = async (id) => {
        if (deletingItem) return;
        
        setDeletingItem(id);
        try {
            const res = await fetch(`${API_URL}/api/university/rankings/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Ranking deleted");
                fetchUniversityProfile();
            }
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeletingItem(null);
        }
    };

    const addResearch = async (e) => {
        e.preventDefault();
        if (addingResearch) return;
        
        setAddingResearch(true);
        try {
            const res = await fetch(`${API_URL}/api/university/research`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(researchForm),
            });
            if (res.ok) {
                toast.success("Research added");
                setShowResearchForm(false);
                setResearchForm({
                    research_title: "", area: "", publication_year: "", description: ""
                });
                fetchUniversityProfile();
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to add research");
            }
        } catch (err) {
            toast.error("Failed to add research");
        } finally {
            setAddingResearch(false);
        }
    };

    const deleteResearch = async (id) => {
        if (deletingItem) return;
        
        setDeletingItem(id);
        try {
            const res = await fetch(`${API_URL}/api/university/research/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("Research deleted");
                fetchUniversityProfile();
            }
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeletingItem(null);
        }
    };

    if (loading) return <LoadingSpinner message="Loading university profile..." />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT COLUMN - MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* HEADER with ProfileHeader component */}
                        <ProfileHeader
                            profile={university}
                            displayName={displayName}
                            API_URL={API_URL}
                            showEditMenu={showEditMenu}
                            setShowEditMenu={setShowEditMenu}
                            handleImageUpload={handleImageUpload}
                            clearImages={clearImages}
                            setEditingIntro={startEditingUniversity}
                            uploadingImage={uploadingImage}
                        >
                            <p className="text-base text-gray-600 mt-2">
                                {university.university_type ? `${university.university_type} University` : "Educational Institution"}
                                {university.accreditation && ` • ${university.accreditation}`}
                            </p>
                            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{university.city && university.state ? `${university.city}, ${university.state}` : "Add location"}</span>
                            </div>
                        </ProfileHeader>

                        {/* UNIVERSITY INFORMATION SECTION */}
                        <SectionCard 
                            title="University Information" 
                            onAdd={editingUniversity ? null : startEditingUniversity}
                            addLabel="Edit"
                        >
                            {editingUniversity ? (
                                <FormContainer>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>University Name *</Label>
                                            <Input
                                                value={university.name}
                                                onChange={(e) => setUniversity({ ...university, name: e.target.value })}
                                                placeholder="Enter university name"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>University Type</Label>
                                                <select
                                                    value={university.university_type}
                                                    onChange={(e) => setUniversity({ ...university, university_type: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5"
                                                >
                                                    <option value="">Select type</option>
                                                    {UNIVERSITY_TYPES.map((type) => (
                                                        <option key={type} value={type}>{type}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Accreditation</Label>
                                                <select
                                                    value={university.accreditation}
                                                    onChange={(e) => setUniversity({ ...university, accreditation: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5"
                                                >
                                                    <option value="">Select accreditation</option>
                                                    {ACCREDITATIONS.map((acc) => (
                                                        <option key={acc} value={acc}>{acc}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Established Year</Label>
                                                <Input
                                                    type="number"
                                                    value={university.established_year}
                                                    onChange={(e) => setUniversity({ ...university, established_year: e.target.value })}
                                                    placeholder="e.g., 1950"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label>Campus Area</Label>
                                                <Input
                                                    value={university.campus_area}
                                                    onChange={(e) => setUniversity({ ...university, campus_area: e.target.value })}
                                                    placeholder="e.g., 200 acres"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>State</Label>
                                                <select
                                                    value={university.state}
                                                    onChange={(e) => setUniversity({ ...university, state: e.target.value, city: "" })}
                                                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5"
                                                >
                                                    <option value="">Select state</option>
                                                    {Object.keys(STATES_AND_CITIES).map((state) => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label>City</Label>
                                                <select
                                                    value={university.city}
                                                    onChange={(e) => setUniversity({ ...university, city: e.target.value })}
                                                    disabled={!university.state}
                                                    className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5 disabled:bg-gray-100"
                                                >
                                                    <option value="">Select city</option>
                                                    {university.state && STATES_AND_CITIES[university.state]?.map((city) => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Zipcode</Label>
                                                <Input
                                                    value={university.zipcode}
                                                    onChange={(e) => setUniversity({ ...university, zipcode: e.target.value })}
                                                    placeholder="Postal code"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label>Phone</Label>
                                                <Input
                                                    value={university.phone}
                                                    onChange={(e) => setUniversity({ ...university, phone: e.target.value })}
                                                    placeholder="University phone"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Address</Label>
                                            <Input
                                                value={university.address}
                                                onChange={(e) => setUniversity({ ...university, address: e.target.value })}
                                                placeholder="Full address"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Email</Label>
                                                <Input
                                                    type="email"
                                                    value={university.email}
                                                    onChange={(e) => setUniversity({ ...university, email: e.target.value })}
                                                    placeholder="University email"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label>Website URL</Label>
                                                <Input
                                                    value={university.website_url}
                                                    onChange={(e) => setUniversity({ ...university, website_url: e.target.value })}
                                                    placeholder="https://www.university.edu"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Total Students</Label>
                                                <Input
                                                    type="number"
                                                    value={university.total_students}
                                                    onChange={(e) => setUniversity({ ...university, total_students: e.target.value })}
                                                    placeholder="Total students"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label>Total Faculty</Label>
                                                <Input
                                                    type="number"
                                                    value={university.total_faculty}
                                                    onChange={(e) => setUniversity({ ...university, total_faculty: e.target.value })}
                                                    placeholder="Total faculty"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Vice Chancellor Name</Label>
                                            <Input
                                                value={university.vice_chancellor_name}
                                                onChange={(e) => setUniversity({ ...university, vice_chancellor_name: e.target.value })}
                                                placeholder="Vice Chancellor's name"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Vice Chancellor Email</Label>
                                                <Input
                                                    type="email"
                                                    value={university.vice_chancellor_email}
                                                    onChange={(e) => setUniversity({ ...university, vice_chancellor_email: e.target.value })}
                                                    placeholder="Vice Chancellor's email"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                            <div>
                                                <Label>Vice Chancellor Phone</Label>
                                                <Input
                                                    value={university.vice_chancellor_phone}
                                                    onChange={(e) => setUniversity({ ...university, vice_chancellor_phone: e.target.value })}
                                                    placeholder="Vice Chancellor's phone"
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-end pt-2">
                                            <button
                                                onClick={cancelEditUniversity}
                                                disabled={savingUniversity}
                                                className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={updateUniversity}
                                                disabled={savingUniversity}
                                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {savingUniversity && (
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                )}
                                                {savingUniversity ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    </div>
                                </FormContainer>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    <InfoItem label="University Name" value={university.name} />
                                    <InfoItem label="Type" value={university.university_type} />
                                    <InfoItem label="Accreditation" value={university.accreditation} />
                                    <InfoItem label="Established" value={university.established_year} />
                                    <InfoItem label="Campus Area" value={university.campus_area} />
                                    <InfoItem label="Location" value={university.city && university.state ? `${university.city}, ${university.state}` : null} />
                                    <InfoItem label="Address" value={university.address} />
                                    <InfoItem label="Zipcode" value={university.zipcode} />
                                    <InfoItem label="Phone" value={university.phone} icon="phone" />
                                    <InfoItem label="Email" value={university.email} icon="email" />
                                    <InfoItem label="Website" value={university.website_url} icon="link" />
                                    <InfoItem label="Total Students" value={university.total_students} />
                                    <InfoItem label="Total Faculty" value={university.total_faculty} />
                                    <InfoItem label="Vice Chancellor" value={university.vice_chancellor_name} />
                                    <InfoItem label="VC Email" value={university.vice_chancellor_email} icon="email" />
                                    <InfoItem label="VC Phone" value={university.vice_chancellor_phone} icon="phone" />
                                </div>
                            )}
                        </SectionCard>

                        {/* DEPARTMENTS SECTION */}
                        <SectionCard title="Departments" onAdd={() => setShowDepartmentForm(!showDepartmentForm)}>
                            {showDepartmentForm && (
                                <FormContainer onSubmit={addDepartment}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Department Name *</Label>
                                            <Input
                                                required
                                                value={departmentForm.department_name}
                                                onChange={(e) => setDepartmentForm({ ...departmentForm, department_name: e.target.value })}
                                                placeholder="e.g., Computer Science"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>HOD Name</Label>
                                            <Input
                                                value={departmentForm.hod_name}
                                                onChange={(e) => setDepartmentForm({ ...departmentForm, hod_name: e.target.value })}
                                                placeholder="Head of Department"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowDepartmentForm(false)} 
                                            disabled={addingDepartment}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={addingDepartment}
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingDepartment && (
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {addingDepartment ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </FormContainer>
                            )}
                            {departments.length === 0 && !showDepartmentForm ? (
                                <EmptyState message="No departments added yet" />
                            ) : (
                                <div className="space-y-2">
                                    {departments.map((dept) => (
                                        <ItemCard
                                            key={dept.id}
                                            colorScheme="blue"
                                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                                            title={dept.department_name}
                                            subtitle={dept.hod_name ? `HOD: ${dept.hod_name}` : null}
                                            onDelete={() => deleteDepartment(dept.id)}
                                            isDeleting={deletingItem === dept.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* PROGRAMS SECTION */}
                        <SectionCard title="Academic Programs" onAdd={() => setShowProgramForm(!showProgramForm)}>
                            {showProgramForm && (
                                <FormContainer onSubmit={addProgram}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Program Level *</Label>
                                            <select
                                                required
                                                value={programForm.program_level}
                                                onChange={(e) => setProgramForm({ ...programForm, program_level: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5"
                                            >
                                                <option value="">Select level</option>
                                                {PROGRAM_LEVELS.map((level) => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Program Name *</Label>
                                            <Input
                                                required
                                                value={programForm.program_name}
                                                onChange={(e) => setProgramForm({ ...programForm, program_name: e.target.value })}
                                                placeholder="e.g., B.Tech Computer Science"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Department</Label>
                                            <Input
                                                value={programForm.department}
                                                onChange={(e) => setProgramForm({ ...programForm, department: e.target.value })}
                                                placeholder="Department name"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Duration (Years)</Label>
                                            <Input
                                                type="number"
                                                value={programForm.duration_years}
                                                onChange={(e) => setProgramForm({ ...programForm, duration_years: e.target.value })}
                                                placeholder="e.g., 4"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Annual Fees</Label>
                                            <Input
                                                value={programForm.annual_fees}
                                                onChange={(e) => setProgramForm({ ...programForm, annual_fees: e.target.value })}
                                                placeholder="e.g., 150000"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Total Seats</Label>
                                            <Input
                                                type="number"
                                                value={programForm.total_seats}
                                                onChange={(e) => setProgramForm({ ...programForm, total_seats: e.target.value })}
                                                placeholder="e.g., 60"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Eligibility</Label>
                                        <Input
                                            value={programForm.eligibility}
                                            onChange={(e) => setProgramForm({ ...programForm, eligibility: e.target.value })}
                                            placeholder="e.g., 10+2 with PCM"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowProgramForm(false)} 
                                            disabled={addingProgram}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={addingProgram}
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingProgram && (
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {addingProgram ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </FormContainer>
                            )}
                            {programs.length === 0 && !showProgramForm ? (
                                <EmptyState message="No programs added yet" />
                            ) : (
                                <div className="space-y-2">
                                    {programs.map((prog) => (
                                        <ItemCard
                                            key={prog.id}
                                            colorScheme="purple"
                                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                                            title={prog.program_name}
                                            subtitle={`${prog.program_level}${prog.department ? ` • ${prog.department}` : ''}`}
                                            description={`Duration: ${prog.duration_years || 'N/A'} years • Fees: ₹${prog.annual_fees || 'N/A'} • Seats: ${prog.total_seats || 'N/A'}`}
                                            onDelete={() => deleteProgram(prog.id)}
                                            isDeleting={deletingItem === prog.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* PLACEMENTS SECTION */}
                        <SectionCard title="Placement Records" onAdd={() => setShowPlacementForm(!showPlacementForm)}>
                            {showPlacementForm && (
                                <FormContainer onSubmit={addPlacement}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Academic Year *</Label>
                                            <Input
                                                required
                                                value={placementForm.academic_year}
                                                onChange={(e) => setPlacementForm({ ...placementForm, academic_year: e.target.value })}
                                                placeholder="e.g., 2023-24"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Placement Percentage</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={placementForm.placement_percent}
                                                onChange={(e) => setPlacementForm({ ...placementForm, placement_percent: e.target.value })}
                                                placeholder="e.g., 85.5"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Average Package (LPA)</Label>
                                            <Input
                                                value={placementForm.average_package}
                                                onChange={(e) => setPlacementForm({ ...placementForm, average_package: e.target.value })}
                                                placeholder="e.g., 7.5"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Highest Package (LPA)</Label>
                                            <Input
                                                value={placementForm.highest_package}
                                                onChange={(e) => setPlacementForm({ ...placementForm, highest_package: e.target.value })}
                                                placeholder="e.g., 45"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Companies Visited</Label>
                                            <Input
                                                type="number"
                                                value={placementForm.companies_visited}
                                                onChange={(e) => setPlacementForm({ ...placementForm, companies_visited: e.target.value })}
                                                placeholder="e.g., 150"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Top Recruiters</Label>
                                            <Input
                                                value={placementForm.top_recruiters}
                                                onChange={(e) => setPlacementForm({ ...placementForm, top_recruiters: e.target.value })}
                                                placeholder="e.g., Google, Microsoft, Amazon"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPlacementForm(false)} 
                                            disabled={addingPlacement}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={addingPlacement}
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingPlacement && (
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {addingPlacement ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </FormContainer>
                            )}
                            {placements.length === 0 && !showPlacementForm ? (
                                <EmptyState message="No placement records added yet" />
                            ) : (
                                <div className="space-y-2">
                                    {placements.map((p) => (
                                        <ItemCard
                                            key={p.id}
                                            colorScheme="green"
                                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                                            title={`Placements ${p.academic_year}`}
                                            description={`Placement: ${p.placement_percent}% • Avg: ₹${p.average_package}L • Highest: ₹${p.highest_package}L • Companies: ${p.companies_visited || 'N/A'}`}
                                            onDelete={() => deletePlacement(p.id)}
                                            isDeleting={deletingItem === p.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* RANKINGS SECTION */}
                        <SectionCard title="Rankings & Accreditations" onAdd={() => setShowRankingForm(!showRankingForm)}>
                            {showRankingForm && (
                                <FormContainer onSubmit={addRanking}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Ranking Body *</Label>
                                            <select
                                                required
                                                value={rankingForm.ranking_body}
                                                onChange={(e) => setRankingForm({ ...rankingForm, ranking_body: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5"
                                            >
                                                <option value="">Select body</option>
                                                {RANKING_BODIES.map((body) => (
                                                    <option key={body} value={body}>{body}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Rank</Label>
                                            <Input
                                                value={rankingForm.rank_value}
                                                onChange={(e) => setRankingForm({ ...rankingForm, rank_value: e.target.value })}
                                                placeholder="e.g., #15"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Year</Label>
                                            <Input
                                                type="number"
                                                value={rankingForm.year}
                                                onChange={(e) => setRankingForm({ ...rankingForm, year: e.target.value })}
                                                placeholder="2024"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Category</Label>
                                            <Input
                                                value={rankingForm.category}
                                                onChange={(e) => setRankingForm({ ...rankingForm, category: e.target.value })}
                                                placeholder="e.g., Engineering"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Certificate URL</Label>
                                        <Input
                                            value={rankingForm.certificate_url}
                                            onChange={(e) => setRankingForm({ ...rankingForm, certificate_url: e.target.value })}
                                            placeholder="https://certificate-url.com"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowRankingForm(false)} 
                                            disabled={addingRanking}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={addingRanking}
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingRanking && (
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {addingRanking ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </FormContainer>
                            )}
                            {rankings.length === 0 && !showRankingForm ? (
                                <EmptyState message="No rankings added yet" />
                            ) : (
                                <div className="space-y-2">
                                    {rankings.map((r) => (
                                        <ItemCard
                                            key={r.id}
                                            colorScheme="amber"
                                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                                            title={`${r.ranking_body} Rank ${r.rank_value}`}
                                            period={r.year ? `Year ${r.year}` : null}
                                            subtitle={r.category}
                                            link={r.certificate_url ? { url: r.certificate_url, text: "View Certificate" } : null}
                                            onDelete={() => deleteRanking(r.id)}
                                            isDeleting={deletingItem === r.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* RESEARCH SECTION */}
                        <SectionCard title="Research & Publications" onAdd={() => setShowResearchForm(!showResearchForm)}>
                            {showResearchForm && (
                                <FormContainer onSubmit={addResearch}>
                                    <div>
                                        <Label>Research Title *</Label>
                                        <Input
                                            required
                                            value={researchForm.research_title}
                                            onChange={(e) => setResearchForm({ ...researchForm, research_title: e.target.value })}
                                            placeholder="Title of research work"
                                            className="mt-1.5"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Research Area</Label>
                                            <Input
                                                value={researchForm.area}
                                                onChange={(e) => setResearchForm({ ...researchForm, area: e.target.value })}
                                                placeholder="e.g., Artificial Intelligence"
                                                className="mt-1.5"
                                            />
                                        </div>
                                        <div>
                                            <Label>Publication Year</Label>
                                            <Input
                                                type="number"
                                                value={researchForm.publication_year}
                                                onChange={(e) => setResearchForm({ ...researchForm, publication_year: e.target.value })}
                                                placeholder="2024"
                                                className="mt-1.5"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg p-3 mt-1.5 min-h-[100px]"
                                            value={researchForm.description}
                                            onChange={(e) => setResearchForm({ ...researchForm, description: e.target.value })}
                                            placeholder="Brief description of the research work"
                                        />
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowResearchForm(false)} 
                                            disabled={addingResearch}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={addingResearch}
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingResearch && (
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {addingResearch ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </FormContainer>
                            )}
                            {research.length === 0 && !showResearchForm ? (
                                <EmptyState message="No research publications added yet" />
                            ) : (
                                <div className="space-y-2">
                                    {research.map((res) => (
                                        <ItemCard
                                            key={res.id}
                                            colorScheme="indigo"
                                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                            title={res.research_title}
                                            subtitle={res.area}
                                            period={res.publication_year}
                                            description={res.description}
                                            onDelete={() => deleteResearch(res.id)}
                                            isDeleting={deletingItem === res.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </SectionCard>

                        {/* FACILITIES SECTION */}
                        <SectionCard title="Facilities" onAdd={() => setShowFacilityForm(!showFacilityForm)}>
                            {showFacilityForm && (
                                <FormContainer onSubmit={addFacility}>
                                    <div>
                                        <Label>Facility Name *</Label>
                                        <select
                                            required
                                            value={facilityForm.facility_name}
                                            onChange={(e) => setFacilityForm({ facility_name: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 mt-1.5"
                                        >
                                            <option value="">Select facility</option>
                                            {FACILITY_OPTIONS.map((fac) => (
                                                <option key={fac} value={fac}>{fac}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-3 justify-end">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowFacilityForm(false)} 
                                            disabled={addingFacility}
                                            className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={addingFacility}
                                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {addingFacility && (
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {addingFacility ? "Adding..." : "Add"}
                                        </button>
                                    </div>
                                </FormContainer>
                            )}
                            {facilities.length === 0 && !showFacilityForm ? (
                                <EmptyState message="No facilities added yet" />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {facilities.map((fac) => (
                                        <div
                                            key={fac.id}
                                            className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-100 transition-colors group"
                                        >
                                            <span className="text-sm font-medium text-blue-900">{fac.facility_name}</span>
                                            <button
                                                onClick={() => deleteFacility(fac.id)}
                                                disabled={deletingItem === fac.id}
                                                className="text-blue-700 hover:text-blue-900 opacity-70 group-hover:opacity-100 disabled:opacity-50"
                                            >
                                                {deletingItem === fac.id ? (
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </SectionCard>
                    </div>

                    {/* RIGHT COLUMN - SIDEBAR */}
                    <div className="space-y-6">
                        <SectionCard title="Quick Info">
                            <div className="space-y-4">
                                <InfoDisplay 
                                    icon={
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    }
                                    label="Established"
                                    value={university.established_year || "Not specified"}
                                />
                                <InfoDisplay 
                                    icon={
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    }
                                    label="Students"
                                    value={university.total_students || "Not specified"}
                                />
                                <InfoDisplay 
                                    icon={
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    }
                                    label="Faculty"
                                    value={university.total_faculty || "Not specified"}
                                />
                                <InfoDisplay 
                                    icon={
                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    }
                                    label="Campus"
                                    value={university.campus_area || "Not specified"}
                                />
                                {university.website_url && (
                                    <div className="pt-2 border-t">
                                        <a
                                            href={university.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                                        >
                                            Visit Website
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </SectionCard>

                        {university.vice_chancellor_name && (
                            <SectionCard title="Vice Chancellor">
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-900">{university.vice_chancellor_name}</p>
                                    {university.vice_chancellor_email && (
                                        <a href={`mailto:${university.vice_chancellor_email}`} className="text-sm text-blue-600 hover:text-blue-700 block">
                                            {university.vice_chancellor_email}
                                        </a>
                                    )}
                                    {university.vice_chancellor_phone && (
                                        <a href={`tel:${university.vice_chancellor_phone}`} className="text-sm text-blue-600 hover:text-blue-700 block">
                                            {university.vice_chancellor_phone}
                                        </a>
                                    )}
                                </div>
                            </SectionCard>
                        )}

                        {university.referral_code && (
                            <SectionCard title="Referral Code">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                                    <p className="text-2xl font-bold tracking-wider mb-2">{university.referral_code}</p>
                                    <p className="text-sm text-blue-100">Share this code with students</p>
                                </div>
                            </SectionCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
