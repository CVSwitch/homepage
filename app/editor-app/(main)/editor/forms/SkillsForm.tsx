"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown, ChevronRight, Settings, Check, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { useResume } from "./ResumeProvider";
import RichTextEditor from "@/components/RichTextEditor";
import { Skills, skillsSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { extractText } from "@/lib/extractText";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

interface TailoredData {
  skills?: {
    description: string;
    description_text: string;
  };
}

export default function SkillsForm() {
  const { resumeData, setResumeData } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [tailoredSuggestion, setTailoredSuggestion] = useState<string | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isTailored = searchParams.get('tailored') === 'true';
  const tailoredResumeId = searchParams.get('tailored_resume_id');

  const form = useForm<Skills>({
    resolver: zodResolver(skillsSchema),
    mode: "onChange",
    defaultValues: {
      skills: resumeData.skills,
    },
  });

  const updateSkills = debounce((description) => {
    const description_text = extractText(description);
    setResumeData((prev) => ({
      ...prev,
      skills: { description, description_text },
    }));
  }, 300);

  const watchedDescription = useWatch({
    control: form.control,
    name: "skills.description",
  });

  useEffect(() => {
    updateSkills(watchedDescription);
    return () => updateSkills.cancel();
  }, [watchedDescription]);

  // Fetch tailored data when component mounts if this is a tailored resume
  useEffect(() => {
    const fetchTailoredData = async () => {
      console.log('SkillsForm Debug:', {
        isTailored,
        tailoredResumeId,
        userId: user?.uid,
        searchParams: Object.fromEntries(searchParams.entries())
      });

      if (isTailored && tailoredResumeId && user?.uid) {
        try {
          // First try to get data from session storage
          const storedTailoredData = sessionStorage.getItem('tailoredResumeData');

          if (storedTailoredData) {
            console.log('Using tailored data from session storage');
            const tailoredData: TailoredData = JSON.parse(storedTailoredData);

            if (tailoredData.skills) {
              const tailoredSkills = tailoredData.skills.description;
              const currentSkills = resumeData.skills?.description || "";

              console.log('Skills comparison:', {
                tailoredSkills,
                currentSkills,
                isDifferent: tailoredSkills !== currentSkills
              });

              // Only show suggestion if it's different from current content
              if (tailoredSkills !== currentSkills) {
                setTailoredSuggestion(tailoredSkills);
                setShowSuggestion(true);
                console.log('Showing tailored suggestion for skills');
              } else {
                console.log('Skills are the same, not showing suggestion');
              }
            } else {
              console.log('No skills data in tailored response');
            }
          } else {
            // Fallback to API call if session storage is empty
            console.log('Fetching tailored skills data from API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_RESUME_DATA}?user_id=${user.uid}&resume_id=${tailoredResumeId}`);

            const response = await axios.get<{
              data: {
                parsed_json: TailoredData;
              };
            }>(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_RESUME_DATA}?user_id=${user.uid}&resume_id=${tailoredResumeId}`
            );

            console.log('Tailored skills response:', response.data);

            if (response.data.data.parsed_json.skills) {
              const tailoredSkills = response.data.data.parsed_json.skills.description;
              const currentSkills = resumeData.skills?.description || "";

              console.log('Skills comparison:', {
                tailoredSkills,
                currentSkills,
                isDifferent: tailoredSkills !== currentSkills
              });

              // Only show suggestion if it's different from current content
              if (tailoredSkills !== currentSkills) {
                setTailoredSuggestion(tailoredSkills);
                setShowSuggestion(true);
                console.log('Showing tailored suggestion for skills');
              } else {
                console.log('Skills are the same, not showing suggestion');
              }
            } else {
              console.log('No skills data in tailored response');
            }
          }
        } catch (error) {
          console.error('Error fetching tailored skills data:', error);
        }
      } else {
        console.log('Skipping tailored skills fetch - conditions not met');
      }
    };

    fetchTailoredData();
  }, [isTailored, tailoredResumeId, user?.uid, resumeData.skills?.description]);

  const handleAcceptSuggestion = () => {
    if (tailoredSuggestion) {
      form.setValue("skills.description", tailoredSuggestion);
      setShowSuggestion(false);
      setTailoredSuggestion(null);
    }
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setTailoredSuggestion(null);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-md">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span className="text-xl">Skills</span>
            {showSuggestion && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Tailored Suggestion Available
              </span>
            )}
          </div>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </CardTitle>
        <CardDescription>
          Highlight your key technical and soft skills.
        </CardDescription>
      </CardHeader>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[1500px] opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
      >
        <CardContent>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="skills.description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={(json) =>
                          form.setValue("skills.description", json)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Tailored Suggestion Section */}
              {showSuggestion && tailoredSuggestion && (
                <div className="mt-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-900">
                      🤖 AI Tailored Suggestion
                    </h4>
                  </div>

                  <div className="mb-3">
                    <div
                      className="text-blue-800 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: tailoredSuggestion }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAcceptSuggestion}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      type="button"
                      onClick={handleRejectSuggestion}
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}
