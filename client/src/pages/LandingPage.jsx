import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Scale, 
  Shield, 
  FileText, 
  Calendar, 
  Users, 
  ArrowRight,
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");
    
    if (user && role) {
      if (role === "client") navigate("/client");
      if (role === "advocate") navigate("/advocate");
      if (role === "admin") navigate("/admin");
    }
  }, [navigate]);

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Easy Scheduling",
      description: "Book appointments with advocates at your convenience"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Document Management",
      description: "Securely store and share case documents"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Case Tracking",
      description: "Monitor your legal cases in real-time"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure & Private",
      description: "End-to-end encryption for all communications"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Register as a client or advocate in minutes"
    },
    {
      number: "02",
      title: "Connect",
      description: "Find and book appointments with verified advocates"
    },
    {
      number: "03",
      title: "Collaborate",
      description: "Manage cases, documents, and payments seamlessly"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LegalConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Trusted by 1000+ Legal Professionals</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Your Legal Journey,
              <br />
              <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Connect with verified advocates, manage your cases efficiently, and handle all legal matters in one secure platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('how-it-works').offsetTop, behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200"
              >
                Learn More
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Cases Managed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-600">Advocates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">98%</p>
                <p className="text-sm text-gray-600">Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make legal case management effortless for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-linear-to-b from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-600">
              Your journey to efficient legal case management starts here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
                  <div className="text-6xl font-bold text-blue-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose LegalConnect?
              </h2>
              <div className="space-y-4">
                {[
                  "Verified and trusted advocates",
                  "Secure document storage",
                  "Real-time case updates",
                  "Transparent payment tracking",
                  "24/7 platform access"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-xl shadow-md mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Save Time</span>
                </div>
                <p className="text-gray-600">Reduce administrative work by 60%</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Stay Protected</span>
                </div>
                <p className="text-gray-600">Bank-grade security for all data</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Better Collaboration</span>
                </div>
                <p className="text-gray-600">Seamless communication with your advocate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of clients and advocates using LegalConnect today
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="px-10 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-xl hover:shadow-2xl"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-6 h-6 text-blue-500" />
                <span className="text-xl font-bold text-white">LegalConnect</span>
              </div>
              <p className="text-sm">
                Simplifying legal case management for everyone
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} LegalConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;