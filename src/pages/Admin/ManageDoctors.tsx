import { useState, useEffect } from "react";
import { Search, CheckCircle, Eye, X, User as UserIcon, Clock } from "lucide-react";
import { useStore } from "../../store/store";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const itemsPerPage = 10;

  const registeredUsers = useStore((state) => state.registeredUsers);
  const appointments = useStore((state) => state.appointments);

  useEffect(() => {
    const verifiedDoctors = registeredUsers
      .filter(u => u.role === 'doctor' && (u as any).verificationStatus === 'approved')
      .map(d => {
        const doctorAppointments = appointments.filter(a => a.doctorId === d.id);
        const uniquePatients = new Set(doctorAppointments.map(a => a.patientId)).size;
        
        return {
          ...d,
          specialty: (d as any).specialty || 'General Practice',
          avatar: d.avatar || 'https://via.placeholder.com/40',
          totalAppointments: doctorAppointments.length,
          uniquePatients: uniquePatients,
          recentAppointments: doctorAppointments
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        };
      });
    setDoctors(verifiedDoctors);
  }, [registeredUsers, appointments]);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage Doctors</h1>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
            A
          </div>
          <span className="text-gray-700 font-medium">Admin</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Verified Doctors</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{doctors.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Total Appointments</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {doctors.reduce((acc, curr) => acc + curr.totalAppointments, 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Avg. Patients/Doctor</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {doctors.length > 0 
              ? Math.round(doctors.reduce((acc, curr) => acc + curr.uniquePatients, 0) / doctors.length) 
              : 0}
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Specialty</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Appointments</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDoctors.length > 0 ? (
                paginatedDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-xs text-gray-500">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{doctor.specialty}</td>
                    <td className="py-4 px-4 text-gray-700">{doctor.totalAppointments}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center w-fit">
                        <CheckCircle size={12} className="mr-1" /> Verified
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedDoctor(doctor)}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                      >
                        <Eye size={16} className="mr-1" /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No verified doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedDoctor(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              
              {/* Modal Header */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Doctor Profile
                </h3>
                <button onClick={() => setSelectedDoctor(null)} className="text-gray-400 hover:text-gray-500">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Info */}
                  <div className="flex-shrink-0 text-center md:text-left">
                    <img
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0 border-4 border-white shadow-lg"
                    />
                    <div className="mt-4">
                      <h4 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h4>
                      <p className="text-blue-600 font-medium">{selectedDoctor.specialty}</p>
                      <div className="mt-2 flex items-center justify-center md:justify-start text-gray-500 text-sm">
                        <UserIcon size={14} className="mr-1" /> {selectedDoctor.experience || 'N/A'} Experience
                      </div>
                    </div>
                  </div>

                  {/* Stats & Bio */}
                  <div className="flex-grow space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-700">{selectedDoctor.totalAppointments}</div>
                        <div className="text-xs text-blue-600 font-medium">Total Appointments</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-700">{selectedDoctor.uniquePatients}</div>
                        <div className="text-xs text-green-600 font-medium">Patients Treated</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">About</h5>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedDoctor.bio || "No biography available for this doctor."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock size={18} className="mr-2 text-gray-400" /> Recent Appointments
                  </h5>
                  <div className="space-y-3">
                    {selectedDoctor.recentAppointments.length > 0 ? (
                      selectedDoctor.recentAppointments.map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs mr-3">
                              {apt.patientName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{apt.patientName}</div>
                              <div className="text-xs text-gray-500">{apt.date} at {apt.time}</div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No recent appointments.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
