const axios = require('axios');
const crypto = require('crypto');

const orderServiceUrls = ['http://localhost:3007', 'http://localhost:3011'];
const catalogServiceUrls = ['http://localhost:3004', 'http://localhost:3010'];

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

class FrontEndServer {
  constructor() {
    this.orderServiceUrls = orderServiceUrls;
    this.catalogServiceUrls = catalogServiceUrls;
    this.orderServiceIndex = 0;
    this.catalogServiceIndex = 0;
  }

  getNextOrderServiceUrl() {
    const url = this.orderServiceUrls[this.orderServiceIndex];
    this.orderServiceIndex = (this.orderServiceIndex + 1) % this.orderServiceUrls.length;
    return url;
  }

  getNextCatalogServiceUrl() {
    const url = this.catalogServiceUrls[this.catalogServiceIndex];
    this.catalogServiceIndex = (this.catalogServiceIndex + 1) % this.catalogServiceUrls.length;
    return url;
  }

  async info(req, res) {
    const { item_number } = req.params;
    const cacheKey = cache.generateHash(item_number);
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${item_number}`);
      res.json(cachedData);
    } else {
      try {
        console.log(`Cache miss for ${item_number}`);
        const response = await axios.get(`${this.getNextCatalogServiceUrl()}/info/${item_number}`);
        const data = response.data;
        cache.set(cacheKey, data);
        res.header('X-Server-Processed-By', `Catalog Server at ${this.getNextCatalogServiceUrl()}`);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data from the catalog service.' });
      }
    }
  }

  async searchBooks(req, res) {
    const { topic } = req.params;
    const cacheKey = cache.generateHash(topic);
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      res.json(cachedData);
      console.log(`Cache hit for ${topic}`);

    } else {
      console.log(`Cache miss for ${topic}`);

      try {
        const response = await axios.get(`${this.getNextCatalogServiceUrl()}/search/${topic}`);
        const data = response.data;
        cache.set(cacheKey, data);
        res.header('X-Server-Processed-By', `Catalog Server at ${this.getNextCatalogServiceUrl()}`);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve data from the catalog service.' });
      }
    }
  }

  async purchase(req, res) {
    const { book_id } = req.params;
    try {
      const response = await axios.post(`${this.getNextOrderServiceUrl()}/buy/${book_id}`);
      
      const cacheKey = cache.generateHash(book_id);
      cache.invalidate(cacheKey);
      res.header('X-Server-Processed-By', `Order Server at ${this.getNextOrderServiceUrl()}`);
      res.json({ message: 'Purchase successful' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to process the purchase.' });
    }
  }
}

const cache = new Cache();
const frontEndServer = new FrontEndServer();

exports.info = frontEndServer.info.bind(frontEndServer);
exports.searchBooks = frontEndServer.searchBooks.bind(frontEndServer);
exports.purchase = frontEndServer.purchase.bind(frontEndServer);
