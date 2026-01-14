import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { STATES_AND_CITIES } from "../data/statesAndCities";


const COLLEGE_TYPES = [
    "University",
    "Autonomous",
    "Affiliated College",
    "Technical Institute",
    "Management Institute",
];

const DEGREE_LEVELS = ["UG", "PG", "Diploma", "PhD"];

const FACILITY_OPTIONS = [
    "Hostel",
    "Library",
    "Labs",
    "Sports",
    "Medical",
    "Cafeteria",
    "Wi-Fi",
    "Placement Cell",
    "Incubation/Research",
    "Transport",
    "Auditorium",
    "Other",
];

export default function CollegeProfile() {
    const token = localStorage.getItem("token");

    const [college, setCollege] = useState({
        name: "",
        established_year: "",
        college_type: "",
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
    });

    const [programs, setPrograms] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [rankings, setRankings] = useState([]);

    const [programForm, setProgramForm] = useState({
        degree_level: "",
        program_name: "",
        specialization: "",
        duration_years: "",
        annual_fees: "",
        total_seats: "",
    });
    const [facilityForm, setFacilityForm] = useState({ facility_name: "" });
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

    useEffect(() => {
        fetchCollege();
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
            const { ok, data } = await apiCall("http://localhost:5000/api/college", "GET");
            if (ok) {
                const c = data.college || {};
                setCollege({
                    name: c.name || "",
                    established_year: c.established_year || "",
                    college_type: c.college_type || "",
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
                });
                setPrograms(data.programs || []);
                setFacilities(data.facilities || []);
                setPlacements(data.placements || []);
                setRankings(data.rankings || []);
            } else {
                toast.error("Failed to load college profile");
            }
        } finally {
            setLoading(false);
        }
    };

    const saveCollege = async () => {
        const { ok, data } = await apiCall("http://localhost:5000/api/college", "PUT", college);
        if (ok) {
            toast.success("College profile saved");
            setCollege((prev) => ({ ...prev, ...data.college }));
        } else {
            toast.error(data?.message || "Failed to save");
        }
    };

    const saveProgram = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall("http://localhost:5000/api/college/programs", "POST", programForm);
        if (ok) {
            toast.success("Program added");
            setProgramForm({ degree_level: "", program_name: "", specialization: "", duration_years: "", annual_fees: "", total_seats: "" });
            fetchCollege();
        } else {
            toast.error("Failed to add program");
        }
    };

    const deleteProgram = async (id) => {
        const { ok } = await apiCall(`http://localhost:5000/api/college/programs/${id}`, "DELETE");
        if (ok) {
            toast.success("Program deleted");
            fetchCollege();
        }
    };

    const addFacility = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall("http://localhost:5000/api/college/facilities", "POST", facilityForm);
        if (ok) {
            toast.success("Facility added");
            setFacilityForm({ facility_name: "" });
            fetchCollege();
        } else toast.error("Failed to add facility");
    };

    const deleteFacility = async (id) => {
        const { ok } = await apiCall(`http://localhost:5000/api/college/facilities/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchCollege(); }
    };

    const addPlacement = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall("http://localhost:5000/api/college/placements", "POST", placementForm);
        if (ok) {
            toast.success("Placement added");
            setPlacementForm({ academic_year: "", placement_percent: "", average_package: "", highest_package: "", companies_visited: "", top_recruiters: "" });
            fetchCollege();
        } else toast.error("Failed to add placement");
    };

    const deletePlacement = async (id) => {
        const { ok } = await apiCall(`http://localhost:5000/api/college/placements/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchCollege(); }
    };

    const addRanking = async (e) => {
        e.preventDefault();
        const { ok } = await apiCall("http://localhost:5000/api/college/rankings", "POST", rankingForm);
        if (ok) {
            toast.success("Ranking added");
            setRankingForm({ ranking_body: "", rank_value: "", year: "", category: "", certificate_url: "" });
            fetchCollege();
        } else toast.error("Failed to add ranking");
    };

    const deleteRanking = async (id) => {
        const { ok } = await apiCall(`http://localhost:5000/api/college/rankings/${id}`, "DELETE");
        if (ok) { toast.success("Deleted"); fetchCollege(); }
    };

    const uploadMedia = async (e) => {
        e.preventDefault();
        if (!logoFile && !bannerFile) return toast.error("Select a logo or banner first");
        const formData = new FormData();
        if (logoFile) formData.append("logoImage", logoFile);
        if (bannerFile) formData.append("bannerImage", bannerFile);
        const { ok, data } = await apiCall("http://localhost:5000/api/college/media", "PATCH", formData, true);
        if (ok) {
            toast.success("Images updated");
            setCollege((prev) => ({ ...prev, logo_url: data.logo_url || prev.logo_url, banner_url: data.banner_url || prev.banner_url }));
            setLogoFile(null);
            setBannerFile(null);
        } else {
            toast.error(data?.message || "Upload failed");
        }
    };

    const clearMedia = async () => {
        const { ok } = await apiCall("http://localhost:5000/api/college/media/clear", "DELETE");
        if (ok) {
            toast.success("Images cleared");
            setCollege((prev) => ({ ...prev, logo_url: "", banner_url: "" }));
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    const bannerStyle = college.banner_url
        ? { backgroundImage: `url(http://localhost:5000${college.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
        : {};

    return (
        <div className="min-h-screen bg-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero header */}
                        <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white relative">
                            <div className="h-32 md:h-36 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700" style={bannerStyle} />
                            <div className="px-6 pb-6 flex flex-wrap items-end gap-4 -mt-12">
                                <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center ring-4 ring-white overflow-hidden">
                                    {college.logo_url ? (
                                        <img src={`http://localhost:5000${college.logo_url}`} alt="College Logo" className="w-full h-full object-cover" />
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
                            <div className="px-6 pb-4 flex gap-3">
                                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                                <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
                                <Button onClick={uploadMedia} variant="secondary">Upload</Button>
                                {(college.logo_url || college.banner_url) && (
                                    <Button onClick={clearMedia} variant="destructive">Clear</Button>
                                )}
                            </div>
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
                                        <Label>College Type</Label>
                                        <select value={college.college_type} onChange={(e) => setCollege({ ...college, college_type: e.target.value })} className="w-full border rounded-md p-2">
                                            <option value="">Select type</option>
                                            {COLLEGE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Established Year</Label>
                                        <Input type="number" value={college.established_year} onChange={(e) => setCollege({ ...college, established_year: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Accreditation / Affiliation</Label>
                                        <Input value={college.accreditation} onChange={(e) => setCollege({ ...college, accreditation: e.target.value })} placeholder="e.g., NAAC A+, UGC, AICTE" />
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

                        {/* Programs */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle>Programs Offered</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={saveProgram} className="space-y-3 border p-4 rounded">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Degree Level</Label>
                                            <select value={programForm.degree_level} onChange={(e) => setProgramForm({ ...programForm, degree_level: e.target.value })} className="w-full border rounded-md p-2">
                                                <option value="">Select</option>
                                                {DEGREE_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Program Name</Label>
                                            <Input required value={programForm.program_name} onChange={(e) => setProgramForm({ ...programForm, program_name: e.target.value })} placeholder="e.g., B.Tech" />
                                        </div>
                                        <div>
                                            <Label>Specialization</Label>
                                            <Input value={programForm.specialization} onChange={(e) => setProgramForm({ ...programForm, specialization: e.target.value })} placeholder="e.g., CSE" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Duration (years)</Label>
                                            <Input type="number" value={programForm.duration_years} onChange={(e) => setProgramForm({ ...programForm, duration_years: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Annual Fees</Label>
                                            <Input type="number" value={programForm.annual_fees} onChange={(e) => setProgramForm({ ...programForm, annual_fees: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Total Seats</Label>
                                            <Input type="number" value={programForm.total_seats} onChange={(e) => setProgramForm({ ...programForm, total_seats: e.target.value })} />
                                        </div>
                                    </div>
                                    <Button type="submit">Save Program</Button>
                                </form>

                                {programs.map((p) => (
                                    <div key={p.id} className="border p-4 rounded flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{p.program_name}</h3>
                                            <p className="text-sm text-gray-600">{p.specialization}</p>
                                            <p className="text-xs text-gray-500">{p.degree_level} • {p.duration_years ? `${p.duration_years} yrs` : ""}</p>
                                            <p className="text-xs text-gray-500">Fees: {p.annual_fees || "-"} | Seats: {p.total_seats || "-"}</p>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={() => deleteProgram(p.id)}>Delete</Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Facilities */}
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle>Facilities</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form onSubmit={addFacility} className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Select Facility</Label>
                                            <select value={facilityForm.facility_name} onChange={(e) => setFacilityForm({ facility_name: e.target.value })} className="w-full border rounded-md p-2" required>
                                                <option value="">Choose</option>
                                                {FACILITY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Or add custom</Label>
                                            <Input value={facilityForm.facility_name} onChange={(e) => setFacilityForm({ facility_name: e.target.value })} placeholder="Custom facility" />
                                        </div>
                                    </div>
                                    <Button type="submit">Add Facility</Button>
                                </form>

                                <div className="flex flex-wrap gap-2">
                                    {facilities.map((f) => (
                                        <div key={f.id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                            <span>{f.facility_name}</span>
                                            <button onClick={() => deleteFacility(f.id)} className="text-red-500 hover:text-red-700">×</button>
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
                        <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-0">
                            <CardHeader>
                                <CardTitle className="text-lg">Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-700">
                                <p><strong>Phone:</strong> {college.phone || "-"}</p>
                                <p><strong>Email:</strong> {college.email || "-"}</p>
                                <p className="break-all"><strong>Website:</strong> {college.website_url || "-"}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

