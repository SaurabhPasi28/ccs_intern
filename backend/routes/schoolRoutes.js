const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const schoolController = require("../controllers/schoolController");

// Get school profile
// router.get("/", verifyToken, schoolController.getSchool);

// // Update school basic info
// router.put("/", verifyToken, schoolController.updateSchool);

// Upload school media (logo and banner) - uploadSchoolMedia is now an array with multer middleware
// router.patch(
//     "/media",
//     verifyToken,
//     ...schoolController.uploadSchoolMedia
// );

// // Facility routes
// router.post("/facilities", verifyToken, schoolController.addFacility);
// router.delete("/facilities/:id", verifyToken, schoolController.deleteFacility);

// // Program routes
// router.post("/programs", verifyToken, schoolController.addProgram);
// router.delete("/programs/:id", verifyToken, schoolController.deleteProgram);

// // Achievement routes
// router.post("/achievements", verifyToken, schoolController.addAchievement);
// router.delete("/achievements/:id", verifyToken, schoolController.deleteAchievement);

// // Result routes
// router.post("/results", verifyToken, schoolController.addResult);
// router.delete("/results/:id", verifyToken, schoolController.deleteResult);

module.exports = router;
