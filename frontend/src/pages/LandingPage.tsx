import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { FileText, Target, TrendingUp, Users, Zap, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes resumes to extract key skills and insights"
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Career Matching",
      description: "Get personalized career role suggestions based on your profile"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Strength Scoring",
      description: "Receive detailed scoring and improvement recommendations"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Recruiter Keywords",
      description: "Identify keywords that recruiters are looking for"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Instant Results",
      description: "Get comprehensive analysis in under 30 seconds"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Secure Processing",
      description: "Your data is processed securely and not stored permanently"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AI Boosted Resume Screener</h1>
            </div>
           
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16 lg:py-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Intelligent Resume
            <span className="text-blue-600 block sm:inline"> Analysis</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your resume and get instant AI-powered insights including skill analysis, 
            career recommendations, and recruiter-focused keyword optimization.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              <FileText className="h-5 w-5 mr-2" />
              Click to Analyse Resume
            </Button>
           
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 lg:py-0">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your resume for modern recruitment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="py-16 lg:py-0">
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <p className="text-lg text-gray-600">
                Simple 3-step process to analyze your resume
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Upload Resume",
                  description: "Upload your PDF or DOCX resume file",
                  color: "bg-blue-600"
                },
                {
                  step: 2,
                  title: "AI Analysis", 
                  description: "Our AI analyzes your content and skills",
                  color: "bg-green-600"
                },
                {
                  step: 3,
                  title: "Get Results",
                  description: "Receive detailed insights and recommendations",
                  color: "bg-purple-600"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`${item.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg`}>
                    {item.step}
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16 lg:py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Optimize Your Resume?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Join thousands who have improved their job prospects with AI-powered resume analysis
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Start Analysis Now
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">AI Boosted Resume Screener</h3>
          </div>
          <p className="text-gray-400">
            © 2025 Intelligent Resume Screening System. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
