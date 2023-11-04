const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes'); // Import the routes module
app.use('/', routes); // Use the 'routes' module as middleware
app.use(bodyParser.json());

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
