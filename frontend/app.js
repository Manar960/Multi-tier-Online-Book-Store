const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3001;
const routes = require('./routes'); 
app.use('/', routes); 
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
