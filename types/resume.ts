export interface Resume {
  id: string;
  name: string;
  lastModified: string;
  url?: string;
  cloudPath?: string;
  jsonUrl?: string | null;
  parsingStatus?: "parsing" | "completed" | "failed";
} 