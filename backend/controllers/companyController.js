const pool = require("../db");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

/* Ensure directory exists */
const ensureDir = async (dirPath) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
};

exports.uploadCompanyMedia = async (req, res) => {
    try {
        const userId = req.userId; // from authMiddleware

        // 1️⃣ Get company using user_id
        const companyRes = await pool.query(
            "SELECT id FROM companies WHERE user_id = $1",
            [userId]
        );

        if (!companyRes.rows.length) {
            return res.status(404).json({ message: "Company profile not found" });
        }

        const companyId = companyRes.rows[0].id;

        let logoUrl = null;
        let bannerUrl = null;

        const uploadDir = path.join(__dirname, "../uploads/company");
        await fs.promises.mkdir(uploadDir, { recursive: true });

        // 2️⃣ Handle logo
        if (req.files?.logoImage) {
            const logoFile = req.files.logoImage[0];
            const logoName = `logo_${companyId}_${Date.now()}.webp`;
            const logoPath = path.join(uploadDir, logoName);

            await sharp(logoFile.buffer)
                .resize(300, 300)
                .webp({ quality: 80 })
                .toFile(logoPath);

            logoUrl = `/uploads/company/${logoName}`;
        }

        // 3️⃣ Handle banner
        if (req.files?.bannerImage) {
            const bannerFile = req.files.bannerImage[0];
            const bannerName = `banner_${companyId}_${Date.now()}.webp`;
            const bannerPath = path.join(uploadDir, bannerName);

            await sharp(bannerFile.buffer)
                .resize(1200, 400)
                .webp({ quality: 80 })
                .toFile(bannerPath);

            bannerUrl = `/uploads/company/${bannerName}`;
        }

        // 4️⃣ Update DB
        const updateRes = await pool.query(
            `
            UPDATE companies
            SET
                logo_url = COALESCE($1, logo_url),
                banner_url = COALESCE($2, banner_url),
                updated_at = NOW()
            WHERE id = $3
            RETURNING *
            `,
            [logoUrl, bannerUrl, companyId]
        );

        res.json({ company: updateRes.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * GET company profile
 */
exports.getCompany = async (req, res) => {
    try {
        const userId = req.userId;

        const companyResult = await pool.query(
            "SELECT * FROM companies WHERE user_id = $1",
            [userId]
        );

        if (!companyResult.rows.length) {
            return res.json({
                company: null,
                tech_stack: [],
                roles: []
            });
        }

        const company = companyResult.rows[0];

        const techStack = await pool.query(
            "SELECT * FROM company_tech_stack WHERE company_id = $1",
            [company.id]
        );

        const roles = await pool.query(
            "SELECT * FROM company_roles WHERE company_id = $1",
            [company.id]
        );

        res.json({
            company,
            tech_stack: techStack.rows,
            roles: roles.rows
        });
    } catch (err) {
        console.error("GET COMPANY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * CREATE / UPDATE company profile
 */
exports.saveCompany = async (req, res) => {
    try {
        const userId = req.userId;

        const {
            name,
            industry,
            company_type,
            founded_year,
            description,
            headquarters,
            state,
            city,
            address,
            zipcode,
            website_url,
            linkedin_url,
            hr_email,
            phone
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Company name is required" });
        }

        const result = await pool.query(
            `
            INSERT INTO companies (
                user_id, name, industry, company_type,
                founded_year, description, headquarters,
                state, city, address, zipcode,
                website_url, linkedin_url, hr_email, phone
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
            ON CONFLICT (user_id)
            DO UPDATE SET
                name = $2,
                industry = $3,
                company_type = $4,
                founded_year = $5,
                description = $6,
                headquarters = $7,
                state = $8,
                city = $9,
                address = $10,
                zipcode = $11,
                website_url = $12,
                linkedin_url = $13,
                hr_email = $14,
                phone = $15,
                updated_at = NOW()
            RETURNING *
            `,
            [
                userId,
                name,
                industry,
                company_type,
                founded_year || null,
                description,
                headquarters,
                state,
                city,
                address,
                zipcode,
                website_url,
                linkedin_url,
                hr_email,
                phone
            ]
        );

        res.json({
            message: "Company profile saved",
            company: result.rows[0]
        });
    } catch (err) {
        console.error("SAVE COMPANY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ADD tech stack
 */
exports.addTech = async (req, res) => {
    try {
        const userId = req.userId;
        const { technology } = req.body;

        if (!technology) {
            return res.status(400).json({ message: "Technology is required" });
        }

        const companyResult = await pool.query(
            "SELECT id FROM companies WHERE user_id = $1",
            [userId]
        );

        if (!companyResult.rows.length) {
            return res.status(400).json({ message: "Create company profile first" });
        }

        await pool.query(
            "INSERT INTO company_tech_stack (company_id, technology) VALUES ($1,$2)",
            [companyResult.rows[0].id, technology]
        );

        res.json({ message: "Technology added" });
    } catch (err) {
        console.error("ADD TECH ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ADD hiring role
 */
exports.addRole = async (req, res) => {
    try {
        const userId = req.userId;
        const { role_name, experience_level, salary_range } = req.body;

        if (!role_name) {
            return res.status(400).json({ message: "Role name is required" });
        }

        const companyResult = await pool.query(
            "SELECT id FROM companies WHERE user_id = $1",
            [userId]
        );

        if (!companyResult.rows.length) {
            return res.status(400).json({ message: "Create company profile first" });
        }

        await pool.query(
            `
            INSERT INTO company_roles
            (company_id, role_name, experience_level, salary_range)
            VALUES ($1,$2,$3,$4)
            `,
            [
                companyResult.rows[0].id,
                role_name,
                experience_level,
                salary_range
            ]
        );

        res.json({ message: "Role added" });
    } catch (err) {
        console.error("ADD ROLE ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};


// <--------bellow all lines are added by me------>

/**
 * GET public company profile by ID (no auth required)
 */
exports.getPublicCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const companyResult = await pool.query(
            "SELECT * FROM companies WHERE id = $1",
            [id]
        );

        if (!companyResult.rows.length) {
            return res.status(404).json({ message: "Company not found" });
        }

        const company = companyResult.rows[0];

        const techStack = await pool.query(
            "SELECT * FROM company_tech_stack WHERE company_id = $1",
            [company.id]
        );

        const roles = await pool.query(
            "SELECT * FROM company_roles WHERE company_id = $1",
            [company.id]
        );

        const locations = await pool.query(
            "SELECT * FROM company_locations WHERE company_id = $1",
            [company.id]
        );

        res.json({
            company,
            tech_stack: techStack.rows,
            roles: roles.rows,
            locations: locations.rows
        });
    } catch (err) {
        console.error("GET PUBLIC COMPANY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
