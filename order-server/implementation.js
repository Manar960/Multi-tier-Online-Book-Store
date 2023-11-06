const db = require('./db');
exports.makePurchase = async (req, res) => {
  const { book_id } = req.params;

  // If the ID is not a number, reject the purchase
  if (!/^\d+$/.test(book_id)) {
    return res.status(422).json({ message: 'Book ID must be a number' });
  }

  // Query the book from the SQLite database
  db.get('SELECT * FROM books WHERE book_id = ?', [book_id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to query the database' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Book with the specified ID does not exist' });
    }

    // Extract the book information from the database
    const book = row;

    if (book.quantity <= 0) {
      return res.json({ success: false, message: 'Book with the specified ID is out of stock' });
    }

    // Update the book quantity in the SQLite database
    db.run('UPDATE books SET quantity = quantity - 1 WHERE book_id = ?', [book_id], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ error: 'Failed to update the database' });
      }

      return res.json({ success: true, message: 'Book with the specified ID purchased' });
    });
  });

  
};