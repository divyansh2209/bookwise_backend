import React from 'react';
import Logo from './assets/BookwiseLogo.png'; // Correct import

const Landing = () => {
  return (
    <section className='bg-[#CAF4FF] overflow-y-auto h-screen'>
      <div className='flex my-5 mx-4 mb-7'>
        <img src={Logo} alt="Bookwise Logo" className='w-7 mr-2'/> {/* Added alt attribute */}
        <h1 className='text-[#5AB2FF] text-2xl font-bold'>Bookwise</h1>
      </div>

      <div className='mx-5 px-2 border-[0.15rem] rounded-lg bg-white py-16 md:mx-[6rem] lg:px-[10rem]'>
        <div className='px-4 py-6'>
          <h1 className='text-[#004AAD] text-center py-4 text-[1.5rem] md:text-[1.9rem]  font-semibold'>
            Books Simplified, Focus Amplified
          </h1>
          <p className='text-[#2C8ED6] text-center text-[1.1rem] md:text-[1.3rem]'>
            Your AI-powered reading companion, built to enhance focus and
            understanding for the social media generation.
          </p>
        </div>
        <div className='flex justify-center py-4'>
          <button className='px-4 py-2 rounded-lg bg-[#FFF9D0] hover:bg-[#FFEBA1] text-[#004AAD] font-medium'>
            Upload your book
          </button>
        </div>
      </div>
    </section>
  );
};

export default Landing;
