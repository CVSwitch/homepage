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
   * @param pdfPath The cloud path of the PDF file
   * @returns The public URL of the parsed JSON file, or null if conversion failed
   */
  async convertPdfToJson(userId: string, pdfPath: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FETCH_USER_DATA}?user_id=${userId}&path_pdf_url=${pdfPath}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to convert PDF to JSON: ${response.status}`);
      }
      
      const result = await response.json() as ParsedJsonResponse;
      console.log('PDF converted to JSON successfully:', result);
      
      return result.data.path_public_url;
    } catch (error) {
      console.error('Error converting PDF to JSON:', error);
      return null;
    }
  }
}; 