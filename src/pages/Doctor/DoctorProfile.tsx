import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, MapPin, Shield, Save, AlertCircle, ArrowLeft, Briefcase, GraduationCap, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/store';

const DoctorProfile = () => {
  const { user, login } = useAuth();
  const updateUser = useStore((state) => state.updateUser);
  const addUser = useStore((state) => state.addUser);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialty: '',
    licenseNumber: '',
    experience: '',
    education: '',
    bio: '',
    password: '',
    confirmPassword: '',
    oldPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        address: (user as any).address || '',
        specialty: (user as any).specialty || '',
        licenseNumber: (user as any).licenseNumber || '',
        experience: (user as any).experience || '',
        education: (user as any).education || '',
        bio: (user as any).bio || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Password validation
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }
      if (!formData.oldPassword) {
        setMessage({ type: 'error', text: 'Please enter your old password to change it' });
        return;
      }
      // Mock check for old password
      if ((user as any).password && (user as any).password !== formData.oldPassword) {
         setMessage({ type: 'error', text: 'Incorrect old password' });
         return;
      }
    }

    if (user) {
      const updates: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        specialty: formData.specialty,
        licenseNumber: formData.licenseNumber,
        experience: formData.experience,
        education: formData.education,
        bio: formData.bio,
      };

      if (formData.password) {
        updates.password = formData.password;
      }

      // Check if user exists in store (is a registered user)
      const existingUser = useStore.getState().getUserByEmail(user.email || '');

      if (existingUser) {
        updateUser(user.id, updates);
      } else {
        // If not in store (mock user), add them to store to persist changes
        const password = formData.password || 'doctor123';
        addUser({
          ...user,
          ...updates,
          password, // Save password so they can login again
        } as any);
      }
      
      // Update local auth state
      login({ ...user, ...updates });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
        oldPassword: ''
      }));
    }
  };

  const handleVerificationSubmit = () => {
    if (!user) return;

    const updates: any = {
      verificationStatus: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      verificationDocuments: ['medical_license.pdf', 'id_proof.jpg'] // Mock documents
    };

    // Check if user exists in store
    const existingUser = useStore.getState().getUserByEmail(user.email || '');

    if (existingUser) {
      updateUser(user.id, updates);
    } else {
      // Add to store if not exists
      const password = formData.password || 'doctor123';
      addUser({
        ...user,
        ...updates,
        password,
      } as any);
    }

    // Update local auth state
    login({ ...user, ...updates });
    setMessage({ type: 'success', text: 'Verification documents submitted successfully!' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/doctor/dashboard" className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Edit Profile</span>
            </div>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <div className="py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              <AlertCircle className="w-5 h-5 mr-2" />
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Personal Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                  Professional Details
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialty</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  >
                    <option value="">Select Specialty</option>
                    <option value="General Practice">General Practice</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 10 years"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
              </div>
            </div>

            {/* Education & Bio */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-green-500" />
                  Education & Bio
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Education / Medical School</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g. Harvard Medical School"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Professional Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="Tell patients about your background and expertise..."
                  />
                </div>
              </div>
            </div>



            {/* Verification Status */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-500" />
                  Verification Status
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Current Status: 
                      <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        (user as any).verificationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        (user as any).verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        (user as any).verificationStatus === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {(user as any).verificationStatus ? (user as any).verificationStatus.charAt(0).toUpperCase() + (user as any).verificationStatus.slice(1) : 'Unverified'}
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {(user as any).verificationStatus === 'approved' ? 'Your account is fully verified. You can accept appointments.' :
                       (user as any).verificationStatus === 'pending' ? 'Your documents are under review. This usually takes 24-48 hours.' :
                       'Please submit your medical license and ID proof to get verified.'}
                    </p>
                  </div>
                  {(user as any).verificationStatus === 'approved' && (
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  )}
                  {(user as any).verificationStatus === 'rejected' && (
                    <XCircle className="h-12 w-12 text-red-500" />
                  )}
                </div>

                {(!(user as any).verificationStatus || (user as any).verificationStatus === 'unverified' || (user as any).verificationStatus === 'rejected') && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Upload Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Medical License</span>
                        <span className="text-xs text-gray-500">PDF, JPG or PNG</span>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Government ID</span>
                        <span className="text-xs text-gray-500">PDF, JPG or PNG</span>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleVerificationSubmit}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Submit for Verification
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-500" />
                  Account Settings
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed border p-2 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email address cannot be changed.</p>
                </div>
                
                <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Old Password</label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pb-8">
              <button
                type="submit"
                className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
