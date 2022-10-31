require('dotenv').config({path: './config/.env'})
const File = require("./models/file");
const fs = require('fs');
const connectDB = require('./config/db');
const colors = require("colors");


const deleteData = async () => {
    connectDB();
    const pastDate = new Date(Date.now() - (60*60*24*1000));

    const files = await File.find({ createdAt: {$lt: pastDate} })

    if(files.length) {
        for(const file of files) {
            try{
                fs.unlinkSync(file.path)
                await file.remove()
                console.log(`Successfuly deleted ${file.filename}`)
            }catch(err) {
                console.log("While Deleting Files");
            }
        }

        console.log("Job Done...!")
    }
}

deleteData().then(process.exit)