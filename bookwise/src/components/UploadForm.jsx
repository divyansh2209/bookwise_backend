import React, { useContext, useState } from 'react';
import { redirect } from 'react-router-dom';
import { usePdf } from '../context/PdfContext';

const UploadForm = ({ closeModal }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    // const [pdfId, setPdfId] = useState(null);
    // const [ChapterArr , setChapterArr] = useState([]);

    const { pdfId, setPdfId, chapterArr, setChapterArr } = usePdf();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        try {
            const response = await fetch('http://localhost:8080/pdf/extract-text', {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Stored PDF:', data);
            const id = data.pdfId;
            console.log(id);
            setPdfId(id);
            setChapterArr(data.pythonScriptResponse);
            
            // console.log("PDF ID: " , id);
            closeModal(); 
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-gray-500 opacity-75" onClick={closeModal}></div>
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md z-20">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={closeModal}
                    >
                        &times;
                    </button>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Upload Your Book</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="title" className="block mb-2">File Name:</label>
                                <input
                                    type="text"
                                    id="title"
                                    className="form-control w-full px-3 py-2 border border-gray-300 rounded"
                                    placeholder="Title"
                                    required
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="file" className="block mb-2">File:</label>
                                <input
                                    type="file"
                                    id="file"
                                    className="form-control w-full px-3 py-2 border border-gray-300 rounded"
                                    accept="application/pdf"
                                    required
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-darkBlue text-white py-2 rounded hover:bg-indigo-500"
                            >
                                Upload
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadForm;
