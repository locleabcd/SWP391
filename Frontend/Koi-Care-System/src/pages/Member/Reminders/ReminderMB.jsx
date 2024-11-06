import '../../../init'
import { useEffect, useState, useRef } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

function ReminderMB() {
  const [notifications, setNotifications] = useState([])
  const stompClientRef = useRef(null)
  const [showReminder, setShowReminder] = useState(true)

  const closeReminder = () => {
    setShowReminder(false)
  }

  useEffect(() => {
    if (!stompClientRef.current) {
      const sock = new SockJS('https://koicaresystemv2.azurewebsites.net/api/ws')
      const stompClient = Stomp.over(sock)
      stompClientRef.current = stompClient

      stompClient.connect(
        { Authorization: `Bearer ${localStorage.getItem('token')}` },
        (frame) => {
          console.log('Connected: ' + frame)

          const username = localStorage.getItem('name')
          stompClient.subscribe(`/user/${username}/notifications`, (notification) => {
            const message = notification.body
            showNotification(message)
          })
        },
        (error) => {
          console.error('WebSocket connection error:', error)
        }
      )
    }

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect(() => {
          console.log('Disconnected')
        })
        stompClientRef.current = null
      }
    }
  }, [])

  function showNotification(message) {
    setNotifications((prevNotifications) => [...prevNotifications, message])
  }

  return (
    <div id='notifications'>
      {notifications.length > 0 && showReminder ? (
        notifications.map((notification, index) => (
          <div key={index} className='notification'>
            <div className='inset-0 fixed bg-gray-800 bg-opacity-50 flex items-center justify-center z-40'>
              <div className='bg-white p-4 rounded shadow-lg'>
                <div className='flex gap-4 items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='lg:size-16 size-10 bg-yellow-500 rounded-full text-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z'
                    />
                  </svg>

                  <h2 className='text-yellow-500 font-bold lg:text-3xl text-xl'>Reminder to</h2>
                </div>
                <p className='mt-2'>It has been a while since you last updated the prices</p>
                <ul className='list-disc ml-4 mt-2'>{notification}</ul>
                <p className='mt-4'>Please proceed to update.</p>
                <button
                  onClick={closeReminder}
                  className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p></p>
      )}
    </div>
  )
}

export default ReminderMB
