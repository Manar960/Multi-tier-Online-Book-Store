const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:/dos1.db'); // Provide the correct path to your SQLite database file

exports.searchBooks = (req, res) => {
  const searchTerm = req.params.topic;

  const query = 'SELECT * FROM books WHERE title LIKE ? OR topic LIKE ?';
  db.all(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
    if (err) {
      console.error('Error executing the query: ' + err.message);
      res.status(500).json({ error: 'An error occurred while searching for books' });
    } else {
      res.status(200).json({ books: results });
    }
  });
};

exports.info = (req, res) => {
  const itemNumber = req.params.item_number;
  const query = 'SELECT * FROM books WHERE id = ?';

  db.get(query, itemNumber, (err, result) => {
    if (err) {
      console.error('Error executing the query: ' + err.message);
      res.status(500).json({ error: 'An error occurred while retrieving book information' });
    } else {
      if (!result) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.status(200).json({ book: result });
      }
    }
  });
};

exports.purchase = (req, res) => {
  const itemNumber = req.params.item_number;
  const query = 'SELECT * FROM books WHERE id = ?';

  db.get(query, itemNumber, (err, result) => {
    if (err) {
      console.error('Error executing the query: ' + err.message);
      res.status(500).json({ error: 'An error occurred while processing the purchase' });
    } else {
      if (!result) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        const book = result;
        if (book.stock > 0) {
          // Decrease the stock by 1 and update the database
          const updateQuery = 'UPDATE books SET stock = stock - 1 WHERE id = ?';
          db.run(updateQuery, itemNumber, (updateErr) => {
            if (updateErr) {
              console.error('Error updating books stock: ' + updateErr.message);
              res.status(500).json({ error: 'An error occurred while processing the purchase' });
            } else {
              res.status(200).json({ message: 'Purchase successful' });
            }
          });
        } else {
          res.status(400).json({ error: 'The item is out of stock' });
        }
      }
    }
  });
};
