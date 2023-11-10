const db = require('./db');

  exports.info = async (req, res) => {
    const { item_number } = req.params;
  db.get('SELECT * FROM books WHERE id = ?', item_number, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to retrieve data from the catalog.' });
      return;
    }
    res.json({ book: rows });
  });
};

  exports.searchBooks = async (req, res) => {
    const { topic } = req.params;
    db.all('SELECT * FROM books WHERE topic = ?', topic, (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Failed to retrieve data from the catalog.' });
        return;
      }
      res.json({ books: rows });
    });
  };

