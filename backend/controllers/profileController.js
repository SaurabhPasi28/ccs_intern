const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const pool = require("../db");

/* =============================
   MULTER CONFIG
============================= */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const ensureDir = async (dirPath) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
};

/* =============================
   GET PROFILE (UUID SAFE)
============================= */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId; // UUID

        const profileResult = await pool.query(
            "SELECT * FROM profiles WHERE user_id = $1",
            [userId]
        );

        const educationResult = await pool.query(
            "SELECT * FROM education WHERE user_id = $1 ORDER BY start_year DESC",
            [userId]
        );

        const experienceResult = await pool.query(
            "SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC",
            [userId]
        );

        const skillsResult = await pool.query(
            `SELECT s.id, s.skill_name
             FROM skills s
             JOIN user_skills us ON s.id = us.skill_id
             WHERE us.user_id = $1`,
            [userId]
        );

        const certificationsResult = await pool.query(
            "SELECT * FROM certifications WHERE user_id = $1 ORDER BY issue_date DESC",
            [userId]
        );

        // 🔑 FIXED FOR NEW DS
        const userResult = await pool.query(
            "SELECT name AS full_name, email FROM users WHERE id = $1",
            [userId]
        );

        res.json({
            full_name: userResult.rows[0]?.full_name || null,
            email: userResult.rows[0]?.email || null,
            profile: profileResult.rows[0] || null,
            education: educationResult.rows,
            experience: experienceResult.rows,
            skills: skillsResult.rows,
            certifications: certificationsResult.rows,
        });
    } catch (err) {
        console.error("GET PROFILE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================
   UPDATE PROFILE
============================= */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { state, city, bio, dob } = req.body;

        const result = await pool.query(
            `INSERT INTO profiles (user_id, state, city, dob, bio, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (user_id)
             DO UPDATE SET
               state = $2,
               city = $3,
               dob = $4,
               bio = $5,
               updated_at = NOW()
             RETURNING *`,
            [userId, state, city, dob || null, bio]
        );

        res.json({ message: "Profile updated", profile: result.rows[0] });
    } catch (err) {
        console.error("UPDATE PROFILE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================
   EDUCATION
============================= */
exports.addEducation = async (req, res) => {
    try {
        const userId = req.userId;
        let { degree, field_of_study, institution, start_year, end_year, is_current } = req.body;

        if (!degree || !institution) {
            return res.status(400).json({ message: "Degree and institution are required" });
        }

        start_year = start_year ? parseInt(start_year) : null;
        end_year = end_year ? parseInt(end_year) : null;

        const result = await pool.query(
            `INSERT INTO education
             (user_id, degree, field_of_study, institution, start_year, end_year, is_current)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, degree, field_of_study, institution, start_year, end_year, is_current || false]
        );

        res.status(201).json({ message: "Education added", education: result.rows[0] });
    } catch (err) {
        console.error("ADD EDUCATION ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteEducation = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        await pool.query(
            "DELETE FROM education WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        res.json({ message: "Education deleted" });
    } catch (err) {
        console.error("DELETE EDUCATION ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================
   EXPERIENCE
============================= */
exports.addExperience = async (req, res) => {
    try {
        const userId = req.userId;
        let { title, company, start_date, end_date, is_current, description } = req.body;

        if (!title || !company) {
            return res.status(400).json({ message: "Title and company are required" });
        }

        const result = await pool.query(
            `INSERT INTO experience
             (user_id, title, company, start_date, end_date, is_current, description)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, title, company, start_date || null, end_date || null, is_current || false, description]
        );

        res.status(201).json({ message: "Experience added", experience: result.rows[0] });
    } catch (err) {
        console.error("ADD EXPERIENCE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteExperience = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        await pool.query(
            "DELETE FROM experience WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        res.json({ message: "Experience deleted" });
    } catch (err) {
        console.error("DELETE EXPERIENCE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================
   SKILLS
============================= */
exports.addSkill = async (req, res) => {
    try {
        const userId = req.userId;
        const { skill_name } = req.body;

        if (!skill_name) {
            return res.status(400).json({ message: "Skill name is required" });
        }

        const skillResult = await pool.query(
            `INSERT INTO skills (skill_name)
             VALUES ($1)
             ON CONFLICT (skill_name) DO UPDATE SET skill_name = $1
             RETURNING id`,
            [skill_name.trim()]
        );

        await pool.query(
            `INSERT INTO user_skills (user_id, skill_id)
             VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [userId, skillResult.rows[0].id]
        );

        res.status(201).json({ message: "Skill added" });
    } catch (err) {
        console.error("ADD SKILL ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const userId = req.userId;
        const { skill_id } = req.params;

        await pool.query(
            "DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2",
            [userId, skill_id]
        );

        res.json({ message: "Skill removed" });
    } catch (err) {
        console.error("DELETE SKILL ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================
   CERTIFICATIONS
============================= */
exports.addCertification = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, issuing_organization, issue_date, expiry_date, credential_id, credential_url } = req.body;

        if (!name || !issuing_organization) {
            return res.status(400).json({ message: "Name and issuing organization are required" });
        }

        const result = await pool.query(
            `INSERT INTO certifications
             (user_id, name, issuing_organization, issue_date, expiry_date, credential_id, credential_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [userId, name, issuing_organization, issue_date || null, expiry_date || null, credential_id || null, credential_url || null]
        );

        res.status(201).json({ message: "Certification added", certification: result.rows[0] });
    } catch (err) {
        console.error("ADD CERTIFICATION ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteCertification = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        await pool.query(
            "DELETE FROM certifications WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        res.json({ message: "Certification deleted" });
    } catch (err) {
        console.error("DELETE CERTIFICATION ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================
   MEDIA UPLOAD (DO NOT CHANGE)
============================= */
exports.uploadMedia = [
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const userId = req.userId;
            const profileFile = req.files?.profileImage?.[0];
            const bannerFile = req.files?.bannerImage?.[0];

            if (!profileFile && !bannerFile) {
                return res.status(400).json({ message: "No files provided" });
            }

            let profileUrl = null;
            let bannerUrl = null;

            if (profileFile) {
                const dir = path.join(__dirname, "..", "uploads", "profiles");
                await ensureDir(dir);

                const filePath = path.join(dir, `${userId}.jpg`);
                await sharp(profileFile.buffer)
                    .resize(400, 400)
                    .jpeg({ quality: 80 })
                    .toFile(filePath);

                profileUrl = `/uploads/profiles/${userId}.jpg`;
            }

            if (bannerFile) {
                const dir = path.join(__dirname, "..", "uploads", "banners");
                await ensureDir(dir);

                const filePath = path.join(dir, `${userId}.jpg`);
                await sharp(bannerFile.buffer)
                    .resize(1600, 400)
                    .jpeg({ quality: 80 })
                    .toFile(filePath);

                bannerUrl = `/uploads/banners/${userId}.jpg`;
            }

            const result = await pool.query(
                `INSERT INTO profiles (user_id, profile_image_url, banner_image_url, updated_at)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (user_id)
                 DO UPDATE SET
                    profile_image_url = COALESCE(EXCLUDED.profile_image_url, profiles.profile_image_url),
                    banner_image_url = COALESCE(EXCLUDED.banner_image_url, profiles.banner_image_url),
                    updated_at = NOW()
                 RETURNING profile_image_url, banner_image_url`,
                [userId, profileUrl, bannerUrl]
            );

            res.json({
                message: "Media updated",
                profile_image_url: result.rows[0].profile_image_url,
                banner_image_url: result.rows[0].banner_image_url,
            });
        } catch (err) {
            console.error("UPLOAD MEDIA ERROR:", err.message);
            res.status(500).json({ message: "Server error" });
        }
    },
];

/* =============================
   CLEAR MEDIA
============================= */
exports.clearMedia = async (req, res) => {
    try {
        const userId = req.userId;

        await pool.query(
            `UPDATE profiles
             SET profile_image_url = NULL,
                 banner_image_url = NULL,
                 updated_at = NOW()
             WHERE user_id = $1`,
            [userId]
        );

        res.json({ message: "Images cleared" });
    } catch (err) {
        console.error("CLEAR MEDIA ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/* =============================
   GET PUBLIC PROFILE (BY USER ID)
============================= */
exports.getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params; // user_id (UUID)

        // Get user basic info
        const userResult = await pool.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [id]
        );

        if (!userResult.rows.length) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const user = userResult.rows[0];

        // Get profile details
        const profileResult = await pool.query(
            "SELECT * FROM profiles WHERE user_id = $1",
            [id]
        );

        const educationResult = await pool.query(
            "SELECT * FROM education WHERE user_id = $1 ORDER BY start_year DESC",
            [id]
        );

        const experienceResult = await pool.query(
            "SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC",
            [id]
        );

        const skillsResult = await pool.query(
            `SELECT s.id, s.skill_name
             FROM skills s
             JOIN user_skills us ON s.id = us.skill_id
             WHERE us.user_id = $1`,
            [id]
        );

        const certificationsResult = await pool.query(
            "SELECT * FROM certifications WHERE user_id = $1 ORDER BY issue_date DESC",
            [id]
        );

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            profile: profileResult.rows[0] || null,
            education: educationResult.rows,
            experience: experienceResult.rows,
            skills: skillsResult.rows,
            certifications: certificationsResult.rows,
        });
    } catch (err) {
        console.error("GET PUBLIC PROFILE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
