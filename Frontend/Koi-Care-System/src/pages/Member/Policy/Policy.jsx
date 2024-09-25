/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
function Policy() {
  const [activeSection, setActiveSection] = useState('')
  const [showScrollTop, setShowScrollTop] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0) // Cuộn lên đầu trang khi chuyển sang trang policy
  }, [])
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
      const sections = document.querySelectorAll('section')
      let currentActiveSection = ''
      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (window.pageYOffset >= sectionTop - 50 && window.pageYOffset < sectionTop + sectionHeight - 50) {
          currentActiveSection = section.id
        }
      })
      setActiveSection(currentActiveSection)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <div className='bg-gray-100 min-h-screen'>
      <header className='bg-white shadow-md'>
        <div className='container mx-auto px-4 py-6 flex items-center'>
          {/* Back Icon */}
          <Link to='/' className='flex items-center text-gray-800 mr-4'>
            <FaArrowLeft className='mr-2' /> {/* Icon before text */}
            Back {/* Text next to the icon */}
          </Link>
          {/* Page Title */}
          <h1 className='text-3xl font-bold text-gray-800'>Our Policies</h1>
        </div>
      </header>
      <div className='container mx-auto px-4 py-8 flex flex-col md:flex-row'>
        <nav className='w-full md:w-1/4 mb-8 md:mb-0'>
          <div className='bg-white rounded-lg shadow-md p-6 sticky top-4'>
            <h2 className='text-xl font-semibold mb-4'>Table of Contents</h2>
            <ul>
              {['privacy-policy', 'terms-of-service', 'cookie-policy', 'acceptable-use'].map((section) => (
                <li key={section} className='mb-2'>
                  <button
                    onClick={() => scrollToSection(section)}
                    className={`text-left w-full py-2 px-3 rounded ${
                      activeSection === section
                        ? 'bg-red-500 text-white'
                        : 'text-black hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    {section
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        {/* Main Content */}
        <main className='w-full md:w-3/4 md:pl-8'>
          <div className='bg-white rounded-lg shadow-md p-8'>
            {/* Privacy Policy */}
            <section id='privacy-policy' className='mb-12'>
              <h2 className='text-2xl font-bold mb-4'>Privacy Policy</h2>
              <p className='mb-4'>
                We value your privacy and are committed to protecting your personal information. This policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              <h3 className='font-semibold'>1. Information We Collect</h3>
              <p className='mb-4'>
                - Personal Information: We collect personal data such as your name, email address, and any details you
                provide during registration, purchase, or interaction with our website.
              </p>
              <p className='mb-4'>
                - Pond and Fish Data: Information you input regarding your Koi ponds, fish, and care activities for the
                purpose of helpinsg you manage and track your care routines.
              </p>
              <p className='mb-4'>
                - Usage Data: Information such as IP addresses, browser types, pages visited, and time spent on the
                website.
              </p>
              <h3 className='font-semibold'>2. How We Use Your Information</h3>
              The information we collect is used to provide and improve our services, process your transactions, send
              notifications, and ensure compliance with legal obligations. We may also use your data for marketing and
              promotional activities. The information we collect is used to provide and improve our services, process
              your transactions, send notifications, and ensure compliance with legal obligations. We may also use your
              data for marketing and promotional activities.
              <p className='mb-4'>- To provide and enhance our services.</p>
              <p className='mb-4'>- To communicate updates, offers, or respond to inquiries.</p>
              <p className='mb-4'>- To process transactions and provide customer support.</p>
              <p className='mb-4'>- To analyze website traffic and user behavior to improve the user experience.</p>
              <h3 className='font-semibold'>3. How We Protect Your Information</h3>
              <p className='mb-4'>
                We use encryption, firewalls, and secure servers to protect your information. However, no system is 100%
                secure, and we cannot guarantee the absolute security of your data.
              </p>
              <h3 className='font-semibold'>4. Sharing Your Information</h3>
              <p className='mb-4'>We do not sell or trade your information. We may share data with:</p>
              <p className='mb-4'>- Service Providers: To operate our site and deliver services.</p>
              <p className='mb-4'>
                - Legal Obligations: When required by law or to protect the rights and safety of Koi Care System.
              </p>
              <h3 className='font-semibold'>5. Your Right</h3>
              <p className='mb-4'>
                You have the right to access, modify, or delete your personal data. Contact us at [email address] to
                make any requests.
              </p>
              <h3 className='font-semibold'>6. Cookies</h3>
              <p className='mb-4'>
                We use cookies to personalize content, analyze traffic, and enhance your browsing experience. You can
                disable cookies through your browser settings.
              </p>
              <h3 className='font-semibold'>7. Updates to This Policy</h3>
              <p className='mb-4'>
                We may update this Privacy Policy periodically. Any changes will be posted here with an updated
                effective date.
              </p>
              <h3 className='font-semibold'>8. Contact Us</h3>
              <p className='mb-4'>For questions or concerns, contact us at [email address].</p>
            </section>
            {/* Terms of Service */}
            <section id='terms-of-service' className='mb-12'>
              <h2 className='text-2xl font-bold mb-4'>Terms of Service</h2>
              <p className='mb-4'>
                By accessing or using our website, you agree to comply with and be bound by the following terms of
                service. If you disagree with any part of these terms, you may not use our website.
              </p>
              <h3 className='font-semibold'>1. Acceptance of Terms</h3>
              <p className='mb-4'>
                Our website is intended for lawful use only. You agree not to use our website in a way that violates any
                applicable laws, regulations, or third-party rights. You may not use our services for any illegal or
                unauthorized purposes.
              </p>
              <h3 className='font-semibold'>2. Eligibility</h3>
              <p className='mb-4'>
                All content provided on this website, including text, graphics, logos, and images, is owned by or
                licensed to us. You may not reproduce, distribute, or display any of the content without our written
                consent.
              </p>
              <h3 className='font-semibold'>3. User Responsibilities</h3>
              <p className='mb-4'>You agree to use our site responsibly. Do not:</p>
              <p className='mb-4'>- Engage in unlawful activities.</p>
              <p className='mb-4'>- Disrupt or interfere with the website's functionality.</p>
              <p className='mb-4'>- Attempt to hack or bypass our security.</p>
              <h3 className='font-semibold'>4. Content Ownership</h3>
              <p className='mb-4'>
                All content on this website, including text, images, and software, is owned by [Website Name] or our
                licensors. You may not reproduce, distribute, or use any content without written permission.
              </p>
              <h3 className='font-semibold'>5. User-Generated Content</h3>
              <p className='mb-4'>
                You may submit content (such as Koi pond details) as part of your user experience. By submitting
                content, you grant [Website Name] a license to use, display, and modify the content as necessary.
              </p>
              <h3 className='font-semibold'>6. Limitations of Liability</h3>
              <p className='mb-4'>
                Koi Care System will not be liable for any damages arising from your use of the website, including, but
                not limited to, loss of data, business interruptions, or inaccurate information.
              </p>
              <h3 className='font-semibold'>7. Termination</h3>
              <p className='mb-4'>
                We reserve the right to suspend or terminate your access to the website at any time without prior
                notice.
              </p>
              <h3 className='font-semibold'>8. Governing Law</h3>
              <p className='mb-4'>These terms are governed by and construed in accordance with the laws of VietNam.</p>
              <h3 className='font-semibold'>9. Contact Us</h3>
              <p className='mb-4'>
                For questions regarding these Terms of Service, please contact us at [email address].
              </p>
            </section>
            {/* Cookie Policy */}
            <section id='cookie-policy' className='mb-12'>
              <h2 className='text-2xl font-bold mb-4'>Cookie Policy</h2>
              <p className='mb-4'>
                This Cookie Policy explains how Koi Care System uses cookies and similar technologies to recognize you
                when you visit our website.
              </p>
              <h3 className='font-semibold'>1. What Are Cookies?</h3>
              <p className='mb-4'>
                Cookies are small data files stored on your device when you visit a website. They are used to track your
                browsing activity and remember your preferences, such as language settings and login information.
              </p>
              <h3 className='font-semibold'>2. Types of Cookies We Use</h3>
              <p className='mb-4'>
                - Essential Cookies: These cookies are necessary for the basic functionality of the site.
              </p>
              <p className='mb-4'>
                - Performance Cookies: These cookies collect information about how you use our site (e.g., pages visited
                and time spent on the site).
              </p>
              <p className='mb-4'>
                - Functionality Cookies: These cookies remember your preferences to provide a personalized experience.
              </p>
              <p className='mb-4'>
                - Targeting Cookies: These cookies collect information about your browsing habits for advertising
                purposes.
              </p>
              <h3 className='font-semibold'>3. Why We Use Cookies</h3>
              <p className='mb-4'>We use cookies to:</p>
              <p className='mb-4'>- Improve website functionality.</p>
              <p className='mb-4'>- Personalize content and ads.</p>
              <p className='mb-4'>- Track and analyze user behavior for site optimization.</p>
              <h3 className='font-semibold'>4. Managing Cookies</h3>
              <p className='mb-4'>
                Cookies are small data files stored on your device when you visit a website. They are used to track your
                browsing activity and remember your preferences, such as language settings and login information.
              </p>
              <h3 className='font-semibold'>5. Third-Party Cookies</h3>
              <p className='mb-4'>
                Some of our partners (e.g., analytics or advertising partners) may use cookies. We do not control these
                cookies, so please review their cookie policies.
              </p>
              <h3 className='font-semibold'>6. Changes to This Cookie Policy</h3>
              <p className='mb-4'>
                Cookies are small data files stored on your device when you visit a website. They are used to track your
                browsing activity and remember your preferences, such as language settings and login information.
              </p>
              <h3 className='font-semibold'>7. Contact Us</h3>
              <p className='mb-4'>For more information about how we use cookies, contact us at [email address].</p>
            </section>
            {/* Acceptable Use Policy */}
            <section id='acceptable-use' className='mb-12'>
              <h2 className='text-2xl font-bold mb-4'>Acceptable Use Policy</h2>
              <p className='mb-4'>
                By using Koi Care System, you agree to adhere to the following Acceptable Use Policy, which outlines
                activities that are prohibited on our platform.
              </p>
              <h3 className='font-semibold'>1. Prohibited Activities</h3>
              <p className='mb-4'>
                - Illegal Activities: You may not use [Website Name] for any unlawful purposes or in furtherance of
                illegal activities, including but not limited to fraud, money laundering, or violation of applicable
                laws and regulations.
              </p>
              <p className='mb-4'>
                - Harmful or Malicious Activities: You may not distribute viruses, malware, or any other harmful or
                disruptive software that can interfere with the operation of the website, other users’ computers, or
                services.
              </p>
              <p className='mb-4'>
                - Unauthorized Access: You may not attempt to gain unauthorized access to our systems, servers,
                databases, or other user accounts. Any attempt to bypass our security measures or probe vulnerabilities
                is strictly prohibited.
              </p>
              <p className='mb-4'>
                - Harassment or Abuse: You may not use the platform to harass, abuse, or intimidate others. This
                includes hate speech, threats, offensive language, or any behavior intended to harm others.
              </p>
              <p className='mb-4'>
                - Spamming and Phishing: You may not use [Website Name] to send unsolicited messages, spam, or engage in
                phishing attempts that seek to obtain sensitive information such as passwords, credit card numbers, or
                other personal data.
              </p>
              <p className='mb-4'>
                - Intellectual Property Infringement: You may not upload or share content that violates the intellectual
                property rights of others, including but not limited to copyrighted materials, trademarks, or trade
                secrets, without proper authorization.
              </p>
              <p className='mb-4'>
                - Misrepresentation: You may not impersonate any person or entity, or falsely state or misrepresent your
                affiliation with a person or entity.
              </p>
              <p className='mb-4'>
                - Excessive Resource Usage: You may not use automated means, such as bots or scripts, to excessively
                load or disrupt the site, extract data, or use resources beyond what is considered acceptable for
                individual use.
              </p>
              <h3 className='font-semibold'>2. User-Generated Content</h3>
              <p className='mb-4'>
                You are responsible for any content you upload, post, or share on Koi Care System. By submitting
                content, you affirm that:
              </p>
              <p className='mb-4'>- You own or have the necessary licenses and rights to share that content.</p>
              <p className='mb-4'>
                - Your content does not violate any laws, including intellectual property or privacy laws.
              </p>
              <p className='mb-4'>- Your content does not contain harmful, abusive, defamatory, or obscene material.</p>
              <h3 className='font-semibold'>3. Reporting Violations</h3>
              <p className='mb-4'>
                If you become aware of any misuse or violation of this Acceptable Use Policy, please report it
                immediately to [email address]. We reserve the right to investigate and take appropriate action,
                including suspension or termination of user accounts.
              </p>
              <h3 className='font-semibold'>4. Enforcement</h3>
              <p className='mb-4'>
                - Illegal Activities: You may not use Koi Care System for any unlawful purposes or in furtherance of
                illegal activities, including but not limited to fraud, money laundering, or violation of applicable
                laws and regulations.
              </p>
            </section>
          </div>
        </main>
      </div>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-8 right-8 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-opacity'
          aria-label='Scroll to top'
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  )
}
export default Policy
