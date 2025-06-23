import React, { useState } from 'react';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorName: '',
    doctorPhone: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const [status, setStatus] = useState({ success: false, error: '', loading: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: false, error: '', loading: true });

    try {
     
        // Deployed Render backend URL (example)
const res = await fetch('https://doctor-backend.onrender.com/api/book-appointment', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      
// const res = await fetch('http://localhost:5000/api/book-appointment', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(formData),
});

      const data = await res.json();
      if (res.ok) {
        setStatus({ success: true, error: '', loading: false });
        setFormData({
          patientName: '',
          patientPhone: '',
          doctorName: '',
          doctorPhone: '',
          appointmentDate: '',
          appointmentTime: '',
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      setStatus({ success: false, error: err.message, loading: false });
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem' }}>
      <h2>Book Doctor Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="patientName" placeholder="Patient Name" required value={formData.patientName} onChange={handleChange} />
        <input type="tel" name="patientPhone" placeholder="Patient WhatsApp (+91...)" required value={formData.patientPhone} onChange={handleChange} />
        <input type="text" name="doctorName" placeholder="Doctor Name" required value={formData.doctorName} onChange={handleChange} />
        <input type="tel" name="doctorPhone" placeholder="Doctor WhatsApp (+91...)" required value={formData.doctorPhone} onChange={handleChange} />
        <input type="date" name="appointmentDate" required value={formData.appointmentDate} onChange={handleChange} />
        <input type="time" name="appointmentTime" required value={formData.appointmentTime} onChange={handleChange} />

        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>

      {status.success && <p style={{ color: 'green' }}>✅ Appointment booked and WhatsApp messages sent!</p>}
      {status.error && <p style={{ color: 'red' }}>❌ {status.error}</p>}
    </div>
  );
};

export default AppointmentForm;
