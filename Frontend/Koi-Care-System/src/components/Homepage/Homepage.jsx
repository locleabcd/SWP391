function Home() {
  return (
    <div className='content-homepage'>
      <div className='flex justify-start items-center h-full'>
        <div className='flex flex-col items-center mr-auto ml-10 w-1/2'>
          <h1 className='text-7xl font-bold text-white text-start w-full mb-20'>Koi Care System</h1>
          <p className='text-white text-xl text-justify font-medium mb-8'>
            The Koi Care System Web is an innovative platform designed to simplify and enhance the management of koi
            ponds. Tailored for koi enthusiasts, breeders, and pond owners, this web application offers a comprehensive
            suite of tools to monitor and maintain the health, growth, and well-being of koi fish. From tracking
            individual koi details such as length, weight, and age to managing pond environments and keeping detailed
            growth histories, the system enables users to effectively oversee their koi collection. With user-friendly
            features like growth charts, sortable lists, and role-based access, the Koi Care System is a powerful
            resource for ensuring the optimal care of these prized fish.
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
