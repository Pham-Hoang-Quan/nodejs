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
        u.avatarUrl,
        u.email
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

// Cập nhật thông tin người dùng dựa trên userId, chỉ cập nhật fullName

userRouter.put('/updateFullName/:userId', (req, res) => {
  const userId = req.params.userId;
  const { fullName } = req.body; // Chỉ lấy fullName từ req.body

  const sql = `
    UPDATE users
    SET fullName = ?
    WHERE userId = ?;
  `;

  db.query(sql, [fullName, userId], (err, result) => {
    if (err) {
      console.error('Lỗi cập nhật fullname:', err);
      res.status(500).json({ error: 'Lỗi cập nhật họ và tên người dùng' });
    } else {
      res.status(200).json({ message: 'Họ và tên người dùng đã được cập nhật' });
    }
  });
});

// Cập nhật thông tin người dùng dựa trên userId, chỉ cập nhật Email

userRouter.put('/updateEmail/:userId', (req, res) => {
  const userId = req.params.userId;
  const { email } = req.body; // Chỉ lấy fullName từ req.body

  const sql = `
    UPDATE users
    SET email = ?
    WHERE userId = ?;
  `;

  db.query(sql, [email, userId], (err, result) => {
    if (err) {
      console.error('Lỗi cập nhật email:', err);
      res.status(500).json({ error: 'Lỗi cập nhật email người dùng' });
    } else {
      res.status(200).json({ message: 'email người dùng đã được cập nhật' });
    }
  });
});

// Cập nhật thông tin người dùng dựa trên userId, chỉ cập nhật SDT

userRouter.put('/updatePhoneNumber/:userId', (req, res) => {
  const userId = req.params.userId;
  const { phoneNumber } = req.body; 

  const sql = `
    UPDATE users
    SET phoneNumber = ?
    WHERE userId = ?;
  `;

  db.query(sql, [phoneNumber, userId], (err, result) => {
    if (err) {
      console.error('Lỗi cập nhật Số điện thoại:', err);
      res.status(500).json({ error: 'Lỗi cập nhật Số điện thoại người dùng' });
    } else {
      res.status(200).json({ message: 'Số điện thoại người dùng đã được cập nhật' });
    }
  });
});

userRouter.put('/updateAvtUrl/:userId', (req, res) => {
  const userId = req.params.userId;
  const { avatarUrl } = req.body; // Chỉ lấy fullName từ req.body

  const sql = `
    UPDATE users
    SET avatarUrl = ?
    WHERE userId = ?;
  `;

  db.query(sql, [avatarUrl, userId], (err, result) => {
    if (err) {
      console.error('Lỗi cập nhật fullname:', err);
      res.status(500).json({ error: 'Lỗi cập nhật avatar người dùng' });
    } else {
      res.status(200).json({ message: 'avatar người dùng đã được cập nhật' });
    }
  });
});


module.exports = userRouter;
