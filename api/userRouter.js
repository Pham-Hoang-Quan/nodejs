// file userRoutes.js

const express = require('express');
const userRouter = express.Router();
const db = require('../config/dbConfig.js');


// chức năng đăng kí, thêm user và bẳng users
userRouter.post('/', (req, res) => {
  const {
    userId,
    username,
    fullName,
    email,
    password,
    avatarUrl,
    phoneNumber,
  } = req.body;

  const sql = 'INSERT INTO users (userId, username, fullName, email, password, avatarUrl, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [userId, username, fullName, email, password, avatarUrl, phoneNumber],
    (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'An error occurred' });
        return;
      }
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
});

// lấy tất cả user của hệ thống
userRouter.get('/', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }
    res.status(200).json(results);
  });
});

// lấy danh sách user đã từng nhắn tin
userRouter.get('/:userId/messages', (req, res) => {
  const userId = req.params.userId;
  const sql = `
      SELECT distinct
        u.userId,
        u.username,
        u.fullName,
        u.avatarUrl
      FROM
        users u
      JOIN
        (
          SELECT
            CASE
              WHEN sender_id = ? THEN receiver_id
              ELSE sender_id
            END AS user_id
          FROM
            messages
          WHERE
            sender_id = ?
            OR receiver_id = ?
        ) m
      ON
        u.userId = m.user_id;
    `;

  db.query(sql, [userId, userId, userId], (error, results) => {
    if (error) {
      console.error('Lỗi truy vấn:', error);
      res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
    } else {
      res.json(results);
    }
  });
});
// lấy thông tin của user truyền vào userID
userRouter.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT *
    FROM users
    WHERE userId = ?;
    `;

  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error('Lỗi truy vấn:', error);
      res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
    } else {
      res.json(results);
    }
  });
});

module.exports = userRouter;
