import { NextResponse } from "next/server";

export async function GET() {
  const mockResumeData = {
    personalInfo: {
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@example.com",
      phone: "+1234567890",
      summary: "Experienced software engineer with expertise in web development.",
      city: "New York",
      country: "USA",
      socials: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe"
      }
    },
    workExperiences: [
      {
        name: "Tech Company",
        city: "San Francisco",
        country: "USA",
        position: "Software Engineer",
        startDate: "2020-06-01",
        endDate: "2023-03-15",
        description: "Developed web applications using React and Node.js.",
        description_text: "Led a team of developers in building scalable applications."
      }
    ],
    education: [
      {
        institution: "MIT",
        area: "Computer Science",
        studyType: "Bachelor's Degree",
        startDate: "2016-09-01",
        endDate: "2020-05-30",
        score: "3.8 GPA",
        courses: "<ul class=\"list-disc ml-3\"><li><p>Dat<em><u>a Struct</u></em>ures, <strong>Algorithms, AI</strong></p></li></ul>",
        description_text: "Graduated with honors."
      },
      {
        institution: "MIT",
        area: "Computer Science",
        studyType: "Bachelor's Degree",
        startDate: "2016-09-01",
        endDate: undefined,
        score: "3.8 GPA",
        courses: "<ul class=\"list-disc ml-3\"><li><p>Dat<em><u>a Struct</u></em>ures, <strong>Algorithms, AI</strong></p></li></ul>",
        description_text: "Graduated with honors."
      }
    ],
    projects: [
      {
        title: "E-commerce Website",
        startDate: "2022-01-01",
        endDate: "2022-12-01",
        description: "Developed a full-stack e-commerce website.",
        link: "https://myecommerce.com",
        description_text: "Implemented secure payment gateways and optimized for performance."
      }
    ],
    skills: {
      description: "React, Node.js, TypeScript, Python",
      description_text: "Expert in modern web development frameworks."
    },
    awards: {
      description: "Best Developer Award 2022",
      description_text: "Recognized for outstanding contributions to the tech community."
    },
    volunteer: {
      description: "Coding Mentor",
      description_text: "Mentored students in web development."
    },
    languages: {
      description: "English, Spanish",
      description_text: "Fluent in English and intermediate in Spanish."
    },
    interests: {
      description: "Machine Learning, Open Source",
      description_text: "Passionate about AI and contributing to open-source projects."
    },
    references: {
      description: "Available upon request",
      description_text: ""
    }
  };

  return NextResponse.json(mockResumeData);
}
