import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MapPin,
    Briefcase,
    Calendar,
    Users,
    Clock,
    Trash2,
    ArrowLeft,
    Building2,
    GraduationCap,
} from "lucide-react";

const BACKEND_URL = "http://localhost:5000";

export default function CompanyJobDetail() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/company/publish/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok) {
                    setJob(data.job);
                } else {
                    console.error(data.message || "Job not found");
                }
            } catch (err) {
                console.error("Error fetching job:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [postId, token]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/company/publish/${postId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                navigate("/company/jobs");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete job");
            }
        } catch (err) {
            console.error("Error deleting job:", err);
            alert("An error occurred while deleting the job");
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-3"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h2>
                    <button
                        onClick={() => navigate("/company/jobs")}
                        className="text-blue-600 hover:underline"
                    >
                        Back to jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate("/company/jobs")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to jobs
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {job.location}
                                </span>
                                <span>•</span>
                                <span>{job.location_type}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Posted {new Date(job.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 font-medium text-sm transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Details Card */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job details</h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 flex items-center justify-center text-gray-400 mt-0.5 font-bold">
                                        ₹
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Salary</p>
                                        <p className="text-gray-600">
                                            {job.pay_show_by === "Range" && job.pay_min && job.pay_max
                                                ? `₹${job.pay_min} - ₹${job.pay_max}`
                                                : job.pay_show_by === "Starting Amount" && job.pay_min
                                                    ? `Starting at ₹${job.pay_min}`
                                                    : job.pay_show_by === "Maximum Amount" && job.pay_max
                                                        ? `Up to ₹${job.pay_max}`
                                                        : job.pay_show_by === "Exact Amount" && job.pay_min
                                                            ? `₹${job.pay_min}`
                                                            : "Competitive"}
                                            {job.pay_rate && ` ${job.pay_rate}`}
                                        </p>
                                    </div>
                                </div>

                                {job.job_types?.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">Job type</p>
                                            <p className="text-gray-600">{job.job_types.join(", ")}</p>
                                        </div>
                                    </div>
                                )}

                                {job.shift?.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-medium text-gray-900">Shift</p>
                                            <p className="text-gray-600">{job.shift.join(", ")}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">Number of openings</p>
                                        <p className="text-gray-600">{job.hiring_count} positions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Description */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Full job description</h2>
                            <div className="text-gray-700 leading-relaxed break-words whitespace-pre-line overflow-wrap-anywhere">
                                {job.description || "No description provided."}
                            </div>
                        </div>

                        {/* Benefits */}
                        {job.selected_benefits?.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h2>
                                <ul className="space-y-2">
                                    {job.selected_benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-700">
                                            <span className="text-blue-600 mt-1">•</span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                                {job.custom_benefits && (
                                    <p className="mt-4 text-sm text-gray-600 border-t pt-4">
                                        Additional: {job.custom_benefits}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Screening Questions */}
                        {job.custom_questions?.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Screening questions
                                </h2>
                                <div className="space-y-4">
                                    {job.custom_questions.map((q, i) => (
                                        <div key={i} className="border-l-2 border-gray-200 pl-4">
                                            <p className="text-gray-900 font-medium">{q.question}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {q.is_required ? "Required" : "Optional"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Qualifications */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h2>

                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="font-medium text-gray-900 mb-1">Education</p>
                                    <p className="text-gray-600">{job.education || "Not specified"}</p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900 mb-1">Experience</p>
                                    <p className="text-gray-600">
                                        {job.experience_years ? `${job.experience_years} years` : "Any"}
                                        {job.experience_type && ` - ${job.experience_type}`}
                                    </p>
                                </div>

                                {job.certifications && (
                                    <div>
                                        <p className="font-medium text-gray-900 mb-1">Certifications</p>
                                        <p className="text-gray-600">{job.certifications}</p>
                                    </div>
                                )}

                                {job.language?.length > 0 && (
                                    <div>
                                        <p className="font-medium text-gray-900 mb-1">Languages</p>
                                        <p className="text-gray-600">{job.language.join(", ")}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Info */}
                        {(job.travel || job.location_qual || job.must_reside !== null) && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional information</h2>

                                <div className="space-y-3 text-sm">
                                    {job.travel && (
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Travel</p>
                                            <p className="text-gray-600">{job.travel}</p>
                                        </div>
                                    )}

                                    {job.location_qual && (
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Location requirements</p>
                                            <p className="text-gray-600">{job.location_qual}</p>
                                        </div>
                                    )}

                                    {job.must_reside !== null && (
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Must reside in location</p>
                                            <p className="text-gray-600">{job.must_reside ? "Yes" : "No"}</p>
                                        </div>
                                    )}

                                    {job.timeline && (
                                        <div>
                                            <p className="font-medium text-gray-900 mb-1">Hiring timeline</p>
                                            <p className="text-gray-600">{job.timeline}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Job Status */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job status</h2>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${job.status?.toLowerCase() === "active" || job.status?.toLowerCase() === "published"
                                    ? "bg-green-100 text-green-800"
                                    : job.status?.toLowerCase() === "draft"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}>
                                    {job.status || "Unknown"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete this job?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{job.title}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}