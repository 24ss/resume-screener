import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { Progress } from '../components/Progress';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  Target, 
  TrendingUp, 
  Key,
  Download,
  Share2,
  RotateCcw,
  Star,
  Award,
  AlertTriangle,
  ThumbsUp
} from 'lucide-react';
import { ResumeAnalysisResponse } from '../utils/api';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResponse | null>(null);

  useEffect(() => {
    const result = location.state?.analysisResult;
    if (!result) {
      navigate('/upload');
      return;
    }
    setAnalysisResult(result);
    console.log('📊 Analysis result:', result);
  }, [location.state, navigate]);

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { data, filename, fallback_used, text_length } = analysisResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="h-6 w-6 text-green-600" />;
    if (score >= 60) return <ThumbsUp className="h-6 w-6 text-yellow-600" />;
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  const getScoreAdvice = (score: number) => {
    if (score >= 80) return "Your resume shows excellent strength and is likely to perform well with recruiters and ATS systems.";
    if (score >= 60) return "Your resume shows good potential. Consider incorporating more keywords and quantifying achievements.";
    return "Your resume has room for improvement. Focus on adding more relevant skills and measurable accomplishments.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/upload')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
                <p className="text-sm text-gray-600">{filename}</p>
                {fallback_used && (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Using fallback analysis</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <Card className={`mb-8 bg-gradient-to-r ${getScoreGradient(data.strength_score)} text-white shadow-xl`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl lg:text-3xl text-white flex items-center">
                  {getScoreIcon(data.strength_score)}
                  <span className="ml-3">Resume Analysis Complete</span>
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  {getScoreAdvice(data.strength_score)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm opacity-90">Skills Found</p>
                <p className="text-2xl font-bold">{data.skills.length}</p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm opacity-90">Career Roles</p>
                <p className="text-2xl font-bold">{data.career_roles.length}</p>
              </div>
              <div className="text-center">
                <Key className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm opacity-90">Keywords</p>
                <p className="text-2xl font-bold">{data.keywords.length}</p>
              </div>
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm opacity-90">Characters</p>
                <p className="text-2xl font-bold">{text_length || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Strength Score */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                Resume Strength Score
              </CardTitle>
              <CardDescription>
                Overall assessment of your resume's effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(data.strength_score)} mb-2`}>
                    {data.strength_score}
                  </div>
                  <div className="text-2xl text-gray-500 mb-4">/100</div>
                  <Badge 
                    variant={data.strength_score >= 80 ? 'default' : data.strength_score >= 60 ? 'secondary' : 'destructive'}
                    className="text-sm px-4 py-2"
                  >
                    {getScoreLabel(data.strength_score)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <Progress value={data.strength_score} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">💡 Improvement Tips:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {data.strength_score < 80 && (
                      <>
                        <li>• Add more quantifiable achievements</li>
                        <li>• Include relevant technical skills</li>
                        <li>• Use action verbs to describe experience</li>
                      </>
                    )}
                    {data.strength_score >= 80 && (
                      <li>• Your resume shows excellent strength! Consider tailoring it for specific roles.</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
{/* Potential Career Roles */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="h-6 w-6 mr-3 text-purple-600" />
                Career Role Matches
              </CardTitle>
              <CardDescription>
                Career paths that align with your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.career_roles.map((role, index) => (
                  <div key={index} className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <span className="font-semibold text-gray-900">{role}</span>
                    </div>
                  </div>
                ))}
                <div className="bg-purple-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-purple-800">
                    <Target className="h-4 w-4 inline mr-1" />
                    <strong>Career Insight:</strong> These roles match your current skill set. Consider researching specific requirements for your target role.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          

          {/* Keywords Recruiters Look For */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Key className="h-6 w-6 mr-3 text-orange-600" />
                Recruiter Keywords
              </CardTitle>
              <CardDescription>
                Important keywords that boost visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-sm px-3 py-1 hover:bg-orange-50 border-orange-200 text-orange-700 transition-colors"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <Key className="h-4 w-4 inline mr-1" />
                    <strong>ATS Optimization:</strong> Incorporate these keywords naturally throughout your resume to improve Applicant Tracking System (ATS) compatibility and recruiter visibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Skills Found */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                Key Skills Identified
              </CardTitle>
              <CardDescription>
                Top skills extracted from your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-sm px-3 py-1 hover:bg-blue-100 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <Star className="h-4 w-4 inline mr-1" />
                    <strong>Pro Tip:</strong> These skills show your core competencies. Consider expanding on the most relevant ones in your resume descriptions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/upload')}
              size="lg"
              className="px-8 py-4"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Analyze Another Resume
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              size="lg"
              className="px-8 py-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use these insights to enhance your resume and improve your job search success rate.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">1</div>
                <p className="text-gray-600">Update your skills section</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">2</div>
                <p className="text-gray-600">Incorporate keywords naturally</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">3</div>
                <p className="text-gray-600">Tailor for target roles</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
