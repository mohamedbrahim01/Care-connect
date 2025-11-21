import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../store/store";

const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
    phone: "",
    experience: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const addUser = useStore((state) => state.addUser);
  const navigate = useNavigate();

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Radiology",
    "Orthopedics",
    "Psychiatry",
    "General Practice",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (!formData.specialty) {
      setError("Please select a specialty");
      setIsLoading(false);
      return;
    }

    try {
      // Create new doctor object
      const newDoctor = {
        id: `doctor-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'doctor' as const,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=2563eb&color=fff`,
        password: formData.password, // In production, this would be hashed
        specialty: formData.specialty,
        phone: formData.phone,
        experience: formData.experience,
        verified: false, // Doctors start as unverified
        verificationStatus: 'pending' as const,
        status: 'Active' as const,
      };

      // Add to store
      addUser(newDoctor);

      // Auto-login
      const { password: _, ...doctorWithoutPassword } = newDoctor;
      login(doctorWithoutPassword);

      // Redirect to dashboard
      navigate("/doctor/dashboard", { replace: true });
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Registration</h1>
            </div>
            <p className="text-gray-600">Join our medical network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (Dr.)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dr. Sarah Lee"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="doctor@hospital.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a specialty</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1-555-0000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Note: Your account will be pending verification by our admin team.
            </p>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/doctor/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign In
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;
