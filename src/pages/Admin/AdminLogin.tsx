import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";


const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await authService.login(formData.username, formData.password);
      if (user && user.role === 'admin') {
        login(user);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          </div>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
            >
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-sm text-gray-800">
              Username: <span className="font-mono">admin</span>
            </p>
            <p className="text-sm text-gray-800">
              Password: <span className="font-mono">admin123</span>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
