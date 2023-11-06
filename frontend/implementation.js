const axios = require('axios');

const orderServiceUrl = 'http://localhost:3005'; 
const catalogServiceUrl = 'http://localhost:3004';

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

exports.info = async (req, res) => {
  const { itemNumber } = req.params;
  try {
    const response = await axios.get(`${catalogServiceUrl}/info/${itemNumber}`);
    const data = response.data;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data from the catalog service.' });
  }
};
exports.makePurchase = async (req, res) => {
  const { itemNumber } = req.params;
  try {
    const orderResponse = await axios.post(`${orderServiceUrl}/order`, {
      itemNumber,
      quantity: 1, 
    });

    if (orderResponse.data.success) {
      res.json({ message: 'Purchase successful' });
    } else {
      res.status(500).json({ error: 'Failed to place the order.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process the purchase.' });
  }
};