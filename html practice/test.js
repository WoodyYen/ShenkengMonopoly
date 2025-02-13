const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  host: 'dpg-cumpuelsvqrc73fjitf0-a.singapore-postgres.render.com',
  port: 5432,
  user: 'shenkeng20250213_user',
  password: 'plhZsmsNkoQtcgE7p3h2zbx4c9Y3lPnd',
  database: 'shenkeng20250213',
  ssl: { rejectUnauthorized: false }
});

async function getImage() {
  try {
    const res = await pool.query('SELECT image_data FROM images WHERE id = $1', [1]);

    if (res.rows.length > 0) {
      fs.writeFileSync('output.png', res.rows[0].image_data);
      console.log('圖片已存為 output.png！🎉');
    } else {
      console.log('❌ 找不到圖片！');
    }

  } catch (err) {
    console.error('讀取圖片錯誤：', err);
  } finally {
    pool.end();
  }
}

getImage();
