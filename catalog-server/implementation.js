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

  exports.update = async (req, res) => {
    const { item_number } = req.params;
    const { cost, quantity } = req.body;
  
    if (!cost && !quantity) {
      res.status(400).json({ error: 'Missing parameters for update.' });
      return;
    }
  
    const updateQuery = 'UPDATE books SET ' +
      (cost ? 'cost = ? ' : '') +
      (cost && quantity ? ', ' : '') +
      (quantity ? 'quantity = ? ' : '') +
      'WHERE id = ?';
  
    const params = [];
    if (cost) params.push(cost);
    if (quantity) params.push(quantity);
    params.push(item_number);
  
    db.run(updateQuery, params, function (err) {
      if (err) {
        res.status(500).json({ error: 'Failed to update data in the catalog.' });
        return;
      }
  
      if (this.changes === 0) {
        res.status(404).json({ error: 'Book not found for update.' });
      } else {
        res.json({ status: 'success' });
      }
    });
  };

