const express = require('express');
const bodyParser = require('body-parser');
const app = express();
<<<<<<< HEAD
const routes = require('./routes'); 
=======
>>>>>>> 386e0bd0e03ee3467d4091428ceead3e5dea1a3e
app.use(bodyParser.json());
app.use('/', routes); 
const port = process.env.PORT || 3007;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





