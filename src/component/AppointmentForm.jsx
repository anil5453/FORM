import React, { useState } from 'react';


const doctors = [
  { name: 'Dr. Alice', phone: '+919390979128' },
  { name: 'Dr. Bob', phone: '+919390979128' },
  { name: 'Dr. Charlie', phone: '+919390979128' },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM',
  '05:00 PM',
];

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorPhone: '',
    appointmentDate: '',
    appointmentTime: '',
    symptoms: ''
  });

  const [confirmation, setConfirmation] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDoctorSelect = (e) => {
    const selectedDoctor = doctors.find(doc => doc.name === e.target.value);
    setFormData({ ...formData, doctorPhone: selectedDoctor.phone });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      appointmentDate: `${formData.appointmentDate} ${formData.appointmentTime}`
    };

    try {
      const res = await fetch('http://localhost:5000/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setConfirmation(result.message || 'Appointment booked successfully.');
    } catch (error) {
      console.error(error);
      setConfirmation('Error booking appointment.');
    }
  };

  return (
    <div className="form-container">
      <h2>Book a Doctor's Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <label>Patient Name</label>
        <input name="patientName" onChange={handleChange} required />

        <label>Patient WhatsApp Number</label>
        <input name="patientPhone" placeholder="+1234567890" onChange={handleChange} required />

        <label>Select Doctor</label>
        <select onChange={handleDoctorSelect} required>
          <option value="">-- Choose Doctor --</option>
          {doctors.map(doc => (
            <option key={doc.phone} value={doc.name}>{doc.name}</option>
          ))}
        </select>

        <label>Appointment Date</label>
        <input type="date" name="appointmentDate" onChange={handleChange} required />

        <label>Time Slot</label>
        <select name="appointmentTime" onChange={handleChange} required>
          <option value="">-- Select Time --</option>
          {timeSlots.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <label>Describe Your Symptoms</label>
        <textarea name="symptoms" onChange={handleChange} rows="4" required />

        <button type="submit">Book Appointment</button>
      </form>

      {confirmation && <div className="confirmation">{confirmation}</div>}
    </div>
  );
};

export default AppointmentForm;
