import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { uploadResume } from '../utils/api';
import { Upload, FileText, AlertCircle, ArrowLeft, Loader2, CheckCircle, Shield, Zap } from 'lucide-react';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);
    setUploadProgress('Uploading file...');

    try {
      console.log('📤 Starting upload:', file.name);

      // Simulate progress updates
      setTimeout(() => setUploadProgress('Extracting text...'), 1000);
      setTimeout(() => setUploadProgress('Analyzing with AI...'), 3000);
      setTimeout(() => setUploadProgress('Generating insights...'), 6000);

      const result = await uploadResume(file);
      console.log('✅ Upload successful:', result);

      setUploadProgress('Complete!');

      // Navigate to results page with the analysis data
      setTimeout(() => {
        navigate('/results', { 
          state: { 
            analysisResult: result 
          } 
        });
      }, 500);

    } catch (error: any) {
      console.error('❌ Upload failed:', error);
      setError(error.message || 'Failed to upload resume. Please try again.');
      setUploadProgress('');
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        setError('File too large. Please upload a file smaller than 10MB.');
      } else if (rejection?.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload PDF or DOCX files only.');
      } else {
        setError('File rejected. Please try again.');
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Upload Your Resume
          </h2>
          <p className="text-lg text-gray-600">
            Upload your resume in PDF or DOCX format for AI-powered analysis
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <Upload className="h-6 w-6 mr-2 text-blue-600" />
              Resume Upload
            </CardTitle>
            <CardDescription>
              Supported formats: PDF, DOCX (Max size: 10MB)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800">Upload Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 lg:p-12 text-center cursor-pointer transition-all duration-300
                ${isDragActive || dragActive
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />

              {uploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
                  <div>
                    <p className="text-xl font-semibold text-gray-900">{uploadProgress}</p>
                    <p className="text-sm text-gray-600 mt-2">Please wait while we process your resume...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {isDragActive || dragActive
                        ? 'Drop your resume here'
                        : 'Drag & drop your resume here'
                      }
                    </p>
                    <p className="text-gray-600 mt-2">
                      or <span className="text-blue-600 font-medium">click to browse files</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      Supports PDF and DOCX files up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Your resume will be processed using AI to extract skills, career suggestions,
                and optimization recommendations. Analysis typically takes 15-30 seconds.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Shield className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Secure Processing</h3>
              <p className="text-sm text-gray-600">Your data is processed securely and not stored permanently</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <Zap className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Fast Analysis</h3>
              <p className="text-sm text-gray-600">Get comprehensive results in under 30 seconds</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <CheckCircle className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Detailed Insights</h3>
              <p className="text-sm text-gray-600">Comprehensive analysis with actionable recommendations</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
