import React, { useEffect, useState } from 'react'
import Logo from '../assets/BookwiseLogo.png'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon, Box
} from '@chakra-ui/react'

import { useLocation } from 'react-router-dom';
import { data } from 'autoprefixer';



const items = [
  {
    id: 1,
    title: 'Back End Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote'
  },
  {
    id: 2,
    title: 'Front End Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote'
  },
  {
    id: 3,
    title: 'User Interface Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'Remote'
  }
]

const itemsPerPage = 10

const Taskeaways = () => {
  const location = useLocation();
  const { pdfId, chapterArr } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);

  console.log("CURRENT PAGE  " , currentPage);

  console.log('ID', pdfId);
  console.log('Chapter', chapterArr);
  console.log('ITEMS: ', items);

  const pdfBody = chapterArr ? chapterArr[currentPage - 1] : '';

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
      console.log('Response from backend:', data);

      // Update state to append the new data
      setItems([data]);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  useEffect(() => {
    if (pdfId && pdfBody) {
      sendDataToBackend(pdfId, pdfBody);
      console.log('HELLOOO');
    }
  }, [pdfId, pdfBody, currentPage]);

  // Calculate the indices of items to show on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // If next page is beyond total pages, optionally handle this case
      console.log('No more pages');
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      // If previous page is before page 1, optionally handle this case
      console.log('Already on the first page');
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

        <div className="col-span-full">
          <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
            About
          </label>
          <div className="mt-2">
            <textarea
              id="about"
              name="about"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={''}
            />
          </div>
          {items.map((item, index) => (
            <div key={index}>{item}</div>  // Ensure items are rendered as strings or elements
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
  )
}

export default Taskeaways
