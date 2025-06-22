const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();


const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const fromWhatsAppNumber = process.env.FROM_WHATSAPP || 'whatsapp:+14155238886';


// Twilio Sandbox credentials (Don't use in production)
 // Twilio sandbox FROM number

const client = twilio(accountSid, authToken);

app.post('/api/book-appointment', async (req, res) => {
  const { patientName, patientPhone, doctorPhone, appointmentDate, symptoms } = req.body;

  if (!patientName || !patientPhone || !doctorPhone || !appointmentDate || !symptoms) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!patientPhone.startsWith('+91') || !doctorPhone.startsWith('+91')) {
    return res.status(400).json({ message: 'Phone numbers must start with +91' });
  }

  const fullDate = appointmentDate;
  const messageText = `📅 Appointment Confirmation\n\n👤 Patient: ${patientName}\n📆 Date: ${fullDate}\n💬 Symptoms: ${symptoms}`;

  try {
    // Send to Patient
    const patientRes = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${patientPhone}`,
      body: `Hello ${patientName}, your appointment is booked.\n\n${messageText}`
    });

    // Send to Doctor
    const doctorRes = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${doctorPhone}`,
      body: `New appointment scheduled:\n\n${messageText}`
    });

    
    console.log('✅ WhatsApp Sent:', patientRes.sid, doctorRes.sid);
    res.status(200).json({ message: '✅ WhatsApp messages sent to patient and doctor.' });

  } catch (error) {
    console.error('❌ Twilio Error:', error);
    res.status(500).json({
      message: '❌ Could not send messages.',
      error: error.message,
      code: error.code,
      moreInfo: error.moreInfo
    });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));

