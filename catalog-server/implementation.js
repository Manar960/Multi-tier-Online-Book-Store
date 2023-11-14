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


  exports.purchase = async (req, res) => {
    const bookId = req.params.book_id;
  
    db.serialize(() => {
      // Check if the book is in stock
      db.get('SELECT stock FROM books WHERE id = ?', [bookId], (err, book) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: 'Failed to check stock availability.' });
        } else if (!book) {
          res.status(404).json({ error: 'Book not found.' });
        } else if (book.stock <= 0) {
          res.status(400).json({ error: 'Book is out of stock.' });
        } else {
          // Update stock and perform the purchase
          db.run('UPDATE books SET stock = stock - 1 WHERE id = ?', [bookId], (updateErr) => {
            if (updateErr) {
              console.error(updateErr.message);
              res.status(500).json({ error: 'Failed to update book stock.' });
            } else {
              res.json({ message: 'Book purchase successful' });
            }
          });
        }
      });
    });
  }
  