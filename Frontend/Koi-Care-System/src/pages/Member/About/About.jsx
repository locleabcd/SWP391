import { useDarkMode } from '../../../components/DarkModeContext'
import Header from '../../../components/Member/Header'
import LeftSideBar from '../../../components/Member/LeftSideBar'
import TopLayout from '../../../layouts/TopLayout'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

function About() {
  const { isDarkMode } = useDarkMode()

  const teamMembers = [
    {
      name: 'The Vinh',
      role: 'Frontend Developer',
      img: 'https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg?w=740'
    },
    {
      name: 'Duc Loc',
      role: 'Leader-Backend Developer',
      img: 'https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg?w=740'
    },
    {
      name: 'Trung Kien',
      role: 'Frontend Developer',
      img: 'https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg?w=740'
    },
    {
      name: 'Minh Thoai',
      role: 'Frontend Developer',
      img: 'https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg?w=740'
    },
    {
      name: 'An Phuoc',
      role: 'Backend Developer',
      img: 'https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg?w=740'
    }
  ]

  return (
    <div className='h-screen flex'>
      <LeftSideBar />

      <div
        className={`relative ${isDarkMode ? 'bg-custom-dark text-white' : 'bg-white text-black'} shadow-xl flex-1 flex-col overflow-y-auto overflow-x-hidden`}
      >
        <Header />

        <div className='py-5 px-[30px] mx-auto'>
          <TopLayout text='About' />

          {/* Team Members Section */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mt-8'>
            {teamMembers.map((member, index) => (
              <div key={index} className='flex flex-col items-center  p-6 rounded-lg shadow-md border'>
                <img src={member.img} alt={member.name} className='w-32 h-32 rounded-full object-cover mb-4' />
                <h3 className='text-lg font-semibold text-center'>{member.name}</h3>
                <p className='text-sm text-gray-500'>{member.role}</p>
              </div>
            ))}
          </div>

          {/* About Us Text Section */}
          <div className='mt-12 rounded-lg p-6 shadow-xl border'>
            <p className='font-dancing mb-6'>Thank you for using our websites.</p>

            <p className='font-dancing'>
              Having kept and loved koi fish for several years, We came up with the idea of developing an app for koi
              owners to make fish keeping easier. Our goal is to keep the app up-to-date and to provide assistance for
              every koi owner.
            </p>
            <p className='mb-6 font-dancing'>
              Our goal is to keep the app up-to-date and to provide assistance for every koi owner. A rating in the App
              Store or sharing the app would therefore make us very happy and motivate us to continue developing
              additional features.
            </p>
            <p className='mb-6 font-dancing '>
              If you have any questions or suggestions for improvement, please send an e-mail to{' '}
              <a href='#' className='text-blue-500 underline'>
                feedback@koicaresystem.com
              </a>
              .
            </p>
            <p className='text-red-500 font-dancing'>The Koi Care Team</p>
          </div>

          {/* Social Media Links Section */}
          <div className='mt-8 '>
            <p className='mb-4 font-semibold text-center'>
              Follow us on social media where we keep you posted about exciting new features!
            </p>
            <div className='flex  gap-4 justify-center items-center'>
              <a href='https://www.facebook.com/profile.php?id=100012871843289'>
                <FaFacebook className='text-2xl hover:text-blue-600' />
              </a>
              <a href='https://www.facebook.com/profile.php?id=100012871843289'>
                <FaInstagram className='text-2xl hover:text-pink-500' />
              </a>
              <a href='https://www.facebook.com/profile.php?id=100012871843289'>
                <FaTwitter className='text-2xl hover:text-blue-500' />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
