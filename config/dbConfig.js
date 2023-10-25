

const mysql = require('mysql');

// Tạo kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatsystem',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = db; // Xuất kết nối cơ sở dữ liệu để sử dụng trong các tệp khác
