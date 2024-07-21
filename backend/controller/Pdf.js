const Pdf = require('../model/Pdf');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { spawn } = require('child_process');

exports.fetchPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find();
        res.json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).send('Error fetching PDFs');
    }
};

exports.extractText = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file was uploaded.');
    }
    if (!req.body.title) {
        return res.status(400).send('No title provided.');
    }
    try {
        const result = await pdfParse(req.files.file);
        // Ensure the directory exists
        const path = './textFiles/';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        // Write the extracted text to a file
        const textFilePath = `${path}${req.body.title}.txt`;
        fs.writeFileSync(textFilePath, result.text, 'utf8');
        console.log('PDF parsed and text written to file.');
        
        const pythonProcess = spawn('python', ["./chapterize.py", textFilePath]);

        let pythonScriptResponse = '';
        console.log("pythonProcess: ", pythonProcess);

        pythonProcess.stdout.on('data', (data) => {
            pythonScriptResponse += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            console.error('Error from Python script:', data.toString());
        });
        
        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}`);
                return res.status(500).send('Error running Python script.');
            } else {
                console.log('Python script completed successfully.');
                try {
                    const jsonResponse = JSON.parse(pythonScriptResponse);

                    // Create new PDF document without raw_text
                    const newPdf = new Pdf({
                        title: req.body.title,
                        chapters: jsonResponse
                    });

                    // Save the PDF document to the database
                    await newPdf.save();

                    res.json({
                        message: "PDF parsed and Python script executed successfully.",
                        pythonScriptResponse: jsonResponse
                    });
                } catch (error) {
                    console.error('Error parsing Python script response:', error);
                    res.status(500).send('Error parsing Python script response.');
                }
            }
        });
    } catch (error) {
        console.error('Error parsing PDF file or saving to database:', error);
        res.status(500).send('Error parsing PDF file or saving to database');
    }
};

exports.storeChapters = async (req, res) => {
    const { id } = req.params;
    const chapters = req.body;
    console.log("ID: ", id);
    console.log("Chapters: ", chapters);
    try {
        const pdf = await Pdf.findById(id);
        if (!pdf) {
            return res.status(404).send('PDF not found');
        }
        pdf.chapters = chapters;
        await pdf.save();
        res.send(pdf);
    } catch (error) {
        console.error('Error storing chapters:', error);
        res.status(500).send('Error storing chapters');
    }
};