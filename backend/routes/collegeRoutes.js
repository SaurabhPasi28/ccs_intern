const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const collegeController = require("../controllers/collegeController");

const {
    getCollege,
    updateCollege,
    addProgram,
    deleteProgram,
    addFacility,
    deleteFacility,
    addPlacement,
    deletePlacement,
    addRanking,
    deleteRanking,
    uploadMedia,
    clearMedia,
    getPublicCollege, //sp-->
} = collegeController;

// public college profile added by me----------->sp


/* =============================
   PUBLIC ENDPOINTS (NO AUTH)
============================= */
router.get("/public/college", getPublicCollege); // Public college profile

/* =============================
   APPLY AUTH MIDDLEWARE ONCE
============================= */
router.use(authMiddleware);

/* =============================
   COLLEGE PROFILE
============================= */
router.get("/", getCollege);
router.put("/", updateCollege);

/* =============================
   PROGRAMS
============================= */
router.post("/programs", addProgram);
router.delete("/programs/:id", deleteProgram);

/* =============================
   FACILITIES
============================= */
router.post("/facilities", addFacility);
router.delete("/facilities/:id", deleteFacility);

/* =============================
   PLACEMENTS
============================= */
router.post("/placements", addPlacement);
router.delete("/placements/:id", deletePlacement);

/* =============================
   RANKINGS
============================= */
router.post("/rankings", addRanking);
router.delete("/rankings/:id", deleteRanking);

/* =============================
   MEDIA (🔥 IMPORTANT FIX)
============================= */
router.patch("/media", ...uploadMedia);   // ✅ MUST spread
router.delete("/media/clear", clearMedia);

module.exports = router;
