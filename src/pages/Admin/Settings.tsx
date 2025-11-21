import { useState } from "react";
import { Lock, Shield, AlertTriangle } from "lucide-react";
import { useStore } from "../../store/store";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const updateUser = useStore((state) => state.updateUser);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: "New passwords do not match." });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: "Password must be at least 6 characters." });
      return;
    }

    if (user) {
      updateUser(user.id, { password: passwordData.newPassword });
      setMessage({ type: 'success', text: "Password updated successfully." });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const toggleSetting = (setting: keyof typeof systemSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Lock className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Shield className="w-5 h-5 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">System Control</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Disable access for non-admin users</p>
              </div>
              <button
                onClick={() => toggleSetting('maintenanceMode')}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  systemSettings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    systemSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Allow Registrations</h3>
                <p className="text-sm text-gray-500">Enable new user sign-ups</p>
              </div>
              <button
                onClick={() => toggleSetting('allowRegistrations')}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  systemSettings.allowRegistrations ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    systemSettings.allowRegistrations ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Send system alerts via email</p>
              </div>
              <button
                onClick={() => toggleSetting('emailNotifications')}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  systemSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    systemSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-md border border-yellow-200">
             <div className="flex">
               <AlertTriangle className="h-5 w-5 text-yellow-400" />
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-yellow-800">System Status</h3>
                 <div className="mt-2 text-sm text-yellow-700">
                   <p>System is running normally. Last backup was performed 2 hours ago.</p>
                 </div>
               </div>
             </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
            <button
              onClick={() => {
                if (window.confirm("Are you sure? This will reset all data to initial state.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reset System Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
