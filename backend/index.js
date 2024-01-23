const express = require("express");
const mongoConnection = require('./connection/db')
const mainRouter = require('./routes')
const cors = require("cors");

const app = express();

require('dotenv').config()
app.use(cors());



app.use(express.json())
app.use('/api/v1', mainRouter)

app.listen(3000, async () => {
     await mongoConnection()
     console.log('Connect to the server')

})