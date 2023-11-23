const axios = require('axios');

const orderServiceUrl = 'http://localhost:3007'; 
const catalogServiceUrl = 'http://localhost:3004';

exports.info = async (req, res) => {
  const { item_number } = req.params;
  try {
    const response = await axios.get(`${catalogServiceUrl}/info/${item_number}`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data from the catalog service.' });
  }
};



// Function to search for books by topic
exports.searchBooks = async (req, res) => {
  const { topic } = req.params;
  try {
    const response = await axios.get(`${catalogServiceUrl}/search/${topic}`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data from the catalog service.' });
  }
};



exports.purchase = async (req, res) => {
    const { book_id } = req.params;
    try {
      const response = await axios.get(`${orderServiceUrl}/buy/${book_id}`);
      res.json({ message: 'Purchase successful' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process the purchase.' });
    }
  
};


