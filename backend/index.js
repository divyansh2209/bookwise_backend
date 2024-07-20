const express = require('express');
const server = express();
const cors = require("cors");
// const multer = require('multer')
const mongoose = require('mongoose');


const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const Pdf = require('./model/Pdf');


server.use(cors());
server.use("/", express.static("public"));
server.use(fileUpload());

// MONGODB Connect
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb+srv://divyanshracvik2209:NeuralBlocks@cluster0.5hwcnpd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('database connected');
}


// PDF UPLOAD MULTER

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./files");
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now();
//         cb(null, uniqueSuffix + file.originalname);
//     },
// });

// const upload = multer({ storage: storage })

// server.post("/upload-files", upload.single("file"), async (req, res) => {
//     console.log(req.file)
// })



// PDF reader
server.post("/extract-text", async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file was uploaded.');
    }

    if (!req.body.title) {
        return res.status(400).send('No title provided.');
    }

    try {
        const result = await pdfParse(req.files.file);
        const newPdf = new Pdf({
            title: req.body.title,
            raw_text: result.text,
        });

        await newPdf.save();
        res.send(newPdf);
    } catch (error) {
        console.error('Error parsing PDF file or saving to database:', error);
        res.status(500).send('Error parsing PDF file or saving to database');
    }
});


// SERVER

server.get('/', (req, res) => {
    res.json({ status: 'success' });
})

server.listen(8080, () => {
    console.log('Server Started');
})
