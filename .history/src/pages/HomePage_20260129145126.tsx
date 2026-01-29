import { Link } from "react-router-dom";
import {
  User,
  Stethoscope,
  Shield,
  ArrowRight,
  HeartPulse,
  Clock,
  Video,
  CheckCircle,
  Star,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ================= HERO ================= */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
          Modern Healthcare <br /> Made Simple
        </h1>

        <p className="text-2xl text-gray-600 max-w-3xl mb-10">
          Care Connect is a secure telemedicine platform that enables patients
          and doctors to connect, consult, and manage healthcare digitally.
        </p>

        <div className="flex gap-6 flex-wrap justify-center">
          <Link
            to="/patient/register"
            className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-green-700 flex items-center"
          >
            Start as Patient <ArrowRight className="ml-2" />
          </Link>
          <Link
            to="/doctor/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700 flex items-center"
          >
            Join as Doctor <ArrowRight className="ml-2" />
          </Link>
        </div>

        <div className="mt-16 text-gray-500">
          Trusted by healthcare professionals worldwide
        </div>
      </section>

      {/* ================= TRUST / SOCIAL PROOF ================= */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-blue-600">10K+</h3>
            <p className="text-gray-600">Patients</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-green-600">1K+</h3>
            <p className="text-gray-600">Doctors</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-purple-600">24/7</h3>
            <p className="text-gray-600">Availability</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-red-600">99.9%</h3>
            <p className="text-gray-600">Uptime</p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          How Care Connect Works
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <User className="mx-auto w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Create Account</h3>
            <p className="text-gray-600">
              Sign up as a patient or doctor in less than 2 minutes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <Video className="mx-auto w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Book Consultation</h3>
            <p className="text-gray-600">
              Schedule secure online consultations anytime.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <HeartPulse className="mx-auto w-10 h-10 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Get Care</h3>
            <p className="text-gray-600">
              Receive medical advice, prescriptions, and reports online.
            </p>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 px-6">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Why Healthcare Providers Choose Us
            </h2>

            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="text-green-600 mr-3" />
                HIPAA-compliant & secure platform
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-green-600 mr-3" />
                Manage patients & schedules easily
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-green-600 mr-3" />
                Expand your practice digitally
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Why Patients Love Care Connect
            </h2>

            <ul className="space-y-4 text-gray-600">
              <li className="flex items-center">
                <Clock className="text-blue-600 mr-3" />
                No waiting time
              </li>
              <li className="flex items-center">
                <Video className="text-blue-600 mr-3" />
                Remote consultations
              </li>
              <li className="flex items-center">
                <HeartPulse className="text-blue-600 mr-3" />
                Better health management
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          What Users Say
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="text-yellow-400 w-5 h-5" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                “Care Connect made healthcare accessible and fast. Amazing
                experience!”
              </p>
              <p className="font-semibold">— Verified User</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-600 py-20 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Healthcare?
        </h2>
        <p className="text-xl mb-10">
          Join thousands of patients and doctors today.
        </p>
        <Link
          to="/patient/register"
          className="bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100"
        >
          Get Started Now
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <p>&copy; 2025 Care Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
