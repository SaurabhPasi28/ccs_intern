const pool = require("../db");
const path = require("path");
const fs = require("fs");
const { imageUpload } = require("../middleware/upload");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinaryUpload");

const ensureDir = async (dirPath) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
};

// Generate a unique 6-digit referral code and ensure no collisions
const generateReferralCode = async () => {
    const makeCode = () => Math.floor(100000 + Math.random() * 900000).toString();
    let code = makeCode();
    let attempts = 0;
    while (attempts < 5) {
        const existing = await pool.query("SELECT 1 FROM universities WHERE referral_code = $1", [code]);
        if (existing.rowCount === 0) return code;
        code = makeCode();
        attempts += 1;
    }
    return `${makeCode()}${Math.floor(Math.random() * 10)}`.slice(0, 6);
};

// Get university profile and related data
exports.getUniversity = async (req, res) => {
    try {
        const userId = req.userId;

        const universityResult = await pool.query(
            "SELECT * FROM universities WHERE user_id = $1",
            [userId]
        );

        const universityId = universityResult.rows[0]?.id || null;

        const departments = universityId
            ? (await pool.query(
                  "SELECT * FROM university_departments WHERE university_id = $1 ORDER BY department_name",
                  [universityId]
              )).rows
            : [];

        const programs = universityId
            ? (await pool.query(
                  "SELECT * FROM university_programs WHERE university_id = $1 ORDER BY id DESC",
                  [universityId]
              )).rows
            : [];

        const facilities = universityId
            ? (await pool.query(
                  "SELECT * FROM university_facilities WHERE university_id = $1 ORDER BY facility_name",
                  [universityId]
              )).rows
            : [];

        const placements = universityId
            ? (await pool.query(
                  "SELECT * FROM university_placements WHERE university_id = $1 ORDER BY academic_year DESC",
                  [universityId]
              )).rows
            : [];

        const rankings = universityId
            ? (await pool.query(
                  "SELECT * FROM university_rankings WHERE university_id = $1 ORDER BY year DESC NULLS LAST",
                  [universityId]
              )).rows
            : [];

        const research = universityId
            ? (await pool.query(
                  "SELECT * FROM university_research WHERE university_id = $1 ORDER BY publication_year DESC NULLS LAST, id DESC",
                  [universityId]
              )).rows
            : [];

        res.json({
            university: universityResult.rows[0] || null,
            departments,
            programs,
            facilities,
            placements,
            rankings,
            research,
        });
    } catch (err) {
        console.error("GET UNIVERSITY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update university basic info
exports.updateUniversity = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            name,
            established_year,
            university_type,
            accreditation,
            state,
            city,
            zipcode,
            address,
            phone,
            email,
            website_url,
            vice_chancellor_name,
            vice_chancellor_email,
            vice_chancellor_phone,
            total_students,
            total_faculty,
            campus_area,
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: "University name is required" });
        }

        // Check if university exists
        const existing = await pool.query(
            "SELECT referral_code FROM universities WHERE user_id = $1",
            [userId]
        );

        let referralCode = existing.rows[0]?.referral_code;
        if (!referralCode) {
            referralCode = await generateReferralCode();
        }

        const result = await pool.query(
            `INSERT INTO universities (
                user_id, name, established_year, university_type, accreditation,
                state, city, zipcode, address, phone, email, website_url,
                vice_chancellor_name, vice_chancellor_email, vice_chancellor_phone,
                total_students, total_faculty, campus_area, referral_code, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
            ON CONFLICT (user_id)
            DO UPDATE SET
                name = EXCLUDED.name,
                established_year = EXCLUDED.established_year,
                university_type = EXCLUDED.university_type,
                accreditation = EXCLUDED.accreditation,
                state = EXCLUDED.state,
                city = EXCLUDED.city,
                zipcode = EXCLUDED.zipcode,
                address = EXCLUDED.address,
                phone = EXCLUDED.phone,
                email = EXCLUDED.email,
                website_url = EXCLUDED.website_url,
                vice_chancellor_name = EXCLUDED.vice_chancellor_name,
                vice_chancellor_email = EXCLUDED.vice_chancellor_email,
                vice_chancellor_phone = EXCLUDED.vice_chancellor_phone,
                total_students = EXCLUDED.total_students,
                total_faculty = EXCLUDED.total_faculty,
                campus_area = EXCLUDED.campus_area,
                updated_at = NOW()
            RETURNING *`,
            [
                userId,
                name,
                established_year || null,
                university_type || null,
                accreditation || null,
                state || null,
                city || null,
                zipcode || null,
                address || null,
                phone || null,
                email || null,
                website_url || null,
                vice_chancellor_name || null,
                vice_chancellor_email || null,
                vice_chancellor_phone || null,
                total_students || null,
                total_faculty || null,
                campus_area || null,
                referralCode,
            ]
        );

        res.json({ university: result.rows[0] });
    } catch (err) {
        console.error("UPDATE UNIVERSITY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Upload university media (logo and banner) to Cloudinary
exports.uploadUniversityMedia = [
    imageUpload.fields([
        { name: "logoImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const userId = req.userId;

            const universityRes = await pool.query(
                "SELECT id, logo_url, banner_url FROM universities WHERE user_id = $1",
                [userId]
            );

            if (!universityRes.rows.length) {
                return res.status(404).json({ message: "University profile not found" });
            }

            const university = universityRes.rows[0];
            const logoFile = req.files?.logoImage?.[0];
            const bannerFile = req.files?.bannerImage?.[0];

            let logoUrl = null;
            let bannerUrl = null;

            /* LOGO - Upload to Cloudinary */
            if (logoFile) {
                // Delete old logo if exists
                if (university.logo_url) {
                    const oldPublicId = extractPublicId(university.logo_url);
                    if (oldPublicId) await deleteFromCloudinary(oldPublicId);
                }

                const result = await uploadToCloudinary(logoFile.buffer, "university", "logo");
                logoUrl = result.secure_url;
            }

            /* BANNER - Upload to Cloudinary */
            if (bannerFile) {
                // Delete old banner if exists
                if (university.banner_url) {
                    const oldPublicId = extractPublicId(university.banner_url);
                    if (oldPublicId) await deleteFromCloudinary(oldPublicId);
                }

                const result = await uploadToCloudinary(bannerFile.buffer, "university", "banner");
                bannerUrl = result.secure_url;
            }

            const updateRes = await pool.query(
                `UPDATE universities
                SET
                    logo_url = COALESCE($1, logo_url),
                    banner_url = COALESCE($2, banner_url),
                    updated_at = NOW()
                WHERE id = $3
                RETURNING *`,
                [logoUrl, bannerUrl, university.id]
            );

            res.json({ 
                message: "Media uploaded successfully to Cloudinary",
                university: updateRes.rows[0] 
            });
        } catch (err) {
            console.error("UPLOAD UNIVERSITY MEDIA ERROR:", err.message);
            res.status(500).json({ message: "Server error: " + err.message });
        }
    },
];

// Helper function to extract public_id from Cloudinary URL
const extractPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const publicId = parts.slice(parts.indexOf('ccs')).join('/').replace(/\.[^/.]+$/, '');
    return publicId;
};

// Add department
exports.addDepartment = async (req, res) => {
    try {
        const userId = req.userId;
        const { department_name, hod_name } = req.body;

        if (!department_name) {
            return res.status(400).json({ message: "Department name is required" });
        }

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        const result = await pool.query(
            "INSERT INTO university_departments (university_id, department_name, hod_name) VALUES ($1, $2, $3) RETURNING *",
            [universityId, department_name, hod_name || null]
        );

        res.json({ department: result.rows[0] });
    } catch (err) {
        console.error("ADD DEPARTMENT ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        await pool.query(
            "DELETE FROM university_departments WHERE id = $1 AND university_id = $2",
            [id, universityId]
        );

        res.json({ message: "Department deleted" });
    } catch (err) {
        console.error("DELETE DEPARTMENT ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Add program
exports.addProgram = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            program_level,
            program_name,
            department,
            duration_years,
            annual_fees,
            total_seats,
            eligibility,
        } = req.body;

        if (!program_name) {
            return res.status(400).json({ message: "Program name is required" });
        }

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        const result = await pool.query(
            "INSERT INTO university_programs (university_id, program_level, program_name, department, duration_years, annual_fees, total_seats, eligibility) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [
                universityId,
                program_level || null,
                program_name,
                department || null,
                duration_years || null,
                annual_fees || null,
                total_seats || null,
                eligibility || null,
            ]
        );

        res.json({ program: result.rows[0] });
    } catch (err) {
        console.error("ADD PROGRAM ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete program
exports.deleteProgram = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        await pool.query(
            "DELETE FROM university_programs WHERE id = $1 AND university_id = $2",
            [id, universityId]
        );

        res.json({ message: "Program deleted" });
    } catch (err) {
        console.error("DELETE PROGRAM ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Add facility
exports.addFacility = async (req, res) => {
    try {
        const userId = req.userId;
        const { facility_name } = req.body;

        if (!facility_name) {
            return res.status(400).json({ message: "Facility name is required" });
        }

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        const result = await pool.query(
            "INSERT INTO university_facilities (university_id, facility_name) VALUES ($1, $2) RETURNING *",
            [universityId, facility_name]
        );

        res.json({ facility: result.rows[0] });
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ message: "Facility already exists" });
        }
        console.error("ADD FACILITY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete facility
exports.deleteFacility = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        await pool.query(
            "DELETE FROM university_facilities WHERE id = $1 AND university_id = $2",
            [id, universityId]
        );

        res.json({ message: "Facility deleted" });
    } catch (err) {
        console.error("DELETE FACILITY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Add placement
exports.addPlacement = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            academic_year,
            placement_percent,
            average_package,
            highest_package,
            companies_visited,
            top_recruiters,
        } = req.body;

        if (!academic_year) {
            return res.status(400).json({ message: "Academic year is required" });
        }

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        const result = await pool.query(
            "INSERT INTO university_placements (university_id, academic_year, placement_percent, average_package, highest_package, companies_visited, top_recruiters) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [
                universityId,
                academic_year,
                placement_percent || null,
                average_package || null,
                highest_package || null,
                companies_visited || null,
                top_recruiters || null,
            ]
        );

        res.json({ placement: result.rows[0] });
    } catch (err) {
        console.error("ADD PLACEMENT ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete placement
exports.deletePlacement = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        await pool.query(
            "DELETE FROM university_placements WHERE id = $1 AND university_id = $2",
            [id, universityId]
        );

        res.json({ message: "Placement deleted" });
    } catch (err) {
        console.error("DELETE PLACEMENT ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Add ranking
exports.addRanking = async (req, res) => {
    try {
        const userId = req.userId;
        const { ranking_body, rank_value, year, category, certificate_url } = req.body;

        if (!ranking_body) {
            return res.status(400).json({ message: "Ranking body is required" });
        }

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        const result = await pool.query(
            "INSERT INTO university_rankings (university_id, ranking_body, rank_value, year, category, certificate_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [universityId, ranking_body, rank_value || null, year || null, category || null, certificate_url || null]
        );

        res.json({ ranking: result.rows[0] });
    } catch (err) {
        console.error("ADD RANKING ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete ranking
exports.deleteRanking = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        await pool.query(
            "DELETE FROM university_rankings WHERE id = $1 AND university_id = $2",
            [id, universityId]
        );

        res.json({ message: "Ranking deleted" });
    } catch (err) {
        console.error("DELETE RANKING ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Add research
exports.addResearch = async (req, res) => {
    try {
        const userId = req.userId;
        const { research_title, area, publication_year, description } = req.body;

        if (!research_title) {
            return res.status(400).json({ message: "Research title is required" });
        }

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        const result = await pool.query(
            "INSERT INTO university_research (university_id, research_title, area, publication_year, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [universityId, research_title, area || null, publication_year || null, description || null]
        );

        res.json({ research: result.rows[0] });
    } catch (err) {
        console.error("ADD RESEARCH ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete research
exports.deleteResearch = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const universityRes = await pool.query(
            "SELECT id FROM universities WHERE user_id = $1",
            [userId]
        );

        if (!universityRes.rows.length) {
            return res.status(404).json({ message: "University not found" });
        }

        const universityId = universityRes.rows[0].id;

        await pool.query(
            "DELETE FROM university_research WHERE id = $1 AND university_id = $2",
            [id, universityId]
        );

        res.json({ message: "Research deleted" });
    } catch (err) {
        console.error("DELETE RESEARCH ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
