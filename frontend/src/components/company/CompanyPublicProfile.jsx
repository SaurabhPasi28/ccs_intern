import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
    Building2,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Instagram,
    Facebook,
    Twitter,
    MapPinned,
    Briefcase,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const resolveMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_URL}${url}`;
};

export default function CompanyPublicProfile() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [techStack, setTechStack] = useState([]);
    const [roles, setRoles] = useState([]);
    const [locations, setLocations] = useState([]);
    const [socialLinks, setSocialLinks] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/company/public/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setCompany(data.company);
                    setTechStack(data.tech_stack || []);
                    setRoles(data.roles || []);
                    setLocations(data.locations || []);
                    setSocialLinks(data.social_links || null);
                    setError(null);
                } else {
                    setError(data.message || "Company not found");
                }
            } catch (err) {
                setError("Failed to load company profile");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
                    <p className="text-lg font-semibold text-gray-700">Loading company profile...</p>
                </div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="max-w-md shadow-lg border border-red-200">
                    <CardContent className="pt-6">
                        <p className="text-center text-red-600 font-semibold">{error || "Company not found"}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
            {/* Banner */}
            <div className="relative">
                {company.banner_url ? (
                    <div className="w-full h-64 bg-gray-800">
                        <img
                            src={resolveMediaUrl(company.banner_url)}
                            alt={company.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full h-64 bg-linear-to-r from-blue-600 to-indigo-600" />
                )}

                {/* Logo */}
                <div className="absolute -bottom-12 left-8">
                    {company.logo_url ? (
                        <img
                            src={resolveMediaUrl(company.logo_url)}
                            alt={company.name}
                            className="w-32 h-32 rounded-lg border-4 border-white shadow-lg bg-white object-cover"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-lg border-4 border-white shadow-lg bg-white flex items-center justify-center">
                            <Building2 size={48} className="text-gray-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 pt-20 pb-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
                    {company.industry && <p className="text-lg text-gray-600 mb-4">{company.industry}</p>}

                    <div className="flex flex-wrap gap-4 text-sm">
                        {company?.website && (
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Globe size={18} /> Website
                            </a>
                        )}
                        {company?.email && (
                            <a
                                href={`mailto:${company.email}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Mail size={18} /> Email
                            </a>
                        )}
                        {company?.phone && (
                            <a
                                href={`tel:${company.phone}`}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Phone size={18} /> Call
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {company.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">About</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">{company.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {(company.founded_year || company.company_type || company.headquarters || company.city || company.state) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Company Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {company.founded_year && (
                                        <div className="flex justify-between pb-4 border-b">
                                            <span className="text-gray-600">Founded</span>
                                            <span className="font-semibold text-gray-900">{company.founded_year}</span>
                                        </div>
                                    )}
                                    {company.company_type && (
                                        <div className="flex justify-between pb-4 border-b">
                                            <span className="text-gray-600">Type</span>
                                            <span className="font-semibold text-gray-900">{company.company_type}</span>
                                        </div>
                                    )}
                                    {company.headquarters && (
                                        <div className="flex justify-between pb-4 border-b">
                                            <span className="text-gray-600">Headquarters</span>
                                            <span className="font-semibold text-gray-900">{company.headquarters}</span>
                                        </div>
                                    )}
                                    {(company.city || company.state) && (
                                        <div className="flex items-start gap-2">
                                            <MapPin size={18} className="text-gray-600 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-600">Location</p>
                                                <p className="font-semibold text-gray-900">
                                                    {company.city}{company.state ? `, ${company.state}` : ""}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {techStack.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Tech Stack</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {techStack.map((tech, index) => (
                                        <Badge key={`${tech}-${index}`} variant="secondary">
                                            {tech}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {roles.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Roles Hiring For</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {roles.map((role, index) => (
                                        <div key={`${role}-${index}`} className="flex items-center gap-2 text-gray-700">
                                            <Briefcase size={16} className="text-gray-500" />
                                            <span>{role}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {locations.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Locations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {locations.map((location, index) => (
                                        <div key={index} className="text-sm border-l-4 border-blue-500 pl-3 py-1">
                                            {location.address && (
                                                <p className="text-gray-800 font-medium">{location.address}</p>
                                            )}
                                            <p className="text-gray-600 font-medium">
                                                {[location.city, location.state].filter(Boolean).join(", ")}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {(company?.phone || company?.email || company?.website) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Contact</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {company?.phone && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone</p>
                                            <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline font-medium">
                                                {company.phone}
                                            </a>
                                        </div>
                                    )}
                                    {company?.email && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                                            <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline font-medium break-all">
                                                {company.email}
                                            </a>
                                        </div>
                                    )}
                                    {company?.website && (
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Website</p>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {socialLinks && Object.values(socialLinks).some((link) => link) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Follow Us</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {socialLinks.linkedin && (
                                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
                                            <Linkedin size={18} /> LinkedIn
                                        </a>
                                    )}
                                    {socialLinks.instagram && (
                                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-pink-600 font-medium">
                                            <Instagram size={18} /> Instagram
                                        </a>
                                    )}
                                    {socialLinks.facebook && (
                                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
                                            <Facebook size={18} /> Facebook
                                        </a>
                                    )}
                                    {socialLinks.twitter && (
                                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-blue-400 font-medium">
                                            <Twitter size={18} /> Twitter
                                        </a>
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



