# Project Structure

homepage
├── app
│   ├── api
│   │   └── mockResume
│   │       └── route.ts
│   ├── cover-letter
│   │   └── page.tsx
│   ├── editor-app
│   │   ├── (main)
│   │   │   ├── editor
│   │   │   │   ├── forms
│   │   │   │   │   ├── AwardsForm.tsx
│   │   │   │   │   ├── CoverLetterForm.tsx
│   │   │   │   │   ├── CoverLetterProvider.tsx
│   │   │   │   │   ├── EducationForm.tsx
│   │   │   │   │   ├── InterestForm.tsx
│   │   │   │   │   ├── LanguagesForm.tsx
│   │   │   │   │   ├── PersonalInfoForm.tsx
│   │   │   │   │   ├── ProjectsForm.tsx
│   │   │   │   │   ├── ReferenceForm.tsx
│   │   │   │   │   ├── ResumeProvider.tsx
│   │   │   │   │   ├── SkillsForm.tsx
│   │   │   │   │   ├── VolunteerForm.tsx
│   │   │   │   │   └── WorkExperienceForm.tsx
│   │   │   │   ├── CoverLetterEditor.tsx
│   │   │   │   ├── CoverLetterPreview.tsx
│   │   │   │   ├── CoverLetterSection.tsx
│   │   │   │   ├── JobTailoringDialog.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── ResumeEditor.tsx
│   │   │   │   ├── ResumePreview.tsx
│   │   │   │   ├── ResumePreviewSection.tsx
│   │   │   │   ├── SingleColumnColored.tsx
│   │   │   │   ├── TemplateDrawer.tsx
│   │   │   │   ├── TwoColumnColoredResumePreview.tsx
│   │   │   │   └── TwoColumnResumePreview.tsx
│   │   │   └── import
│   │   │       └── page.tsx
│   │   └── api
│   │       └── mockResume
│   │           └── route.ts
│   ├── home
│   │   └── page.tsx
│   ├── interview-prep
│   │   └── page.tsx
│   ├── linkedin-optimizer
│   │   └── page.tsx
│   ├── resume-optimizer
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── cover-letter
│   │   └── CoverLetterSection.tsx
│   ├── interview
│   │   ├── FeedbackSummary.tsx
│   │   ├── InterviewChat.tsx
│   │   ├── InterviewPrepSection.tsx
│   │   ├── InterviewTypeSelector.tsx
│   │   ├── JobDescriptionButton.tsx
│   │   ├── JobDescriptionModal.tsx
│   │   ├── PracticeMode.tsx
│   │   ├── ResumeUploadButton.tsx
│   │   └── Timer.tsx
│   ├── linkedin
│   │   └── LinkedInSection.tsx
│   ├── resume-optimizer
│   │   └── ResumeSection.tsx
│   ├── ui
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── Datepicker.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── HeroSection.tsx
│   ├── OnboardingScreen.tsx
│   ├── ProfileDropdown.tsx
│   ├── QuickActions.tsx
│   ├── RichTextEditor.tsx
│   ├── Sidebar.tsx
│   ├── StatsGrid.tsx
│   └── TextEditorMenu.tsx
├── config
│   └── api.ts
├── hooks
│   ├── useAuth.ts
│   ├── useCoverLetters.ts
│   ├── useDimensions.ts
│   └── useResumes.ts
├── images
│   └── google-logo.svg
├── lib
│   ├── extractText.ts
│   ├── firebase.ts
│   ├── types.ts
│   ├── utils.ts
│   └── validation.ts
├── public
│   ├── images
│   │   └── google-logo.svg
│   ├── mascot
│   │   ├── 4afe73ba-1fff-4451-9fe6-01ecd45cfac1.webp
│   │   ├── 84830214-fef3-4cd2-83ed-ae4b57700dcc.webp
│   │   ├── 8f03eded-c5b9-450c-9583-27ddc7041f29.webp
│   │   ├── login.png
│   │   ├── main.png
│   │   └── mascot.webp
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── services
│   ├── coverLetterService.ts
│   ├── pdfParserService.ts
│   └── resumeService.ts
├── types
│   ├── html2pdf.d.ts
│   └── resume.ts
├── .env.local
├── .gitignore
├── ab.html
├── components.json
├── eslint.config.mjs
├── Flow.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
