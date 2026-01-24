const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const universityController = require("../controllers/universityController");

// Get university profile
// router.get("/", verifyToken, universityController.getUniversity);

// // Update university basic info
// router.put("/", verifyToken, universityController.updateUniversity);

// // Upload university media (logo and banner) - uploadUniversityMedia is now an array with multer middleware
// router.patch(
//     "/media",
//     verifyToken,
//     ...universityController.uploadUniversityMedia
// );

// // Department routes
// router.post("/departments", verifyToken, universityController.addDepartment);
// router.delete("/departments/:id", verifyToken, universityController.deleteDepartment);

// // Program routes
// router.post("/programs", verifyToken, universityController.addProgram);
// router.delete("/programs/:id", verifyToken, universityController.deleteProgram);

// // Facility routes
// router.post("/facilities", verifyToken, universityController.addFacility);
// router.delete("/facilities/:id", verifyToken, universityController.deleteFacility);

// // Placement routes
// router.post("/placements", verifyToken, universityController.addPlacement);
// router.delete("/placements/:id", verifyToken, universityController.deletePlacement);

// // Ranking routes
// router.post("/rankings", verifyToken, universityController.addRanking);
// router.delete("/rankings/:id", verifyToken, universityController.deleteRanking);

// // Research routes
// router.post("/research", verifyToken, universityController.addResearch);
// router.delete("/research/:id", verifyToken, universityController.deleteResearch);

// module.exports = router;
// router.delete("/research/:id", verifyToken, universityController.deleteResearch);

module.exports = router;
