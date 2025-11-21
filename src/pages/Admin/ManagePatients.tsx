import { useState, useEffect } from "react";
import { Search, Trash2 } from "lucide-react";
import { useStore } from "../../store/store";

const ManagePatients = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const registeredUsers = useStore((state) => state.registeredUsers);
  const deleteUser = useStore((state) => state.deleteUser);

  useEffect(() => {
    const registeredPatients = registeredUsers
      .filter(u => u.role === 'patient')
      .map(p => ({
        ...p,
        status: 'Active',
        lastVisit: 'New', // Placeholder as we don't track visits yet
        condition: (p as any).condition || 'General Checkup',
        age: (p as any).age || 'N/A',
        phone: (p as any).phone || 'N/A',
        avatar: p.avatar || 'https://via.placeholder.com/40'
      }));
    setPatients(registeredPatients);
  }, [registeredUsers]);

  const handleDelete = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      deleteUser(id);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manage Patients</h1>
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
          <div className="text-gray-500 text-sm font-medium">Total Patients</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{patients.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">New This Month</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {patients.filter(p => p.lastVisit === 'New').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium">Active Cases</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {patients.length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Age</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Condition</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-xs text-gray-500">ID: #{patient.id.toString().slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{patient.email}</div>
                      <div className="text-xs text-gray-500">{patient.phone}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{patient.age}</td>
                    <td className="py-4 px-4 text-gray-700">{patient.condition}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No patients found matching your search.
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

export default ManagePatients;
