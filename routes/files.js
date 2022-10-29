const router = require('express').Router();
const path = require('path');
const upload = require('../middleware/uploadFile');
const File = require('../models/file');
const {v4: uuid4} = require('uuid');
const sendMail = require("../middleware/emailService");


router.post("/", (req,res) => {
    
    //Store File
    upload(req, res, async (err) => {

        //Validate Request
        if(!req.file) {
            return res.status(400).json({error : "Bhai Sabh Fields bhar na....."});
        }

        
        if(err) {
            return res.status(500).send({error : err.message})
        }

        //Store into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });
        
        const response = await file.save();

        //Response --> Link
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})

    })


});

router.post("/send", async (req,res) => {
    //validate Request
    const {uuid, emailTo, emailFrom} = req.body;

    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({error : "Tune Phir se sare fields nahi bhare kya...? "});
    }

    //Get data from database
    const file = await File.findOne({uuid : uuid});

    if(file.sender) {
        return res.status(400).send({error : "Email Pahile bhi bheja he"});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    //Send Email
    sendMail({
        from : emailFrom,
        to : emailTo,
        subject : "inShare File Sharing",
        text : `${emailFrom} shared a file with you.`,
        html : require('../middleware/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${response.uuid}`,
            size: parseInt(response.size/1000) + 'KB',
            expires : '24 hours'
        })
    })

    res.status(200).json({success : true, msg: "Email Send Successfuly."})

})

module.exports = router;