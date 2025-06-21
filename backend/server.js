// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Twilio setup
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST: Handle appointment booking
app.post("/send-whatsapp", async (req, res) => {
  const {
    patientName,
    patientPhone,
    doctorPhone,
    appointmentDate,
    appointmentTime,
    symptoms
  } = req.body;

  // Validate input
  if (!patientName || !patientPhone || !doctorPhone || !appointmentDate || !appointmentTime || !symptoms) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // WhatsApp message content
  const messageText = `📅 *Appointment Confirmation*\n\n👤 *Patient*: ${patientName}\n📱 *Phone*: ${patientPhone}\n🗓️ *Date*: ${appointmentDate}\n⏰ *Time*: ${appointmentTime}\n📝 *Symptoms*: ${symptoms}`;

  try {
    // Send to doctor
    await client.messages.create({
      body: `🩺 *New Appointment Booked!*\n\n${messageText}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${doctorPhone}`
    });

    // Send to patient
    await client.messages.create({
      body: `✅ *Your Appointment is Confirmed!*\n\n${messageText}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${patientPhone}`
    });

    res.json({ success: true, message: "✅ WhatsApp messages sent to doctor and patient." });
  } catch (error) {
    console.error("Error sending WhatsApp messages:", error.message);
    res.status(500).json({ success: false, error: "❌ Failed to send WhatsApp messages." });
  }
});



// Root route
app.get("/", (req, res) => {
  res.send("Doctor Appointment API is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
