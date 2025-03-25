import { z } from "zod";

export const personalInfoSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  summary: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  socials: z.object({
    linkedin: z.string().optional(),
    github: z.string().optional(),
  }),
});

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        name: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        position: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional().nullable(),
        description: z.string().optional(),
        description_text: z.string().optional(),
      }).refine((data) => {
        if (!data.startDate || !data.endDate) return true; // Allow empty dates
        return new Date(data.startDate) <= new Date(data.endDate);
      }, {
        message: "End date cannot be before the start date",
        path: ["endDate"],
      })
    )
    .optional(),
});

export const educationSchema = z.object({
  education: z
    .array(
      z.object({
        institution: z.string().min(2, "Institution name is too short"),
        area: z.string().min(2, "Field of study is required"),
        studyType: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional().nullable(),
        score: z.string().optional(),
        courses: z.string().optional(),
        description_text: z.string().optional(),
      }).refine((data) => {
        if (!data.startDate || !data.endDate) return true; // Allow empty dates
        return new Date(data.startDate) <= new Date(data.endDate);
      }, {
        message: "End date cannot be before the start date",
        path: ["endDate"],
      })
    )
    .optional(),
});

export const projectsSchema = z.object({
  projects: z
    .array(
      z.object({
        title: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional().nullable(),
        description: z.string().optional(),
        link: z.string().optional(),
        description_text: z.string().optional(),
      }).refine((data) => {
        if (!data.startDate || !data.endDate) return true; // Allow empty dates
        return new Date(data.startDate) <= new Date(data.endDate);
      }, {
        message: "End date cannot be before the start date",
        path: ["endDate"],
      })
    )
    .optional(),
});

export const skillsSchema = z.object({
  skills: z.object({
    description: z.string().optional(),
    description_text: z.string().optional(),
  }),
});

export const awardsSchema = z.object({
  awards: z.object({
    description: z.string().optional(),
    description_text: z.string().optional(),
  }),
});

export const volunteerSchema = z.object({
  volunteer: z.object({
    description: z.string().optional(),
    description_text: z.string().optional(),
  }),
});

export const languagesSchema = z.object({
  languages: z.object({
    description: z.string().optional(),
    description_text: z.string().optional(),
  }),
});

export const interestsSchema = z.object({
  interests: z.object({
    description: z.string().optional(),
    description_text: z.string().optional(),
  }),
});

export const referencesSchema = z.object({
  references: z.object({
    description: z.string().optional(),
    description_text: z.string().optional(),
  }),
});

export const coverLetterSchema = z.object({
  coverLetter: z.object({
    description: z.string().optional(),
    description_text: z.string().optional(),
  }),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Projects = z.infer<typeof projectsSchema>;
export type Awards = z.infer<typeof awardsSchema>;
export type Volunteer = z.infer<typeof volunteerSchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Languages = z.infer<typeof languagesSchema>;
export type Interests = z.infer<typeof interestsSchema>;
export type References = z.infer<typeof referencesSchema>;
export type CoverLetter = z.infer<typeof coverLetterSchema>;

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...projectsSchema.shape,
  ...awardsSchema.shape,
  ...volunteerSchema.shape,
  ...skillsSchema.shape,
  ...languagesSchema.shape,
  ...interestsSchema.shape,
  ...referencesSchema.shape,
});

export type ResumeValues = Partial<z.infer<typeof resumeSchema>> & {
  id?: string;
};
