import React from 'react'
import Logo from '../assets/BookwiseLogo.png'

const Taskeaways = () => {
  return (
    <section>
      <div className=' flex items-center justify-between'>
        <div className='flex items-center my-5 ml-4 mb-7'>
          <img src={Logo} alt='Bookwise Logo' className='w-7 mr-2' />
          <h1 className='text-[#5AB2FF] text-2xl font-bold'>Bookwise</h1>
        </div>
        <div className='my-5 mr-4 mb-7'>
          <button className=''>Debate With Ai</button>
        </div>
      </div>
    </section>
  )
}

export default Taskeaways
