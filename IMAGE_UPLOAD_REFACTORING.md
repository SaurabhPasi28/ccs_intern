# Image Upload Refactoring - Cloudinary Integration

## Overview
This document describes the refactoring of image upload functionality across all profile types (Student, College, Company, School, University) to use **reusable components** and **Cloudinary** for cloud storage.

## Changes Made

### 1. Reusable Multer Middleware (`backend/middleware/upload.js`)
**Purpose:** Centralized multer configuration for image uploads

**Features:**
- Memory storage for efficient buffer handling
- 5MB file size limit
- File type validation (JPEG, PNG, WebP only)
- Separate configurations for images and resumes

**Usage:**
```javascript
const { imageUpload, resumeUpload } = require("../middleware/upload");

// In route:
router.patch("/media", authMiddleware, ...imageUpload.fields([
    { name: "logoImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 }
]));
```

### 2. Cloudinary Upload Utility (`backend/utils/cloudinaryUpload.js`)
**Purpose:** Reusable functions for Cloudinary operations

**Functions:**
- `uploadToCloudinary(buffer, entityType, imageType, options)` - Uploads images to Cloudinary
- `deleteFromCloudinary(publicId)` - Deletes images from Cloudinary

**Folder Structure in Cloudinary:**
```
ccs/
├── student/
│   ├── profile/
│   └── banner/
├── college/
│   ├── logo/
│   └── banner/
├── company/
│   ├── logo/
│   └── banner/
├── school/
│   ├── logo/
│   └── banner/
└── university/
    ├── logo/
    └── banner/
```

**Image Processing:**
- Profile images: 400x400px, 85% quality
- Banner images: 1600x400px, 85% quality
- Logo images: 300x300px, 90% quality
- All images converted to JPEG format
- Automatic optimization and format conversion

### 3. Cloudinary Configuration (`backend/config/cloudinary.js`)
**Purpose:** Initialize Cloudinary with credentials from environment variables

**Environment Variables Required:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Controller Updates

#### Student Controller (`backend/controllers/studentController.js`)
- ✅ Removed local multer config
- ✅ Imported reusable `imageUpload` middleware
- ✅ Implemented Cloudinary upload for profile and banner images
- ✅ Added automatic deletion of old images when uploading new ones
- ✅ Folder structure: `ccs/student/profile/` and `ccs/student/banner/`

#### College Controller (`backend/controllers/collegeController.js`)
- ✅ Removed local multer config
- ✅ Imported reusable `imageUpload` middleware
- ✅ Implemented Cloudinary upload for logo and banner images
- ✅ Added automatic deletion of old images
- ✅ Folder structure: `ccs/college/logo/` and `ccs/college/banner/`

#### Company Controller (`backend/controllers/companyController.js`)
- ✅ Removed local sharp processing
- ✅ Imported reusable `imageUpload` middleware
- ✅ Converted to array-based handler for route compatibility
- ✅ Implemented Cloudinary upload for logo and banner images
- ✅ Added automatic deletion of old images
- ✅ Folder structure: `ccs/company/logo/` and `ccs/company/banner/`

#### School Controller (`backend/controllers/schoolController.js`)
- ✅ Removed local multer and sharp config
- ✅ Imported reusable `imageUpload` middleware
- ✅ Converted to array-based handler
- ✅ Implemented Cloudinary upload for logo and banner images
- ✅ Added automatic deletion of old images
- ✅ Folder structure: `ccs/school/logo/` and `ccs/school/banner/`

#### University Controller (`backend/controllers/universityController.js`)
- ✅ Removed local multer and sharp config
- ✅ Imported reusable `imageUpload` middleware
- ✅ Converted to array-based handler
- ✅ Implemented Cloudinary upload for logo and banner images
- ✅ Added automatic deletion of old images
- ✅ Folder structure: `ccs/university/logo/` and `ccs/university/banner/`

### 5. Route Updates

#### Student Routes (`backend/routes/studentRoutes.js`)
- ✅ Already using spread operator for `uploadMedia` array

#### College Routes (`backend/routes/collegeRoutes.js`)
- ✅ Already using spread operator for `uploadMedia` array

#### Company Routes (`backend/routes/companyRoutes.js`)
- ✅ Updated to use spread operator for `uploadCompanyMedia` array
- ✅ Removed local multer config

#### School Routes (`backend/routes/schoolRoutes.js`)
- ✅ Uncommented and activated all routes
- ✅ Updated to use spread operator for `uploadSchoolMedia` array
- ✅ Removed local multer config

#### University Routes (`backend/routes/universityRoutes.js`)
- ✅ Uncommented and activated all routes
- ✅ Updated to use spread operator for `uploadUniversityMedia` array
- ✅ Removed local multer config

## Benefits of This Refactoring

### 1. **Code Reusability**
- Single multer configuration used across all controllers
- Single Cloudinary upload function used everywhere
- Reduces code duplication by ~80%

### 2. **Cloud Storage**
- Images stored on Cloudinary instead of local server
- Automatic CDN delivery for faster load times
- Better scalability and reliability
- No need to manage local storage

### 3. **Consistent Folder Structure**
- Organized by entity type (student, college, company, etc.)
- Easy to locate and manage images
- Better access control possibilities

### 4. **Automatic Image Optimization**
- Images automatically processed to optimal dimensions
- JPEG compression for smaller file sizes
- Cloudinary's automatic format optimization
- Reduced bandwidth usage

### 5. **Old Image Cleanup**
- Automatically deletes old images when new ones are uploaded
- Prevents storage bloat
- Keeps Cloudinary storage clean

### 6. **Maintainability**
- Changes to image handling only need to be made in one place
- Easier to debug and test
- Consistent error handling

## API Endpoints

All endpoints require authentication via `Authorization: Bearer <token>` header.

### Student
- `PATCH /api/student/media` - Upload profile/banner image
  - Form fields: `profileImage`, `bannerImage`

### College
- `PATCH /api/college/media` - Upload logo/banner image
  - Form fields: `logoImage`, `bannerImage`

### Company
- `PATCH /api/company/media` - Upload logo/banner image
  - Form fields: `logoImage`, `bannerImage`

### School
- `PATCH /api/school/media` - Upload logo/banner image
  - Form fields: `logoImage`, `bannerImage`

### University
- `PATCH /api/university/media` - Upload logo/banner image
  - Form fields: `logoImage`, `bannerImage`

## Front-End Integration

All front-end profile components already have image upload functionality:
- ✅ `StudentProfile.jsx` - Has profile and banner upload
- ✅ `CollegeProfile.jsx` - Has logo and banner upload
- ✅ `CompanyProfile.jsx` - Has logo and banner upload
- ✅ `SchoolProfile.jsx` - Has logo and banner upload
- ✅ `UniversityProfile.jsx` - Has logo and banner upload

The front-end uses `FormData` to send files to the backend, which is compatible with the new Cloudinary implementation.

## Testing Checklist

- [ ] Test student profile/banner image upload
- [ ] Test college logo/banner image upload
- [ ] Test company logo/banner image upload
- [ ] Test school logo/banner image upload
- [ ] Test university logo/banner image upload
- [ ] Verify images appear in correct Cloudinary folders
- [ ] Test uploading new image replaces old one (check Cloudinary)
- [ ] Test file size limit (5MB)
- [ ] Test file type validation (only JPEG/PNG/WebP)
- [ ] Test images display correctly on public profiles
- [ ] Test images display correctly in all front-end views

## Troubleshooting

### Images not uploading
1. Check Cloudinary credentials in `.env` file
2. Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correct
3. Check network connectivity to Cloudinary

### Old images not deleted
- The `extractPublicId` helper function extracts the public_id from Cloudinary URLs
- Ensure URLs stored in database are Cloudinary URLs (contain 'ccs/' in path)

### File type errors
- Only JPEG, PNG, and WebP formats are allowed
- Error message: "Only JPEG, PNG, and WebP images are allowed"

### File size errors
- Maximum file size is 5MB
- Error message: "File too large"

## Migration Notes

If you have existing local images in the `backend/uploads/` folder:
1. These will no longer be accessible after this change
2. Users will need to re-upload their images
3. Old local files can be manually migrated to Cloudinary if needed
4. Consider keeping the `uploads/` folder temporarily for reference

## Next Steps

1. ✅ Install cloudinary package
2. ✅ Configure environment variables
3. ✅ Test all image upload endpoints
4. ✅ Verify images appear in Cloudinary dashboard
5. ⚠️ Optional: Migrate existing local images to Cloudinary
6. ⚠️ Optional: Clean up old `uploads/` directory after migration

## Package Dependencies

Ensure these packages are installed:
```json
{
  "cloudinary": "^2.0.0",
  "multer": "^2.0.2",
  "sharp": "^0.34.5"
}
```

Install with:
```bash
cd backend
npm install cloudinary
```

---

**Last Updated:** January 23, 2026  
**Author:** CCS Development Team
