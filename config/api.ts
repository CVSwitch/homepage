export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://rmqnv1wqk5.execute-api.ap-south-1.amazonaws.com/dev/',  // localhost:4400 to test in local 
  ENDPOINTS: {
    FETCH_USER_DATA: '/api/v1/fetchuserdata',
    UPLOAD_COVER_LETTER: '/api/v1/uploadcoverletter',
    UPLOAD_RESUME: '/api/v1/uploadresume',
    ANALYZE_RESUME: '/api/v1/analyzeparsedjson',
    FETCH_ANALYZED_JSON: '/api/v1/fetchanalyzedjson',
    LINKEDIN_SUGGESTIONS: '/api/v1/linkedin-suggestions',
  }
}; 