const axios = require('axios');

const catalogServiceUrl = 'http://localhost:3004';

exports.purchase = async (req, res) => {
  const item_number = req.params.book_id;

  try {
    // Check if the book is in stock
    const response = await axios.get(`${catalogServiceUrl}/info/${item_number}`);
    const book = response.data.book;
    if (!book) {
      res.status(404).json({ error: 'Book not found.' });
    } 
    else if (book.quantity <= 0) {
      res.status(400).json({ error: 'Book is out of stock.' });
    } 
    else {
      // Update stock and perform the purchase
      const updatePayload = { cost: book.cost,  quantity: book.quantity - 1 };
      await axios.put(`${catalogServiceUrl}/update/${item_number}`, updatePayload);

      res.json({ message: 'Book purchase successful' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check stock availability or update book stock.' });
  }
};
