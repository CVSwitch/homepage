"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ChevronDown, ChevronRight } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResume } from "./ResumeProvider";
import RichTextEditor from "@/components/RichTextEditor";
import { Awards, awardsSchema } from "@/lib/validation";
import { debounce } from "lodash";
import { extractText } from "@/lib/extractText";

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default function AwardForm() {
  const { resumeData, setResumeData } = useResume();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<Awards>({
    resolver: zodResolver(awardsSchema),
    mode: "onChange",
    defaultValues: {
      awards: resumeData.awards,
    },
  });

  const updateAwards = debounce((description) => {
    const safeDescription = typeof description === "string" ? description : "";
    const description_text = extractText(safeDescription);
    setResumeData({
      ...resumeData,
      awards: {
        description: stripHtml(safeDescription),
        description_text: stripHtml(description_text),
      },
    });
  }, 300);

  const watchedDescription = useWatch({
    control: form.control,
    name: "awards.description",
  });

  useEffect(() => {
    updateAwards(watchedDescription);
    return () => updateAwards.cancel();
  }, [watchedDescription]);

  return (
    <Card className="max-w-2xl mx-auto mt-10 shadow-md">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" /> {/* Awards Icon */}
            <span className="text-xl">Awards</span>
          </div>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </CardTitle>
        <CardDescription>
          Highlight any awards, recognitions, or achievements.
        </CardDescription>
      </CardHeader>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] opacity-100 py-4" : "max-h-0 opacity-0"
          }`}
      >
        <CardContent>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="awards.description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        value={field.value || ""}
                        onChange={(json) => {
                          form.setValue(`awards.description`, json);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
}
