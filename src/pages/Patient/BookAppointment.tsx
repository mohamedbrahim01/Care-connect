import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Search, User, GraduationCap, Briefcase, MapPin, Phone, Award } from 'lucide-react';
import mockData from '../../data/mockData.json';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store/store';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addAppointment = useStore((state) => state.addAppointment);
  const registeredUsers = useStore((state) => state.registeredUsers);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [shareMedicalInfo, setShareMedicalInfo] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    const registeredDoctors = registeredUsers.filter(u => u.role === 'doctor');
    
    // 1. Start with mock doctors
    let allDoctors = mockData.doctors.map(doc => ({
      ...doc,
      // Normalize verification status for mock data
      verificationStatus: doc.verified ? 'approved' : 'unverified'
    }));

    // 2. Update mock doctors with real data from store if they exist there
    allDoctors = allDoctors.map(mockDoc => {
      const storeDoc = registeredDoctors.find(d => String(d.id) === String(mockDoc.id));
      if (storeDoc) {
        return { ...mockDoc, ...storeDoc } as any;
      }
      return mockDoc;
    });

    // 3. Add new doctors from store that aren't in mock data
    const newStoreDoctors = registeredDoctors.filter(storeDoc => 
      !allDoctors.some(doc => String(doc.id) === String(storeDoc.id))
    );

    // 4. Combine and Filter
    // Only show doctors who are explicitly approved
    const displayDoctors = [...allDoctors, ...newStoreDoctors].filter(doc => {
      // If it's a store doctor or updated mock doctor, it uses 'verificationStatus'
      // If it's a pure mock doctor, we mapped 'verified' to 'verificationStatus' above
      return (doc as any).verificationStatus === 'approved';
    });

    setDoctors(displayDoctors);
  }, [registeredUsers]);

  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Allow both Active and Away doctors to be shown
    return matchesSpecialty && matchesSearch && (doctor.status === 'Active' || doctor.status === 'Away');
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedDoctor) return;

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) return;

    // Save appointment to store
    addAppointment({
      patientId: user.id,
      patientName: user.name,
      patientEmail: user.email || '',
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      medicalInfoShared: shareMedicalInfo,
    });

    // Show success message and redirect
    alert(`Appointment booked successfully with ${doctor.name} on ${selectedDate} at ${selectedTime}!`);
    navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-600">
            <h1 className="text-xl font-bold text-white">Book an Appointment</h1>
          </div>

          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Doctor</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Dr. Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select a Doctor</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredDoctors.map(doctor => {
                  const isAway = doctor.status === 'Away';
                  return (
                    <div
                      key={doctor.id}
                      className={`relative rounded-lg border p-4 flex flex-col space-y-3 transition-colors ${
                        selectedDoctor === doctor.id 
                          ? 'border-green-500 ring-2 ring-green-500 bg-green-50' 
                          : isAway
                            ? 'border-gray-200 bg-gray-50 opacity-75'
                            : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      <div 
                        className={`flex items-center space-x-3 ${isAway ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => !isAway && setSelectedDoctor(doctor.id)}
                      >
                        <div className="relative">
                          <img
                            src={doctor.avatar}
                            alt={doctor.name}
                            className={`h-12 w-12 rounded-full object-cover ${isAway ? 'grayscale' : ''}`}
                          />
                          {isAway && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 ring-2 ring-white" title="Away" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{doctor.name}</p>
                            {isAway && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Away
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{doctor.specialty}</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingDoctor(doctor);
                        }}
                        className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <User className="h-3 w-3 mr-1.5" />
                        View Profile
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date and Time Selection */}
            {selectedDoctor && (
              <form onSubmit={handleBook} className="space-y-6 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                      <select
                        required
                        className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">Select Time</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                      </select>
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    id="share-info"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    checked={shareMedicalInfo}
                    onChange={(e) => setShareMedicalInfo(e.target.checked)}
                  />
                  <label htmlFor="share-info" className="ml-2 block text-sm text-gray-900">
                    Share my medical information (Heart Rate, BP, Weight, Glucose) with the doctor
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity z-10" aria-hidden="true" onClick={() => setViewingDoctor(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative z-20 inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              
              <div className="flex items-start mb-6">
                <img
                  className={`h-24 w-24 rounded-full bg-gray-300 mr-6 object-cover border-4 border-white shadow-md ${viewingDoctor.status === 'Away' ? 'grayscale' : ''}`}
                  src={viewingDoctor.avatar}
                  alt={viewingDoctor.name}
                />
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-900 mr-3">{viewingDoctor.name}</h3>
                    {viewingDoctor.status === 'Away' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Away
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-green-600 font-medium">{viewingDoctor.specialty}</p>
                  {viewingDoctor.experience && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <Award className="h-4 w-4 mr-1" />
                      <span className="text-sm">{viewingDoctor.experience} Experience</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Bio */}
                {viewingDoctor.bio && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-bold text-gray-900 uppercase mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      About
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{viewingDoctor.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Education */}
                  {viewingDoctor.education && (
                    <div className="border border-gray-200 p-4 rounded-lg">
                      <h4 className="text-sm font-bold text-gray-900 uppercase mb-2 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                        Education
                      </h4>
                      <p className="text-gray-700 text-sm">{viewingDoctor.education}</p>
                    </div>
                  )}

                  {/* License */}
                  {viewingDoctor.licenseNumber && (
                    <div className="border border-gray-200 p-4 rounded-lg">
                      <h4 className="text-sm font-bold text-gray-900 uppercase mb-2 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-purple-500" />
                        License
                      </h4>
                      <p className="text-gray-700 text-sm">{viewingDoctor.licenseNumber}</p>
                    </div>
                  )}
                </div>

                {/* Contact */}
                {(viewingDoctor.phone || viewingDoctor.address) && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingDoctor.phone && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Phone className="h-4 w-4 mr-2" />
                          {viewingDoctor.phone}
                        </div>
                      )}
                      {viewingDoctor.address && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          {viewingDoctor.address}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end items-center">
                {viewingDoctor.status === 'Away' && (
                  <span className="text-sm text-red-600 mr-4 font-medium">
                    Doctor is currently away and cannot accept appointments.
                  </span>
                )}
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => setViewingDoctor(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={viewingDoctor.status === 'Away'}
                  className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                    viewingDoctor.status === 'Away' 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={() => {
                    setSelectedDoctor(viewingDoctor.id);
                    setViewingDoctor(null);
                  }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
