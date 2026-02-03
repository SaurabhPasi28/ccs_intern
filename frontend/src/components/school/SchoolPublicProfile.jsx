import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
    School,
    MapPin,
    Calendar,
    Globe,
    Mail,
    Phone,
    BookOpen,
    Award,
    Building2,
    Trophy,
    Users,
    GraduationCap,
    CheckCircle,
    Star,
    Target,
    Sparkles,
    User
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const resolveMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_URL}${url}`;
};

export default function SchoolPublicProfile() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [school, setSchool] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     fetchSchoolProfile();
    // }, [id]);

    // const fetchSchoolProfile = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch(`http://localhost:5000/api/college/public/${id}`);
    //         const data = await response.json();

    //         if (response.ok) {
    //             setSchool(data.college);
    //             setPrograms(data.programs || []);
    //             setFacilities(data.facilities || []);
    //             setPlacements(data.placements || []);
    //             setRankings(data.rankings || []);
    //         } else {
    //             setError(data.message || "School not found");
    //         }
    //     } catch (err) {
    //         setError("Failed to load school profile");
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
        useEffect(() => {
                const fetchSchoolProfile = async () => {
                        try {
                                setLoading(true);
                                const response = await fetch(`${API_URL}/school/public/${id}`);
                                const data = await response.json();

                                if (response.ok) {
                                        setSchool(data.school || null);
                                        setPrograms(data.programs || []);
                                        setFacilities(data.facilities || []);
                                        setPlacements(data.placements || []);
                                        setRankings(data.rankings || []);
                                        setError(null);
                                } else {
                                        setError(data.message || "School not found");
                                }
                        } catch (err) {
                                setError("Failed to load school profile");
                                console.error(err);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchSchoolProfile();
        }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-indigo-100">
                <div className="text-center">
                    <School className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
                    <div className="text-xl font-semibold text-gray-700">Loading school profile...</div>
                </div>
            </div>
        );
    }

    if (error || !school) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-indigo-100">
                <Card className="max-w-md shadow-2xl border-2 border-red-200">
                    <CardContent className="pt-6">
                        <p className="text-center text-red-600 font-semibold">{error || "School not found"}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-sky-50 via-blue-50 to-indigo-100">
            {/* Banner Section with Overlay Pattern */}
            <div className="relative overflow-hidden">
                {school.banner_url ? (
                    <div className="relative w-full h-80">
                        <img
                            src={resolveMediaUrl(school.banner_url)}
                            alt={school.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>
                ) : (
                    <div className="relative w-full h-80 bg-blue-600 ">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                        </div>
                    </div>
                )}

                {/* Logo with Enhanced Shadow */}
                <div className="absolute -bottom-20 left-10 transform hover:scale-105 transition-all duration-300 ease-in-out">
                    {school.logo_url ? (
                        <div className="relative ">
                            <img
                                src={resolveMediaUrl(school.logo_url)}
                                alt={school.name}
                                className="w-52 h-52 rounded-full border-4 border-white shadow-2xl bg-white object-cover"
                            />
                            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition"></div>
                        </div>
                    ) : (
                        <div className="relative w-52 h-52 rounded-3xl border-4 border-white shadow-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <School size={80} className="text-white" />
                        </div>
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 opacity-20">
                    <Sparkles className="w-12 h-12 text-white animate-pulse" />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
                {/* School Header */}
                <div className="mb-10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-blue-600 mb-4 tracking-tight">
                                {school.name}
                            </h1>
                            <div className="flex flex-wrap gap-3 mb-6">
                                {school.school_type && (
                                    <Badge className="px-4 py-2 text-base font-bold bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 shadow-lg">
                                        <School className="w-4 h-4 mr-2" />
                                        {school.school_type}
                                    </Badge>
                                )}
                                {school.board && (
                                    <Badge className="px-4 py-2 text-base font-bold bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 shadow-lg">
                                        <Award className="w-4 h-4 mr-2" />
                                        {school.board}
                                    </Badge>
                                )}
                                {school.affiliation && (
                                    <Badge className="px-4 py-2 text-base font-bold bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 shadow-lg">
                                        <Award className="w-4 h-4 mr-2" />
                                        {school.affiliation}
                                    </Badge>
                                )}
                                {school.established_year && (
                                    <Badge className="px-4 py-2 text-base font-bold bg-purple-500 hover:bg-purple-600 border-0 shadow-lg">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Est. {school.established_year}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Location & Contact Quick Info */}
                    <div className="flex flex-wrap gap-6 text-base">
                        {(school.city || school.state) && (
                            <div className="flex items-center gap-2 text-gray-700 font-medium bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                                <MapPin size={20} className="text-blue-600" />
                                <span>{[school.city, school.state].filter(Boolean).join(", ")}</span>
                            </div>
                        )}
                        {school.website_url && (
                            <a
                                href={school.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                            >
                                <Globe size={20} />
                                <span>Visit Website</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Academic Programs/Classes */}
                        {programs.length > 0 && (
                            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white rounded-2xl overflow-hidden">
                                <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6">
                                    <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                                            <BookOpen size={28} />
                                        </div>
                                        Academic Programs
                                    </CardTitle>
                                </div>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {programs.map((program, index) => (
                                            <div
                                                key={index}
                                                className="group relative bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300 hover:-translate-y-1"
                                            >
                                                <div className="absolute top-4 right-4">
                                                    <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        {program.degree_level || "Program"}
                                                    </div>
                                                </div>
                                                <GraduationCap className="w-10 h-10 text-blue-600 mb-3" />
                                                <h3 className="font-bold text-xl text-gray-900 mb-2 pr-20">
                                                    {program.program_name}
                                                </h3>
                                                {program.specialization && (
                                                    <p className="text-sm text-gray-600 mb-4 font-medium">
                                                        {program.specialization}
                                                    </p>
                                                )}
                                                <div className="space-y-2 mt-4">
                                                    {program.duration_years && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <Calendar size={16} className="text-blue-600" />
                                                            <span className="font-semibold">{program.duration_years} Years</span>
                                                        </div>
                                                    )}
                                                    {program.total_seats && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                            <Users size={16} className="text-indigo-600" />
                                                            <span className="font-semibold">{program.total_seats} Seats</span>
                                                        </div>
                                                    )}
                                                    {program.annual_fees && (
                                                        <div className="flex items-center gap-2 text-sm text-green-700 font-bold">
                                                            <span>₹{parseFloat(program.annual_fees).toLocaleString()}/year</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Achievements & Results */}
                        {placements.length > 0 && (
                            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white rounded-2xl overflow-hidden">
                                <div className="bg-linear-to-r from-green-600 to-emerald-600 p-6">
                                    <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                                            <Trophy size={28} />
                                        </div>
                                        Academic Excellence & Results
                                    </CardTitle>
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {placements.map((placement, index) => (
                                            <div
                                                key={index}
                                                className="relative bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-3 mb-5">
                                                    <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white text-lg font-black px-4 py-2 rounded-xl shadow-lg">
                                                        {placement.academic_year}
                                                    </div>
                                                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                                    {placement.placement_percent && (
                                                        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-green-200">
                                                            <Target className="w-6 h-6 text-green-600 mb-2" />
                                                            <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Success Rate</p>
                                                            <p className="text-3xl font-black text-green-600">{placement.placement_percent}%</p>
                                                        </div>
                                                    )}
                                                    {placement.average_package && (
                                                        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-blue-200">
                                                            <Award className="w-6 h-6 text-blue-600 mb-2" />
                                                            <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Avg Score</p>
                                                            <p className="text-2xl font-black text-blue-600">{placement.average_package}%</p>
                                                        </div>
                                                    )}
                                                    {placement.highest_package && (
                                                        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-purple-200">
                                                            <Trophy className="w-6 h-6 text-purple-600 mb-2" />
                                                            <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Top Score</p>
                                                            <p className="text-2xl font-black text-purple-600">{placement.highest_package}%</p>
                                                        </div>
                                                    )}
                                                    {placement.companies_visited && (
                                                        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-orange-200">
                                                            <Users className="w-6 h-6 text-orange-600 mb-2" />
                                                            <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Toppers</p>
                                                            <p className="text-3xl font-black text-orange-600">{placement.companies_visited}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {placement.top_recruiters && (
                                                    <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
                                                        <p className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4 text-yellow-500" />
                                                            Notable Achievements:
                                                        </p>
                                                        <p className="text-sm text-gray-700 leading-relaxed">{placement.top_recruiters}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Rankings & Awards */}
                        {rankings.length > 0 && (
                            <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white rounded-2xl overflow-hidden">
                                <div className="bg-linear-to-r from-yellow-500 to-orange-600 p-6">
                                    <CardTitle className="text-3xl font-black text-white flex items-center gap-3">
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
                                            <Award size={28} />
                                        </div>
                                        Awards & Recognition
                                    </CardTitle>
                                </div>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {rankings.map((ranking, index) => (
                                            <div
                                                key={index}
                                                className="group relative bg-linear-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-linear-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
                                                        <Award size={24} className="text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                                                            {ranking.ranking_body}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge className="bg-linear-to-r from-yellow-500 to-orange-600 text-white font-bold text-sm px-3 py-1">
                                                                #{ranking.rank_value}
                                                            </Badge>
                                                            {ranking.year && (
                                                                <span className="text-xs text-gray-600 font-bold bg-white px-3 py-1 rounded-full">
                                                                    {ranking.year}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {ranking.category && (
                                                            <p className="text-sm text-gray-700 font-medium">{ranking.category}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        {(school.email || school.phone || school.website_url) && (
                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-br from-white to-blue-50 rounded-2xl overflow-hidden">
                                <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-5">
                                    <CardTitle className="flex font-bold text-xl items-center gap-2 text-white">
                                        <Mail size={24} />
                                        Contact Us
                                    </CardTitle>
                                </div>
                                <CardContent className="p-5 space-y-3">
                                    {school.email && (
                                        <a
                                            href={`mailto:${school.email}`}
                                            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-blue-50 transition-all duration-200 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg group"
                                        >
                                            <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                <Mail size={20} className="text-blue-600" />
                                            </div>
                                            <span className="text-sm text-gray-700 font-semibold flex-1 break-all">{school.email}</span>
                                        </a>
                                    )}
                                    {school.phone && (
                                        <a
                                            href={`tel:${school.phone}`}
                                            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-green-50 transition-all duration-200 border-2 border-green-100 hover:border-green-300 hover:shadow-lg group"
                                        >
                                            <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                                                <Phone size={20} className="text-green-600" />
                                            </div>
                                            <span className="text-sm text-gray-700 font-semibold">{school.phone}</span>
                                        </a>
                                    )}
                                    {school.website_url && (
                                        <a
                                            href={school.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-purple-50 transition-all duration-200 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg group"
                                        >
                                            <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                <Globe size={20} className="text-purple-600" />
                                            </div>
                                            <span className="text-sm text-gray-700 font-semibold">Visit Website</span>
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Location Card */}
                        {(school.address || school.city || school.state || school.zipcode) && (
                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-br from-white to-indigo-50 rounded-2xl overflow-hidden">
                                <div className="bg-indigo-600 p-5">
                                    <CardTitle className="flex font-bold text-xl items-center gap-2 text-white">
                                        <MapPin size={24} />
                                        Location
                                    </CardTitle>
                                </div>
                                <CardContent className="p-5 space-y-3">
                                    {school.address && (
                                        <p className="text-sm text-gray-700 leading-relaxed font-medium bg-white p-3 rounded-lg border-2 border-gray-100">
                                            {school.address}
                                        </p>
                                    )}
                                    {(school.city || school.state) && (
                                        <p className="text-base text-gray-800 font-bold bg-indigo-100 p-3 rounded-lg">
                                            {[school.city, school.state].filter(Boolean).join(", ")}
                                        </p>
                                    )}
                                    {school.zipcode && (
                                        <p className="text-sm text-gray-700 font-semibold bg-white p-3 rounded-lg border-2 border-gray-100">
                                            PIN: {school.zipcode}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Facilities Card */}
                        {facilities.length > 0 && (
                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-br from-white to-green-50 rounded-2xl overflow-hidden">
                                <div className="bg-linear-to-r from-green-600 to-emerald-600 p-5">
                                    <CardTitle className="flex items-center gap-2 font-bold text-xl text-white">
                                        <Building2 size={24} />
                                        Facilities
                                    </CardTitle>
                                </div>
                                <CardContent className="p-5">
                                    <div className="grid grid-cols-1 gap-2">
                                        {facilities.map((facility, index) => (
                                            <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-green-100 hover:border-green-300 hover:shadow-md transition-all group">
                                                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                                                    <CheckCircle size={18} className="text-green-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">{facility.facility_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Principal */}
                        {(school.principal_name || school.principal_email || school.principal_phone) && (
                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-br from-white to-emerald-50 rounded-2xl overflow-hidden">
                                <div className="bg-emerald-600 p-5">
                                    <CardTitle className="flex font-bold text-xl items-center gap-2 text-white">
                                        <User size={22} />
                                        Principal
                                    </CardTitle>
                                </div>
                                <CardContent className="p-5 space-y-3">
                                    {school.principal_name && (
                                        <p className="text-sm font-semibold text-gray-800 bg-white p-3 rounded-lg border-2 border-emerald-100">
                                            {school.principal_name}
                                        </p>
                                    )}
                                    {school.principal_email && (
                                        <a
                                            href={`mailto:${school.principal_email}`}
                                            className="text-sm text-emerald-700 font-semibold bg-white p-3 rounded-lg border-2 border-emerald-100 block"
                                        >
                                            {school.principal_email}
                                        </a>
                                    )}
                                    {school.principal_phone && (
                                        <a
                                            href={`tel:${school.principal_phone}`}
                                            className="text-sm text-emerald-700 font-semibold bg-white p-3 rounded-lg border-2 border-emerald-100 block"
                                        >
                                            {school.principal_phone}
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Facts */}
                        {(school.school_type || school.board || school.affiliation || school.grade_levels || school.established_year || school.student_strength || school.teacher_count || programs.length > 0) && (
                            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-linear-to-br from-white to-purple-50 rounded-2xl overflow-hidden">
                                <div className="bg-purple-600 p-5">
                                    <CardTitle className="font-bold text-xl text-white">Quick Facts</CardTitle>
                                </div>
                                <CardContent className="p-5 space-y-4">
                                    {school.school_type && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">School Type</p>
                                            <p className="font-black text-lg text-gray-900">{school.school_type}</p>
                                        </div>
                                    )}
                                    {school.board && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Board</p>
                                            <p className="font-black text-lg text-gray-900">{school.board}</p>
                                        </div>
                                    )}
                                    {school.affiliation && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-emerald-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Affiliation</p>
                                            <p className="font-black text-lg text-gray-900">{school.affiliation}</p>
                                        </div>
                                    )}
                                    {school.grade_levels && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-indigo-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Grade Levels</p>
                                            <p className="font-black text-lg text-gray-900">{school.grade_levels}</p>
                                        </div>
                                    )}
                                    {school.established_year && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Established</p>
                                            <p className="font-black text-lg text-gray-900">{school.established_year}</p>
                                        </div>
                                    )}
                                    {school.student_strength && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Students</p>
                                            <p className="font-black text-lg text-gray-900">{school.student_strength}</p>
                                        </div>
                                    )}
                                    {school.teacher_count && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-pink-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Teachers</p>
                                            <p className="font-black text-lg text-gray-900">{school.teacher_count}</p>
                                        </div>
                                    )}
                                    {programs.length > 0 && (
                                        <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-md hover:shadow-lg transition-shadow">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Programs Offered</p>
                                            <p className="font-black text-lg text-gray-900">{programs.length}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
