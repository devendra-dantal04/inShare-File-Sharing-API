require('dotenv').config({path: './config/.env'})
const express = require("express");
const app = express();
const colors = require('colors');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

connectDB();

//CORS

const corsOptions = {
    origin : process.env.ALLOWED_CLIENTS.split(','),
}

app.use(cors(corsOptions))


app.use(express.static('public'));
app.use(express.json());


//Template engine
app.set('views', path.join(__dirname, "/views"));
app.set('view engine', 'ejs');

//Routes
app.use("/api/files", require('./routes/files'));
app.use("/files", require('./routes/show'));
app.use("/files/download", require('./routes/download'));



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on PORT ${PORT}`.brightRed.bgBrightWhite);
})