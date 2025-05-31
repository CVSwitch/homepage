import { memo, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useResume } from "./forms/ResumeProvider";
import { Phone, Mail, Linkedin, Github } from "lucide-react";
import { formatDate } from "date-fns/format";
import useDimensions from "@/hooks/useDimensions";
import { ResumeValues } from "@/lib/validation";
import EditableText from "./components/EditableText";

interface TwoColumnColoredResumePreviewProps {
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

interface ResumeSectionProps {
  personalInfo?: ResumeValues["personalInfo"];
  workExperiences?: ResumeValues["workExperiences"];
  education?: ResumeValues["education"];
  projects?: ResumeValues["projects"];
  skills?: ResumeValues["skills"];
  languages?: ResumeValues["languages"];
  volunteer?: ResumeValues["volunteer"];
  interests?: ResumeValues["interests"];
  awards?: ResumeValues["awards"];
  references?: ResumeValues["references"];
}

interface GenericSectionProps {
  title: string;
  data?: { description?: string; description_text?: string };
  color?: string;
  onEdit: (value: string) => void;
}

export default function TwoColumnColoredResumePreview({ className, contentRef }: TwoColumnColoredResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);
  const { resumeData } = useResume();

  const filteredData = useMemo(
    () => ({
      workExperiences: resumeData?.workExperiences?.filter((exp) =>
        Object.values(exp).some(Boolean)
      ),
      education: resumeData?.education?.filter((edu) =>
        Object.values(edu).some(Boolean)
      ),
      projects: resumeData?.projects?.filter((project) =>
        Object.values(project).some(Boolean)
      ),
    }),
    [resumeData]
  );

  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297] shadow-lg",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("p-0", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        ref={contentRef}
      >
        {/* Main Grid Layout */}
        <div className="flex w-full h-full">
          {/* Left Column - Dark Background */}
          <div className="w-1/3 bg-zinc-800 text-white p-8">
            <div className="space-y-6 break-words">
              <PersonalInfoHeader personalInfo={resumeData?.personalInfo} />
              <EducationSection education={filteredData?.education} />
              <SkillsSection skills={resumeData?.skills} />
              <LanguagesSection languages={resumeData?.languages} />
            </div>
          </div>

          {/* Right Column - White Background */}
          <div className="w-2/3 p-8 space-y-6">
            <WorkExperienceSection workExperiences={filteredData?.workExperiences} />
            <ProjectsSection projects={filteredData?.projects} />
            <VolunteerSection volunteer={resumeData?.volunteer} />
            <InterestsSection interests={resumeData?.interests} />
            <AwardsSection awards={resumeData?.awards} />
            <ReferencesSection references={resumeData?.references} />
          </div>
        </div>
      </div>
    </div>
  );
}

const PersonalInfoHeader = memo(({ personalInfo }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  const { firstname, lastname, email, phone, socials, city, country, summary } = personalInfo || {};
  const { linkedin, github } = socials || {};

  const handleEdit = (field: string, value: string) => {
    if (field.startsWith('socials.')) {
      const socialField = field.split('.')[1];
      setResumeData({
        ...resumeData,
        personalInfo: {
          ...resumeData.personalInfo,
          socials: {
            linkedin: resumeData.personalInfo?.socials?.linkedin || "",
            github: resumeData.personalInfo?.socials?.github || "",
            [socialField]: value
          }
        }
      });
    } else {
      setResumeData({
        ...resumeData,
        personalInfo: {
          ...resumeData.personalInfo,
          socials: resumeData.personalInfo?.socials || { linkedin: "", github: "" },
          [field]: value
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold break-words">
          <EditableText
            value={firstname || ""}
            onEdit={(value) => handleEdit("firstname", value)}
            className="inline-block"
          />{" "}
          <EditableText
            value={lastname || ""}
            onEdit={(value) => handleEdit("lastname", value)}
            className="inline-block"
          />
        </h1>
        {(city || country) && (
          <p className="text-zinc-400 mt-1 break-words">
            <EditableText
              value={city || ""}
              onEdit={(value) => handleEdit("city", value)}
              className="inline-block"
            />
            {city && country ? ", " : ""}
            <EditableText
              value={country || ""}
              onEdit={(value) => handleEdit("country", value)}
              className="inline-block"
            />
          </p>
        )}
      </div>
      <div className="space-y-2 text-sm">
        {phone && (
          <p className="flex items-center gap-2 break-all">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <EditableText
              value={phone}
              onEdit={(value) => handleEdit("phone", value)}
              className="break-words inline-block"
            />
          </p>
        )}
        {email && (
          <p className="flex items-center gap-2 break-all">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <EditableText
              value={email}
              onEdit={(value) => handleEdit("email", value)}
              className="break-words inline-block"
            />
          </p>
        )}
        {linkedin && (
          <p className="flex items-center gap-2 break-all">
            <Linkedin className="w-4 h-4 flex-shrink-0" />
            <EditableText
              value={linkedin}
              onEdit={(value) => handleEdit("socials.linkedin", value)}
              className="break-words inline-block"
            />
          </p>
        )}
        {github && (
          <p className="flex items-center gap-2 break-all">
            <Github className="w-4 h-4 flex-shrink-0" />
            <EditableText
              value={github}
              onEdit={(value) => handleEdit("socials.github", value)}
              className="break-words inline-block"
            />
          </p>
        )}
      </div>
      {summary && (
        <div>
          <h2 className="text-xl font-semibold border-b border-zinc-600 pb-2 mb-2">
            Summary
          </h2>
          <EditableText
            value={summary}
            onEdit={(value) => handleEdit("summary", value)}
            className="text-sm text-zinc-300 whitespace-pre-line break-words"
          />
        </div>
      )}
    </div>
  );
});

const EducationSection = memo(({ education }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  if (!education?.length) return null;
  const handleEdit = (index: number, field: string, value: string) => {
    const newEducation = [...(resumeData.education || [])];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setResumeData({
      ...resumeData,
      education: newEducation
    });
  };
  return (
    <div>
      <h2 className="text-xl font-semibold border-b border-zinc-600 pb-2 mb-4">
        Education
      </h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="space-y-1">
            <EditableText
              value={edu.institution || ""}
              onEdit={(value) => handleEdit(index, "institution", value)}
              className="font-medium break-words"
            />
            <EditableText
              value={edu.studyType || ""}
              onEdit={(value) => handleEdit(index, "studyType", value)}
              className="text-sm text-zinc-300 break-words"
            />
            <EditableText
              value={edu.area || ""}
              onEdit={(value) => handleEdit(index, "area", value)}
              className="text-sm text-zinc-300 break-words"
            />
            {edu.startDate && (
              <p className="text-sm text-zinc-400 break-words">
                {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
              </p>
            )}
            {edu.score && (
              <EditableText
                value={edu.score}
                onEdit={(value) => handleEdit(index, "score", value)}
                className="text-sm text-zinc-400 break-words"
              />
            )}
            {edu.courses && (
              <EditableText
                value={edu.courses}
                onEdit={(value) => handleEdit(index, "courses", value)}
                className="text-sm text-zinc-300 break-words"
                isRichText
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const WorkExperienceSection = memo(({ workExperiences }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  if (!workExperiences?.length) return null;
  const handleEdit = (index: number, field: string, value: string) => {
    const newExperiences = [...(resumeData.workExperiences || [])];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    setResumeData({
      ...resumeData,
      workExperiences: newExperiences
    });
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold text-zinc-800 mb-4 break-words">
        Work Experience
      </h2>
      <div className="space-y-6">
        {workExperiences.map((exp, index) => (
          <div key={index} className="space-y-2">
            <EditableText
              value={exp.name || ""}
              onEdit={(value) => handleEdit(index, "name", value)}
              className="font-semibold text-zinc-800 break-words"
            />
            <EditableText
              value={exp.position || ""}
              onEdit={(value) => handleEdit(index, "position", value)}
              className="text-zinc-600 break-words"
            />
            {exp.startDate && (
              <p className="text-sm text-zinc-500 break-words">
                {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
              </p>
            )}
            {(exp.city || exp.country) && (
              <p className="text-sm text-zinc-600 break-words">
                <EditableText
                  value={exp.city || ""}
                  onEdit={(value) => handleEdit(index, "city", value)}
                  className="inline-block"
                />
                {exp.city && exp.country ? ", " : ""}
                <EditableText
                  value={exp.country || ""}
                  onEdit={(value) => handleEdit(index, "country", value)}
                  className="inline-block"
                />
              </p>
            )}
            {exp.description && (
              <EditableText
                value={exp.description}
                onEdit={(value) => handleEdit(index, "description", value)}
                className="text-sm text-zinc-600 break-words"
                isRichText
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const ProjectsSection = memo(({ projects }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  if (!projects?.length) return null;
  const handleEdit = (index: number, field: string, value: string) => {
    const newProjects = [...(resumeData.projects || [])];
    newProjects[index] = {
      ...newProjects[index],
      [field]: value
    };
    setResumeData({
      ...resumeData,
      projects: newProjects
    });
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold text-zinc-800 mb-4 break-words">Projects</h2>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="space-y-2">
            <EditableText
              value={project.title || ""}
              onEdit={(value) => handleEdit(index, "title", value)}
              className="font-semibold text-zinc-800 break-words w-full"
            />
            {project.startDate && (
              <p className="text-sm text-zinc-500 break-words">
                {formatDate(project.startDate, "MM/yyyy")} -{" "}
                {project.endDate
                  ? formatDate(project.endDate, "MM/yyyy")
                  : "Present"}
              </p>
            )}
            {project.link && (
              <EditableText
                value={project.link}
                onEdit={(value) => handleEdit(index, "link", value)}
                className="text-sm text-blue-600 hover:underline break-all inline-block max-w-full"
              />
            )}
            {project.description && (
              <EditableText
                value={project.description}
                onEdit={(value) => handleEdit(index, "description", value)}
                className="text-sm text-zinc-600 break-words"
                isRichText
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

const SkillsSection = memo(({ skills }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  const handleEdit = (value: string) => {
    setResumeData({
      ...resumeData,
      skills: {
        description: value,
        description_text: value
      }
    });
  };
  return <GenericSection title="Skills" data={skills} onEdit={handleEdit} color="text-zinc-300" />;
});

const LanguagesSection = memo(({ languages }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  const handleEdit = (value: string) => {
    setResumeData({
      ...resumeData,
      languages: {
        description: value,
        description_text: value
      }
    });
  };
  return <GenericSection title="Languages" data={languages} onEdit={handleEdit} color="text-zinc-300" />;
});

const VolunteerSection = memo(({ volunteer }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  const handleEdit = (value: string) => {
    setResumeData({
      ...resumeData,
      volunteer: {
        description: value,
        description_text: value
      }
    });
  };
  return <GenericSection title="Volunteer Experience" data={volunteer} onEdit={handleEdit} color="text-zinc-600" />;
});

const InterestsSection = memo(({ interests }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  const handleEdit = (value: string) => {
    setResumeData({
      ...resumeData,
      interests: {
        description: value,
        description_text: value
      }
    });
  };
  return <GenericSection title="Interests" data={interests} onEdit={handleEdit} color="text-zinc-600" />;
});

const AwardsSection = memo(({ awards }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  const handleEdit = (value: string) => {
    setResumeData({
      ...resumeData,
      awards: {
        description: value,
        description_text: value
      }
    });
  };
  return <GenericSection title="Awards" data={awards} onEdit={handleEdit} color="text-zinc-600" />;
});

const ReferencesSection = memo(({ references }: ResumeSectionProps) => {
  const { resumeData, setResumeData } = useResume();
  const handleEdit = (value: string) => {
    setResumeData({
      ...resumeData,
      references: {
        description: value,
        description_text: value
      }
    });
  };
  return <GenericSection title="References" data={references} onEdit={handleEdit} color="text-zinc-600" />;
});

const GenericSection = memo(({ title, data, onEdit, color }: GenericSectionProps) => {
  if (!data?.description) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold border-b border-zinc-600 pb-2 mb-2">
        {title}
      </h2>
      <EditableText
        value={data.description}
        onEdit={onEdit}
        className={cn("text-sm break-words", color || "text-zinc-300")}
      />
    </div>
  );
});

PersonalInfoHeader.displayName = "PersonalInfoHeader";
EducationSection.displayName = "EducationSection";
WorkExperienceSection.displayName = "WorkExperienceSection";
ProjectsSection.displayName = "ProjectsSection";
SkillsSection.displayName = "SkillsSection";
LanguagesSection.displayName = "LanguagesSection";
VolunteerSection.displayName = "VolunteerSection";
InterestsSection.displayName = "InterestsSection";
AwardsSection.displayName = "AwardsSection";
ReferencesSection.displayName = "ReferencesSection";
GenericSection.displayName = "GenericSection"; 