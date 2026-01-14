const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    getCompany,
    saveCompany,
    addTech,
    addRole,
    uploadCompanyMedia,
    getPublicCompany,
} = require("../controllers/companyController");

const multer = require("multer");

/* Multer config */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.get("/", authMiddleware, getCompany);
router.get("/public/:id", getPublicCompany); // Public endpoint - no auth {Added by me}
router.put("/", authMiddleware, saveCompany);
router.post("/tech", authMiddleware, addTech);
router.post("/roles", authMiddleware, addRole);

// ✅ MEDIA ROUTE
router.patch(
    "/media",
    authMiddleware,
    upload.fields([
        { name: "logoImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 }
    ]),
    uploadCompanyMedia
);

module.exports = router;
