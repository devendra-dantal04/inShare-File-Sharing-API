const mongoose = require('mongoose');


const connectDB = () => {
    //Database Connection
    try {
        mongoose.connect(process.env.MONGO_CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology : true
        });

        const connection = mongoose.connection;

        if(connection) {
            console.log(`Database Connected...`.brightYellow);
        }

    }catch(err) {
        console.log(err);
        connection.on('error', console.error.bind(console, "connection error : "));
    }
}

module.exports = connectDB;