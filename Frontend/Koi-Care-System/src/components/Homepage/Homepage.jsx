function Home() {
  return (
    <div className='content-homepage'>
      {/* content home page  */}
      <div className='flex justify-start items-center h-full'>
        <div className='flex flex-col items-center mr-auto ml-10 pt-36 w-1/2'>
          <h1 className='text-5xl font-bold text-black mb-4'>Koi Care System</h1>
          <p className='text-gray-600 text-lg font-medium mb-8'>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
            dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in
            vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et
            accumsan et iusto odio dignissim qui blandit
          </p>
          <button className='bg-white text-black border border-gray-300 border-solid  hover:bg-red-500 hover:text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline'>
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
