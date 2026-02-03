import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
    GraduationCap, 
    MapPin, 
    Calendar, 
    Globe, 
    Mail, 
    Phone,
    BookOpen,
    Award,
    TrendingUp,
    DollarSign,
    Users,
    Building2
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function UniversityPublicProfile() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [university, setUniversity] = useState(null);
    const [degrees, setDegrees] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUniversityProfile();
    }, [id]);

    const fetchUniversityProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/university/public/${id}`);
            const data = await response.json();

            if (response.ok) {
                setUniversity(data.university);
                setDegrees(data.degrees || []);
                setPlacements(data.placements || []);
                setRankings(data.rankings || []);
            } else {
                setError(data.message || "University not found");
            }
        } catch (err) {
            setError("Failed to load university profile");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <GraduationCap className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
                    <div className="text-xl font-semibold text-gray-700">Loading university profile...</div>
                </div>
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="max-w-md shadow-2xl border-2 border-red-200">
                    <CardContent className="pt-6">
                        <p className="text-center text-red-600 font-semibold">{error || "University not found"}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100">
            {/* Banner Section */}
            <div className="relative">
                {university?.banner_url ? (
                    <div className="w-full h-72 bg-black">
                        <img
                            src={`${API_URL}${university.banner_url}`}
                            alt={university.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-72 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
                )}

                <div className="absolute -bottom-16 left-10 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    {university?.logo_url ? (
                        <img
                            src={`${API_URL}${university.logo_url}`}
                            alt={university.name}
                            className="w-48 h-48 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                        />
                    ) : (
                        <div className="w-48 h-48 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center">
                            <GraduationCap size={64} className="text-gray-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 pt-20 pb-8">
                {/* University Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">{university.name}</h1>
                    
                    <div className="flex flex-wrap gap-4 text-gray-700 mb-6">
                        {university?.city && university?.state && (
                            <div className="flex items-center gap-2 font-medium">
                                <MapPin size={20} className="text-blue-600" />
                                <span className="text-base">{university.city}, {university.state}</span>
                            </div>
                        )}
                        {university?.established_year && (
                            <div className="flex items-center gap-2 font-medium">
                                <Calendar size={20} className="text-blue-600" />
                                <span className="text-base">Est. {university.established_year}</span>
                            </div>
                        )}
                    </div>

                    {/* University Info Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {university?.university_type && (
                            <Badge variant="secondary" className="px-3 py-1 text-sm">
                                {university.university_type}
                            </Badge>
                        )}
                        {university?.accreditation && (
                            <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm">
                                {university.accreditation}
                            </Badge>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        {university?.website_url && (
                            <a
                                href={university.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Globe size={16} />
                                <span>Website</span>
                            </a>
                        )}
                        {university?.email && (
                            <a
                                href={`mailto:${university.email}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Mail size={16} />
                                <span>{university.email}</span>
                            </a>
                        )}
                        {university?.phone && (
                            <a
                                href={`tel:${university.phone}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Phone size={16} />
                                <span>{university.phone}</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Academic Degrees Section */}
                        {degrees.length > 0 && (
                            <Card className="border-2 border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <BookOpen size={24} className="text-blue-600" />
                                        Degree Programs ({degrees.length})
                                    </CardTitle>
                                    <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {degrees.map((degree, index) => (
                                            <div 
                                                key={index} 
                                                className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-blue-50 transition-colors"
                                            >
                                                <p className="font-semibold text-gray-900">{degree.degree_name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Placements Section */}
                        {placements.length > 0 && (
                            <Card className="border-2 border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <TrendingUp size={24} className="text-green-600" />
                                        Placement Statistics
                                    </CardTitle>
                                    <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {placements.map((placement, index) => (
                                            <div key={index} className="border-2 border-gray-100 rounded-lg p-5 hover:shadow-lg hover:border-green-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50">
                                                <h3 className="font-bold text-lg text-gray-900 mb-3">{placement.academic_year}</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {placement.placement_percent && (
                                                        <div className="bg-green-50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-600 font-medium">Placement Rate</p>
                                                            <p className="text-2xl font-bold text-green-600">{placement.placement_percent}%</p>
                                                        </div>
                                                    )}
                                                    {placement.average_package && (
                                                        <div className="bg-blue-50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-600 font-medium">Avg Package</p>
                                                            <p className="text-2xl font-bold text-blue-600">₹{placement.average_package} LPA</p>
                                                        </div>
                                                    )}
                                                    {placement.highest_package && (
                                                        <div className="bg-purple-50 p-3 rounded-lg">
                                                            <p className="text-xs text-gray-600 font-medium">Highest Package</p>
                                                            <p className="text-2xl font-bold text-purple-600">₹{placement.highest_package} LPA</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {placement.companies_visited && (
                                                    <p className="text-sm text-gray-600 mt-3">
                                                        <strong>Companies Visited:</strong> {placement.companies_visited}
                                                    </p>
                                                )}
                                                {placement.top_recruiters && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        <strong>Top Recruiters:</strong> {placement.top_recruiters}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Info Cards */}
                    <div className="space-y-6">
                        {/* Rankings Card */}
                        {rankings.length > 0 && (
                            <Card className="border-2 border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Award size={24} className="text-yellow-600" />
                                        Rankings
                                    </CardTitle>
                                    <div className="h-1 w-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {rankings.map((ranking, index) => (
                                            <div key={index} className="border-l-4 border-yellow-500 pl-3 py-2">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{ranking.ranking_body}</p>
                                                <p className="font-bold text-xl text-gray-900">#{ranking.rank_value}</p>
                                                {ranking.category && (
                                                    <p className="text-sm text-gray-600">{ranking.category}</p>
                                                )}
                                                {ranking.year && (
                                                    <p className="text-xs text-gray-500 mt-1">{ranking.year}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* University Info Card */}
                        <Card className="border-2 border-blue-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Building2 size={24} className="text-blue-600" />
                                    University Info
                                </CardTitle>
                                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {university.total_students && (
                                    <div className="border-l-4 border-blue-500 pl-3 py-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Students</p>
                                        <p className="font-semibold text-base text-gray-900">{university.total_students}</p>
                                    </div>
                                )}
                                {university.total_faculty && (
                                    <div className="border-l-4 border-purple-500 pl-3 py-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Faculty</p>
                                        <p className="font-semibold text-base text-gray-900">{university.total_faculty}</p>
                                    </div>
                                )}
                                {university.campus_area && (
                                    <div className="border-l-4 border-green-500 pl-3 py-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Campus Area</p>
                                        <p className="font-semibold text-base text-gray-900">{university.campus_area}</p>
                                    </div>
                                )}
                                {university.address && (
                                    <div className="border-l-4 border-gray-400 pl-3 py-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{university.address}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
