const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const app2 = express();

app.use(bodyParser.json());
app2.use(bodyParser.json());

const routes = require('./routes');

app.use('/', routes);
app2.use('/', routes);

const port = process.env.PORT || 3004;
const port2 = process.env.PORT || 3010;  // Use a different port for the second app

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app2.listen(port2, () => {
  console.log(`Server 2 is running on port ${port2}`);
});
