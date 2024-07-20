import React, { useState } from 'react';
import Logo from './assets/BookwiseLogo.png';
import axios from 'axios';
import UploadForm from './components/UploadForm';

const Landing = () => {
  const [formState, setFormState] = useState(false);


  return (
    <section className='bg-[#CAF4FF] overflow-y-auto h-screen'>

      {formState && <UploadForm />}

      <div className='flex my-5 mx-4 mb-7'>
        <img src={Logo} alt="Bookwise Logo" className='w-7 mr-2' />
        <h1 className='text-primaryBlue text-2xl font-bold'>Bookwise</h1>
      </div>

      <div className='mx-5 px-2 border-[0.15rem] rounded-lg bg-white py-16 md:mx-[6rem] lg:px-[10rem]'>
        <div className='px-4 py-6'>
          <h1 className='text-darkBlue text-center py-4 text-[1.5rem] md:text-[1.9rem]  font-semibold'>
            Books Simplified, Focus Amplified
          </h1>
          <p className='text-lightBlue text-center text-[1.1rem] md:text-[1.3rem]'>
            Your AI-powered reading companion, built to enhance focus and
            understanding for the social media generation.
          </p>
        </div>
        <div className='flex justify-center py-4'>
          <button onClick={() => setFormState(!formState)} className='px-4 py-2 rounded-lg bg-buttonBg hover:bg-buttonHover text-darkBlue font-medium'>
            Upload your book
          </button>
        </div>
      </div>
      
    </section>
  );
};

export default Landing;
