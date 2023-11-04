const express = require('express');
const route = express.Router();
const db = require('../config/dbConfig.js');

route.get('/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT * FROM users WHERE userId = ?';
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn:', err);
        res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Không tìm thấy user với ID đã cho' });
      } else {
        const user = results[0]; // Lấy user đầu tiên từ kết quả (nếu có)
  
        res.status(200).json(user);
      }
    });
  });
  module.exports = route;