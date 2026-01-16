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
    Building2,
    TrendingUp,
    Users,
    DollarSign,
    CheckCircle
} from "lucide-react";

export default function SchoolPublicProfile() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [college1, setCollege] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    // useEffect(() => {
    //     fetchCollegeProfile();
    // }, [id]);

    // const fetchCollegeProfile = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch(`${API_URL}/api/college/public/${id}`);
    //         const data = await response.json();

    //         if (response.ok) {
    //             setCollege(data.college);
    //             setPrograms(data.programs || []);
    //             setFacilities(data.facilities || []);
    //             setPlacements(data.placements || []);
    //             setRankings(data.rankings || []);
    //         } else {
    //             setError(data.message || "College not found");
    //         }
    //     } catch (err) {
    //         setError("Failed to load college profile");
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

   const college= {
  "college": {
    "id": "1",
    "name": "Global Institute of Technology",
    "college_type": "Private Autonomous University",
    "accreditation": "NAAC A+ | AICTE Approved",
    "established_year": 2005,
    "banner_url": "/uploads/colleges/git/banner.jpg",
    "logo_url": "/uploads/colleges/git/logo.png",
    "website_url": "https://www.globaltech.edu",
    "email": "info@globaltech.edu",
    "phone": "+91-9876543210",
    "address": "NH-48, Knowledge Park, Sector 12",
    "city": "Bengaluru",
    "state": "Karnataka",
    "zipcode": "560064"
  },

  "programs": [
    {
      "program_name": "Bachelor of Technology",
      "specialization": "Computer Science & Engineering",
      "degree_level": "Undergraduate",
      "duration_years": 4,
      "annual_fees": 185000,
      "total_seats": 180
    },
    {
      "program_name": "Bachelor of Technology",
      "specialization": "Artificial Intelligence & Data Science",
      "degree_level": "Undergraduate",
      "duration_years": 4,
      "annual_fees": 210000,
      "total_seats": 120
    },
    {
      "program_name": "Master of Technology",
      "specialization": "Software Engineering",
      "degree_level": "Postgraduate",
      "duration_years": 2,
      "annual_fees": 160000,
      "total_seats": 60
    },
    {
      "program_name": "Master of Business Administration",
      "specialization": "Finance & Marketing",
      "degree_level": "Postgraduate",
      "duration_years": 2,
      "annual_fees": 250000,
      "total_seats": 90
    }
  ],

  "facilities": [
    { "facility_name": "Central Library (1.2L+ Books)" },
    { "facility_name": "Smart Classrooms" },
    { "facility_name": "On-Campus Hostels (Boys & Girls)" },
    { "facility_name": "24x7 Wi-Fi Campus" },
    { "facility_name": "Advanced Computer Labs" },
    { "facility_name": "Sports Complex & Gymnasium" },
    { "facility_name": "Medical & Health Center" },
    { "facility_name": "Innovation & Incubation Cell" }
  ],

  "placements": [
    {
      "academic_year": "2022-2023",
      "placement_percent": 87,
      "average_package": 6.5,
      "highest_package": 28.0,
      "companies_visited": 140,
      "top_recruiters": "Google, Amazon, Microsoft, Infosys, TCS, Accenture, Deloitte"
    },
    {
      "academic_year": "2023-2024",
      "placement_percent": 91,
      "average_package": 7.2,
      "highest_package": 32.5,
      "companies_visited": 165,
      "top_recruiters": "Amazon, Adobe, Flipkart, Walmart, Cognizant, Capgemini"
    }
  ],

  "rankings": [
    {
      "ranking_body": "NIRF",
      "rank_value": 68,
      "year": 2024,
      "category": "Engineering Institutes"
    },
    {
      "ranking_body": "QS India Rankings",
      "rank_value": 45,
      "year": 2023,
      "category": "Private Universities"
    },
    {
      "ranking_body": "Times Higher Education",
      "rank_value": 32,
      "year": 2023,
      "category": "Emerging Universities"
    }
  ]
}


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading college profile...</div>
            </div>
        );
    }

    if (error || !college) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <p className="text-center text-red-500">{error || "College not found"}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100">
            {/* Banner Section */}
            <div className="relative">
                {college.banner_url ? (
                    <div className="w-full h-72 bg-black">
                        <img
                            src={`${API_URL}${college.banner_url}`}
                            alt={college.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-72 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
                )}

                <div className="absolute -bottom-16 left-10 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    {college.logo_url ? (
                        <img
                            src={`${API_URL}${college.logo_url}`}
                            alt={college.name}
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
                {/* College Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">{college.name}</h1>
                    <div className="flex flex-wrap gap-4 text-gray-700 mb-6">
                        {college.college_type && (
                            <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                                {college.college_type}
                            </Badge>
                        )}
                        {college.accreditation && (
                            <div className="flex items-center gap-2 font-medium">
                                <Award size={20} className="text-indigo-600" />
                                <span className="text-base">{college.accreditation}</span>
                            </div>
                        )}
                        {college.established_year && (
                            <div className="flex items-center gap-2 font-medium">
                                <Calendar size={20} className="text-indigo-600" />
                                <span className="text-base">Established {college.established_year}</span>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-5 text-sm mt-4">
                        {college.website_url && (
                            <a
                                href={college.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 hover:underline"
                            >
                                <Globe size={18} />
                                <span>Website</span>
                            </a>
                        )}
                        {college.email && (
                            <a
                                href={`mailto:${college.email}`}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 hover:underline"
                            >
                                <Mail size={18} />
                                <span>{college.email}</span>
                            </a>
                        )}
                        {college.phone && (
                            <a
                                href={`tel:${college.phone}`}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 hover:underline"
                            >
                                <Phone size={18} />
                                <span>{college.phone}</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Programs Section */}
                        {programs.length > 0 && (
                            <Card className="border-2 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <BookOpen size={24} className="text-indigo-600" />
                                        Academic Programs ({programs.length})
                                    </CardTitle>
                                    <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {programs.map((program, index) => (
                                            <div
                                                key={index}
                                                className="border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-gray-900 mb-1">
                                                            {program.program_name}
                                                        </h3>
                                                        {program.specialization && (
                                                            <p className="text-sm text-gray-600 font-medium">
                                                                {program.specialization}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {program.degree_level && (
                                                        <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">
                                                            {program.degree_level}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    {program.duration_years && (
                                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                            <Calendar size={16} className="text-blue-600" />
                                                            <span className="font-medium">{program.duration_years} Years</span>
                                                        </div>
                                                    )}
                                                    {program.annual_fees && (
                                                        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
                                                            <DollarSign size={16} className="text-green-600" />
                                                            <span className="font-medium">₹{parseFloat(program.annual_fees).toLocaleString()}/year</span>
                                                        </div>
                                                    )}
                                                    {program.total_seats && (
                                                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                                                            <Users size={16} className="text-purple-600" />
                                                            <span className="font-medium">{program.total_seats} Seats</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Placements Section */}
                        {placements.length > 0 && (
                            <Card className="border-2 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <TrendingUp size={24} className="text-green-600" />
                                        Placement Records
                                    </CardTitle>
                                    <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {placements.map((placement, index) => (
                                            <div
                                                key={index}
                                                className="border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-green-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
                                            >
                                                <h3 className="font-bold text-xl text-gray-900 mb-4">
                                                    Academic Year {placement.academic_year}
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {placement.placement_percent && (
                                                        <div className="bg-green-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 font-semibold mb-1">Placement Rate</p>
                                                            <p className="text-2xl font-bold text-green-600">{placement.placement_percent}%</p>
                                                        </div>
                                                    )}
                                                    {placement.average_package && (
                                                        <div className="bg-blue-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 font-semibold mb-1">Avg Package</p>
                                                            <p className="text-lg font-bold text-blue-600">₹{parseFloat(placement.average_package).toFixed(2)}L</p>
                                                        </div>
                                                    )}
                                                    {placement.highest_package && (
                                                        <div className="bg-purple-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 font-semibold mb-1">Highest Package</p>
                                                            <p className="text-lg font-bold text-purple-600">₹{parseFloat(placement.highest_package).toFixed(2)}L</p>
                                                        </div>
                                                    )}
                                                    {placement.companies_visited && (
                                                        <div className="bg-orange-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-600 font-semibold mb-1">Companies</p>
                                                            <p className="text-2xl font-bold text-orange-600">{placement.companies_visited}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {placement.top_recruiters && (
                                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                                        <p className="text-sm font-semibold text-gray-700 mb-2">Top Recruiters:</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{placement.top_recruiters}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Rankings Section */}
                        {rankings.length > 0 && (
                            <Card className="border-2 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <Award size={24} className="text-yellow-600" />
                                        Rankings & Accreditations
                                    </CardTitle>
                                    <div className="h-1 w-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {rankings.map((ranking, index) => (
                                            <div
                                                key={index}
                                                className="border-2 border-gray-100 rounded-xl p-4 hover:shadow-lg hover:border-yellow-200 transition-all duration-200 bg-gradient-to-br from-white to-yellow-50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Award size={20} className="text-yellow-600 mt-1" />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-base text-gray-900 mb-1">
                                                            {ranking.ranking_body}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-sm">
                                                                Rank {ranking.rank_value}
                                                            </Badge>
                                                            {ranking.year && (
                                                                <span className="text-xs text-gray-600 font-medium">
                                                                    {ranking.year}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {ranking.category && (
                                                            <p className="text-sm text-gray-600">{ranking.category}</p>
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
                        <Card className="border-2 border-indigo-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-indigo-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex font-bold text-xl items-center gap-2 text-gray-900">
                                    <Mail size={22} className="text-indigo-600" />
                                    Contact Information
                                </CardTitle>
                                <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {college.email && (
                                    <a
                                        href={`mailto:${college.email}`}
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors border border-gray-100"
                                    >
                                        <Mail size={18} className="text-indigo-600" />
                                        <span className="text-sm text-gray-700 font-medium">{college.email}</span>
                                    </a>
                                )}
                                {college.phone && (
                                    <a
                                        href={`tel:${college.phone}`}
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors border border-gray-100"
                                    >
                                        <Phone size={18} className="text-indigo-600" />
                                        <span className="text-sm text-gray-700 font-medium">{college.phone}</span>
                                    </a>
                                )}
                                {college.website_url && (
                                    <a
                                        href={college.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors border border-gray-100"
                                    >
                                        <Globe size={18} className="text-indigo-600" />
                                        <span className="text-sm text-gray-700 font-medium">Visit Website</span>
                                    </a>
                                )}
                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card className="border-2 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex font-bold text-xl items-center gap-2 text-gray-900">
                                    <MapPin size={22} className="text-indigo-600" />
                                    Location
                                </CardTitle>
                                <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {college.address && <p className="text-sm text-gray-700 leading-relaxed">{college.address}</p>}
                                {(college.city || college.state) && (
                                    <p className="text-sm text-gray-700 font-medium">
                                        {[college.city, college.state].filter(Boolean).join(", ")}
                                    </p>
                                )}
                                {college.zipcode && (
                                    <p className="text-sm text-gray-700 font-medium">{college.zipcode}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Facilities Card */}
                        {facilities.length > 0 && (
                            <Card className="border-2 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 font-bold text-xl text-gray-900">
                                        <Building2 size={22} className="text-indigo-600" />
                                        Facilities
                                    </CardTitle>
                                    <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {facilities.map((facility, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                                <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                                <span className="font-medium">{facility.facility_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Info */}
                        <Card className="border-2 border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="font-bold text-xl text-gray-900">Quick Info</CardTitle>
                                <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {college.college_type && (
                                    <div className="border-l-4 border-indigo-500 pl-3 py-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</p>
                                        <p className="font-semibold text-base text-gray-900">{college.college_type}</p>
                                    </div>
                                )}
                                {college.accreditation && (
                                    <div className="border-l-4 border-purple-500 pl-3 py-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Accreditation</p>
                                        <p className="font-semibold text-base text-gray-900">{college.accreditation}</p>
                                    </div>
                                )}
                                {college.established_year && (
                                    <div className="border-l-4 border-green-500 pl-3 py-1">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Established</p>
                                        <p className="font-semibold text-base text-gray-900">{college.established_year}</p>
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
