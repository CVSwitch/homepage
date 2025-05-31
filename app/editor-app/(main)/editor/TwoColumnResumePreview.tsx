import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { memo, useMemo, useRef } from "react";
import { useResume } from "./forms/ResumeProvider";
import { Phone, Mail, Linkedin, Github } from "lucide-react";
import { formatDate } from "date-fns/format";
import { ResumeValues } from "@/lib/validation";
import EditableText from "./components/EditableText";

interface TwoColumnResumePreviewProps {
  className?: string;
  contentRef?: React.Ref<HTMLDivElement>;
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
  onEdit?: (value: string) => void;
}

export default function TwoColumnResumePreview({ className, contentRef }: TwoColumnResumePreviewProps) {
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
        className={cn("p-6", !width && "invisible")}
        style={{ zoom: (1 / 794) * width }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* Main Grid Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6 break-words">
            <PersonalInfoHeader personalInfo={resumeData?.personalInfo} />
            <SkillsSection skills={resumeData?.skills} />
            <LanguagesSection languages={resumeData?.languages} />
            <VolunteerSection volunteer={resumeData?.volunteer} />
            <InterestsSection interests={resumeData?.interests} />
            <AwardsSection awards={resumeData?.awards} />
            <ReferencesSection references={resumeData?.references} />
          </div>

          {/* Right Column */}
          <div className="space-y-6 break-words">
            <WorkExperienceSection workExperiences={filteredData?.workExperiences} />
            <EducationSection education={filteredData?.education} />
            <ProjectsSection projects={filteredData?.projects} />
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
    <div className="w-full break-words">
      <h1 className="text-3xl font-bold mb-2 break-words">
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
      <div className="space-y-2 text-sm">
        {(city || country) && (
          <p className="text-gray-600 break-words">
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
        <div className="space-y-1">
          {phone && (
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <EditableText
                value={phone}
                onEdit={(value) => handleEdit("phone", value)}
                className="break-all inline-block"
              />
            </p>
          )}
          {email && (
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <EditableText
                value={email}
                onEdit={(value) => handleEdit("email", value)}
                className="break-all inline-block"
              />
            </p>
          )}
          {linkedin && (
            <p className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 flex-shrink-0" />
              <EditableText
                value={linkedin}
                onEdit={(value) => handleEdit("socials.linkedin", value)}
                className="break-all inline-block"
              />
            </p>
          )}
          {github && (
            <p className="flex items-center gap-2">
              <Github className="w-4 h-4 flex-shrink-0" />
              <EditableText
                value={github}
                onEdit={(value) => handleEdit("socials.github", value)}
                className="break-all inline-block"
              />
            </p>
          )}
        </div>
      </div>
      {summary && (
        <div className="mt-4">
          <div className="w-full text-left space-y-1 break-inside-avoid">
            <p className="text-lg font-semibold break-words">Summary</p>
            <hr className="border-black border-1" />
            <EditableText
              value={summary}
              onEdit={(value) => handleEdit("summary", value)}
              className="whitespace-pre-line text-sm"
            />
          </div>
        </div>
      )}
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
    <div className="w-full">
      <p className="text-lg font-semibold break-words">Work Experience</p>
      <hr className="border-black border-1 mb-2" />
      {workExperiences.map((exp, index) => (
        <div key={index} className="break-inside-avoid mb-4">
          <div className="flex flex-col gap-1">
            <EditableText
              value={exp.name || ""}
              onEdit={(value) => handleEdit(index, "name", value)}
              className="text-md font-bold mt-1 break-words"
            />
            <EditableText
              value={exp.position || ""}
              onEdit={(value) => handleEdit(index, "position", value)}
              className="text-sm italic break-words"
            />
            {(exp.city || exp.country) && (
              <p className="text-sm italic text-right break-words">
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
            {exp.startDate && (
              <span className="text-sm text-gray-600 break-words">
                {formatDate(exp.startDate, "MM/yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
              </span>
            )}
            {exp.description && (
              <EditableText
                value={exp.description}
                onEdit={(value) => handleEdit(index, "description", value)}
                className="mt-2 text-sm break-words"
              />
            )}
          </div>
        </div>
      ))}
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
    <div className="w-full break-inside-avoid">
      <p className="text-lg font-semibold break-words">Education</p>
      <hr className="border-black border-1 mb-2" />
      {education.map((edu, index) => (
        <div key={index} className="space-y-2 mb-4">
          <EditableText
            value={edu.institution || ""}
            onEdit={(value) => handleEdit(index, "institution", value)}
            className="text-md font-bold break-words"
          />
          <EditableText
            value={edu.studyType || ""}
            onEdit={(value) => handleEdit(index, "studyType", value)}
            className="text-sm italic break-words"
          />
          <EditableText
            value={edu.area || ""}
            onEdit={(value) => handleEdit(index, "area", value)}
            className="text-sm italic break-words"
          />
          {edu.startDate && (
            <span className="text-sm text-gray-600 break-words">
              {formatDate(edu.startDate, "MM/yyyy")} - {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
            </span>
          )}
          {edu.score && (
            <EditableText
              value={edu.score}
              onEdit={(value) => handleEdit(index, "score", value)}
              className="text-sm break-words"
            />
          )}
          {edu.courses && (
            <EditableText
              value={edu.courses}
              onEdit={(value) => handleEdit(index, "courses", value)}
              className="mt-2 text-sm break-words"
              isRichText
            />
          )}
        </div>
      ))}
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
    <div className="w-full">
      <p className="text-lg font-semibold break-words">Projects</p>
      <hr className="border-black border-1 mb-2" />
      {projects.map((project, index) => (
        <div key={index} className="break-inside-avoid space-y-2 mb-4">
          <EditableText
            value={project.title || ""}
            onEdit={(value) => handleEdit(index, "title", value)}
            className="text-md font-bold break-words"
          />
          {project.startDate && (
            <span className="text-sm text-gray-600 break-words">
              {formatDate(project.startDate, "MM/yyyy")} - {project.endDate ? formatDate(project.endDate, "MM/yyyy") : "Present"}
            </span>
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
              className="mt-2 text-sm break-words"
            />
          )}
        </div>
      ))}
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
  return <GenericSection title="Skills" data={skills} onEdit={handleEdit} />;
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
  return <GenericSection title="Languages" data={languages} onEdit={handleEdit} />;
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
  return <GenericSection title="Volunteer Experience" data={volunteer} onEdit={handleEdit} />;
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
  return <GenericSection title="Interests" data={interests} onEdit={handleEdit} />;
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
  return <GenericSection title="Awards" data={awards} onEdit={handleEdit} />;
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
  return <GenericSection title="References" data={references} onEdit={handleEdit} />;
});

const GenericSection = memo(({ title, data, onEdit }: GenericSectionProps) => {
  if (!data || !data.description) return null;
  const handleEdit = onEdit || (() => { });
  return (
    <div className="w-full">
      <p className="text-lg font-semibold break-words">{title}</p>
      <hr className="border-black border-1 mb-2" />
      {data.description && (
        <div className="mt-2 text-sm break-words">
          <EditableText
            value={data.description}
            onEdit={handleEdit}
            className="inline-block"
          />
        </div>
      )}
    </div>
  );
});

PersonalInfoHeader.displayName = "PersonalInfoHeader";
WorkExperienceSection.displayName = "WorkExperienceSection";
EducationSection.displayName = "EducationSection";
ProjectsSection.displayName = "ProjectsSection";
SkillsSection.displayName = "SkillsSection";
LanguagesSection.displayName = "LanguagesSection";
VolunteerSection.displayName = "VolunteerSection";
InterestsSection.displayName = "InterestsSection";
AwardsSection.displayName = "AwardsSection";
ReferencesSection.displayName = "ReferencesSection";
GenericSection.displayName = "GenericSection"; 