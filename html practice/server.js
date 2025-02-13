const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// 啟用 CORS
app.use(cors());

// 啟用 JSON 解析
app.use(express.json());

// 靜態文件服務，設定讓單元00資料夾可以被訪問
app.use(express.static('html practice/單元00'));

// 設定根路徑，直接回應 Monopoly.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html practice/單元00/Monopoly.html');
});

// 資料庫配置
const pool = new Pool({
  host: 'dpg-cumpuelsvqrc73fjitf0-a.singapore-postgres.render.com',
  port: 5432,
  user: 'shenkeng20250213_user',
  password: 'plhZsmsNkoQtcgE7p3h2zbx4c9Y3lPnd',
  database: 'shenkeng20250213',
  ssl: { rejectUnauthorized: false } // Render 需要 SSL 連線
});

// 設定 Multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  }
});

// 上傳端點
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '未收到圖片' });
    }

    const { image_name, image_description } = req.body;
    const image_data = req.file.buffer;

    const result = await pool.query(
      'INSERT INTO images (image_name, image_description, image_data) VALUES ($1, $2, $3) RETURNING id',
      [image_name, image_description, image_data]
    );

    res.json({ 
      message: '圖片上傳成功', 
      imageId: result.rows[0].id 
    });

  } catch (err) {
    console.error('上傳錯誤：', err);
    res.status(500).json({ message: '伺服器錯誤，上傳失敗', error: err.message });
  }
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '伺服器錯誤' });
});

app.listen(port, () => {
  console.log(`伺服器運行在 http://localhost:${port}`);
});


// //第一版
// const express = require('express');
// const multer = require('multer');
// const { Pool } = require('pg');
// const fs = require('fs');

// const app = express();
// const port = 3000;

// // 資料庫配置
// const pool = new Pool({
//   host: 'dpg-cumpuelsvqrc73fjitf0-a',
//   port: 5432,
//   user: 'shenkeng20250213_user',
//   password: 'plhZsmsNkoQtcgE7p3h2zbx4c9Y3lPnd',
//   database: 'shenkeng20250213',
// });

// // 設定 Multer 來處理圖片上傳
// const storage = multer.memoryStorage(); // 儲存為內存中的Buffer
// const upload = multer({ storage });

// // 接收上傳的圖片和資料
// app.post('/upload', upload.single('image'), async (req, res) => {
//   const { image_name, image_description } = req.body;
//   const image_data = req.file.buffer;

//   try {
//     const result = await pool.query(
//       'INSERT INTO images (image_name, image_description, image_data) VALUES ($1, $2, $3) RETURNING id',
//       [image_name, image_description, image_data]
//     );
//     res.json({ message: '圖片上傳成功', imageId: result.rows[0].id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: '上傳失敗' });
//   }
// });

// // 啟動伺服器
// app.listen(port, () => {
//   console.log(`伺服器運行在 http://localhost:${port}`);
// });
