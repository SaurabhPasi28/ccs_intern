# Profile Pages UI Pattern Guide

## Overview
This document outlines the standardized UI pattern implemented across all profile pages (Student, Company, School, University, College). The pattern provides a professional display mode with edit functionality and consistent loading states.

## Key Principles

### 1. **Display Mode vs Edit Mode**
- **Display Mode**: Shows data in a clean, professional format with proper typography and spacing
- **Edit Mode**: Shows form inputs for editing data
- Toggle between modes using Edit button
- Cancel button reverts to original data

### 2. **Loading States**
- All save operations have loading indicators
- Buttons disabled during save to prevent duplicate submissions
- Spinner icon shows during save operations
- Image uploads show loading state

### 3. **Consistent Card Structure**
- All sections use `SectionCard` component
- Edit button in card header
- Professional data display when not editing
- Form inputs only visible during edit

## Implementation Pattern

### State Management

```jsx
// Data states
const [data, setData] = useState({});
const [originalData, setOriginalData] = useState({});

// UI states
const [editing, setEditing] = useState(false);
const [saving, setSaving] = useState(false);

// For image uploads
const [uploadingImage, setUploadingImage] = useState({ type1: false, type2: false });
```

### Edit/Save/Cancel Pattern

```jsx
// Start editing - save original data
const startEditing = () => {
    setOriginalData({...data});
    setEditing(true);
};

// Save with loading state
const saveData = async () => {
    if (saving) return; // Prevent duplicates
    setSaving(true);
    try {
        const res = await apiCall(url, "PUT", data);
        if (res.success) {
            setData(res.data);
            setOriginalData(res.data);
            setEditing(false);
            toast.success("Saved successfully");
        }
    } finally {
        setSaving(false);
    }
};

// Cancel - revert to original
const cancelEdit = () => {
    setData(originalData);
    setEditing(false);
};
```

### Display Mode Structure

```jsx
<SectionCard title="Section Name" onAdd={editing ? null : startEditing} addLabel="Edit">
    {editing ? (
        // EDIT MODE: Form
        <form onSubmit={(e) => { e.preventDefault(); saveData(); }}>
            {/* Form inputs */}
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={cancelEdit} disabled={saving}>
                    Cancel
                </button>
                <button type="submit" disabled={saving}>
                    {saving && <SpinnerIcon />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    ) : (
        // DISPLAY MODE: Professional layout
        <div className="space-y-6">
            {!hasData ? (
                <EmptyState message="Click Edit to add information" />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <InfoItem label="Field Name" value={data.field} />
                        {/* More fields */}
                    </div>
                    {data.description && (
                        <div className="pt-2 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{data.description}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )}
</SectionCard>
```

## Helper Components

### InfoItem Component
Displays individual field data in professional format:

```jsx
function InfoItem({ label, value, icon }) {
    if (!value) return null;
    
    return (
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {label}
            </p>
            <div className="flex items-center gap-2">
                {icon && <Icon />}
                <p className="text-sm text-gray-900 font-medium">{value}</p>
            </div>
        </div>
    );
}
```

### SocialLink Component
Displays social media links with icons:

```jsx
function SocialLink({ platform, url, icon }) {
    return (
        <a href={url} target="_blank" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group">
            <div className="shrink-0">{getIcon(icon)}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{platform}</p>
                <p className="text-xs text-gray-500 truncate">{url}</p>
            </div>
            <ExternalLinkIcon />
        </a>
    );
}
```

## Company Profile - Completed Example

### Features Implemented:
1. ✅ Company Information section with display/edit modes
2. ✅ Social Media Links section with display/edit modes
3. ✅ Loading states for all save operations
4. ✅ Image upload loading indicators
5. ✅ Cancel functionality that reverts data
6. ✅ Professional display with InfoItem components
7. ✅ Social links with platform icons
8. ✅ Empty states for missing data
9. ✅ Consistent SectionCard usage
10. ✅ QuickInfoCard for sidebar

### Data Display Format:
- **Grid Layout**: 2 columns on desktop, 1 on mobile
- **Field Labels**: Small, uppercase, gray text
- **Field Values**: Medium font, dark text, with icons where appropriate
- **Links**: Clickable with external link icon
- **Description**: Full-width below grid with border separator

## Applying to Other Profile Pages

### School Profile
Sections to update:
- School Information (name, type, board, location, contact)
- About section
- Facilities/Infrastructure
- Achievements
- Social Media Links

### University Profile
Sections to update:
- University Information (name, type, accreditation, location)
- About section
- Programs Offered
- Rankings/Accreditations
- Research Areas
- Social Media Links

### College Profile
Sections to update:
- College Information (name, affiliation, location)
- About section
- Departments/Courses
- Placements
- Infrastructure
- Social Media Links

## Step-by-Step Implementation

### 1. Add State Management
```jsx
const [editing, setEditing] = useState(false);
const [saving, setSaving] = useState(false);
const [originalData, setOriginalData] = useState({});
```

### 2. Update API Calls
```jsx
// Save original on load
useEffect(() => {
    fetchData().then(data => {
        setData(data);
        setOriginalData(data);
    });
}, []);
```

### 3. Create Edit/Save/Cancel Functions
```jsx
const startEditing = () => {
    setOriginalData({...data});
    setEditing(true);
};

const saveData = async () => {
    if (saving) return;
    setSaving(true);
    try {
        // API call
    } finally {
        setSaving(false);
    }
};

const cancelEdit = () => {
    setData(originalData);
    setEditing(false);
};
```

### 4. Create Display Components
```jsx
function InfoItem({ label, value }) { /* ... */ }
function SocialLink({ platform, url, icon }) { /* ... */ }
```

### 5. Update Section UI
- Replace form-only view with conditional display/edit
- Add InfoItem grid for display mode
- Add loading states to buttons
- Use EmptyState for missing data

## UI Specifications

### Colors
- Labels: `text-gray-500`
- Values: `text-gray-900`
- Backgrounds: `bg-gray-50` (hover states)
- Borders: `border-gray-200`
- Primary: `text-blue-600`, `bg-blue-600`

### Spacing
- Section cards: `space-y-6`
- Grid gaps: `gap-x-8 gap-y-4`
- Padding: `p-3` or `p-4`
- Margins: `mt-1.5`, `mb-2`

### Typography
- Section titles: Default (via SectionCard)
- Labels: `text-xs font-medium uppercase tracking-wide`
- Values: `text-sm font-medium`
- Descriptions: `text-sm text-gray-700 leading-relaxed`

## Benefits

1. **Better UX**: Clear distinction between viewing and editing
2. **Professional Look**: Data displayed in readable format, not form inputs
3. **Data Safety**: Cancel button prevents accidental changes
4. **Consistency**: All profile pages follow same pattern
5. **Performance**: Loading states prevent duplicate submissions
6. **Accessibility**: Clear labels and proper semantic HTML

## Testing Checklist

- [ ] Display mode shows all data correctly
- [ ] Edit button opens form with pre-filled data
- [ ] Save button shows loading state
- [ ] Save button disabled during save
- [ ] Cancel button reverts to original data
- [ ] Empty state shows when no data
- [ ] Links are clickable and open in new tab
- [ ] Image uploads show loading indicator
- [ ] Responsive layout works on mobile
- [ ] All sections use SectionCard component

## Next Steps

1. Apply pattern to School Profile
2. Apply pattern to University Profile
3. Apply pattern to College Profile
4. Test all pages thoroughly
5. Ensure consistent styling across all pages
6. Update any custom sections to follow pattern

---

**Pattern Status:**
- ✅ Student Profile - Complete
- ✅ Company Profile - Complete
- ⏳ School Profile - Pending
- ⏳ University Profile - Pending
- ⏳ College Profile - Pending
