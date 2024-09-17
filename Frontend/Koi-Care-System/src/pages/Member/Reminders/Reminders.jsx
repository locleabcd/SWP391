import LeftSideBar from '../../../components/Member/LeftSideBar'

function Reminders() {
  return (
    <div>
      {/* member page */}
      <div className='min-h-screen px-3 py-3 flex bg-gray-100 gap-5'>
        {/* sidebar */}
        <LeftSideBar />
        {/* dashboard page  */}
        <div className='w-5/6 bg-white text-black shadow-xl rounded-md flex flex-col'>
          {/* 4 ô trên  */}
          <div className='h-1/4  m-2 flex flex-row gap-2'>
            {/* item  */}
            <div className='flex-1 bg-white border border-gray-200 shadow-sm rounded-md'></div>
            <div className='flex-1 bg-white border border-gray-200 shadow-sm rounded-md'></div>
            <div className='flex-1 bg-white border border-gray-200 shadow-sm rounded-md'></div>
            <div className='flex-1 bg-white border border-gray-200 shadow-sm rounded-md'></div>
          </div>

          <div className='h-3/4 flex flex-row gap-2 '>
            <div className='flex-3 bg-white border border-gray-200 shadow-sm rounded-md'> </div>
            <div className='flex-1 bg-white border border-gray-200 shadow-sm rounded-md'> </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reminders
