const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes'); 
app.use(bodyParser.json());
app.use('/', routes); 
const port = process.env.PORT || 3007;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





