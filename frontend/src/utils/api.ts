import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout
});

export interface ResumeAnalysisResponse {
  success: boolean;
  analysis_id: number;
  filename: string;
  data: {
    skills: string[];
    strength_score: number;
    career_roles: string[];
    keywords: string[];
  };
  processed_at: string;
  text_length?: number;
  fallback_used?: boolean;
}

export interface ApiError {
  detail: string;
}

export const uploadResume = async (file: File): Promise<ResumeAnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('📤 Uploading file:', file.name, 'Size:', file.size, 'bytes');

    const response = await api.post<ResumeAnalysisResponse>('/upload_resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Upload successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Upload failed:', error);

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    if (error.response?.status === 413) {
      throw new Error('File too large. Please upload a file smaller than 10MB.');
    }
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw new Error('Failed to upload and analyze resume. Please try again.');
  }
};

export const healthCheck = async (): Promise<{ status: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend service is unavailable');
  }
};

export const debugCors = async (): Promise<any> => {
  try {
    const response = await api.get('/debug/cors');
    return response.data;
  } catch (error) {
    throw new Error('CORS debug failed');
  }
};
