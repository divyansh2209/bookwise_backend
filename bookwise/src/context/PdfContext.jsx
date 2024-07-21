import React, { createContext, useState, useContext } from 'react';

const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
    const [pdfId, setPdfId] = useState(null);
    const [chapterArr, setChapterArr] = useState([]);

    return (
        <PdfContext.Provider value={{ pdfId, setPdfId, chapterArr, setChapterArr }}>
            {children}
        </PdfContext.Provider>
    );
};

export const usePdf = () => useContext(PdfContext);