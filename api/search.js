const express = require('express');
const userRouter = express.Router();
const db = require('../config/dbConfig.js');

// Route để tìm kiếm user bằng tên
userRouter.get('/:name', (req, res) => {
  const name = req.params.name; 
  const sql = 'SELECT * FROM users WHERE fullname LIKE ?';
  const searchTerm = `%${name}%`; // Tìm tất cả các user có tên chứa đoạn tên cần tìm

  db.query(sql, [searchTerm], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
      return;
    }

    res.status(200).json(results);
  });
});
// Route để tìm kiếm user đã nhắn tin 
userRouter.get('/message/:name', (req, res) => {
    const name = req.params.name; // Lấy tên từ phần path của URL
    const sql = 'SELECT u.* FROM `messages` m join users u ON m.sender_id=u.userId WHERE u.fullName LIKE ?';
    const searchTerm = `%${name}%`; // Tìm tất cả các user có tên chứa đoạn tên cần tìm
  
    db.query(sql, [searchTerm], (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn:', err);
        res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        return;
      }
  
      res.status(200).json(results);
    });
  });

module.exports = userRouter;
