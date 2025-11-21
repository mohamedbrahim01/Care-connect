import { useState, useEffect } from "react";
import { Search, FileText, Check, X } from "lucide-react";
import { useStore } from "../../store/store";

const CredentialVerification = () => {
  const registeredUsers = useStore((state) => state.registeredUsers);
  const updateUser = useStore((state) => state.updateUser);
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    // Filter for doctors with pending verification status from the store
    const pending = registeredUsers.filter(u => 
      u.role === 'doctor' && (u as any).verificationStatus === 'pending'
    );
    setPendingDoctors(pending);
  }, [registeredUsers]);

  const handleApprove = (doctorId: number | string) => {
    updateUser(doctorId, { 
      verificationStatus: 'approved',
      verified: true 
    } as any);
    // alert("Doctor approved successfully!"); // Optional: removed for smoother UX or keep if preferred
  };

  const handleReject = (doctorId: number | string) => {
    updateUser(doctorId, { 
      verificationStatus: 'rejected',
      verified: false
    } as any);
  };

  const filteredDoctors = pendingDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((doctor.specialty || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Credential Verification
        </h1>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
            A
          </div>
          <span className="text-gray-700 font-medium">Admin</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          {/* title next to the search bar */}
          <h2 className="text-lg font-semibold text-gray-900"></h2>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Specialty
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Documents
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={doctor.avatar || 'https://via.placeholder.com/40'}
                          alt={doctor.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-700">{doctor.specialty || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Pending Review
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1">
                        {doctor.verificationDocuments && doctor.verificationDocuments.map((doc: string, idx: number) => (
                          <div key={idx} className="flex items-center text-xs text-blue-600 hover:underline cursor-pointer">
                            <FileText size={12} className="mr-1" />
                            {doc}
                          </div>
                        ))}
                        {(!doctor.verificationDocuments || doctor.verificationDocuments.length === 0) && (
                           <span className="text-xs text-gray-400">No documents</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(doctor.id)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(doctor.id)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No pending verification requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CredentialVerification;
