const fs = require('fs');
const csv = require('csv-parser');

<<<<<<< HEAD
const csvFilePath = 'books.csv';

exports.info = async (req, res) => {
  const { item_number } = req.params;

  const foundBook = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.id === item_number) {
        foundBook.push(row);
=======
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
>>>>>>> 386e0bd0e03ee3467d4091428ceead3e5dea1a3e
      }
    })
    .on('end', () => {
      if (foundBook.length === 0) {
        res.status(404).json({ error: 'Book not found.' });
      } else {
        res.json({ book: foundBook[0] });
      }
    });
<<<<<<< HEAD
};

exports.searchBooks = async (req, res) => {
  const { topic } = req.params;

  const foundBooks = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.topic === topic) {
        foundBooks.push(row);
      }
    })
    .on('end', () => {
      res.json({ books: foundBooks });
    });
};

exports.update = async (req, res) => {
  const { item_number } = req.params;
  const { cost, quantity } = req.body;
  if (!cost && !quantity) {
    res.status(400).json({ error: 'Missing parameters for update.' });
    return;
  }

  const updatedBooks = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.id === item_number) {
        if (cost) row.cost = cost;
        if (quantity) row.quantity = quantity;
      }
      updatedBooks.push(row);
    })
    .on('end', () => {
      const writeStream = fs.createWriteStream(csvFilePath);
      writeStream.write('id,title,author,topic,cost,quantity\n'); // CSV header
      updatedBooks.forEach((row) => {
        writeStream.write(`${row.id},${row.title},${row.author},${row.topic},${row.cost},${row.quantity}\n`);
      });
      writeStream.end();

      res.json({ status: 'success' });
    });
};
=======
  };
  
>>>>>>> 386e0bd0e03ee3467d4091428ceead3e5dea1a3e
