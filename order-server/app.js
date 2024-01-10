const express = require('express');
const bodyParser = require('body-parser');

const app1 = express();
const app2 = express();

app1.use(bodyParser.json());
app2.use(bodyParser.json());

const routes = require('./routes');

app1.use('/', routes);
app2.use('/', routes);

const port1 = process.env.PORT || 3007;
const port2 = process.env.PORT || 3011; 

app1.listen(port1, () => {
  console.log(`Server 1 is running on port ${port1}`);
});

app2.listen(port2, () => {
  console.log(`Server 2 is running on port ${port2}`);
});
