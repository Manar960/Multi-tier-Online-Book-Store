const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const routes = require('./routes'); 
app.use('/', routes); 
const port = process.env.PORT || 3010;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





