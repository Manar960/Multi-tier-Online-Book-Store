const axios = require('axios');
const crypto = require('crypto');

const orderServiceUrl = 'http://localhost:3007'; 
const catalogServiceUrl = 'http://localhost:3004';

class Cache {
  constructor(maxItems = 10) {
    this.cache = {};
    this.order = [];
    this.maxItems = maxItems;
  }

  get(key) {
    return this.cache[key];
  }

  set(key, value) {
    if (this.order.length >= this.maxItems) {
      const lruKey = this.order.shift();
      delete this.cache[lruKey];
    }

    this.cache[key] = value;
    this.order.push(key);
  }

  invalidate(key) {
    delete this.cache[key];
    this.order = this.order.filter(item => item !== key);
  }

  generateHash(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }
}

const cache = new Cache();

exports.info = async (req, res) => {
  const { item_number } = req.params;

  const cacheKey = cache.generateHash(item_number);

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
  } else {
    try {

      const response = await axios.get(`${catalogServiceUrl}/info/${item_number}`);
      const data = response.data;

      cache.set(cacheKey, data);

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve data from the catalog service.' });
    }
  }
};

exports.searchBooks = async (req, res) => {
  const { topic } = req.params;

  const cacheKey = cache.generateHash(topic);

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
  } else {
    try {
      const response = await axios.get(`${catalogServiceUrl}/search/${topic}`);
      const data = response.data;

      cache.set(cacheKey, data);

      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve data from the catalog service.' });
    }
  }
};

exports.purchase = async (req, res) => {
  const { book_id } = req.params;
  try {
    const response = await axios.post(`${orderServiceUrl}/buy/${book_id}`);
    
    const cacheKey = cache.generateHash(book_id);
    cache.invalidate(cacheKey);

    res.json({ message: 'Purchase successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to process the purchase.' });
  }
};





