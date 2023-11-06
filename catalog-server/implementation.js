const db = require('./db');
class Book {
    static get(book_id, callback) {
      const query = 'SELECT * FROM books WHERE id = ?';
      db.get(query, [book_id], callback);
    }
  
    static search(book_topic, callback) {
      const query = 'SELECT * FROM books WHERE topic = ?';
      db.all(query, [book_topic], callback);
    }
  
    static update(book_id, data, callback) {
      const fields = [];
      const values = [];
  
      for (const key in data) {
        if (data[key] !== undefined) {
          fields.push(key + ' = ?');
          values.push(data[key]);
        }
      }
  
      if (fields.length === 0) {
        return callback('No valid fields to update');
      }
  
      values.push(book_id);
  
      const query = `UPDATE books SET ${fields.join(', ')} WHERE id = ?`;
      db.run(query, values, (error) => {
        if (error) {
          callback(error);
        } else {
          this.get(book_id, callback);
        }
      });
    }
  }
  
  // Define query methods
  const queries = {
    item: {
      query_handler: (param, callback) => Book.get(param, callback),
      schema: (result) => result, // You can format the response as needed
    },
    topic: {
      query_handler: (param, callback) => Book.search(param, callback),
      schema: (result) => result, // You can format the response as needed
    },
  };
  exports.info = async (req, res) => {
    const method = req.params.method;
    const param = req.params.param;
  
    if (!queries[method]) {
      return res.status(404).json({
        message: 'Invalid query method',
        supportedQueryMethods: Object.keys(queries),
      });
    }
  
    queries[method].query_handler(param, (error, result) => {
      if (error) {
        return res.status(404).json({ message: 'Not found' });
      }
      const formattedResult = queries[method].schema(result);
      res.json(formattedResult);
    });
  };

  exports.makePurchase = async (req, res) => {
    const book_id = req.params.book_id;
    const book_data = req.body || {};
  
    Book.update(book_id, book_data, (error, updatedBook) => {
      if (error) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json(updatedBook);
    });

  };