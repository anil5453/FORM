const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// Twilio credentials (for demo/testing only)
const accountSid = 'AC15fd4a9ed904d4cad4163d975d04cc93';
const authToken = '6b1bbcecaa480c69a323154dcccf7981';
const fromWhatsAppNumber = 'whatsapp:+14155238886';

const client = twilio(accountSid, authToken);

// Test route
app.get('/', (req, res) => {
  res.send('✅ WhatsApp backend is live!');
});

// Send WhatsApp message
app.post('/send-whatsapp', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ message: '🚫 "to" and "message" fields are required.' });
  }

  try {
    const response = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${to}`,
      body: message,
    });

    console.log('✅ Message sent:', response.sid);
    res.json({ message: '✅ WhatsApp message sent successfully.', sid: response.sid });
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.message || error);
    res.status(500).json({ message: '❌ Failed to send WhatsApp message.', error: error.message || error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});