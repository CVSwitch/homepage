export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.cvswitch.com/',  // localhost:4400 to test in local 
  ENDPOINTS: {
    FETCH_USER_DATA: '/api/v1/fetchuserdata',
    UPLOAD_COVER_LETTER: '/api/v1/uploadcoverletter',
    UPLOAD_RESUME: '/api/v1/uploadresume',
    ANALYZE_RESUME: '/api/v1/analyzeparsedjson',
    FETCH_ANALYZED_JSON: '/api/v1/fetchanalyzedjson',
    LINKEDIN_SUGGESTIONS: '/api/v1/linkedin-suggestions',
    PDF_TO_PARSED_JSON: '/api/v1/pdftoparsedjson',
    HANDLE_EDITED_RESULT: '/api/v1/handleeditedresult',
    GET_RESUME_DATA: '/api/v1/getresumedata',
    DELETE_RESUME: '/api/v1/deleteresume',
    PARSE_UPLOADED_RESUME: '/api/v1/parse_uploaded_resume',
  }
}; 