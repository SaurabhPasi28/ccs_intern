# Testing Guide - Image Upload with Cloudinary

## Prerequisites
1. Cloudinary account created
2. Environment variables set in `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=dbu5fwipd
   CLOUDINARY_API_KEY=391334451736338
   CLOUDINARY_API_SECRET=hK74qYxuQnwqd0XHclhacPBzx9Q
   ```
3. Backend server running
4. Frontend development server running

## Testing Steps

### 1. Test Student Profile Images

**Profile Image Upload:**
```bash
# Using curl (replace TOKEN with your JWT token)
curl -X PATCH http://localhost:5000/api/student/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@/path/to/your/image.jpg"
```

**Banner Image Upload:**
```bash
curl -X PATCH http://localhost:5000/api/student/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "bannerImage=@/path/to/your/banner.jpg"
```

**Both at once:**
```bash
curl -X PATCH http://localhost:5000/api/student/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@/path/to/profile.jpg" \
  -F "bannerImage=@/path/to/banner.jpg"
```

**Expected Result:**
- Status: 200 OK
- Response includes URLs from Cloudinary
- Check Cloudinary: `ccs/student/profile/` folder has the image
- Check Cloudinary: `ccs/student/banner/` folder has the image

### 2. Test College Logo and Banner

**Logo Upload:**
```bash
curl -X PATCH http://localhost:5000/api/college/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "logoImage=@/path/to/logo.jpg"
```

**Banner Upload:**
```bash
curl -X PATCH http://localhost:5000/api/college/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "bannerImage=@/path/to/banner.jpg"
```

**Expected Result:**
- Status: 200 OK
- Check Cloudinary: `ccs/college/logo/` and `ccs/college/banner/` folders

### 3. Test Company Logo and Banner

```bash
curl -X PATCH http://localhost:5000/api/company/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "logoImage=@/path/to/logo.jpg" \
  -F "bannerImage=@/path/to/banner.jpg"
```

**Expected Result:**
- Check Cloudinary: `ccs/company/logo/` and `ccs/company/banner/` folders

### 4. Test School Logo and Banner

```bash
curl -X PATCH http://localhost:5000/api/school/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "logoImage=@/path/to/logo.jpg" \
  -F "bannerImage=@/path/to/banner.jpg"
```

**Expected Result:**
- Check Cloudinary: `ccs/school/logo/` and `ccs/school/banner/` folders

### 5. Test University Logo and Banner

```bash
curl -X PATCH http://localhost:5000/api/university/media \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "logoImage=@/path/to/logo.jpg" \
  -F "bannerImage=@/path/to/banner.jpg"
```

**Expected Result:**
- Check Cloudinary: `ccs/university/logo/` and `ccs/university/banner/` folders

## Frontend Testing

### Using Browser (Recommended)

1. **Login** to your account (student, college, company, school, or university)
2. **Navigate** to your profile page
3. **Click** on the edit/upload image button
4. **Select** an image file (JPEG, PNG, or WebP)
5. **Wait** for upload confirmation
6. **Verify** the image appears on your profile
7. **Refresh** the page to ensure it persists

### Test Scenarios

#### Scenario 1: File Size Limit
- Upload image > 5MB
- **Expected:** Error message "File too large"

#### Scenario 2: Invalid File Type
- Upload a PDF or other non-image file
- **Expected:** Error message "Only JPEG, PNG, and WebP images are allowed"

#### Scenario 3: Replace Existing Image
1. Upload an image
2. Upload a different image to the same field
3. **Expected:** 
   - New image replaces old one
   - Old image is deleted from Cloudinary
   - Check Cloudinary to confirm only one image exists

#### Scenario 4: Upload Both Images
1. Upload profile/logo image
2. Upload banner image
3. **Expected:**
   - Both images appear on profile
   - Both saved to appropriate Cloudinary folders

## Verify in Cloudinary Dashboard

1. Login to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to Media Library
3. Check folder structure:
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
4. Verify images are in correct folders
5. Check image properties (dimensions, format)

## Common Issues and Solutions

### Issue: "Cloudinary connection failed"
**Solution:** 
- Check internet connection
- Verify Cloudinary credentials in `.env`
- Ensure cloudinary package is installed

### Issue: "Images not appearing on profile"
**Solution:**
- Check browser console for errors
- Verify API response includes Cloudinary URLs
- Check database for updated URLs

### Issue: "Old images not deleted"
**Solution:**
- Check Cloudinary for multiple versions
- Verify `extractPublicId` function is working
- Check console logs for deletion errors

### Issue: "413 Payload Too Large"
**Solution:**
- File size exceeds 5MB limit
- Compress image before uploading
- Adjust `limits.fileSize` if needed

## Database Verification

Check that URLs are saved in PostgreSQL:

```sql
-- Student profile images
SELECT user_id, profile_image_url, banner_image_url 
FROM profiles 
WHERE user_id = 'YOUR_USER_ID';

-- College images
SELECT id, name, logo_url, banner_url 
FROM colleges 
WHERE user_id = 'YOUR_USER_ID';

-- Company images
SELECT id, name, logo_url, banner_url 
FROM companies 
WHERE user_id = 'YOUR_USER_ID';

-- School images
SELECT id, name, logo_url, banner_url 
FROM schools 
WHERE user_id = 'YOUR_USER_ID';

-- University images
SELECT id, name, logo_url, banner_url 
FROM universities 
WHERE user_id = 'YOUR_USER_ID';
```

**Expected:** URLs should start with `https://res.cloudinary.com/`

## Performance Testing

1. **Upload Speed:** Should complete in 2-5 seconds
2. **Image Loading:** Should load from CDN quickly
3. **Multiple Uploads:** Can handle concurrent uploads

## Security Testing

1. **Authentication:** Endpoints reject requests without valid JWT
2. **File Type:** Rejects non-image files
3. **File Size:** Rejects files > 5MB

## Cleanup After Testing

If you want to remove test images from Cloudinary:
1. Go to Cloudinary Media Library
2. Select test images
3. Click Delete

Or use Cloudinary API:
```javascript
cloudinary.api.delete_resources_by_prefix('ccs/student/profile/test_', 
  function(error, result) { console.log(result); });
```

---

**Testing Checklist:**

- [ ] Student profile image upload works
- [ ] Student banner image upload works
- [ ] College logo upload works
- [ ] College banner upload works
- [ ] Company logo upload works
- [ ] Company banner upload works
- [ ] School logo upload works
- [ ] School banner upload works
- [ ] University logo upload works
- [ ] University banner upload works
- [ ] Images appear in correct Cloudinary folders
- [ ] Old images are deleted when new ones uploaded
- [ ] File size validation works (5MB limit)
- [ ] File type validation works (JPEG/PNG/WebP only)
- [ ] Images display correctly on profile pages
- [ ] Images persist after page refresh
- [ ] URLs are saved correctly in database

---

**Last Updated:** January 23, 2026
