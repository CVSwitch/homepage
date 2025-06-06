import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { workExperienceSchema, WorkExperience } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, ChevronDown, ChevronRight, Trash2, Check, X } from "lucide-react";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import {
  Resolver,
  useFieldArray,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import RichTextEditor from "@/components/RichTextEditor";
import { DatePicker } from "@/components/ui/Datepicker";
import { Checkbox } from "@/components/ui/checkbox";
import { useResume } from "./ResumeProvider";
import { debounce } from "lodash";
import { extractText } from "@/lib/extractText";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

type WorkExperienceFormValues = {
  workExperiences: WorkExperience["workExperiences"];
};

interface TailoredWorkExperience {
  name: string;
  city: string;
  country: string;
  position: string;
  startDate?: string | null;
  endDate?: string | null;
  description: string;
  description_text: string;
}

interface TailoredData {
  workExperiences?: TailoredWorkExperience[];
}

export default function WorkExperienceForm() {
  const { resumeData, setResumeData } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [tailoredSuggestions, setTailoredSuggestions] = useState<TailoredWorkExperience[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean[]>([]);
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const isTailored = searchParams.get('tailored') === 'true';
  const tailoredResumeId = searchParams.get('tailored_resume_id');

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(
      workExperienceSchema
    ) as Resolver<WorkExperienceFormValues>,
    mode: "onChange",
    defaultValues: {
      workExperiences: resumeData.workExperiences,
    },
  });

  const resumeDataRef = useRef(resumeData);

  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  useEffect(() => {
    const updateResumeData = debounce((values: WorkExperienceFormValues) => {
      resumeDataRef.current = {
        ...resumeDataRef.current,
        workExperiences: values.workExperiences || [],
      };

      setResumeData(resumeDataRef.current);
    }, 300);

    const subscription = form.watch((data) =>
      updateResumeData(data as WorkExperienceFormValues)
    );

    return () => {
      subscription.unsubscribe();
      updateResumeData.cancel();
    };
  }, [form, setResumeData]);

  // Fetch tailored data when component mounts if this is a tailored resume
  useEffect(() => {
    const fetchTailoredData = async () => {
      console.log('WorkExperienceForm Debug:', {
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

            if (tailoredData.workExperiences) {
              const tailoredExperiences = tailoredData.workExperiences;
              setTailoredSuggestions(tailoredExperiences);

              // Initialize showSuggestions array - show suggestion if content is different
              const currentExperiences = resumeData.workExperiences || [];
              const suggestionsToShow = tailoredExperiences.map((tailored, index) => {
                const current = currentExperiences[index];
                const isDifferent = current && current.description !== tailored.description;
                console.log(`Work Experience ${index + 1} comparison:`, {
                  currentDescription: current?.description,
                  tailoredDescription: tailored.description,
                  isDifferent
                });
                return isDifferent;
              });
              setShowSuggestions(suggestionsToShow);
              console.log('Work experience suggestions to show:', suggestionsToShow);
            } else {
              console.log('No work experiences data in tailored response');
            }
          } else {
            // Fallback to API call if session storage is empty
            console.log('Fetching tailored work experience data from API:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_RESUME_DATA}?user_id=${user.uid}&resume_id=${tailoredResumeId}`);

            const response = await axios.get<{
              data: {
                parsed_json: TailoredData;
              };
            }>(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_RESUME_DATA}?user_id=${user.uid}&resume_id=${tailoredResumeId}`
            );

            console.log('Tailored work experience response:', response.data);

            if (response.data.data.parsed_json.workExperiences) {
              const tailoredExperiences = response.data.data.parsed_json.workExperiences;
              setTailoredSuggestions(tailoredExperiences);

              // Initialize showSuggestions array - show suggestion if content is different
              const currentExperiences = resumeData.workExperiences || [];
              const suggestionsToShow = tailoredExperiences.map((tailored, index) => {
                const current = currentExperiences[index];
                const isDifferent = current && current.description !== tailored.description;
                console.log(`Work Experience ${index + 1} comparison:`, {
                  currentDescription: current?.description,
                  tailoredDescription: tailored.description,
                  isDifferent
                });
                return isDifferent;
              });
              setShowSuggestions(suggestionsToShow);
              console.log('Work experience suggestions to show:', suggestionsToShow);
            } else {
              console.log('No work experiences data in tailored response');
            }
          }
        } catch (error) {
          console.error('Error fetching tailored work experience data:', error);
        }
      } else {
        console.log('Skipping tailored work experience fetch - conditions not met');
      }
    };

    fetchTailoredData();
  }, [isTailored, tailoredResumeId, user?.uid, resumeData.workExperiences]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const handleAcceptSuggestion = (index: number) => {
    const suggestion = tailoredSuggestions[index];
    if (suggestion) {
      form.setValue(`workExperiences.${index}.description`, suggestion.description);
      const newShowSuggestions = [...showSuggestions];
      newShowSuggestions[index] = false;
      setShowSuggestions(newShowSuggestions);
    }
  };

  const handleRejectSuggestion = (index: number) => {
    const newShowSuggestions = [...showSuggestions];
    newShowSuggestions[index] = false;
    setShowSuggestions(newShowSuggestions);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-md">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span className="text-xl">Work Experience</span>
            {showSuggestions.some(show => show) && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Tailored Suggestions Available
              </span>
            )}
          </div>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </CardTitle>
        <CardDescription>
          Add your previous jobs, roles, responsibilities, and achievements.
        </CardDescription>
      </CardHeader>

      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden ${isOpen ? "max-h-[3000px] opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
      >
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              {fields.map((field, index) => (
                <WorkExperienceItem
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                  tailoredSuggestion={tailoredSuggestions[index]}
                  showSuggestion={showSuggestions[index] || false}
                  onAcceptSuggestion={() => handleAcceptSuggestion(index)}
                  onRejectSuggestion={() => handleRejectSuggestion(index)}
                />
              ))}

              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      name: "",
                      city: "",
                      country: "",
                      position: "",
                      startDate: undefined,
                      endDate: null,
                      description: "",
                    })
                  }
                >
                  + Add Work Experience
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}

interface WorkExperienceItemProps {
  index: number;
  form: UseFormReturn<WorkExperienceFormValues>;
  remove: (index: number) => void;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  tailoredSuggestion?: TailoredWorkExperience;
  showSuggestion: boolean;
  onAcceptSuggestion: () => void;
  onRejectSuggestion: () => void;
}

function WorkExperienceItem({
  index,
  form,
  remove,
  openIndex,
  setOpenIndex,
  tailoredSuggestion,
  showSuggestion,
  onAcceptSuggestion,
  onRejectSuggestion,
}: WorkExperienceItemProps) {
  const isExpanded = openIndex === index;
  const endDate = form.watch(`workExperiences.${index}.endDate`);
  const currentlyWorking = endDate === undefined;

  const description = useWatch({
    control: form.control,
    name: `workExperiences.${index}.description`,
  });

  //useDeferredValue is used to wait till all the description are loaded before extracting text it is done when React is idle
  const deferreDescription = useDeferredValue(description);

  useEffect(() => {
    if (deferreDescription) {
      const extractedText = extractText(deferreDescription);
      form.setValue(
        `workExperiences.${index}.description_text`,
        extractedText,
        {
          shouldValidate: false,
          shouldDirty: true,
        }
      );
    }
  }, [deferreDescription, form, index]);

  return (
    <Card className="border max-w-2xl mx-auto shadow-md relative">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) {
            setOpenIndex(isExpanded ? null : index);
          }
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Work Experience {index + 1}</span>
            {showSuggestion && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                Tailored Suggestion
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDown size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                remove(index);
              }}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div
        className={`transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? "max-h-[3000px] opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
      >
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name={`workExperiences.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`workExperiences.${index}.position`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`workExperiences.${index}.city`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`workExperiences.${index}.country`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`workExperiences.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`workExperiences.${index}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={field.onChange}
                      disabled={currentlyWorking}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={currentlyWorking}
              onCheckedChange={(checked) => {
                form.setValue(
                  `workExperiences.${index}.endDate`,
                  checked ? undefined : null
                );
              }}
            />
            <label className="text-sm font-medium">I currently work here</label>
          </div>

          <FormField
            control={form.control}
            name={`workExperiences.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={(json) => {
                      form.setValue(
                        `workExperiences.${index}.description`,
                        json
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tailored Suggestion Section */}
          {showSuggestion && tailoredSuggestion && (
            <div className="mt-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">
                  🤖 AI Tailored Description Suggestion
                </h4>
              </div>

              <div className="mb-3">
                <div
                  className="text-blue-800 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: tailoredSuggestion.description }}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={onAcceptSuggestion}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  type="button"
                  onClick={onRejectSuggestion}
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

          <input
            type="hidden"
            {...form.register(`workExperiences.${index}.description_text`)}
          />
        </CardContent>
      </div>
    </Card>
  );
}
