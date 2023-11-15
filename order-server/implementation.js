const axios = require('axios');

const catalogServiceUrl = 'http://localhost:3004';

exports.purchase = async (req, res) => {
  const bookId = req.params.book_id;

  try {
    const response = await axios.get(`${catalogServiceUrl}/info/${bookId}`);
    const book = response.data.item;

    if (!book) {
      res.status(404).json({ error: 'Book not found.' });
    } else if (book.quantity <= 0) {
      res.status(400).json({ error: 'Book is out of stock.' });
    } else {
      const updatePayload = { quantity: book.quantity - 1 };
      await axios.put(`${catalogServiceUrl}/update/${bookId}`, updatePayload);

      res.json({ message: 'Book purchase successful' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check stock availability or update book stock.' });
  }
};
