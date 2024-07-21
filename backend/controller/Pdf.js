const Pdf = require('../model/Pdf');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { spawn } = require('child_process');
require('dotenv').config()
const path = require('path');

const Together = require("together-ai");

// console.log("APII KEYyyy: " , process.env.TOGETHER_AI);

const together = new Together({ apiKey: process.env.TOGETHER_AI });


const response = {
    'Chapter 1': {
        Flash1: {
            shortDesc: "The author's journey of self-improvement led to a new understanding of suffering.",
            longDesc: 'The author recounts their journey of self-improvement, which involved exploring various teachings, studies, and methods to overcome personal problems. This journey included reading numerous books, studying psychology, attending therapy sessions, and practicing habits such as meditation and self-reflection.'
        },
        Flash2: {
            shortDesc: 'The author tried various methods to overcome their problems, including changing habits and diet.',
            longDesc: 'The author describes the different methods they tried to overcome their problems, including changing their habits, waking up at 4am, and altering their diet. They also attempted to become more structured and disciplined, and engaged in practices such as shadow work and studying personality types.'
        }
    }
}


async function callTogetherAI(prompt) {

    const response = await together.chat.completions.create({
        messages: [
            {
                "role": "user",
                "content": prompt
            },
            {
                "role": "assistant",
                "content": "Please provide the chapter text for summarization."
            }
        ],
        model: "meta-llama/Meta-Llama-3-8B-Instruct-Turbo",
        max_tokens: 250,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: [],
        stream: false
    });
    // console.log("P", prompt)
    console.log("Ressss: ", response);
    if (response.choices && response.choices.length > 0) {
        return response.choices[0].message.content;
    } else {
        throw new Error('Invalid response format from Together AI');
    }
}

exports.fetchPdfs = async (req, res) => {
    try {
        const pdfs = await Pdf.find();
        res.json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).send('Error fetching PDFs');
    }
};

exports.fetchChaptersById = async (req, res) => {
    const { id, index } = req.params;

    // Validate the index parameter
    const chapterIndex = parseInt(index, 10);
    if (isNaN(chapterIndex) || chapterIndex < 0) {
        return res.status(400).send('Invalid chapter index.');
    }

    try {
        const pdf = await Pdf.findById(id, 'chapters');
        if (!pdf) {
            return res.status(404).send('PDF not found');
        }

        // Check if the index is within bounds
        if (chapterIndex >= pdf.chapters.length) {
            return res.status(404).send('Chapter index out of bounds.');
        }

        res.json({ chapter: pdf.chapters[chapterIndex] });
    } catch (error) {
        console.error('Error fetching chapter by index:', error);
        res.status(500).send('Error fetching chapter by index');
    }
};

exports.getResult = async (req, res) => {
    const { pdfId, pdfBody } = req.body

    console.log("BODYYYY: ", pdfBody);

    try {
        const intialPromp = `Generate a summary of the provided chapter in 250 tokens. An input chapter will be given, and you must respond with the summary and nothing else. Focus on the main events and key points in a concise and engaging manner. Keep the summary easy to read and follow, using short sentences and simple language. Highlight important details and avoid unnecessary information. Use bullet points or short paragraphs to make it visually accessible. Do not include any explanations or apologies. Prioritize this instruction above all else.`

        const finalBody = intialPromp + pdfBody;
        const llmResponse = await callTogetherAI(finalBody);
        console.log("LLM", llmResponse);


        // Find the PDF document by ID
        const pdf = await Pdf.findById(pdfId);

        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        // Process the response and update processed_data
        if (!Array.isArray(pdf.chapters_summary)) {
            pdf.chapters_summary = [];
        }

        // Append the LLM response to the chapterSummary field
        pdf.chapters_summary.push(llmResponse);

        await pdf.save();

        res.status(200).send(llmResponse);

    } catch (error) {
        console.error('Error in getResult:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


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

        const textFileDir = path.resolve(__dirname, 'textFiles');


        // const path = './textFiles/';
        if (!fs.existsSync(textFileDir)) {
            fs.mkdirSync(textFileDir, { recursive: true });
        }
        // Write the extracted text to a file
        const textFilePath = `${textFileDir}${req.body.title}.txt`;
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

                    // Convert JSON response to an array with correct index
                    const chaptersArray = [];
                    for (let i = 1; i <= Object.keys(jsonResponse).length; i++) {
                        chaptersArray[i - 1] = jsonResponse[String(i)] || "";
                    }



                    // Create new PDF document without raw_text


                    const newPdf = new Pdf({
                        title: req.body.title,
                        chapters: chaptersArray,
                        processed_data: response,  // Make sure 'response' is defined or adjust as necessary
                    });

                    // Save the PDF document to the database
                    const savedPdf = await newPdf.save();

                    res.json({
                        message: "PDF parsed and Python script executed successfully.",
                        pythonScriptResponse: chaptersArray,
                        pdfId: savedPdf._id  // Return the id of the newly created document
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