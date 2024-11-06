/* eslint-disable react/no-unescaped-entities */

function About() {
  const teamMembers = [
    {
      name: 'The Vinh',
      role: 'Frontend Developer',
      img: 'https://koicaresystemv3.blob.core.windows.net/koicarestorage/Vinh.jpg'
    },
    {
      name: 'Duc Loc',
      role: 'Leader-Backend Developer',
      img: 'https://koicaresystemv3.blob.core.windows.net/koicarestorage/Loc.jpg'
    },
    {
      name: 'Trung Kien',
      role: 'Frontend Developer',
      img: 'https://koicaresystemv3.blob.core.windows.net/koicarestorage/Kien.jpg'
    },
    {
      name: 'Minh Thoai',
      role: 'Frontend Developer',
      img: 'https://koicaresystemv3.blob.core.windows.net/koicarestorage/Thoai.jpg'
    },
    {
      name: 'An Phuoc',
      role: 'Backend Developer',
      img: 'https://koicaresystemv3.blob.core.windows.net/koicarestorage/Phuoc.jpg'
    }
  ]

  return (
    <div className='py-10 px-4 sm:px-6 lg:px-8 mx-auto '>
      <div className='text-black text-5xl text-center mb-20'>
        <strong>About Us</strong>
      </div>

      {/* Team Members Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8'>
        {teamMembers.map((member, index) => (
          <div key={index} className='flex flex-col items-center p-6 rounded-lg shadow-md border'>
            <img
              src={member.img}
              alt={member.name}
              className='w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4'
            />
            <h3 className='text-xl font-semibold text-center'>{member.name}</h3>
            <p className='text-lg text-gray-500'>{member.role}</p>
          </div>
        ))}
      </div>

      {/* About Us Text Section */}
      <div className='mt-12 rounded-lg p-6 shadow-xl border'>
        <p className='font-dancing mb-6 text-xl'>Thank you for using our websites.</p>

        <p className='font-dancing text-xl'>
          Having kept and loved koi fish for several years, we came up with the idea of developing an app for koi owners
          to make fish keeping easier. Our goal is to keep the app up-to-date and to provide assistance for every koi
          owner.
        </p>
        <p className='mb-6 font-dancing text-xl'>
          A rating in the App Store or sharing the app would therefore make us very happy and motivate us to continue
          developing additional features.
        </p>
        <p className='mb-6 font-dancing text-xl'>
          If you have any questions or suggestions for improvement, please send an e-mail to{' '}
          <a href='mailto:feedback@koicaresystem.com' className='text-blue-500 underline'>
            feedback@koicaresystem.com
          </a>
          .
        </p>
        <p className='text-red-500 font-dancing'>The Koi Care Team</p>
      </div>

      {/* Social Media Links Section */}
      <div className='mt-10'>
        <p className='font-semibold text-center text-xl'>
          Follow us on social media where we keep you posted about exciting new features!
        </p>
      </div>
    </div>
  )
}

export default About
