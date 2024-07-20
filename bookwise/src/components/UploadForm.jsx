import React, { useState } from 'react'
import axios from 'axios';

const UploadForm = ({ }) => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        try {
            const response = await fetch('http://localhost:8080/extract-text', {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Stored PDF:', data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="relative">
            <div className="inset-0 z-10 w-full h-screen overflow-y-auto">
                <div className="absolute inset-0 w-full h-full bg-gray-500 opacity-75">
                </div>
                <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    </span>
                    <div className="relative inline-block overflow-hidden transition-all transform sm:align-middle sm:max-w-lg" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div>
                            <div className="rounded-lg p-8 bg-white shadow">
                                <div className="bg-white dark:bg-gray-800 ">
                                    <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">

                                        <form onSubmit={handleSubmit}>
                                            <div className='mb-5'>
                                                <label htmlFor="">File Name: </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Title"
                                                    required
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                            </div>

                                            <div className='mb-5'>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="application/pdf"
                                                    required
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                />

                                            </div>

                                            <button
                                                type="submit"
                                                className="flex w-full justify-center rounded-md bg-darkBlue px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                Upload
                                            </button>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadForm