const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const dns        = require('dns');
const { URL }    = require('url');
const sqlite3    = require('sqlite3').verbose();

const app = express();
app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Открываем (или создаём) файл базы
const db = new sqlite3.Database('./database.sqlite', err => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

// Создаём таблицу, если её нет
db.run(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL UNIQUE
  )
`);

app.post('/api/shorturl', (req, res) => {
  const original = req.body.url;
  let hostname;

  // Парсим URL, чтобы получить хостнейм
  try {
    hostname = new URL(original).hostname;
  } catch {
    return res.json({ error: 'invalid url' });
  }

  // Проверяем, что домен существует
  dns.lookup(hostname, err => {
    if (err) return res.json({ error: 'invalid url' });

    // Ищем уже существующую запись
    db.get(
      'SELECT id FROM urls WHERE original_url = ?',
      [original],
      (err, row) => {
        if (err) return res.json({ error: 'server error' });
        if (row) {
          // Уже было добавлено ранее
          return res.json({
            original_url: original,
            short_url: row.id
          });
        }
        // Вставляем новую
        db.run(
          'INSERT INTO urls(original_url) VALUES(?)',
          [original],
          function(err) {
            if (err) return res.json({ error: 'server error' });
            res.json({
              original_url: original,
              short_url: this.lastID
            });
          }
        );
      }
    );
  });
});

app.get('/api/shorturl/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get(
    'SELECT original_url FROM urls WHERE id = ?',
    [id],
    (err, row) => {
      if (err) return res.json({ error: 'server error' });
      if (!row) return res.json({ error: 'No short URL found for the given input' });
      // Перенаправляем на оригинальный URL
      res.redirect(row.original_url);
    }
  );
});

// Запускаем
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
