const pool = require("../db");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const ensureDir = async (dirPath) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
};
exports.uploadCompanyMedia = async (req, res) => {
    try {
        const userId = req.userId;

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
        await ensureDir(uploadDir);

        /* LOGO */
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

        /* BANNER */
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
        console.error("UPLOAD COMPANY MEDIA ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

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
            hr_email,
            phone,
            website
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
                hr_email, phone, website
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            ON CONFLICT (user_id)
            DO UPDATE SET
                name=$2,
                industry=$3,
                company_type=$4,
                founded_year=$5,
                description=$6,
                headquarters=$7,
                state=$8,
                city=$9,
                address=$10,
                zipcode=$11,
                hr_email=$12,
                phone=$13,
                website=$14,
                updated_at=NOW()
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
                hr_email,
                phone,
                website
            ]
        );

        res.json({
            message: "Company profile saved",
            company: result.rows[0],
        });
    } catch (err) {
        console.error("SAVE COMPANY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getCompany = async (req, res) => {
    try {
        const userId = req.userId;

        const companyRes = await pool.query(
            "SELECT * FROM companies WHERE user_id = $1",
            [userId]
        );

        if (!companyRes.rows.length) {
            return res.json({ company: null });
        }

        const company = companyRes.rows[0];

        const socialRes = await pool.query(
            "SELECT * FROM company_social_links WHERE company_id = $1",
            [company.id]
        );

        res.json({
            company,
            social_links: socialRes.rows[0] || null,
        });
    } catch (err) {
        console.error("GET COMPANY ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
exports.saveCompanySocialLinks = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            linkedin,
            instagram,
            facebook,
            twitter,
            youtube,
            pinterest
        } = req.body;

        const companyRes = await pool.query(
            "SELECT id FROM companies WHERE user_id = $1",
            [userId]
        );

        if (!companyRes.rows.length) {
            return res.status(404).json({ message: "Company profile not found" });
        }

        const companyId = companyRes.rows[0].id;

        const existingRes = await pool.query(
            "SELECT id FROM company_social_links WHERE company_id = $1",
            [companyId]
        );

        let result;
        let action = "saved";

        if (existingRes.rows.length) {
            result = await pool.query(
                `
                UPDATE company_social_links
                SET
                    linkedin=$1,
                    instagram=$2,
                    facebook=$3,
                    twitter=$4,
                    youtube=$5,
                    pinterest=$6,
                    updated_at=NOW()
                WHERE company_id=$7
                RETURNING *
                `,
                [
                    linkedin,
                    instagram,
                    facebook,
                    twitter,
                    youtube,
                    pinterest,
                    companyId
                ]
            );
            action = "updated";
        } else {
            result = await pool.query(
                `
                INSERT INTO company_social_links (
                    company_id,
                    linkedin,
                    instagram,
                    facebook,
                    twitter,
                    youtube,
                    pinterest
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7)
                RETURNING *
                `,
                [
                    companyId,
                    linkedin,
                    instagram,
                    facebook,
                    twitter,
                    youtube,
                    pinterest
                ]
            );
        }

        res.json({
            message: `Social links ${action} successfully`,
            social_links: result.rows[0],
        });
    } catch (err) {
        console.error("SAVE SOCIAL LINKS ERROR:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
exports.clearCompanyMedia = async (req, res) => {
    try {
        const userId = req.userId;

        // Optional query param `type` can be 'logo' or 'banner' to clear only that image.
        const { type } = req.query || {};

        // First fetch existing urls so we can delete files from disk
        const existingRes = await pool.query(
            `SELECT logo_url, banner_url FROM companies WHERE user_id = $1`,
            [userId]
        );
        if (!existingRes.rows.length) return res.status(404).json({ message: 'Company not found' });

        const { logo_url: currentLogo, banner_url: currentBanner } = existingRes.rows[0];

        let query, params;

        if (type === 'logo') {
            query = `
                UPDATE companies
                SET logo_url = NULL,
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING *
            `;
            params = [userId];
        } else if (type === 'banner') {
            query = `
                UPDATE companies
                SET banner_url = NULL,
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING *
            `;
            params = [userId];
        } else {
            query = `
                UPDATE companies
                SET logo_url = NULL,
                    banner_url = NULL,
                    updated_at = NOW()
                WHERE user_id = $1
                RETURNING *
            `;
            params = [userId];
        }

        const result = await pool.query(query, params);

        // Delete files from disk for the cleared types
        const tryUnlink = async (url) => {
            if (!url) return;
            try {
                // remove leading slash if present
                const rel = url.replace(/^\//, "");
                const filePath = path.join(__dirname, '..', rel);
                await fs.promises.unlink(filePath).catch(() => { });
            } catch (e) {
                console.error('Failed to unlink file', url, e.message);
            }
        };

        if (type === 'logo') {
            await tryUnlink(currentLogo);
        } else if (type === 'banner') {
            await tryUnlink(currentBanner);
        } else {
            await tryUnlink(currentLogo);
            await tryUnlink(currentBanner);
        }

        res.json({ company: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to clear images" });
    }
};
exports.saveCompanyPost = async (req, res) => {
    try {
        const userId = req.userId;
        const job = req.body;

        /* ================= GET COMPANY ================= */
        const companyRes = await pool.query(
            "SELECT id FROM companies WHERE user_id = $1",
            [userId]
        );

        if (!companyRes.rows.length) {
            return res.status(404).json({ message: "Company profile not found" });
        }

        const companyId = companyRes.rows[0].id;

        /* ================= INSERT JOB ================= */
        const jobRes = await pool.query(
            `
            INSERT INTO company_jobs (
                company_id,
                title,
                location_type,
                location,
                must_reside,
                timeline,
                hiring_count,
                pay_show_by,
                pay_min,
                pay_max,
                pay_rate,
                description,
                education,
                experience_years,
                experience_type,
                certifications,
                location_qual,
                travel,
                custom_benefits,
                status
            )
            VALUES (
                $1,$2,$3,$4,$5,
                $6,$7,
                $8,$9,$10,$11,
                $12,$13,$14,$15,
                $16,$17,$18,
                $19,$20
            )
            RETURNING *
            `,
            [
                companyId,
                job.title,
                job.location_type,
                job.location,
                job.must_reside === "yes",
                job.timeline,
                job.hiring_count,
                job.pay_show_by,
                job.pay_min || null,
                job.pay_max || null,
                job.pay_rate,
                job.description,
                job.education,
                job.experience_years || null,
                job.experience_type,
                job.certifications,
                job.location_qual,
                job.travel,
                job.custom_benefits,
                job.status || "draft"
            ]
        );

        const jobId = jobRes.rows[0].id;

        /* ================= HELPERS ================= */
        const insertMany = async (table, field, values) => {
            if (!values || !values.length) return;
            const q = values.map((_, i) => `($1,$${i + 2})`).join(",");
            await pool.query(
                `INSERT INTO ${table} (job_id, ${field}) VALUES ${q}`,
                [jobId, ...values]
            );
        };

        /* ================= CHILD TABLES ================= */
        await insertMany("company_job_types", "type", job.job_types);
        await insertMany("company_job_benefits", "benefit", job.selected_benefits);
        await insertMany("company_job_languages", "language", job.language);
        await insertMany("company_job_shifts", "shift", job.shift);

        /* ================= CUSTOM QUESTIONS ================= */
        if (job.custom_questions?.length) {
            for (const q of job.custom_questions) {
                await pool.query(
                    `
                    INSERT INTO company_job_questions (job_id, question, is_required)
                    VALUES ($1,$2,$3)
                    `,
                    [jobId, q.text, q.required]
                );
            }
        }

        res.json({
            message: "Job post saved successfully",
            job: jobRes.rows[0],
        });

    } catch (err) {
        console.error("SAVE COMPANY POST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getCompanyPosts = async (req, res) => {
    try {
        const userId = req.userId;

        const jobsRes = await pool.query(
            `
            SELECT j.*
            FROM company_jobs j
            JOIN companies c ON c.id = j.company_id
            WHERE c.user_id = $1
            ORDER BY j.created_at DESC
            `,
            [userId]
        );

        res.json({ jobs: jobsRes.rows });
    } catch (err) {
        console.error("GET COMPANY POSTS ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getCompanyPostById = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        const jobRes = await pool.query(
            `
            SELECT j.*
            FROM company_jobs j
            JOIN companies c ON c.id = j.company_id
            WHERE j.id = $1 AND c.user_id = $2
            `,
            [postId, userId]
        );

        if (!jobRes.rows.length) {
            return res.status(404).json({ message: "Job post not found" });
        }

        res.json({ job: jobRes.rows[0] });
    } catch (err) {
        console.error("GET COMPANY POST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteCompanyPost = async (req, res) => {
    try {
        const userId = req.userId;
        const { postId } = req.params;

        const result = await pool.query(
            `
            DELETE FROM company_jobs j
            USING companies c
            WHERE j.company_id = c.id
              AND j.id = $1
              AND c.user_id = $2
            RETURNING j.*
            `,
            [postId, userId]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: "Job post not found" });
        }

        res.json({ message: "Job post deleted successfully" });
    } catch (err) {
        console.error("DELETE COMPANY POST ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};
