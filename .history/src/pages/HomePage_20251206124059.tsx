import { Link } from "react-router-dom";
import { User, Stethoscope, Shield, ArrowRight } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900">Care Connect</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted telemedicine platform connecting patients and
            healthcare providers for remote consultations and health management.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Patient Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">For Patients</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Access healthcare services from the comfort of your home. Book
              appointments, manage your health records, and consult with doctors
              remotely.
            </p>
            <div className="space-y-4">
              <Link
                to="/patient/register"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center group"
              >
                <span>Create Patient Account</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/patient/login"
                className="w-full border-2 border-green-600 text-green-600 py-3 px-6 rounded-lg hover:bg-green-50 transition-colors duration-200 flex items-center justify-center"
              >
                Patient Login
              </Link>
            </div>
          </div>

          {/* Doctor Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">For Doctors</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Join our network of healthcare professionals. Manage your
              practice, consult with patients, and expand your reach through
              telemedicine.
            </p>
            <div className="space-y-4">
              <Link
                to="/doctor/register"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group"
              >
                <span>Create Doctor Account</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/doctor/login"
                className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
              >
                Doctor Login
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Administrator Access
            </h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Manage the platform, verify doctor credentials, and monitor system
            activity.
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors duration-200 group"
          >
            <span>Admin Login</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2025 Care Connect. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
