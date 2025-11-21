import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../services/authService';

export interface Appointment {
  id: string;
  patientId: number | string;
  patientName: string;
  patientEmail: string;
  doctorId: number | string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  medicalInfoShared?: boolean;
}

export interface Notification {
  id: string;
  userId: number | string;
  type: 'info_request' | 'appointment_cancelled' | 'appointment_rescheduled';
  message: string;
  appointmentId: string;
  read: boolean;
  createdAt: string;
}



interface AppState {
  // Users registered through the app
  registeredUsers: User[];
  
  // Appointments
  appointments: Appointment[];
  
  // Notifications
  notifications: Notification[];

  // Actions
  addUser: (user: User) => void;
  getUserByEmail: (email: string) => User | undefined;
  getUserById: (id: number | string) => User | undefined;
  
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  getAppointmentsByPatient: (patientId: number | string) => Appointment[];
  getAppointmentsByDoctor: (doctorId: number | string) => Appointment[];
  cancelAppointment: (id: string) => void;
  updateUser: (id: number | string, updates: Partial<User>) => void;
  deleteUser: (id: number | string) => void;
  
  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  shareMedicalInfo: (appointmentId: string) => void;
}



export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      registeredUsers: [],
      appointments: [],
      notifications: [],

      addUser: (user) => {
        set((state) => ({
          registeredUsers: [...state.registeredUsers, user],
        }));
      },

      getUserByEmail: (email) => {
        return get().registeredUsers.find((u) => u.email === email);
      },

      getUserById: (id) => {
        return get().registeredUsers.find((u) => u.id === id);
      },

      addAppointment: (appointmentData) => {
        const appointment: Appointment = {
          ...appointmentData,
          id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'scheduled',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          appointments: [...state.appointments, appointment],
        }));
      },

      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, ...updates } : apt
          ),
        }));
      },

      getAppointmentsByPatient: (patientId) => {
        return get().appointments.filter((apt) => apt.patientId === patientId);
      },

      getAppointmentsByDoctor: (doctorId) => {
        return get().appointments.filter((apt) => apt.doctorId === doctorId);
      },

      cancelAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
          ),
        }));
      },

      updateUser: (id, updates) => {
        set((state) => ({
          registeredUsers: state.registeredUsers.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          registeredUsers: state.registeredUsers.filter((user) => user.id !== id),
        }));
      },

      addNotification: (notificationData) => {
        console.log('Adding notification:', notificationData);
        const notification: Notification = {
          ...notificationData,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [...(state.notifications || []), notification],
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: (state.notifications || []).map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      shareMedicalInfo: (appointmentId) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === appointmentId ? { ...apt, medicalInfoShared: true } : apt
          ),
        }));
      },
    }),
    {
      name: 'care-connect-storage',
    }
  )
);

