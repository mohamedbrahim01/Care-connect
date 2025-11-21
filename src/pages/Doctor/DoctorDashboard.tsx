import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Activity, Bell, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/store';

const DoctorDashboard = () => {
  const { user, logout, login } = useAuth();
  const getAppointmentsByDoctor = useStore((state) => state.getAppointmentsByDoctor);
  const updateAppointment = useStore((state) => state.updateAppointment);
  const addNotification = useStore((state) => state.addNotification);
  const markNotificationRead = useStore((state) => state.markNotificationRead);
  const notifications = useStore((state) => state.notifications);
  const getUserById = useStore((state) => state.getUserById);
  const updateUser = useStore((state) => state.updateUser);
  const addUser = useStore((state) => state.addUser);
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [requestSent, setRequestSent] = useState<{[key: string]: boolean}>({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  const doctorNotifications = notifications?.filter(n => n.userId === user?.id && !n.read) || [];

  useEffect(() => {
    if (user) {
      // Initialize availability from user status
      // Check store first for most up-to-date status
      const storeUser = getUserById(user.id);
      if (storeUser && (storeUser as any).status) {
        setIsAvailable((storeUser as any).status === 'Active');
      } else if ((user as any).status) {
        setIsAvailable((user as any).status === 'Active');
      }

      try {
        // Fetch real appointments from store
        const doctorAppointments = getAppointmentsByDoctor(user.id);
        setAppointments(doctorAppointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    }
  }, [user, getAppointmentsByDoctor, notifications, getUserById]);

  const toggleStatus = () => {
    if (!user) return;
    
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    
    const statusString = newStatus ? 'Active' : 'Away';
    
    // Check if user exists in store
    const existingUser = getUserById(user.id);
    
    if (existingUser) {
      // Update in store
      updateUser(user.id, { status: statusString } as any);
    } else {
      // Add to store if not exists (for mock users)
      // We need to add the password field for the login logic to work with store users
      addUser({ 
        ...user, 
        status: statusString,
        password: 'doctor123' // Default password for mock doctors
      } as any);
    }
    
    // Update local auth context to reflect change immediately
    login({ ...user, status: statusString } as any);
  };

  const handleCompleteAppointment = (id: string) => {
    updateAppointment(id, { status: 'completed' });
    // Refresh appointments
    if (user) {
      const doctorAppointments = getAppointmentsByDoctor(user.id);
      setAppointments(doctorAppointments);
    }
  };

  const handleCancelAppointment = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
    // Refresh appointments
    if (user) {
      const doctorAppointments = getAppointmentsByDoctor(user.id);
      setAppointments(doctorAppointments);
    }
  };

  const handleRequestInfo = (appointment: any) => {
    addNotification({
      userId: appointment.patientId,
      type: 'info_request',
      message: `Dr. ${user?.name} requested your medical information for the appointment on ${appointment.date}.`,
      appointmentId: appointment.id,
    });
    setRequestSent(prev => ({ ...prev, [appointment.id]: true }));
    alert('Request sent to patient!');
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleViewPatient = (patientId: string | number) => {
    console.log('Attempting to view patient with ID:', patientId);
    const patient = getUserById(patientId);
    console.log('Patient found in store:', patient);
    
    if (patient) {
      setSelectedPatient(patient);
    } else {
      console.warn('Patient not found in store, attempting to show basic info...');
      // Fallback: Create a basic patient object from the appointment data if available
      const appointment = appointments.find(apt => apt.patientId === patientId);
      if (appointment) {
        const fallbackPatient = {
          id: patientId,
          name: appointment.patientName,
          email: appointment.patientEmail,
          role: 'patient' as const,
          avatar: '',
          heartRate: 'N/A',
          bloodPressure: 'N/A',
          weight: 'N/A',
          glucose: 'N/A'
        };
        console.log('Using fallback patient data:', fallbackPatient);
        setSelectedPatient(fallbackPatient);
      } else {
        alert('Patient details not found.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Care Connect</span>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Doctor Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Status:</span>
                <button
                  onClick={toggleStatus}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isAvailable ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {isAvailable ? 'Available' : 'Away'}
                </span>
              </div>
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  {doctorNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    {doctorNotifications.length === 0 ? (
                      <div className="px-4 py-4 text-sm text-gray-500 text-center">
                        No new notifications
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {doctorNotifications.map((notification) => (
                          <li key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className="flex-1 w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.type === 'appointment_cancelled' ? 'Appointment Cancelled' : 
                                   notification.type === 'appointment_rescheduled' ? 'Appointment Rescheduled' : 'Info Request'}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {notification.message}
                                </p>
                                <div className="mt-2">
                                  <button
                                    onClick={() => handleMarkRead(notification.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Mark as Read
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Dr. {user?.name}</span>
                <img
                  className="h-8 w-8 rounded-full bg-gray-300 mr-4"
                  src={user?.avatar || 'https://via.placeholder.com/40'}
                  alt="User avatar"
                />
                <Link
                  to="/doctor/profile"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium mr-4"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Alert */}
        {user && ((user as any).verificationStatus === 'pending' || (user as any).verificationStatus === 'rejected' || (user as any).verificationStatus === 'unverified') && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            (user as any).verificationStatus === 'pending' ? 'bg-orange-50 text-orange-800' : 'bg-red-50 text-red-800'
          }`}>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>
                {(user as any).verificationStatus === 'pending' 
                  ? 'Your account is pending verification. Some features may be limited.' 
                  : 'Your account is not verified. Please submit your documents.'}
              </span>
            </div>
            <Link to="/doctor/profile" className="text-sm font-medium underline hover:text-opacity-80">
              {(user as any).verificationStatus === 'pending' ? 'View Status' : 'Verify Now'}
            </Link>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Today's Schedule</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {(appointment.patientName || 'U').charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-medium text-blue-600">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.specialty}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {appointment.time}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{appointment.date}</div>
                          <div className="mt-1">
                            {appointment.medicalInfoShared ? (
                              <div className="flex flex-col items-end">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mb-1">
                                  Medical Info Shared
                                </span>
                                <button
                                  onClick={() => handleViewPatient(appointment.patientId)}
                                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  <User className="h-3 w-3 mr-1" />
                                  View Record
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-end">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mb-1">
                                  Info Not Shared
                                </span>
                                {appointment.status === 'scheduled' && (
                                  <button
                                    onClick={() => handleRequestInfo(appointment)}
                                    disabled={requestSent[appointment.id]}
                                    className={`text-xs text-blue-600 hover:text-blue-800 ${requestSent[appointment.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {requestSent[appointment.id] ? 'Request Sent' : 'Request Info'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {appointment.status === 'scheduled' ? (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleCompleteAppointment(appointment.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </button>
                            <button 
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Patient Info Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity z-10" aria-hidden="true" onClick={() => setSelectedPatient(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-20 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div>
                {/* Header */}
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-2xl font-bold text-gray-900" id="modal-title">
                      Patient Medical Record
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Complete medical information and vital signs
                    </p>
                  </div>
                </div>

                {/* Patient Basic Info */}
                <div className="border-t border-gray-200 pt-6 pb-6">
                  <div className="flex items-center mb-6">
                    <img
                      className="h-20 w-20 rounded-full bg-gray-300 mr-4 object-cover"
                      src={selectedPatient.avatar || 'https://via.placeholder.com/150'}
                      alt="Patient avatar"
                    />
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{selectedPatient.email}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        {(selectedPatient as any).age && (
                          <div className="flex items-center">
                            <span className="font-medium">Age:</span>
                            <span className="ml-1">{(selectedPatient as any).age} years</span>
                          </div>
                        )}
                        {(selectedPatient as any).bloodType && (
                          <div className="flex items-center">
                            <span className="font-medium">Blood Type:</span>
                            <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-800 rounded font-semibold">{(selectedPatient as any).bloodType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  {((selectedPatient as any).phone || (selectedPatient as any).address) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                      {(selectedPatient as any).phone && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Phone Number</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{(selectedPatient as any).phone}</p>
                        </div>
                      )}
                      {(selectedPatient as any).address && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Address</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{(selectedPatient as any).address}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Vital Signs */}
                <div className="border-t border-gray-200 pt-6 pb-6">
                  <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-red-500" />
                    Vital Signs
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                      <p className="text-xs font-medium text-red-700 uppercase">Heart Rate</p>
                      <p className="text-lg font-bold text-red-900 mt-1">{selectedPatient.heartRate || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-blue-700 uppercase">Blood Pressure</p>
                      <p className="text-lg font-bold text-blue-900 mt-1">{selectedPatient.bloodPressure || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-green-700 uppercase">Weight</p>
                      <p className="text-lg font-bold text-green-900 mt-1">{selectedPatient.weight || 'N/A'}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <p className="text-xs font-medium text-purple-700 uppercase">Glucose</p>
                      <p className="text-lg font-bold text-purple-900 mt-1">{selectedPatient.glucose || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                {((selectedPatient as any).allergies || (selectedPatient as any).conditions || (selectedPatient as any).medications) && (
                  <div className="border-t border-gray-200 pt-6">
                    <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
                      Medical History
                    </h5>
                    <div className="space-y-4">
                      {(selectedPatient as any).allergies && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <p className="text-xs font-bold text-yellow-800 uppercase mb-2 flex items-center">
                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            Allergies
                          </p>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{(selectedPatient as any).allergies}</p>
                        </div>
                      )}
                      {(selectedPatient as any).conditions && (
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                          <p className="text-xs font-bold text-orange-800 uppercase mb-2 flex items-center">
                            <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                            Chronic Conditions
                          </p>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{(selectedPatient as any).conditions}</p>
                        </div>
                      )}
                      {(selectedPatient as any).medications && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Current Medications
                          </p>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">{(selectedPatient as any).medications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Close Button */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  onClick={() => setSelectedPatient(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
