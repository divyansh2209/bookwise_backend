const express = require('express');
const server = express();
const cors = require("cors");
// const multer = require('multer')
const mongoose = require('mongoose');
const pdfRoutes = require('./routes/Pdf');
const fileUpload = require("express-fileupload");
require('dotenv').config()
const path = require('path');

const distDir = path.resolve(__dirname, 'dist'); // Define the dist directory
server.use(express.static(distDir));
server.use(express.json());
server.use(cors());
server.use("/", express.static("public"));
server.use(fileUpload());


// MONGODB Connect
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('database connected');
}

//Routes
server.use('/pdf', pdfRoutes.router);


// SERVER
server.get('/', (req, res) => {
    res.json({ status: 'success' });
})

server.listen(8080, () => {
    console.log('Server Started');
})









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
// server.post("/extract-text", async (req, res) => {
//     if (!req.files || !req.files.file) {
//         return res.status(400).send('No file was uploaded.');
//     }

//     if (!req.body.title) {
//         return res.status(400).send('No title provided.');
//     }

//     try {
//         const result = await pdfParse(req.files.file);
//         const newPdf = new Pdf({
//             title: req.body.title,
//             raw_text: result.text,
//         });

//         await newPdf.save();
//         res.send(newPdf);
//     } catch (error) {
//         console.error('Error parsing PDF file or saving to database:', error);
//         res.status(500).send('Error parsing PDF file or saving to database');
//     }
// });


// //Get All PDF:
// server.get("/pdfs", async (req, res) => {
//     try {
//         const pdfs = await Pdf.find();
//         res.json(pdfs);
//     } catch (error) {
//         console.error('Error fetching PDFs:', error);
//         res.status(500).send('Error fetching PDFs');
//     }
// });
