import { API_CONFIG } from "@/config/api";

interface ParsedJsonResponse {
  data: {
    path_cloud_url: string;
    path_public_url: string;
  };
  message: string;
  mode: string;
  status: number;
}

export const pdfParserService = {
  /**
   * Converts a PDF file to parsed JSON format
   * @param userId The user ID
   * @param cloudPath The cloud path of the PDF file
   * @returns The public URL of the parsed JSON file, or null if conversion failed
   */
  async convertPdfToJson(userId: string, cloudPath: string): Promise<any> {
    try {
      console.log('Starting PDF to JSON conversion for:', cloudPath);
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PDF_TO_PARSED_JSON}?user_id=${userId}&cloud_file_path=${encodeURIComponent(cloudPath)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to convert PDF to JSON: ${response.status}`);
      }

      const result = await response.json();
      console.log('PDF to JSON conversion initiated:', result);
      return result;
    } catch (error) {
      console.error('Error in convertPdfToJson:', error);
      throw error;
    }
  },

  // New function for cover letters
  async convertCoverLetterPdfToJson(userId: string, cloudPath: string): Promise<any> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PDF_TO_PARSED_COVER_LETTER_JSON}?user_id=${userId}&cloud_file_path=${encodeURIComponent(cloudPath)}`,
        {
          method: 'GET', // Or POST if required by your API
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to trigger Cover Letter PDF to JSON conversion: ${response.status}`);
      }

      const result = await response.json();
      console.log('Cover Letter PDF to JSON Conversion Triggered:', result);
      return result;
    } catch (error) {
      console.error('Error triggering Cover Letter PDF to JSON conversion:', error);
      throw error;
    }
  },
}; 