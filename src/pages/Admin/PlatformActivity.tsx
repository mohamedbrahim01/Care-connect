import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "../../store/store";
import { useEffect, useState } from "react";

const PlatformActivity = () => {
  const registeredUsers = useStore((state) => state.registeredUsers);
  const appointments = useStore((state) => state.appointments);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingDoctors: 0
  });

  // Derived data for charts
  const [dailyLogins, setDailyLogins] = useState<{ day: string; count: number }[]>([]);
  const [appointmentTrends, setAppointmentTrends] = useState<{ category: string; count: number }[]>([]);

  useEffect(() => {
    const doctors = registeredUsers.filter(u => u.role === 'doctor');
    const patients = registeredUsers.filter(u => u.role === 'patient');
    
    setStats({
      totalUsers: registeredUsers.length,
      totalDoctors: doctors.length,
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      pendingDoctors: doctors.filter(d => (d as any).verificationStatus === 'pending').length
    });

    // Calculate Appointment Trends from real data
    const trends = [
      { category: "Scheduled", count: appointments.filter(a => a.status === 'scheduled').length },
      { category: "Completed", count: appointments.filter(a => a.status === 'completed').length },
      { category: "Cancelled", count: appointments.filter(a => a.status === 'cancelled').length }
    ];
    setAppointmentTrends(trends);

    // Mock Daily Logins (since we don't track login history yet)
    // In a real app, this would come from an analytics service or backend logs
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const mockLogins = days.map(day => ({
      day,
      count: Math.floor(Math.random() * 50) + 10 // Random data for visualization
    }));
    setDailyLogins(mockLogins);

  }, [registeredUsers, appointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Platform Activity Monitoring
        </h1>
      </div>

      {/* Real Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm font-medium">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalUsers}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <div className="text-gray-500 text-sm font-medium">Total Appointments</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalAppointments}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <div className="text-gray-500 text-sm font-medium">Doctors</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.totalDoctors}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
          <div className="text-gray-500 text-sm font-medium">Pending Verification</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingDoctors}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Logins Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Logins (Est.)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyLogins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointment Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformActivity;
