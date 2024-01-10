const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');


const csvFilePath = 'books2.csv';
const replicaUrl = 'http://localhost:3004';

exports.info = async (req, res) => {
  const { item_number } = req.params;

  const foundBook = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.id === item_number) {
        foundBook.push(row);
      }
    })
    .on('end', () => {
      if (foundBook.length === 0) {
        res.status(404).json({ error: 'Book not found.' });
      } else {
        res.json({ book: foundBook[0] });
      }
    });
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
  let hasChanges = false;

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row.id === item_number) {
        if (cost && row.cost !== cost) {
          row.cost = cost;
          hasChanges = true;
        }
        if (quantity && row.quantity !== quantity) {
          row.quantity = quantity;
          hasChanges = true;
        }
      }
      updatedBooks.push(row);
    })
    .on('end', async() => {
      if (hasChanges) {
        const writeStream = fs.createWriteStream(csvFilePath);
        writeStream.write('id,title,topic,cost,quantity\n');
        updatedBooks.forEach((row) => {
          writeStream.write(`${row.id},${row.title},${row.topic},${row.cost},${row.quantity}\n`);
        });
        writeStream.end();
        res.json({ status: 'success' });

        try {
          await axios.put(`${replicaUrl}/update/${item_number}`, {cost,quantity});
        } catch (error) {
          console.error(error);
        }
      } else {
        res.status(200).json({ status: 'success', message: 'No changes to update.' });
      }
    });
};

