const express = require('express');
const messageRouter = express.Router();
const db = require('../config/dbConfig.js');

// chức năng gửi tin nhắn, thêm vào bảng messages
messageRouter.post('/', (req, res) => {
    const { sender_id, receiver_id, content } = req.body;
    const timestamp = Math.floor(Date.now() / 1000);

    // Thực hiện thêm tin nhắn vào cơ sở dữ liệu với trường timestamp
    const sql = 'INSERT INTO messages (sender_id, receiver_id, content, timestamp) VALUES (?, ?, ?, NOW())';
    db.query(sql, [sender_id, receiver_id, content], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err);
            res.status(500).json({ error: 'An error occurred' });
            return;
        }
        res.status(201).json({ message: 'Message sent successfully' });
    });
});

// lấy tất cả tin nhắn của hệ thống (để test, chưa có dùng trong chức năng nào)
messageRouter.get('/', (req, res) => {
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

// chức năng hiển thị tin nhắn của 2 người trong trang ChatScreen
messageRouter.get('/:senderId/:receiverId', (req, res) => {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId; 
    const sql = `
    SELECT *
    FROM messages
    WHERE (sender_id = ? AND receiver_id = ?)
    OR (sender_id = ? AND receiver_id = ?)
    ORDER BY timestamp ASC;
    `;
  
    db.query(sql, [senderId, receiverId, receiverId, senderId], (error, results) => {
      if (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
      } else {
        res.json(results);
      }
    });
  });

module.exports = messageRouter;