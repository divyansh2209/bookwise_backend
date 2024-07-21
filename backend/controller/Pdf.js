const Pdf = require('../model/Pdf');
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { spawn } = require('child_process');

const Together = require("together-ai");
const together = new Together({ apiKey: "f586ecd64b69edebba90fe42619919a9e33ef084253799ab5af009a72db064e5" });


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


const prompt = `I want to create chapter-wise summaries in a flashcard format for books. Each chapter should be summarized into 3-5 flashcards, depending on the chapter's length. Each flashcard should contain:

A shortDesc - a concise summary that includes all the key points. This should be about a short paragraph long.
A longDesc - an expanded version of the shortDesc, providing more context and detail. This should be a long paragraph long.
For training purposes, I'll provide the text of each chapter. Your task is to generate a JSON output with the structure as shown in the example below. The summaries should be clear, informative, and include all the essential information.
Here's an example of how the output should look for a chapter from "The Art of War": {
    {
        "Chapter 3": {
            "Flash1": {
                "shortDesc": "Capture the enemy's resources and forces intact for greater strategic advantage rather than destroying them.",
                "longDesc": "Sun Tzu advises that preserving the enemy's territory and forces is more beneficial than total destruction. Capturing their assets offers greater control and strategic advantage, reduces the cost of rebuilding, and ensures a more favorable outcome in war."
            },
            "Flash2": {
                "shortDesc": "True mastery in war is achieved by breaking the enemy's will rather than engaging in every battle.",
                "longDesc": "Supreme excellence in warfare involves undermining the enemy's will and plans without direct combat. This approach preserves resources and minimizes losses, achieving strategic dominance through disruption and outmaneuvering."
            },
        }
    }
}   
To summarize:
Provide chapter text as input.
Output should be a JSON object with chapter-wise summaries.
Each chapter contains 3-5 flashcards.
Each flashcard has a shortDesc (short paragraph) and a longDesc (long paragraph).
shortDesc should be concise and include all key points.
longDesc should provide additional context and detail.
Remember: Just give the JSON as the response and add nothing else, no other text apart from JSON! (High priority);
Complete the full json within 250 tokens and dont produce any gibberish

Input - 
later that I came across a new understanding of where suffering
comes from that I was able to stop it at its source.
As I began my journey of self-improvement, I came across a
myriad of different teachings, studies, and methods to help people
overcome their problems. I read dozens, if not hundreds of books,
studied psychology, went to therapists, listened to many different
thought leaders, tried changing my habits, waking up at 4am,
changing my diet, becoming more structured and disciplined,
shadow work, studying personality types, meditating daily, going on
spiritual retreats, following spiritual masters, and researching
different ancient religions.`;

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
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: [],
        stream: false
    });
    // console.log("P", prompt)
    // console.log("Res", response);
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
        const intialPromp = `I want to create chapter-wise summaries in a flashcard format for books. Each chapter should be summarized into 3-5 flashcards, depending on the chapter's length. Each flashcard should contain:

A shortDesc - a concise summary that includes all the key points. This should be about a short paragraph long.
A longDesc - an expanded version of the shortDesc, providing more context and detail. This should be a long paragraph long.
For training purposes, I'll provide the text of each chapter. Your task is to generate a JSON output with the structure as shown in the example below. The summaries should be clear, informative, and include all the essential information.
Here's an example of how the output should look for a chapter from "The Art of War": {{
    "Chapter 3": {
        "Flash1": {
            "shortDesc": "Capture the enemy's resources and forces intact for greater strategic advantage rather than destroying them.",
            "longDesc": "Sun Tzu advises that preserving the enemy's territory and forces is more beneficial than total destruction. Capturing their assets offers greater control and strategic advantage, reduces the cost of rebuilding, and ensures a more favorable outcome in war."
        },
        "Flash2": {
            "shortDesc": "True mastery in war is achieved by breaking the enemy's will rather than engaging in every battle.",
            "longDesc": "Supreme excellence in warfare involves undermining the enemy's will and plans without direct combat. This approach preserves resources and minimizes losses, achieving strategic dominance through disruption and outmaneuvering."
        },
        "Flash3": {
            "shortDesc": "Avoid prolonged sieges to prevent high casualties and resource depletion; use more efficient strategies.",
            "longDesc": "Prolonged sieges lead to significant casualties and resource depletion. Sun Tzu recommends avoiding sieges when possible, favoring strategies that achieve objectives with minimal cost and greater efficiency."
        }
    }
}
}

To summarize:
Provide chapter text as input.
Output should be a JSON object with chapter-wise summaries.
Each chapter contains 3-5 flashcards.
Each flashcard has a shortDesc (short paragraph) and a longDesc (long paragraph).
shortDesc should be concise and include all key points.
longDesc should provide additional context and detail.
Remeber : Just give the json as the response and add nothing else, no other text apart from json!(High priority) `

        const finalBody = intialPromp + pdfBody;
        const llmResponse = await callTogetherAI(finalBody);
        console.log("LLM", llmResponse);

        const response = extractJsonFromText(llmResponse);
        if (!response) {
            return res.status(400).json({ error: 'Failed to extract valid JSON from response.' });
        }

        console.log("CLEANED:", response);

        // Find the PDF document by ID
        const pdf = await Pdf.findById(pdfId);

        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        // Process the response and update processed_data
        pdf.processed_data = Object.keys(response).map((chapterKey) => ({
            [chapterKey]: response[chapterKey]
        }));

        await pdf.save();

        res.status(200).json({ message: 'Processed data saved successfully', processed_data: pdf.processed_data });
    } catch (error) {
        console.error('Error in getResult:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


function extractJsonFromText(text) {
    const jsonRegex = /{[\s\S]*}/;
    const match = text.match(jsonRegex);
    if (match) {
        console.log('Extracted JSON:', match[0]); // Debugging statement
        try {
            // Find the first '{' and the last '}' to ensure we get the complete JSON
            const firstBraceIndex = text.indexOf('{');
            const lastBraceIndex = text.lastIndexOf('}');
            const jsonString = text.substring(firstBraceIndex, lastBraceIndex + 1);
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return null;
        }
    } else {
        console.error('No JSON found in the text.');
        return null;
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