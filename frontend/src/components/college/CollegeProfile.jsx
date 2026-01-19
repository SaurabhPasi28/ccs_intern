import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { STATES_AND_CITIES } from "../data/statesAndCities";
const API_URL = import.meta.env.VITE_API_URL;

const COLLEGE_TYPES = [
    "University",
    "Autonomous",
    "Affiliated College",
    "Technical Institute",
    "Management Institute",
];

const DEGREE_LEVELS = [
    "B.Tech", "M.Tech", "B.E.", "M.E.", "BSc", "MSc", "BCA", "MCA",
    "BA", "MA", "BBA", "MBA", "B.Com", "M.Com", "LLB", "LLM",
    "MBBS", "MD", "BDS", "MDS", "B.Pharm", "M.Pharm", "PhD",
    "Diploma", "Other"
];

export default function CollegeProfile() {
    const token = localStorage.getItem("token");

    const [college, setCollege] = useState({
        name: "",
        established_year: "",
        accreditation: "",
        state: "",
        city: "",
        zipcode: "",
        address: "",
        phone: "",
        email: "",
        website_url: "",
        logo_url: "",
        banner_url: "",
        hod_name: "",
        hod_email: "",
        hod_phone: "",
        hod_designation: "",
    });

    const [degrees, setDegrees] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [rankings, setRankings] = useState([]);

    const [degreeForm, setDegreeForm] = useState({ degree_name: "" });
    const [customDegreeMode, setCustomDegreeMode] = useState(false);
    const [showDegreeForm, setShowDegreeForm] = useState(false);
    const [placementForm, setPlacementForm] = useState({
        academic_year: "",
        placement_percent: "",
        average_package: "",
        highest_package: "",
        companies_visited: "",
        top_recruiters: "",
    });
    const [rankingForm, setRankingForm] = useState({
        ranking_body: "",
        rank_value: "",
        year: "",
        category: "",
        certificate_url: "",
    });

    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMediaPopup, setShowMediaPopup] = useState(false);
    const [dragActive, setDragActive] = useState({ logo: false, banner: false });
    
    const [qrCode, setQrCode] = useState(null);
    const [qrLoading, setQrLoading] = useState(false);

    useEffect(() => {
        fetchCollege();
        fetchQRCode();
    }, []);

    const apiCall = async (url, method, body, isFormData = false) => {
        try {
            const res = await fetch(url, {
                method,
                headers: isFormData
                    ? { Authorization: `Bearer ${token}` }
                    : { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
            });
            const data = await res.json();
            return { ok: res.ok, data };
        } catch (err) {
            return { ok: false, data: null };
        }
    };

    const fetchCollege = async () => {
        try {
            const { ok, data } = await apiCall(`${API_URL}/api/college`, "GET");
            if (ok) {
                const c = data.college || {};
                setCollege({
                    name: c.name || "",
                    established_year: c.established_year || "",
                    accreditation: c.accreditation || "",
                    state: c.state || "",
                    city: c.city || "",
                    zipcode: c.zipcode || "",
                    address: c.address || "",
                    phone: c.phone || "",
                    email: c.email || "",
                    website_url: c.website_url || "",
                    logo_url: c.logo_url || "",
                    banner_url: c.banner_url || "",
                    hod_name: c.hod_name || "",
                    hod_email: c.hod_email || "",
                    hod_phone: c.hod_phone || "",
                    hod_designation: c.hod_designation || "",
                });
                setDegrees(data.degrees || []);
                setPlacements(data.placements || []);
                setRankings(data.rankings || []);
            } else {
                toast.error("Failed to load college profile");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchQRCode = async () => {
        setQrLoading(true);
        try {
            const { ok, data } = await apiCall(`${API_URL}/api/college/qrcode`, "GET");
            if (ok) {
                setQrCode(data);
            }
        } catch (err) {
            console.error("Failed to fetch QR code:", err);
        } finally {
            setQrLoading(false);
        }
    };

    const downloadQRCode = () => {
        if (!qrCode?.qrCode) return;
        const link = document.createElement('a');
        link.href = qrCode.qrCode;
        link.download = `${qrCode.collegeName || 'college'}_referral_qr.png`;
        link.click();
        toast.success("QR Code downloaded!");
    };

    const saveCollege = async () => {
        const { ok, data } = await apiCall(`${API_URL}/api/college`, "PUT", college);
        if (ok) {
            toast.success("College profile saved");
            setCollege((prev) => ({ ...prev, ...data.college }));
        } else {
            toast.error(data?.message || "Failed to save");
        }
    };

    const handleDegreeSelect = (value) => {
        if (value === "Other") {
            setCustomDegreeMode(true);
            setDegreeForm({ degree_name: "" });
        } else {
            setCustomDegreeMode(false);
            setDegreeForm({ degree_name: value });
        }
    };

    const addDegree = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall(`${API_URL}/api/college/degrees`, "POST", degreeForm);
        if (ok) {
            toast.success("Degree added");
            setShowDegreeForm(false);
            setDegreeForm({ degree_name: "" });
            setCustomDegreeMode(false);
            fetchCollege();
        } else toast.error("Failed to add degree");
    };

    const deleteDegree = async (degree_id) => {
        const { ok } = await apiCall(`${API_URL}/api/college/degrees/${degree_id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchCollege(); }
    };

    const addPlacement = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall(`${API_URL}/api/college/placements`, "POST", placementForm);
        if (ok) {
            toast.success("Placement added");
            setPlacementForm({ academic_year: "", placement_percent: "", average_package: "", highest_package: "", companies_visited: "", top_recruiters: "" });
            fetchCollege();
        } else toast.error("Failed to add placement");
    };

    const deletePlacement = async (id) => {
        const { ok } = await apiCall(`${API_URL}/api/college/placements/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchCollege(); }
    };

    const addRanking = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall(`${API_URL}/api/college/rankings`, "POST", rankingForm);
        if (ok) {
            toast.success("Ranking added");
            setRankingForm({ ranking_body: "", rank_value: "", year: "", category: "", certificate_url: "" });
            fetchCollege();
        } else toast.error("Failed to add ranking");
    };

    const deleteRanking = async (id) => {
        const { ok } = await apiCall(`${API_URL}/api/college/rankings/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchCollege(); }
    };

    const handleDrag = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive({ ...dragActive, [type]: true });
        } else if (e.type === "dragleave") {
            setDragActive({ ...dragActive, [type]: false });
        }
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive({ ...dragActive, [type]: false });
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (type === "logo") {
                setLogoFile(e.dataTransfer.files[0]);
            } else {
                setBannerFile(e.dataTransfer.files[0]);
            }
        }
    };

    const uploadMedia = async (e) => {
        e.preventDefault();
        if (!logoFile && !bannerFile) return toast.error("Select a logo or banner first");
        const formData = new FormData();
        if (logoFile) formData.append("logoImage", logoFile);
        if (bannerFile) formData.append("bannerImage", bannerFile);
        const { ok, data } = await apiCall(`${API_URL}/api/college/media`, "PATCH", formData, true);
        if (ok) {
            toast.success("Images updated");
            setCollege((prev) => ({ ...prev, logo_url: data.logo_url || prev.logo_url, banner_url: data.banner_url || prev.banner_url }));
            setLogoFile(null);
            setBannerFile(null);
            setShowMediaPopup(false);
        } else {
            toast.error(data?.message || "Upload failed");
        }
    };

    const clearMedia = async () => {
        const { ok } = await apiCall(`${API_URL}/api/college/media/clear`, "DELETE");
        if (ok) {
            toast.success("Images cleared");
            setCollege((prev) => ({ ...prev, logo_url: "", banner_url: "" }));
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    const bannerStyle = college.banner_url
        ? { backgroundImage: `url(${API_URL}${college.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
        : {};

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Media Upload Popup */}
            {showMediaPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMediaPopup(false)}>
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Upload Images</h2>
                            <button onClick={() => setShowMediaPopup(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* Logo Drop Zone */}
                            <div>
                                <Label>College Logo</Label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                        dragActive.logo ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onDragEnter={(e) => handleDrag(e, "logo")}
                                    onDragLeave={(e) => handleDrag(e, "logo")}
                                    onDragOver={(e) => handleDrag(e, "logo")}
                                    onDrop={(e) => handleDrop(e, "logo")}
                                    onClick={() => document.getElementById("logoInput").click()}
                                >
                                    {logoFile ? (
                                        <div>
                                            <p className="text-sm text-gray-600">Selected: {logoFile.name}</p>
                                            <button onClick={(e) => { e.stopPropagation(); setLogoFile(null); }} className="text-red-500 text-sm mt-2">Remove</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-600">Drag and drop logo here, or click to select</p>
                                        </div>
                                    )}
                                </div>
                                <input id="logoInput" type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                            </div>
                            {/* Banner Drop Zone */}
                            <div>
                                <Label>College Banner</Label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                                        dragActive.banner ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onDragEnter={(e) => handleDrag(e, "banner")}
                                    onDragLeave={(e) => handleDrag(e, "banner")}
                                    onDragOver={(e) => handleDrag(e, "banner")}
                                    onDrop={(e) => handleDrop(e, "banner")}
                                    onClick={() => document.getElementById("bannerInput").click()}
                                >
                                    {bannerFile ? (
                                        <div>
                                            <p className="text-sm text-gray-600">Selected: {bannerFile.name}</p>
                                            <button onClick={(e) => { e.stopPropagation(); setBannerFile(null); }} className="text-red-500 text-sm mt-2">Remove</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-600">Drag and drop banner here, or click to select</p>
                                        </div>
                                    )}
                                </div>
                                <input id="bannerInput" type="file" accept="image/*" className="hidden" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <Button onClick={() => setShowMediaPopup(false)} variant="outline">Cancel</Button>
                                <Button onClick={uploadMedia} disabled={!logoFile && !bannerFile}>Upload</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero header */}
                        <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white relative">
                            {/* Edit Icon */}
                            <div className="absolute top-4 right-4 z-10">
                                <button
                                    onClick={() => setShowMediaPopup(true)}
                                    className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="h-32 md:h-36 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700" style={bannerStyle} />
                            <div className="px-6 pb-6 flex flex-wrap items-end gap-4 -mt-12">
                                <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center ring-4 ring-white overflow-hidden">
                                    {college.logo_url ? (
                                        <img src={`${API_URL}${college.logo_url}`} alt="College Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-semibold text-sky-700">logo</span>
                                    )}
                                </div>
                                <div className="my-2 flex-1 min-w-[200px]">
                                    <h1 className="text-2xl font-bold text-slate-900">{college.name || "College name"}</h1>
                                    <p className="text-sm text-slate-500">
                                        {college.city || "City"} / {college.state || "State"}
                                    </p>
                                </div>
                            </div>
                            {(college.logo_url || college.banner_url) && (
                                <div className="px-6 pb-4">
                                    <Button onClick={clearMedia} variant="destructive" size="sm">Clear Images</Button>
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>College Name</Label>
                                        <Input value={college.name} onChange={(e) => setCollege({ ...college, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Established Year</Label>
                                        <Input type="number" value={college.established_year} onChange={(e) => setCollege({ ...college, established_year: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>State</Label>
                                        <select value={college.state} onChange={(e) => setCollege({ ...college, state: e.target.value, city: "" })} className="w-full border rounded-md p-2">
                                            <option value="">Select state</option>
                                            {Object.keys(STATES_AND_CITIES).map((state) => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label>City</Label>
                                        <select value={college.city} onChange={(e) => setCollege({ ...college, city: e.target.value })} disabled={!college.state} className="w-full border rounded-md p-2 disabled:bg-gray-100">
                                            <option value="">Select city</option>
                                            {college.state && STATES_AND_CITIES[college.state]?.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Zipcode</Label>
                                        <Input value={college.zipcode} onChange={(e) => setCollege({ ...college, zipcode: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Address</Label>
                                        <Input value={college.address} onChange={(e) => setCollege({ ...college, address: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Phone</Label>
                                        <Input value={college.phone} onChange={(e) => setCollege({ ...college, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Official Email</Label>
                                        <Input type="email" value={college.email} onChange={(e) => setCollege({ ...college, email: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Website URL</Label>
                                        <Input value={college.website_url} onChange={(e) => setCollege({ ...college, website_url: e.target.value })} placeholder="https://" />
                                    </div>
                                </div>
                                <Button onClick={saveCollege}>Save</Button>
                            </CardContent>
                        </Card>

                        {/* Degrees Offered */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Degrees Offered</CardTitle>
                                    <Button onClick={() => setShowDegreeForm(!showDegreeForm)} size="sm">
                                        {showDegreeForm ? "Cancel" : "+ Add Degree"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {showDegreeForm && (
                                    <form onSubmit={addDegree} className="space-y-3">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            <select
                                                value={customDegreeMode ? "Other" : degreeForm.degree_name}
                                                onChange={(e) => handleDegreeSelect(e.target.value)}
                                                className="w-full border rounded-md p-2"
                                                required={!customDegreeMode}
                                            >
                                                <option value="">Select degree</option>
                                                {DEGREE_LEVELS.map((degree) => (
                                                    <option key={degree} value={degree}>{degree}</option>
                                                ))}
                                            </select>
                                            {customDegreeMode && (
                                                <Input
                                                    required
                                                    value={degreeForm.degree_name}
                                                    onChange={(e) => setDegreeForm({ degree_name: e.target.value })}
                                                    placeholder="Enter degree name"
                                                />
                                            )}
                                        </div>
                                        <Button type="submit">Save</Button>
                                    </form>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {degrees.map((degree) => (
                                        <div key={degree.id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                            <span>{degree.degree_name}</span>
                                            <button onClick={() => deleteDegree(degree.id)} className="text-red-500 hover:text-red-700">
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Placement Snapshot */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle>Placement Snapshot</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={addPlacement} className="space-y-3 border p-4 rounded">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Academic Year</Label>
                                            <Input value={placementForm.academic_year} onChange={(e) => setPlacementForm({ ...placementForm, academic_year: e.target.value })} placeholder="2024-25" />
                                        </div>
                                        <div>
                                            <Label>Placement %</Label>
                                            <Input type="number" value={placementForm.placement_percent} onChange={(e) => setPlacementForm({ ...placementForm, placement_percent: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Companies Visited</Label>
                                            <Input type="number" value={placementForm.companies_visited} onChange={(e) => setPlacementForm({ ...placementForm, companies_visited: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Average Package</Label>
                                            <Input type="number" value={placementForm.average_package} onChange={(e) => setPlacementForm({ ...placementForm, average_package: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Highest Package</Label>
                                            <Input type="number" value={placementForm.highest_package} onChange={(e) => setPlacementForm({ ...placementForm, highest_package: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Top Recruiters</Label>
                                            <Input value={placementForm.top_recruiters} onChange={(e) => setPlacementForm({ ...placementForm, top_recruiters: e.target.value })} placeholder="Comma separated" />
                                        </div>
                                    </div>
                                    <Button type="submit">Save Placement</Button>
                                </form>

                                {placements.map((p) => (
                                    <div key={p.id} className="border p-4 rounded flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{p.academic_year}</h3>
                                            <p className="text-sm text-gray-600">Placement: {p.placement_percent || "-"}% | Companies: {p.companies_visited || "-"}</p>
                                            <p className="text-xs text-gray-500">Avg: {p.average_package || "-"} | High: {p.highest_package || "-"}</p>
                                            {p.top_recruiters && <p className="text-xs">Top: {p.top_recruiters}</p>}
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => deletePlacement(p.id)}>Delete</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Rankings */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle>Rankings / Certifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={addRanking} className="space-y-3 border p-4 rounded">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Ranking Body</Label>
                                            <Input required value={rankingForm.ranking_body} onChange={(e) => setRankingForm({ ...rankingForm, ranking_body: e.target.value })} placeholder="e.g., NIRF" />
                                        </div>
                                        <div>
                                            <Label>Rank / Grade</Label>
                                            <Input value={rankingForm.rank_value} onChange={(e) => setRankingForm({ ...rankingForm, rank_value: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Year</Label>
                                            <Input type="number" value={rankingForm.year} onChange={(e) => setRankingForm({ ...rankingForm, year: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Category</Label>
                                            <Input value={rankingForm.category} onChange={(e) => setRankingForm({ ...rankingForm, category: e.target.value })} placeholder="Overall / Engineering / Management" />
                                        </div>
                                        <div>
                                            <Label>Certificate URL (optional)</Label>
                                            <Input value={rankingForm.certificate_url} onChange={(e) => setRankingForm({ ...rankingForm, certificate_url: e.target.value })} placeholder="https://" />
                                        </div>
                                    </div>
                                    <Button type="submit">Save Ranking</Button>
                                </form>

                                {rankings.map((r) => (
                                    <div key={r.id} className="border p-4 rounded flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{r.ranking_body}</h3>
                                            <p className="text-sm text-gray-600">{r.rank_value || "-"} {r.year && `(${r.year})`}</p>
                                            {r.category && <p className="text-xs text-gray-500">{r.category}</p>}
                                            {r.certificate_url && <a href={r.certificate_url} className="text-xs text-blue-600" target="_blank" rel="noreferrer">View</a>}
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => deleteRanking(r.id)}>Delete</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* QR Code Card */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            {/* <CardHeader>
                                <CardTitle className="text-lg">Student Referral QR</CardTitle>
                            </CardHeader> */}
                            <CardContent className="space-y-3">
                                {qrLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : qrCode ? (
                                    <div className="space-y-3">
                                        <div className="bg-white p-3 rounded-lg border-2 border-gray-200 flex justify-center">
                                            <img 
                                                src={qrCode.qrCode} 
                                                alt="Registration QR Code" 
                                                className="w-full max-w-[200px]"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 text-center">
                                            Scan to register with your referral code
                                        </p>
                                        <div className="space-y-2">
                                            <Button 
                                                onClick={downloadQRCode} 
                                                className="w-full" 
                                                size="sm"
                                            >
                                                📥 Download QR Code
                                            </Button>
                                            <div className="bg-gray-50 p-2 rounded text-xs">
                                                <p className="text-gray-500 mb-1">Referral Code:</p>
                                                <p className="font-mono text-gray-800 break-all">{qrCode.referralCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Complete your profile to generate QR code
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle className="text-lg">College Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-700">
                                <p><strong>Phone:</strong> {college.phone || "-"}</p>
                                <p><strong>Email:</strong> {college.email || "-"}</p>
                                <p className="break-all"><strong>Website:</strong> {college.website_url || "-"}</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle className="text-lg">HOD Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-xs">Name</Label>
                                    <Input
                                        value={college.hod_name}
                                        onChange={(e) => setCollege({ ...college, hod_name: e.target.value })}
                                        placeholder="HOD Name"
                                        className="text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Designation</Label>
                                    <Input
                                        value={college.hod_designation}
                                        onChange={(e) => setCollege({ ...college, hod_designation: e.target.value })}
                                        placeholder="e.g., Head of Department"
                                        className="text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Email</Label>
                                    <Input
                                        type="email"
                                        value={college.hod_email}
                                        onChange={(e) => setCollege({ ...college, hod_email: e.target.value })}
                                        placeholder="hod@college.edu"
                                        className="text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Phone</Label>
                                    <Input
                                        value={college.hod_phone}
                                        onChange={(e) => setCollege({ ...college, hod_phone: e.target.value })}
                                        placeholder="+91 XXXXX XXXXX"
                                        className="text-sm"
                                    />
                                </div>
                                <Button onClick={saveCollege} size="sm" className="w-full">Save HOD Details</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

