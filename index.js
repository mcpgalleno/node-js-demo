const express = require('express')
const app = express()
const PORT = '8080'
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors())
require('./config/db');
require('./config/router')(app);
require('dotenv').config();
app.use(express.json())

app.listen(PORT, () => console.log("Live"))