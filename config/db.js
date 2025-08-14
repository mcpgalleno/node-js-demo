// configure db here
const mongoose = require('mongoose')

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST || 'localhost'
const port = process.env.DB_PORT || 27017
const database = process.env.DB_MAIN_DATABASE || 'mydatabase'
const connStringOps = process.env.MONGO_DB_CONNECTIONSTRING_OPTION
const srvConnection = process.env.MONGO_DB_SRV_CONNECTION

const url = `mongodb://localhost:27017/node_db`
mongoose.connect(url);

const conn = mongoose.connection;
conn.on('error', () => console.error.bind(console, 'Connection error'));
conn.once('open', () => console.info('Connection to the Database is successful'));

module.exports = conn;