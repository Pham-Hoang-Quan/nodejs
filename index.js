const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
 
// import cấu hình database
const db = require('./config/dbConfig');

// Import tệp userRoutes.js và sử dụng nó
const userRoutes = require('./api/userRouter.js');
app.use('/users', userRoutes);

// import tệp messageRouter 
const messageRouter = require('./api/messagesRouter.js');
app.use('/messages', messageRouter);
//qr code
const qrcode = require('./api/QRcode.js');
app.use('/qrcode', qrcode);
//profile
const profile = require('./api/profile.js');
app.use('/profile', profile);
//search băng ten
const searchByName = require('./api/search.js');
app.use('/search', searchByName);




app.get('/messages', (req, res) => {
  const sql = 'SELECT * FROM messages ORDER BY timestamp DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    res.status(200).json(results);
  });
});







app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('started')
});