import { Link } from "react-router-dom";
import {
  User,
  Stethoscope,
  Shield,
  ArrowRight,
  HeartPulse,
  Clock,
  Video,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900">
            Care Connect
          </h1>
        </div>

        <p className="text-2xl text-gray-600 max-w-3xl mb-10">
          A modern telemedicine platform that connects patients with trusted
          healthcare professionals anytime, anywhere.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link
            to="/patient/register"
            className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-green-700 flex items-center justify-center"
          >
            Get Started as Patient
            <ArrowRight className="ml-2" />
          </Link>

          <Link
            to="/doctor/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700 flex items-center justify-center"
          >
            Join as Doctor
            <ArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Care Connect?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl shadow-lg text-center">
              <Video className="mx-auto mb-4 text-blue-600 w-10 h-10" />
              <h3 className="text-xl font-semibold mb-2">
                Online Consultations
              </h3>
              <p className="text-gray-600">
                Consult certified doctors through secure video calls.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg text-center">
              <Clock className="mx-auto mb-4 text-green-600 w-10 h-10" />
              <h3 className="text-xl font-semibold mb-2">
                Save Time
              </h3>
              <p className="text-gray-600">
                No waiting rooms. Get medical advice instantly.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg text-center">
              <HeartPulse className="mx-auto mb-4 text-red-600 w-10 h-10" />
              <h3 className="text-xl font-semibold mb-2">
                Health Management
              </h3>
              <p className="text-gray-600">
                Keep track of your medical history and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= USER SECTIONS ================= */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {/* Patient */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <User className="text-green-600 w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Patients</h3>
            <p className="text-gray-600 mb-6">
              Book appointments, consult doctors, and manage your health online.
            </p>
            <Link
              to="/patient/login"
              className="text-green-600 font-semibold flex items-center"
            >
              Patient Login <ArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Doctor */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Stethoscope className="text-blue-600 w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Doctors</h3>
            <p className="text-gray-600 mb-6">
              Manage patients, consultations, and grow your practice.
            </p>
            <Link
              to="/doctor/login"
              className="text-blue-600 font-semibold flex items-center"
            >
              Doctor Login <ArrowRight className="ml-2" />
            </Link>
          </div>

          {/* Admin */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Shield className="text-purple-600 w-10 h-10 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Admin</h3>
            <p className="text-gray-600 mb-6">
              Control users, verify doctors, and monitor the platform.
            </p>
            <Link
              to="/admin/login"
              className="text-purple-600 font-semibold flex items-center"
            >
              Admin Login <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>&copy; 2025 Care Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
