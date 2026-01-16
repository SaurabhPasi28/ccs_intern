const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const pool = require("../db");

// ==============================
// Multer config for media uploads
// ==============================
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

const ensureDir = async (dirPath) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
};

// ==============================
// GET COLLEGE PROFILE
// ==============================
exports.getCollege = async (req, res) => {
    try {
        const userId = req.userId;

        const collegeResult = await pool.query(
            "SELECT * FROM colleges WHERE user_id = $1",
            [userId]
        );

        const collegeId = collegeResult.rows[0]?.id || null;

        const programs = collegeId
            ? (await pool.query(
                "SELECT * FROM college_programs WHERE college_id = $1 ORDER BY name ASC",
                [collegeId]
            )).rows
            : [];

        const facilities = collegeId
            ? (await pool.query(
                "SELECT * FROM college_facilities WHERE college_id = $1 ORDER BY facility_name ASC",
                [collegeId]
            )).rows
            : [];

        const placements = collegeId
            ? (await pool.query(
                "SELECT * FROM college_placements WHERE college_id = $1 ORDER BY academic_year DESC",
                [collegeId]
            )).rows
            : [];

        const rankings = collegeId
            ? (await pool.query(
                "SELECT * FROM college_rankings WHERE college_id = $1 ORDER BY year DESC NULLS LAST",
                [collegeId]
            )).rows
            : [];

        res.json({
            college: collegeResult.rows[0] || null,
            programs,
            facilities,
            placements,
            rankings,
        });
    } catch (err) {
        console.error("GET COLLEGE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ==============================
// UPDATE COLLEGE
// ==============================
exports.updateCollege = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            name,
            established_year,
            college_type,
            accreditation,
            state,
            city,
            zipcode,
            address,
            phone,
            email,
            website_url,
        } = req.body;

        if (!name) return res.status(400).json({ message: "College name is required" });

        const result = await pool.query(
            `INSERT INTO colleges
             (user_id, name, established_year, college_type, accreditation, state, city, zipcode, address, phone, email, website_url, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW())
             ON CONFLICT (user_id)
             DO UPDATE SET name=$2, established_year=$3, college_type=$4, accreditation=$5,
                           state=$6, city=$7, zipcode=$8, address=$9, phone=$10, email=$11,
                           website_url=$12, updated_at=NOW()
             RETURNING *`,
            [
                userId,
                name,
                established_year || null,
                college_type,
                accreditation,
                state,
                city,
                zipcode,
                address,
                phone,
                email,
                website_url,
            ]
        );

        res.json({ message: "College profile saved", college: result.rows[0] });
    } catch (err) {
        console.error("UPDATE COLLEGE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ==============================
// UPLOAD MEDIA
// ==============================
exports.uploadMedia = [
    upload.fields([
        { name: "logoImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const userId = req.userId;

            const collegeResult = await pool.query(
                "SELECT id FROM colleges WHERE user_id = $1",
                [userId]
            );
            const collegeId = collegeResult.rows[0]?.id;
            if (!collegeId) return res.status(400).json({ message: "Create college profile first" });

            const logoFile = req.files?.logoImage?.[0];
            const bannerFile = req.files?.bannerImage?.[0];

            const updates = {};

            if (logoFile) {
                const logoDir = path.join(__dirname, "../uploads/college/logos");
                await ensureDir(logoDir);
                const logoFilename = `logo_${userId}_${Date.now()}.jpg`;
                const logoPath = path.join(logoDir, logoFilename);

                await sharp(logoFile.buffer)
                    .resize(300, 300, { fit: "cover" })
                    .jpeg({ quality: 80 })
                    .toFile(logoPath);

                updates.logo_url = `/uploads/college/logos/${logoFilename}`;
            }

            if (bannerFile) {
                const bannerDir = path.join(__dirname, "../uploads/college/banners");
                await ensureDir(bannerDir);
                const bannerFilename = `banner_${userId}_${Date.now()}.jpg`;
                const bannerPath = path.join(bannerDir, bannerFilename);

                await sharp(bannerFile.buffer)
                    .resize(1200, 360, { fit: "cover" })
                    .jpeg({ quality: 80 })
                    .toFile(bannerPath);

                updates.banner_url = `/uploads/college/banners/${bannerFilename}`;
            }

            if (Object.keys(updates).length === 0)
                return res.status(400).json({ message: "No files uploaded" });

            const result = await pool.query(
                `UPDATE colleges 
                 SET logo_url = COALESCE($1, logo_url), 
                     banner_url = COALESCE($2, banner_url), 
                     updated_at = NOW()
                 WHERE id = $3
                 RETURNING logo_url, banner_url`,
                [updates.logo_url || null, updates.banner_url || null, collegeId]
            );

            res.json({
                message: "Media updated",
                logo_url: result.rows[0]?.logo_url,
                banner_url: result.rows[0]?.banner_url,
            });
        } catch (err) {
            console.error("UPLOAD COLLEGE MEDIA ERROR:", err.message);
            res.status(500).json({ message: "Server error" });
        }
    },
];

// ==============================
// CLEAR MEDIA
// ==============================
exports.clearMedia = async (req, res) => {
    try {
        const userId = req.userId;
        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "No college profile" });

        await pool.query(
            `UPDATE colleges 
             SET logo_url = NULL, banner_url = NULL, updated_at = NOW() 
             WHERE id = $1`,
            [collegeId]
        );

        res.json({ message: "Media cleared" });
    } catch (err) {
        console.error("CLEAR COLLEGE MEDIA ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ==============================
// PROGRAMS
// ==============================
exports.addProgram = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, degree, duration } = req.body;

        if (!name) return res.status(400).json({ message: "Program name is required" });

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "Create college profile first" });

        const result = await pool.query(
            `INSERT INTO college_programs (college_id, name, degree, duration)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [collegeId, name, degree || null, duration || null]
        );

        res.status(201).json({ message: "Program added", program: result.rows[0] });
    } catch (err) {
        console.error("ADD PROGRAM ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteProgram = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "No college profile" });

        await pool.query(
            "DELETE FROM college_programs WHERE id = $1 AND college_id = $2",
            [id, collegeId]
        );

        res.json({ message: "Program deleted" });
    } catch (err) {
        console.error("DELETE PROGRAM ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ==============================
// FACILITIES
// ==============================
exports.addFacility = async (req, res) => {
    try {
        const userId = req.userId;
        const { facility_name, description } = req.body;

        if (!facility_name) return res.status(400).json({ message: "Facility name is required" });

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "Create college profile first" });

        const result = await pool.query(
            `INSERT INTO college_facilities (college_id, facility_name, description)
             VALUES ($1,$2,$3)
             RETURNING *`,
            [collegeId, facility_name, description || null]
        );

        res.status(201).json({ message: "Facility added", facility: result.rows[0] });
    } catch (err) {
        console.error("ADD FACILITY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteFacility = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "No college profile" });

        await pool.query(
            "DELETE FROM college_facilities WHERE id = $1 AND college_id = $2",
            [id, collegeId]
        );

        res.json({ message: "Facility deleted" });
    } catch (err) {
        console.error("DELETE FACILITY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ==============================
// PLACEMENTS
// ==============================
exports.addPlacement = async (req, res) => {
    try {
        const userId = req.userId;
        const { academic_year, details } = req.body;

        if (!academic_year) return res.status(400).json({ message: "Academic year is required" });

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "Create college profile first" });

        const result = await pool.query(
            `INSERT INTO college_placements (college_id, academic_year, details)
             VALUES ($1,$2,$3)
             RETURNING *`,
            [collegeId, academic_year, details || null]
        );

        res.status(201).json({ message: "Placement added", placement: result.rows[0] });
    } catch (err) {
        console.error("ADD PLACEMENT ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deletePlacement = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "No college profile" });

        await pool.query(
            "DELETE FROM college_placements WHERE id = $1 AND college_id = $2",
            [id, collegeId]
        );

        res.json({ message: "Placement deleted" });
    } catch (err) {
        console.error("DELETE PLACEMENT ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// ==============================
// RANKINGS
// ==============================
exports.addRanking = async (req, res) => {
    try {
        const userId = req.userId;
        const { source, rank, year } = req.body;

        if (!source || !rank) return res.status(400).json({ message: "Source and rank are required" });

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "Create college profile first" });

        const result = await pool.query(
            `INSERT INTO college_rankings (college_id, source, rank, year)
             VALUES ($1,$2,$3,$4)
             RETURNING *`,
            [collegeId, source, rank, year || null]
        );

        res.status(201).json({ message: "Ranking added", ranking: result.rows[0] });
    } catch (err) {
        console.error("ADD RANKING ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteRanking = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const collegeResult = await pool.query(
            "SELECT id FROM colleges WHERE user_id = $1",
            [userId]
        );
        const collegeId = collegeResult.rows[0]?.id;
        if (!collegeId) return res.status(400).json({ message: "No college profile" });

        await pool.query(
            "DELETE FROM college_rankings WHERE id = $1 AND college_id = $2",
            [id, collegeId]
        );

        res.json({ message: "Ranking deleted" });
    } catch (err) {
        console.error("DELETE RANKING ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


// these bellow lines added by me--------->



// ==============================
// GET PUBLIC COLLEGE PROFILE
// ==============================
exports.getPublicCollege = async (req, res) => {
    try {
        const { id } = req.params;

        const collegeResult = await pool.query(
            "SELECT * FROM colleges WHERE id = $1",
            [id]
        );

        if (!collegeResult.rows.length) {
            return res.status(404).json({ message: "College not found" });
        }

        const college = collegeResult.rows[0];

        const programs = await pool.query(
            "SELECT * FROM college_programs WHERE college_id = $1 ORDER BY degree_level, program_name",
            [college.id]
        );

        const facilities = await pool.query(
            "SELECT * FROM college_facilities WHERE college_id = $1 ORDER BY facility_name",
            [college.id]
        );

        const placements = await pool.query(
            "SELECT * FROM college_placements WHERE college_id = $1 ORDER BY academic_year DESC",
            [college.id]
        );

        const rankings = await pool.query(
            "SELECT * FROM college_rankings WHERE college_id = $1 ORDER BY year DESC NULLS LAST",
            [college.id]
        );

        res.json({
            college,
            programs: programs.rows,
            facilities: facilities.rows,
            placements: placements.rows,
            rankings: rankings.rows
        });
    } catch (err) {
        console.error("GET PUBLIC COLLEGE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
