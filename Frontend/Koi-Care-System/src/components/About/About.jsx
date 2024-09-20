/* eslint-disable react/no-unescaped-entities */
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

function About() {
  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, delay: 200 })
  })

  return (
    <div className='block  ' data-aos='fade-up'>
      <div className=' justify-center  py-20 px-20  font-medium '>
        <h className='text-3xl block  text-center text-white font-bold py-8 bg-gradient-to-r from-pink-300 to-red-400'>
          About us
        </h>

        <div className='  grid grid-flow-row-dense p-8 grid-cols-4 '>
          <p className='text-wrap text-xl font-bold  text-left pl-8'>Our Mission</p>
          <p className='text-wrap col-span-3 text-gray-600'>
            At Koi Care System, our mission is to simplify the art of Koi fish care. We strive to provide Koi
            enthusiasts with an innovative platform that allows for seamless management of their ponds, detailed
            tracking of their fish’s growth, and maintenance of optimal living conditions. We are dedicated to making
            Koi care more accessible and effective, ensuring the health and beauty of every fish and pond.
          </p>
        </div>
        <div className=' grid grid-flow-row-dense p-8  grid-cols-4 '>
          <p className='text-wrap text-xl font-bold text-left pl-8 '>Our Vision</p>
          <p className='text-wrap col-span-3 text-gray-600'>
            Our vision is to be the leading resource for Koi fish care enthusiasts worldwide, transforming how people
            manage and nurture their Koi. We aim to create a community where knowledge, technology, and passion come
            together to enhance the well-being of Koi fish and their habitats. By continuously improving our platform
            and expanding our services, we envision a future where every Koi owner has the tools they need to succeed.
          </p>
        </div>
        <div className=' grid grid-flow-row-dense p-8 grid-cols-4 '>
          <p className='text-wrap text-xl font-bold text-left pl-8'>Our Values</p>
          <p className='text-wrap col-span-3 text-gray-600'>
            <p>
              Innovation: We are committed to using cutting-edge technology to provide the best tools and features for
              managing Koi care.
            </p>
            <p>
              Expertise: Our team combines extensive knowledge and experience in Koi care to offer valuable insights and
              solutions.
            </p>
            <p>
              Community: We value the Koi enthusiast community and strive to foster connections and share knowledge
              through our platform.
            </p>
            <p>
              Sustainability: We are dedicated to promoting practices that ensure the long-term health and well-being of
              Koi fish and their environments.
            </p>
            Customer Focus: We prioritize the needs and feedback of our users to continuously improve our platform and
            services.
          </p>
        </div>
        <div className=' grid grid-flow-row-dense p-8 grid-cols-4 '>
          <p className='text-wrap text-xl font-bold text-left pl-8'>Our Commitment</p>
          <p className='text-wrap col-span-3 text-gray-600'>
            We are dedicated to supporting you on your journey of caring for your Koi fish. With Koi Care System, you
            can confidently manage your pond and enhance your Koi's health and beauty, knowing that you have a trusted
            partner by your side.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
