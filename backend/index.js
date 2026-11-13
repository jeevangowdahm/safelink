require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/sos', require('./routes/sos'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/helplines', require('./routes/helplines'));
app.use('/api/checkin', require('./routes/checkin'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'SafeLink Bangalore API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 SafeLink Bangalore API running on port ${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/\n`);
});
