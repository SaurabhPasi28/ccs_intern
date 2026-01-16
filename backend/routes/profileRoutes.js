const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const profileController = require("../controllers/profileController");

const {
    getProfile,
    updateProfile,
    addEducation,
    deleteEducation,
    addExperience,
    deleteExperience,
    addSkill,
    deleteSkill,
    addCertification,
    deleteCertification,
    uploadMedia,
    clearMedia,
    getPublicProfile,
} = profileController;

/* =============================
   PUBLIC ENDPOINTS (NO AUTH)
============================= */
router.get("/public/:id", getPublicProfile); // Public profile

/* =============================
   APPLY AUTH MIDDLEWARE ONCE
============================= */
router.use(authMiddleware);

/* =============================
   PROFILE
============================= */
router.get("/", getProfile);
router.put("/", updateProfile);

/**
 * uploadMedia is an ARRAY:
 * [multerMiddleware, asyncHandler]
 * so we MUST spread it
 */
router.patch("/media", ...uploadMedia);
router.delete("/media/clear", clearMedia);

/* =============================
   EDUCATION
============================= */
router.post("/education", addEducation);
router.delete("/education/:id", deleteEducation);

/* =============================
   EXPERIENCE
============================= */
router.post("/experience", addExperience);
router.delete("/experience/:id", deleteExperience);

/* =============================
   SKILLS
============================= */
router.post("/skills", addSkill);
router.delete("/skills/:skill_id", deleteSkill);

/* =============================
   CERTIFICATIONS
============================= */
router.post("/certifications", addCertification);
router.delete("/certifications/:id", deleteCertification);

module.exports = router;
