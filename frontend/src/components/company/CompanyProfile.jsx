// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Button } from "../ui/button";
// import { toast } from "sonner";

// export default function CompanyProfile() {
//     const token = localStorage.getItem("token");

//     const [company, setCompany] = useState({
//         name: "",
//         industry: "",
//         company_type: "",
//         founded_year: "",
//         description: "",
//         headquarters: "",
//         state: "",
//         city: "",
//         address: "",
//         zipcode: "",
//         website_url: "",
//         linkedin_url: "",
//         hr_email: "",
//         phone: ""
//     });

//     const [tech, setTech] = useState("");
//     const [techList, setTechList] = useState([]);
//     const [role, setRole] = useState({ role_name: "", experience_level: "", salary_range: "" });
//     const [roles, setRoles] = useState([]);

//     // Helper for API calls
//     const api = async (url, method, body) => {
//         const res = await fetch(url, {
//             method,
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             },
//             body: body ? JSON.stringify(body) : undefined
//         });
//         return res.json();
//     };

//     // Fetch company info on mount
//     useEffect(() => {
//         api("http://localhost:5000/api/company", "GET").then(data => {
//             if (data.company) setCompany(data.company);
//             setTechList(data.tech_stack || []);
//             setRoles(data.roles || []);
//         });
//     }, []);

//     // Save company profile
//     const saveCompany = async () => {
//         const data = await api("http://localhost:5000/api/company", "PUT", company);
//         if (data.company) {
//             setCompany(data.company);
//             toast.success("Company profile saved");
//         }
//     };

//     // Add tech
//     const addTech = async () => {
//         if (!tech.trim()) return;
//         const data = await api("http://localhost:5000/api/company/tech", "POST", { technology: tech });
//         if (data.message) {
//             setTechList([...techList, tech]);
//             setTech("");
//             toast.success("Technology added");
//         }
//     };

//     // Add role
//     const addRole = async () => {
//         if (!role.role_name.trim()) return;
//         const data = await api("http://localhost:5000/api/company/roles", "POST", role);
//         if (data.message) {
//             setRoles([...roles, role]);
//             setRole({ role_name: "", experience_level: "", salary_range: "" });
//             toast.success("Role added");
//         }
//     };

//     return (
//         <div className="max-w-5xl mx-auto p-6 space-y-6">
//             {/* Company Profile */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Company Profile</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <Label>Company Name</Label>
//                             <Input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Industry</Label>
//                             <Input value={company.industry} onChange={e => setCompany({ ...company, industry: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Company Type</Label>
//                             <Input value={company.company_type} onChange={e => setCompany({ ...company, company_type: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Founded Year</Label>
//                             <Input value={company.founded_year} onChange={e => setCompany({ ...company, founded_year: e.target.value })} type="number" />
//                         </div>
//                         <div className="md:col-span-2">
//                             <Label>Description</Label>
//                             <textarea
//                                 className="w-full border rounded p-2"
//                                 value={company.description}
//                                 onChange={e => setCompany({ ...company, description: e.target.value })}
//                             />
//                         </div>
//                         <div>
//                             <Label>Headquarters</Label>
//                             <Input value={company.headquarters} onChange={e => setCompany({ ...company, headquarters: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>State</Label>
//                             <Input value={company.state} onChange={e => setCompany({ ...company, state: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>City</Label>
//                             <Input value={company.city} onChange={e => setCompany({ ...company, city: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Address</Label>
//                             <Input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Zipcode</Label>
//                             <Input value={company.zipcode} onChange={e => setCompany({ ...company, zipcode: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Website URL</Label>
//                             <Input value={company.website_url} onChange={e => setCompany({ ...company, website_url: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>LinkedIn URL</Label>
//                             <Input value={company.linkedin_url} onChange={e => setCompany({ ...company, linkedin_url: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>HR Email</Label>
//                             <Input value={company.hr_email} onChange={e => setCompany({ ...company, hr_email: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Phone</Label>
//                             <Input value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} />
//                         </div>
//                     </div>
//                     <Button onClick={saveCompany}>Save Profile</Button>
//                 </CardContent>
//             </Card>

//             {/* Tech Stack */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Tech Stack</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="flex gap-2">
//                         <Input placeholder="Add Technology" value={tech} onChange={e => setTech(e.target.value)} />
//                         <Button onClick={addTech}>Add</Button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                         {techList.map((t, i) => (
//                             <span key={i} className="bg-gray-200 px-2 py-1 rounded">{t}</span>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Roles */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Hiring Roles</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <Label>Role Name</Label>
//                             <Input value={role.role_name} onChange={e => setRole({ ...role, role_name: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Experience Level</Label>
//                             <Input value={role.experience_level} onChange={e => setRole({ ...role, experience_level: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Salary Range</Label>
//                             <Input value={role.salary_range} onChange={e => setRole({ ...role, salary_range: e.target.value })} />
//                         </div>
//                     </div>
//                     <Button onClick={addRole}>Add Role</Button>

//                     <div className="mt-4 space-y-2">
//                         {roles.map((r, i) => (
//                             <div key={i} className="p-2 border rounded">
//                                 <strong>{r.role_name}</strong> | {r.experience_level} | {r.salary_range}
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Button } from "../ui/button";
// import { toast } from "sonner";

// const API_URL = "http://localhost:5000";

// export default function CompanyProfile() {
//     const token = localStorage.getItem("token");

//     const [company, setCompany] = useState({
//         name: "",
//         industry: "",
//         company_type: "",
//         founded_year: "",
//         description: "",
//         headquarters: "",
//         state: "",
//         city: "",
//         address: "",
//         zipcode: "",
//         website_url: "",
//         linkedin_url: "",
//         hr_email: "",
//         phone: "",
//         logo_url: "",
//         banner_url: "",
//     });

//     const [techInput, setTechInput] = useState("");
//     const [roleForm, setRoleForm] = useState({ role_name: "", experience_level: "", salary_range: "" });

//     const [techList, setTechList] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [logoFile, setLogoFile] = useState(null);
//     const [bannerFile, setBannerFile] = useState(null);

//     const apiCall = async (url, method, body, isFormData = false) => {
//         const res = await fetch(url, {
//             method,
//             headers: isFormData
//                 ? { Authorization: `Bearer ${token}` }
//                 : { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//             body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
//         });
//         return res.json();
//     };

//     // Load company profile
//     useEffect(() => {
//         apiCall("http://localhost:5000/api/company", "GET").then((data) => {
//             if (data.company) setCompany(data.company);
//             // Map tech stack objects to strings for easier UI handling
//             setTechList((data.tech_stack || []).map((t) => t.technology));
//             setRoles(data.roles || []);
//         });
//     }, []);

//     // Save company info
//     const saveCompany = async () => {
//         const res = await apiCall("http://localhost:5000/api/company", "PUT", company);
//         if (res.company) {
//             toast.success("Company profile saved");
//             setCompany(res.company);
//         } else {
//             toast.error("Failed to save profile");
//         }
//     };

//     // Add tech stack
//     const addTech = async () => {
//         if (!techInput.trim()) return;
//         const res = await apiCall("http://localhost:5000/api/company/tech", "POST", { technology: techInput });
//         if (res.message) {
//             setTechList((prev) => [...prev, techInput]);
//             setTechInput("");
//             toast.success("Technology added");
//         }
//     };

//     const deleteTech = (techName) => {
//         setTechList((prev) => prev.filter((t) => t !== techName));
//     };

//     // Add role
//     const addRole = async () => {
//         if (!roleForm.role_name.trim()) return;
//         const res = await apiCall("http://localhost:5000/api/company/roles", "POST", roleForm);
//         if (res.message) {
//             setRoles((prev) => [...prev, roleForm]);
//             setRoleForm({ role_name: "", experience_level: "", salary_range: "" });
//             toast.success("Role added");
//         }
//     };

//     const deleteRole = (index) => {
//         setRoles((prev) => prev.filter((_, i) => i !== index));
//     };

//     // Upload logo/banner
//     const uploadMedia = async () => {
//         if (!logoFile && !bannerFile) return toast.error("Select logo or banner");
//         const formData = new FormData();
//         if (logoFile) formData.append("logoImage", logoFile);
//         if (bannerFile) formData.append("bannerImage", bannerFile);

//         const res = await apiCall("http://localhost:5000/api/company/media", "PATCH", formData, true);
//         if (res.company) {
//             toast.success("Media uploaded");
//             setCompany((prev) => ({ ...prev, ...res.company }));
//             setLogoFile(null);
//             setBannerFile(null);
//         }
//     };

//     const bannerStyle = company.banner_url
//         ? { backgroundImage: `url(${company.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
//         : { backgroundColor: "#f3f4f6" };

//     return (
//         <div className="max-w-7xl mx-auto p-6 space-y-6">
//             {/* Banner + Logo */}
//             <div className="relative rounded-lg overflow-hidden shadow-lg">
//                 <div className="h-48 w-full" style={bannerStyle}></div>

//                 <div className="absolute -bottom-12 left-6 flex items-center gap-4">
//                     <div className="w-24 h-24 rounded-full bg-white shadow overflow-hidden ring-4 ring-white">
//                         {company.logo_url ? (
//                             <img
//                                 src={`${API_URL}${company.logo_url}`}
//                                 alt="Company Logo"
//                                 className="w-full h-full object-cover"
//                             />
//                         ) : (
//                             <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold">
//                                 Logo
//                             </div>
//                         )}
//                     </div>

//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             {company.name || "Company Name"}
//                         </h1>
//                         <p className="text-gray-600">
//                             {company.industry || "Industry"}
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Upload Media */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Upload Logo / Banner</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="flex gap-4 items-center">
//                         <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
//                         <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
//                         <Button onClick={uploadMedia}>Upload</Button>
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Company Info */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Company Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <Label>Company Name</Label>
//                             <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Industry</Label>
//                             <Input value={company.industry} onChange={(e) => setCompany({ ...company, industry: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Company Type</Label>
//                             <Input value={company.company_type} onChange={(e) => setCompany({ ...company, company_type: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Founded Year</Label>
//                             <Input type="number" value={company.founded_year} onChange={(e) => setCompany({ ...company, founded_year: e.target.value })} />
//                         </div>
//                         <div className="md:col-span-2">
//                             <Label>Description</Label>
//                             <textarea
//                                 className="w-full border rounded p-2"
//                                 value={company.description}
//                                 onChange={(e) => setCompany({ ...company, description: e.target.value })}
//                             />
//                         </div>
//                         <div>
//                             <Label>Headquarters</Label>
//                             <Input value={company.headquarters} onChange={(e) => setCompany({ ...company, headquarters: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Address</Label>
//                             <Input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>State</Label>
//                             <Input value={company.state} onChange={(e) => setCompany({ ...company, state: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>City</Label>
//                             <Input value={company.city} onChange={(e) => setCompany({ ...company, city: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Zipcode</Label>
//                             <Input value={company.zipcode} onChange={(e) => setCompany({ ...company, zipcode: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Website URL</Label>
//                             <Input value={company.website_url} onChange={(e) => setCompany({ ...company, website_url: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>LinkedIn URL</Label>
//                             <Input value={company.linkedin_url} onChange={(e) => setCompany({ ...company, linkedin_url: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>HR Email</Label>
//                             <Input value={company.hr_email} onChange={(e) => setCompany({ ...company, hr_email: e.target.value })} />
//                         </div>
//                         <div>
//                             <Label>Phone</Label>
//                             <Input value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
//                         </div>
//                     </div>

//                     <Button onClick={saveCompany}>Save Profile</Button>
//                 </CardContent>
//             </Card>

//             {/* Tech Stack */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Tech Stack</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                     <div className="flex gap-2 items-center">
//                         <Input placeholder="Add Technology" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
//                         <Button onClick={addTech}>Add</Button>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                         {techList.map((tech, i) => (
//                             <div key={i} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
//                                 <span>{tech}</span>
//                                 <button onClick={() => deleteTech(tech)} className="text-red-500 hover:text-red-700">×</button>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* Roles */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Open Roles</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                         <Input placeholder="Role Name" value={roleForm.role_name} onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })} />
//                         <Input placeholder="Experience Level" value={roleForm.experience_level} onChange={(e) => setRoleForm({ ...roleForm, experience_level: e.target.value })} />
//                         <Input placeholder="Salary Range" value={roleForm.salary_range} onChange={(e) => setRoleForm({ ...roleForm, salary_range: e.target.value })} />
//                         <Button onClick={addRole} className="md:col-span-3">Add Role</Button>
//                     </div>
//                     <div className="space-y-2">
//                         {roles.map((r, i) => (
//                             <div key={i} className="border p-3 rounded flex justify-between items-center">
//                                 <div>
//                                     <p className="font-semibold">{r.role_name}</p>
//                                     <p className="text-sm text-gray-600">{r.experience_level} | {r.salary_range}</p>
//                                 </div>
//                                 <Button variant="destructive" size="sm" onClick={() => deleteRole(i)}>Delete</Button>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Button } from "../ui/button";
// import { toast } from "sonner";

// const API_URL = "http://localhost:5000";

// export default function CompanyProfile() {
//     const token = localStorage.getItem("token");

//     const [company, setCompany] = useState({
//         name: "",
//         industry: "",
//         company_type: "",
//         founded_year: "",
//         description: "",
//         headquarters: "",
//         state: "",
//         city: "",
//         address: "",
//         zipcode: "",
//         website_url: "",
//         linkedin_url: "",
//         hr_email: "",
//         phone: "",
//         logo_url: "",
//         banner_url: "",
//     });

//     const [techInput, setTechInput] = useState("");
//     const [roleForm, setRoleForm] = useState({
//         role_name: "",
//         experience_level: "",
//         salary_range: "",
//     });

//     const [techList, setTechList] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [logoFile, setLogoFile] = useState(null);
//     const [bannerFile, setBannerFile] = useState(null);

//     const apiCall = async (url, method, body, isFormData = false) => {
//         const res = await fetch(url, {
//             method,
//             headers: isFormData
//                 ? { Authorization: `Bearer ${token}` }
//                 : {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`,
//                 },
//             body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
//         });
//         return res.json();
//     };

//     useEffect(() => {
//         apiCall(`${API_URL}/api/company`, "GET").then((data) => {
//             if (data.company) setCompany(data.company);
//             setTechList((data.tech_stack || []).map((t) => t.technology));
//             setRoles(data.roles || []);
//         });
//     }, []);

//     const saveCompany = async () => {
//         const res = await apiCall(`${API_URL}/api/company`, "PUT", company);
//         if (res.company) {
//             toast.success("Company profile saved");
//             setCompany(res.company);
//         } else {
//             toast.error("Failed to save profile");
//         }
//     };

//     const addTech = async () => {
//         if (!techInput.trim()) return;
//         const res = await apiCall(`${API_URL}/api/company/tech`, "POST", {
//             technology: techInput,
//         });
//         if (res.message) {
//             setTechList((prev) => [...prev, techInput]);
//             setTechInput("");
//             toast.success("Technology added");
//         }
//     };

//     const addRole = async () => {
//         if (!roleForm.role_name.trim()) return;
//         const res = await apiCall(`${API_URL}/api/company/roles`, "POST", roleForm);
//         if (res.message) {
//             setRoles((prev) => [...prev, roleForm]);
//             setRoleForm({ role_name: "", experience_level: "", salary_range: "" });
//             toast.success("Role added");
//         }
//     };

//     const uploadMedia = async () => {
//         if (!logoFile && !bannerFile) {
//             return toast.error("Select logo or banner");
//         }

//         const formData = new FormData();
//         if (logoFile) formData.append("logoImage", logoFile);
//         if (bannerFile) formData.append("bannerImage", bannerFile);

//         const res = await apiCall(
//             `${API_URL}/api/company/media`,
//             "PATCH",
//             formData,
//             true
//         );

//         if (res.company) {
//             toast.success("Media uploaded");
//             setCompany(res.company);
//             setLogoFile(null);
//             setBannerFile(null);
//         }
//     };

//     const bannerStyle = company.banner_url
//         ? {
//             backgroundImage: `url(${API_URL}${company.banner_url})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//         }
//         : { backgroundColor: "#e5e7eb" };

//     return (
//         <div className="max-w-7xl mx-auto p-6 space-y-10">
//             {/* Banner */}
//             <div className="relative rounded-xl shadow-md">
//                 <div className="h-64 w-full rounded-xl" style={bannerStyle}></div>

//                 <div className="absolute left-8 -bottom-12 z-10 flex items-end gap-4">
//                     <div className="w-28 h-28 rounded-full bg-white shadow-lg overflow-hidden ring-4 ring-white">
//                         {company.logo_url ? (
//                             <img
//                                 src={`${API_URL}${company.logo_url}`}
//                                 alt="Company Logo"
//                                 className="w-full h-full object-cover"
//                             />
//                         ) : (
//                             <div className="flex items-center justify-center w-full h-full text-gray-400 font-semibold">
//                                 Logo
//                             </div>
//                         )}
//                     </div>

//                     <div className="pb-4">
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             {company.name || "Company Name"}
//                         </h1>
//                         <p className="text-gray-600">
//                             {company.industry || "Industry"}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="h-16"></div>
//             </div>


//             {/* Upload Media */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Upload Logo / Banner</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex gap-4 items-center">
//                     <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
//                     <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} />
//                     <Button onClick={uploadMedia}>Upload</Button>
//                 </CardContent>
//             </Card>

//             {/* Company Info */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Company Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {Object.entries(company).map(
//                         ([key, value]) =>
//                             !["logo_url", "banner_url"].includes(key) && (
//                                 <div key={key}>
//                                     <Label className="capitalize">
//                                         {key.replaceAll("_", " ")}
//                                     </Label>
//                                     <Input
//                                         value={value}
//                                         onChange={(e) =>
//                                             setCompany({ ...company, [key]: e.target.value })
//                                         }
//                                     />
//                                 </div>
//                             )
//                     )}
//                     <div className="md:col-span-2">
//                         <Button onClick={saveCompany}>Save Profile</Button>
//                     </div>
//                 </CardContent>
//             </Card>
//             {/* Tech Stack */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Tech Stack</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="flex gap-2">
//                         <Input
//                             placeholder="Add technology (e.g. React, Node.js)"
//                             value={techInput}
//                             onChange={(e) => setTechInput(e.target.value)}
//                         />
//                         <Button onClick={addTech}>Add</Button>
//                     </div>

//                     {techList.length > 0 ? (
//                         <div className="flex flex-wrap gap-2">
//                             {techList.map((tech, i) => (
//                                 <span
//                                     key={i}
//                                     className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm"
//                                 >
//                                     {tech}
//                                     <button
//                                         onClick={() => deleteTech(tech)}
//                                         className="text-red-500 hover:text-red-700 font-bold"
//                                     >
//                                         ×
//                                     </button>
//                                 </span>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-sm text-muted-foreground">
//                             No technologies added yet
//                         </p>
//                     )}
//                 </CardContent>
//             </Card>
//             {/* Open Roles */}
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Open Roles</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                         <Input
//                             placeholder="Role Name"
//                             value={roleForm.role_name}
//                             onChange={(e) =>
//                                 setRoleForm({ ...roleForm, role_name: e.target.value })
//                             }
//                         />
//                         <Input
//                             placeholder="Experience Level"
//                             value={roleForm.experience_level}
//                             onChange={(e) =>
//                                 setRoleForm({
//                                     ...roleForm,
//                                     experience_level: e.target.value,
//                                 })
//                             }
//                         />
//                         <Input
//                             placeholder="Salary Range"
//                             value={roleForm.salary_range}
//                             onChange={(e) =>
//                                 setRoleForm({
//                                     ...roleForm,
//                                     salary_range: e.target.value,
//                                 })
//                             }
//                         />
//                         <Button onClick={addRole} className="md:col-span-3">
//                             Add Role
//                         </Button>
//                     </div>

//                     {roles.length > 0 ? (
//                         <div className="space-y-2">
//                             {roles.map((r, i) => (
//                                 <div
//                                     key={i}
//                                     className="flex items-center justify-between rounded-lg border p-3"
//                                 >
//                                     <div>
//                                         <p className="font-semibold">{r.role_name}</p>
//                                         <p className="text-sm text-muted-foreground">
//                                             {r.experience_level} • {r.salary_range}
//                                         </p>
//                                     </div>
//                                     <Button
//                                         variant="destructive"
//                                         size="sm"
//                                         onClick={() => deleteRole(i)}
//                                     >
//                                         Delete
//                                     </Button>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-sm text-muted-foreground">
//                             No roles added yet
//                         </p>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";


const API_URL = import.meta.env.VITE_API_URL;

export default function CompanyProfile() {
    const token = localStorage.getItem("token");

    const [company, setCompany] = useState({
        name: "",
        industry: "",
        company_type: "",
        founded_year: "",
        description: "",
        headquarters: "",
        state: "",
        city: "",
        address: "",
        zipcode: "",
        website_url: "",
        linkedin_url: "",
        hr_email: "",
        phone: "",
        logo_url: "",
        banner_url: "",
    });

    const [techInput, setTechInput] = useState("");
    const [techList, setTechList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleForm, setRoleForm] = useState({
        role_name: "",
        experience_level: "",
        salary_range: "",
    });

    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    const apiCall = async (url, method, body, isFormData = false) => {
        const res = await fetch(url, {
            method,
            headers: isFormData
                ? { Authorization: `Bearer ${token}` }
                : {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });
        return res.json();
    };

    useEffect(() => {
        apiCall(`${API_URL}/api/company`, "GET").then((data) => {
            if (data.company) setCompany(data.company);
            setTechList((data.tech_stack || []).map((t) => t.technology));
            setRoles(data.roles || []);
        });
    }, []);

    const saveCompany = async () => {
        const res = await apiCall(`${API_URL}/api/company`, "PUT", company);
        if (res.company) toast.success("Profile saved");
    };

    const addTech = async () => {
        if (!techInput.trim()) return;
        await apiCall(`${API_URL}/api/company/tech`, "POST", {
            technology: techInput,
        });
        setTechList((p) => [...p, techInput]);
        setTechInput("");
    };

    const addRole = async () => {
        if (!roleForm.role_name.trim()) return;
        await apiCall(`${API_URL}/api/company/roles`, "POST", roleForm);
        setRoles((p) => [...p, roleForm]);
        setRoleForm({ role_name: "", experience_level: "", salary_range: "" });
    };

    const uploadMedia = async () => {
        const formData = new FormData();
        if (logoFile) formData.append("logoImage", logoFile);
        if (bannerFile) formData.append("bannerImage", bannerFile);

        const res = await apiCall(
            `${API_URL}/api/company/media`,
            "PATCH",
            formData,
            true
        );

        if (res.company) setCompany(res.company);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
            {/* HEADER */}
            <div className="rounded-xl overflow-hidden bg-muted">
                <div
                    className="h-52 md:h-64 bg-cover bg-center"
                    style={{
                        backgroundImage: company.banner_url
                            ? `url(${API_URL}${company.banner_url})`
                            : undefined,
                    }}
                />
                <div className="flex flex-col md:flex-row items-center gap-4 px-6 -mt-12">
                    <div className="w-28 h-28 rounded-full bg-white shadow overflow-hidden ring-4 ring-white">
                        {company.logo_url && (
                            <img
                                src={`${API_URL}${company.logo_url}`}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-bold">{company.name}</h1>
                        <p className="text-muted-foreground">
                            {company.industry}
                        </p>
                    </div>
                </div>
            </div>

            {/* MEDIA UPLOAD */}
            <Card>
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} />
                    <input type="file" onChange={(e) => setBannerFile(e.target.files[0])} />
                    <Button onClick={uploadMedia}>Upload</Button>
                </CardContent>
            </Card>

            {/* COMPANY INFO */}
            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        ["name", "Company Name"],
                        ["industry", "Industry"],
                        ["company_type", "Company Type"],
                        ["founded_year", "Founded Year"],
                        ["headquarters", "Headquarters"],
                        ["state", "State"],
                        ["city", "City"],
                        ["address", "Address"],
                        ["zipcode", "Zip Code"],
                        ["website_url", "Website"],
                        ["linkedin_url", "LinkedIn"],
                        ["hr_email", "HR Email"],
                        ["phone", "Phone"],
                    ].map(([key, label]) => (
                        <div key={key}>
                            <Label>{label}</Label>
                            <Input
                                value={company[key]}
                                onChange={(e) =>
                                    setCompany({ ...company, [key]: e.target.value })
                                }
                            />
                        </div>
                    ))}
                    <div className="md:col-span-2">
                        <Label>Description</Label>
                        <textarea
                            className="w-full border rounded-md p-2"
                            value={company.description}
                            onChange={(e) =>
                                setCompany({ ...company, description: e.target.value })
                            }
                        />
                    </div>
                    <Button onClick={saveCompany} className="md:col-span-2">
                        Save Profile
                    </Button>
                </CardContent>
            </Card>

            {/* TECH STACK */}
            <Card>
                <CardHeader>
                    <CardTitle>Tech Stack</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            placeholder="React, Node, MySQL..."
                        />
                        <Button onClick={addTech}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {techList.map((t, i) => (
                            <span
                                key={i}
                                className="px-3 py-1 rounded-full bg-muted text-sm"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* ROLES */}
            <Card>
                <CardHeader>
                    <CardTitle>Open Roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                            placeholder="Role"
                            value={roleForm.role_name}
                            onChange={(e) =>
                                setRoleForm({ ...roleForm, role_name: e.target.value })
                            }
                        />
                        <Input
                            placeholder="Experience"
                            value={roleForm.experience_level}
                            onChange={(e) =>
                                setRoleForm({
                                    ...roleForm,
                                    experience_level: e.target.value,
                                })
                            }
                        />
                        <Input
                            placeholder="Salary"
                            value={roleForm.salary_range}
                            onChange={(e) =>
                                setRoleForm({
                                    ...roleForm,
                                    salary_range: e.target.value,
                                })
                            }
                        />
                        <Button onClick={addRole} className="md:col-span-3">
                            Add Role
                        </Button>
                    </div>

                    {roles.map((r, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center border rounded p-3"
                        >
                            <div>
                                <p className="font-semibold">{r.role_name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {r.experience_level} • {r.salary_range}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
