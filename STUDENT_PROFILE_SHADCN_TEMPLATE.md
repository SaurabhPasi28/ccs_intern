# Student Profile - Shadcn UI Implementation Guide

## Overview
This document outlines the modular, reusable component structure for profile pages using only Shadcn UI components.

## Reusable Components Created

### 1. **SectionCard** (`customreuse/SectionCard.jsx`)
- Used for all major sections (About, Experience, Education, Skills, Certifications)
- Props: `title`, `onAction`, `actionType` ("add" | "edit"), `children`, `showAction`
- Uses: Card, CardHeader, CardContent, Button, Separator from Shadcn UI
- Icons: Edit (for edit actions), Plus (for add actions) from lucide-react

### 2. **ItemCard** (`customreuse/ItemCard.jsx`)
- Displays individual items (experience, education, certification entries)
- Props: `icon`, `title`, `subtitle`, `period`, `description`, `link`, `onDelete`, `isDeleting`
- Uses: Button from Shadcn UI
- Icons: Trash2, ExternalLink from lucide-react
- Consistent styling with `bg-muted/30`, `border-border`

### 3. **FormContainer** (`customreuse/FormContainer.jsx`)
- Wraps all form inputs with consistent styling
- Props: `onSubmit`, `children`, `onCancel`, `isSubmitting`, `submitText`
- Auto-handles Cancel/Save buttons with loading states
- Uses: Button from Shadcn UI
- Icons: Loader2 from lucide-react

### 4. **SkillBadge** (`customreuse/SkillBadge.jsx`)
- Displays skill tags with delete functionality
- Props: `skill`, `onDelete`, `isDeleting`
- Uses: Badge, Button from Shadcn UI
- Icons: X from lucide-react

### 5. **ProfileHeader** (`customreuse/ProfileHeader.jsx`)
- Handles banner, profile image, and basic info
- Uses children pattern for flexible content injection
- Already implemented with Shadcn-compatible styling

## Student Profile Structure

```jsx
import { 
    Briefcase, GraduationCap, Award, MapPin, Phone, Globe, Link 
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { 
    ProfileHeader, SectionCard, FormContainer, ItemCard, EmptyState, SkillBadge 
} from "../customreuse";
```

## Section Examples

### About Section
```jsx
<SectionCard 
    title="About" 
    onAction={() => setEditingAbout(!editingAbout)} 
    actionType="edit"
>
    {editingAbout ? (
        <FormContainer 
            onSubmit={updateProfile} 
            onCancel={() => setEditingAbout(false)}
            isSubmitting={savingProfile}
        >
            <div>
                <Label htmlFor="bio">About</Label>
                <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Write about yourself..."
                    rows={6}
                />
            </div>
        </FormContainer>
    ) : (
        <p className="text-muted-foreground whitespace-pre-wrap">
            {profile.bio || "Add information about yourself..."}
        </p>
    )}
</SectionCard>
```

### Experience Section
```jsx
<SectionCard 
    title="Experience" 
    onAction={() => setShowExperienceForm(!showExperienceForm)} 
    actionType="add"
>
    {showExperienceForm && (
        <FormContainer 
            onSubmit={addExperience} 
            onCancel={() => setShowExperienceForm(false)}
            isSubmitting={savingExperience}
        >
            <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" required {...} />
            </div>
            <div>
                <Label htmlFor="company">Company *</Label>
                <Input id="company" required {...} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input id="start_date" type="date" {...} />
                </div>
                <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input id="end_date" type="date" {...} />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <input type="checkbox" {...} />
                <Label>I currently work here</Label>
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} {...} />
            </div>
        </FormContainer>
    )}

    {experience.length === 0 ? (
        <EmptyState message="No experience added yet" />
    ) : (
        <div className="space-y-3">
            {experience.map((exp) => (
                <ItemCard
                    key={exp.id}
                    icon={<Briefcase className="h-5 w-5" />}
                    title={exp.title}
                    subtitle={exp.company}
                    period={`${exp.start_date} - ${exp.is_current ? "Present" : exp.end_date}`}
                    description={exp.description}
                    onDelete={() => deleteExperience(exp.id)}
                    isDeleting={deletingItem === `exp-${exp.id}`}
                />
            ))}
        </div>
    )}
</SectionCard>
```

### Education Section
```jsx
<SectionCard 
    title="Education" 
    onAction={() => setShowEducationForm(!showEducationForm)} 
    actionType="add"
>
    {/* Similar structure to Experience */}
    {/* Use GraduationCap icon */}
    {/* Use Select for degree dropdown */}
</SectionCard>
```

### Skills Section
```jsx
<SectionCard 
    title="Skills" 
    onAction={() => setShowSkillForm(!showSkillForm)} 
    actionType="add"
>
    {showSkillForm && (
        <FormContainer {...}>
            <div>
                <Label htmlFor="skill">Skill</Label>
                <Select value={skillForm.skill_name} onValueChange={...}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select skill" />
                    </SelectTrigger>
                    <SelectContent>
                        {SKILL_OPTIONS.map((skill) => (
                            <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </FormContainer>
    )}

    {skills.length === 0 ? (
        <EmptyState message="No skills added yet" />
    ) : (
        <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <SkillBadge
                    key={skill.id}
                    skill={skill.skill_name}
                    onDelete={() => deleteSkill(skill.id)}
                    isDeleting={deletingItem === `skill-${skill.id}`}
                />
            ))}
        </div>
    )}
</SectionCard>
```

### Certifications Section
```jsx
<SectionCard 
    title="Licenses & Certifications" 
    onAction={() => setShowCertificationForm(!showCertificationForm)} 
    actionType="add"
>
    {/* Similar to Experience/Education */}
    {/* Use Award icon */}
    {/* Include credential_id and credential_url fields */}
</SectionCard>
```

### Sidebar Cards
```jsx
<div className="space-y-6">
    {/* Profile Language Card */}
    <SectionCard 
        title="Profile language" 
        onAction={() => {}} 
        actionType="edit"
        showAction={true}
    >
        <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>English</span>
        </div>
    </SectionCard>

    {/* Public Profile URL Card */}
    <SectionCard 
        title="Public profile & URL" 
        onAction={() => {}} 
        actionType="edit"
        showAction={true}
    >
        <div className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground break-all">
                www.ccs.com/in/{displayName.toLowerCase().replace(/\s+/g, '-')}
            </span>
        </div>
    </SectionCard>
</div>
```

## Color Scheme
- All components use Shadcn UI's default theme variables
- Professional, consistent colors via CSS variables:
  - `bg-background` - main background
  - `bg-muted/30` - form backgrounds
  - `border-border` - all borders
  - `text-foreground` - primary text
  - `text-muted-foreground` - secondary text
  - `text-destructive` - delete actions
  - `bg-primary/10` - icon backgrounds

## Form Fields Pattern
```jsx
<div>
    <Label htmlFor="fieldname">Field Label</Label>
    <Input
        id="fieldname"
        value={formState.fieldname}
        onChange={(e) => setFormState({...formState, fieldname: e.target.value})}
        placeholder="Enter..."
    />
</div>
```

## Select Pattern
```jsx
<div>
    <Label htmlFor="selectfield">Select Label</Label>
    <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
            <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
            {OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
        </SelectContent>
    </Select>
</div>
```

## Benefits of This Structure
1. **Modular** - All components are reusable across different profile pages
2. **Consistent** - Same UI patterns throughout
3. **Professional** - Clean Shadcn UI styling
4. **Type-safe** - Can easily add TypeScript
5. **Maintainable** - Changes in one component affect all pages
6. **Scalable** - Easy to add new profile types (company, college, school, etc.)

## Next Steps
1. Replace all Material-UI imports with Shadcn UI
2. Use SectionCard for all major sections
3. Use ItemCard for all list items
4. Use FormContainer for all forms
5. Use SkillBadge for skills
6. Maintain consistent color scheme
7. Keep icons from lucide-react only
