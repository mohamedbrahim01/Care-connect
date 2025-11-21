import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Clock, Activity, Plus, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/store';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const getAppointmentsByPatient = useStore((state) => state.getAppointmentsByPatient);
  const notifications = useStore((state) => state.notifications);
  const markNotificationRead = useStore((state) => state.markNotificationRead);
  const shareMedicalInfo = useStore((state) => state.shareMedicalInfo);
  
  const updateAppointment = useStore((state) => state.updateAppointment);
  const cancelAppointment = useStore((state) => state.cancelAppointment);
  const addNotification = useStore((state) => state.addNotification);
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Reschedule Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const userNotifications = notifications?.filter(n => n.userId === user?.id && !n.read) || [];

 useEffect(() => {
    if (user) {
      // Fetch real appointments from store
      const userAppointments = getAppointmentsByPatient(user.id);
      setAppointments(userAppointments);
    }
  }, [user, getAppointmentsByPatient, notifications, isRescheduleModalOpen]); // Refresh on modal close too

  const handleCancel = (appointment: any) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      // console.log('Cancelling appointment:', appointment);
      // console.log('Doctor ID for notification:', appointment.doctorId);
      cancelAppointment(appointment.id);
      
      // Notify Doctor
      addNotification({
        userId: appointment.doctorId,
        type: 'appointment_cancelled',
        message: `Patient ${user?.name} cancelled the appointment on ${appointment.date} at ${appointment.time}.`,
        appointmentId: appointment.id,
      });
      
      alert('Appointment cancelled.');
      // Refresh
      if (user) {
        const userAppointments = getAppointmentsByPatient(user.id);
        setAppointments(userAppointments);
      }
    }
  };

  const openRescheduleModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    updateAppointment(selectedAppointment.id, {
      date: newDate,
      time: newTime,
      status: 'scheduled' // Reset status to scheduled if it was cancelled
    });

    // Notify Doctor
    addNotification({
      userId: selectedAppointment.doctorId,
      type: 'appointment_rescheduled',
      message: `Patient ${user?.name} rescheduled the appointment to ${newDate} at ${newTime}.`,
      appointmentId: selectedAppointment.id,
    });

    setIsRescheduleModalOpen(false);
    alert('Appointment rescheduled successfully.');
    
    // Refresh
    if (user) {
      const userAppointments = getAppointmentsByPatient(user.id);
      setAppointments(userAppointments);
    }
  };

  const handleShareInfo = (notification: any) => {
    shareMedicalInfo(notification.appointmentId);
    markNotificationRead(notification.id);
    // Refresh appointments
    if (user) {
      const userAppointments = getAppointmentsByPatient(user.id);
      setAppointments(userAppointments);
    }
    alert('Medical information shared successfully!');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Care Connect</span>
            </div>
            <div className="flex items-center">
              {/* Notification Bell */}
              <div className="relative mr-6">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                  {userNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    {userNotifications.length === 0 ? (
                      <div className="px-4 py-4 text-sm text-gray-500 text-center">
                        No new notifications
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {userNotifications.map((notification) => (
                          <li key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className="flex-1 w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.type === 'info_request' ? 'Medical Info Request' : 
                                   notification.type === 'appointment_cancelled' ? 'Appointment Cancelled' : 
                                   notification.type === 'appointment_rescheduled' ? 'Appointment Rescheduled' : 'Notification'}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {notification.message}
                                </p>
                                <div className="mt-2">
                                  <button
                                    onClick={() => handleShareInfo(notification)}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    Share Now
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

              <span className="text-gray-700 mr-4">Welcome, {user?.name}</span>
              <img
                className="h-8 w-8 rounded-full bg-gray-300 mr-4"
                src={user?.avatar || 'https://via.placeholder.com/40'}
                alt="User avatar"
              />
              <Link
                to="/patient/profile"
                className="text-sm text-gray-700 hover:text-gray-900 font-medium mr-4"
              >
                Profile
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
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <Activity className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Heart Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{(user as any)?.heartRate || 'Not Set'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Blood Pressure</dt>
                    <dd className="text-lg font-medium text-gray-900">{(user as any)?.bloodPressure || 'Not Set'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Weight</dt>
                    <dd className="text-lg font-medium text-gray-900">{(user as any)?.weight || 'Not Set'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Glucose</dt>
                    <dd className="text-lg font-medium text-gray-900">{(user as any)?.glucose || 'Not Set'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upcoming Appointments
            </h3>
            <Link
              to="/patient/book-appointment"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book New
            </Link>
          </div>
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-green-600">{appointment.doctorName}</div>
                      <div className="text-sm text-gray-500">{appointment.specialty}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end mr-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {appointment.time}
                      </div>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' : 
                      appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                {appointment.status === 'scheduled' && (
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => openRescheduleModal(appointment)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(appointment)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Reschedule Modal */}
        {isRescheduleModalOpen && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
                <form onSubmit={handleRescheduleSubmit}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Reschedule Appointment
                        </h3>
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">New Date</label>
                            <input
                              type="date"
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">New Time</label>
                            <select
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                            >
                              <option value="">Select Time</option>
                              <option value="09:00">09:00 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="14:00">02:00 PM</option>
                              <option value="15:00">03:00 PM</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Confirm Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRescheduleModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
