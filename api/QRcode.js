const express = require('express');
const route = express.Router();
const QRCode = require('qrcode');

// Route để tạo QR code dựa vào ID
route.get('/:id', (req, res) => {
    const userId = req.params.id;
    const content = `http://localhost:3000/profile/${userId}`;
  
    QRCode.toString(content,{type:"image/png"}, (err, url) => {
      if (err) {
        console.error('Lỗi khi tạo QR code:', err);
        res.status(500).json({ error: 'Lỗi khi tạo QR code' });
      } else {
        res.status(200).json({ qrcode_url: url });
      }
    });
  });

module.exports = route;
