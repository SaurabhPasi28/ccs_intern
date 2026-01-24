const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getCompany,
    saveCompany,
    uploadCompanyMedia,
    saveCompanySocialLinks,
    clearCompanyMedia,
    saveCompanyPost,
    getCompanyPosts,
    getCompanyPostById,
    deleteCompanyPost,
    // addTech,
    // addRole,
    getPublicCompany,
} = require("../controllers/companyController");

router.get("/", authMiddleware, getCompany);
// router.get("/public/:id", getPublicCompany); // Public endpoint - no auth {Added by me}
router.put("/", authMiddleware, saveCompany);
// router.post("/tech", authMiddleware, addTech);
// router.post("/roles", authMiddleware, addRole);

// SOCIAL LINKS
router.post("/social-links", authMiddleware, saveCompanySocialLinks);
router.put("/social-links", authMiddleware, saveCompanySocialLinks);

// ✅ MEDIA ROUTE - uploadCompanyMedia is now an array with multer middleware
router.patch(
    "/media",
    authMiddleware,
    ...uploadCompanyMedia
);

// ✅ MEDIA CLEAR (THIS WAS MISSING)
router.delete(
    "/media/clear",
    authMiddleware,
    clearCompanyMedia
);

/* ================= JOB POSTS ================= */
router.post("/publish", authMiddleware, saveCompanyPost);
router.get("/publish", authMiddleware, getCompanyPosts);
router.get("/publish/:postId", authMiddleware, getCompanyPostById);
router.delete("/publish/:postId", authMiddleware, deleteCompanyPost);

module.exports = router;

module.exports = router;
