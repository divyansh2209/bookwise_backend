import React, { useEffect, useState } from 'react';
import Logo from '../assets/BookwiseLogo.png';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { textVide } from 'text-vide';
import parse from 'html-react-parser';

const itemsPerPage = 10;

const Taskeaways = () => {
  const location = useLocation();
  const { pdfId, chapterArr } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);

  console.log("CURRENT PAGE  ", currentPage);
  console.log('ID', pdfId);
  console.log('Chapter', chapterArr);
  console.log('ITEMS: ', items);

  const removeFirstWord = (str) => {
    const words = str.split(' ');
    return words.length > 1 ? words.slice(1).join(' ') : str;
  };

  const sendDataToBackend = async (pdfId, pdfBody) => {
    try {
      const response = await fetch('http://localhost:8080/pdf/processed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfId, pdfBody }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse response as text
      const data = await response.text();
      // data.length > 1 ? data.slice(1).join(' ') : data;
      console.log('Response from backend:', data);

      // Update state to append the new data
      setItems([data]);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  useEffect(() => {
    if (pdfId && chapterArr && currentPage > 0) {
      const pdfBody = chapterArr[currentPage - 1] || '';
      sendDataToBackend(pdfId, pdfBody);
    }
  }, [pdfId, chapterArr, currentPage]);

  const totalPages = chapterArr ? chapterArr.length : 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <section className='bg-backgroundBlue overflow-y-auto h-screen'>
      {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center my-5 ml-4 mb-7'>
          <img src={Logo} alt='Bookwise Logo' className='w-7 mr-2' />
          <h1 className='text-[#5AB2FF] text-2xl font-bold'>Bookwise</h1>
        </div>
        <div className='my-5 mr-4 mb-7'>
          <button
            className='relative px-4 py-3 m-1 overflow-hidden group bg-gradient-to-r from-[#FF7E5F] to-[#FF6B6B] rounded-lg shadow-lg cursor-pointer border-2 border-[#FF6B6B] text-white drop-shadow-2xl 
              text-sm sm:text-base 
              sm:px-6 sm:py-3'
          >
            <span
              className='absolute w-48 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-white top-1/2 group-hover:h-48 group-hover:-translate-y-32 ease 
                sm:w-64 sm:h-0 sm:group-hover:h-64 sm:group-hover:-translate-y-32'
            ></span>
            <span className='relative text-white transition duration-300 group-hover:text-[#FF6B6B] ease font-Debate'>
              Debate with AI
            </span>
          </button>
        </div>
      </div>
      {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}
      <div className='mx-5 md:mx-10'>
        <div className='mb-4'>
          {/* Chapter Name / index Name */}
          <h1 className='text-[1.5rem]'>Chapter {currentPage}</h1>
        </div>

        <div className="col-span-full bg-white p-4 rounded-lg">

          {items.map((item, index) => (
            <div className='text-lg ' key={index}>{parse(textVide(item))}</div>  // Ensure items are rendered as strings or elements
          ))}


        </div>

        <div className='flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4'>
          <button
            onClick={handlePrevPage}
            className={`cursor-pointer relative inline-flex items-center rounded-md border border-gray-300 bg-lightBlue hover:bg-darkBlue text-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50
            ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}
`}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <button
            onClick={handleNextPage}
            className={`cursor-pointer relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-lightBlue hover:bg-darkBlue text-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50
              ${currentPage === totalPages
                ? 'cursor-not-allowed opacity-50'
                : ''
              }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Taskeaways;
