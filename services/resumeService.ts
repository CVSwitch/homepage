import type { Resume } from '@/types/resume';
import { pdfParserService } from './pdfParserService';

interface UserDataResponse {
  data: {
    uploaded_resume: Array<{
      cloud_path: string;
      public_url: string;
    }>;
    parsed_resume_json: Array<{
      cloud_path: string;
      public_url: string;
    }>;
  };
  message: string;
  mode: string;
  status: number;
}

export const resumeService = {
  async getUserResumes(userId: string): Promise<Resume[]> {
    try {
      userId = 'laiZltBIPFP1yGGFxwsvSVzKyPL2'
      const response = await fetch(`http://localhost:4400/api/v1/fetchuserdata?user_id=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resumes: ${response.status}`);
      }
      
      const data = await response.json() as UserDataResponse;
      
      if (data.data && Array.isArray(data.data.uploaded_resume)) {
        // Create a map of parsed JSON files by their base name (without extension)
        const parsedJsonMap = new Map();
        if (data.data.parsed_resume_json) {
          data.data.parsed_resume_json.forEach(json => {
            const cloudPath = json.cloud_path || '';
            // Extract the base name without extension (e.g., "1743795375" from "1743795375.json")
            const baseName = cloudPath.split('/').pop()?.split('.')[0] || '';
            parsedJsonMap.set(baseName, json.public_url);
          });
        }
        
        return data.data.uploaded_resume.map((resume, index) => {
          // Extract filename from cloud_path
          const cloudPath = resume.cloud_path || '';
          const fileName = cloudPath.split('/').pop() || `Resume ${index + 1}`;
          
          // Check if this resume has a corresponding parsed JSON
          // Extract timestamp from filename (e.g., "1743795375" from "1743795375.008884_Aditya_Yadav_SG-2.pdf")
          const timestamp = cloudPath.split('/').pop()?.split('.')[0] || '';
          const jsonUrl = parsedJsonMap.get(timestamp) || null;
          
          return {
            id: index.toString(),
            name: fileName,
            lastModified: new Date().toISOString().split('T')[0],
            url: resume.public_url,
            cloudPath: resume.cloud_path,
            jsonUrl: jsonUrl,
            // If we have a jsonUrl, the resume has been parsed
            parsingStatus: jsonUrl ? "completed" : undefined
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error('Error in getUserResumes:', error);
      throw error;
    }
  },
  
  async uploadResume(userId: string, file: File): Promise<Resume> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`http://localhost:4400/api/v1/uploadresume?user_id=${userId}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload resume: ${response.status}`);
      }
      
      const result = await response.json();
      const newResume = {
        id: Date.now().toString(),
        name: result.data.file_name,
        lastModified: new Date().toISOString().split('T')[0],
        url: result.data.public_url,
        cloudPath: result.data.cloud_file_path,
        parsingStatus: "parsing" as const
      };
      
      // Call PDF to parsed JSON with a 2-second delay
      setTimeout(async () => {
        await pdfParserService.convertPdfToJson(userId, newResume.cloudPath || '');
      }, 2000);
      
      return newResume;
    } catch (error) {
      console.error('Error in uploadResume:', error);
      throw error;
    }
  },

  async getLinkedInSuggestions(userId: string, resumeId: string): Promise<any> {
    try {
      userId = 'laiZltBIPFP1yGGFxwsvSVzKyPL2'
      const response = await fetch(`http://localhost:4400/api/v1/linkedin-suggestions?user_id=${userId}&resume_id=${resumeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch LinkedIn suggestions: ${response.status}`);
      }

      const data = await response.json();
      return data; // Return the LinkedIn suggestions data
    } catch (error) {
      console.error('Error in getLinkedInSuggestions:', error);
      throw error;
    }
  },
};