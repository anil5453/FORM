const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config(); // ✅ Load .env variables before anything else

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_FROM;

// 🔐 Validate credentials
if (!accountSid || !accountSid.startsWith('AC')) {
  throw new Error('❌ Invalid TWILIO_ACCOUNT_SID. Please check your .env file.');
}
if (!authToken) {
  throw new Error('❌ TWILIO_AUTH_TOKEN is missing.');
}
if (!fromWhatsAppNumber) {
  throw new Error('❌ TWILIO_WHATSAPP_FROM is missing.');
}

const client = twilio(accountSid, authToken);

app.post('/api/book-appointment', async (req, res) => {
  const { patientName, patientPhone, doctorPhone, appointmentDate, symptoms } = req.body;

  // ✅ Validate incoming request
  if (!patientName || !patientPhone || !doctorPhone || !appointmentDate || !symptoms) {
    return res.status(400).json({ message: '🚫 Missing required fields in request body.' });
  }

  const message = `📅 Appointment Confirmation

Patient: ${patientName}
Date: ${appointmentDate}
Symptoms: ${symptoms}`;

  try {
    // 📤 Send to patient
    const patientResponse = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${patientPhone}`,
      body: `Hi ${patientName}, your appointment has been booked.\n\n${message}`
    });

    // 📤 Send to doctor
    const doctorResponse = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${doctorPhone}`,
      body: `New appointment scheduled:\n\n${message}`
    });

    console.log('✅ WhatsApp messages sent:', {
      patientMessageSid: patientResponse.sid,
      doctorMessageSid: doctorResponse.sid
    });

    res.json({ message: '✅ WhatsApp messages sent successfully.' });
  } catch (error) {
    console.error('❌ Error sending WhatsApp messages:', error.message || error);
    res.status(500).json({
      message: '❌ Failed to send WhatsApp messages.',
      error: error.message || error
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
