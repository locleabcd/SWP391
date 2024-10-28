import '../../init'
import { useState, useRef, useEffect } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import axios from 'axios'
var stompClient = null
const Chat = () => {
  const [nickname, setNickname] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [hasUpdated, setHasUpdated] = useState(false)
  const chatAreaRef = useRef(null)
  const baseUrl = 'https://koicaresystemv2.azurewebsites.net/api'
  const initValue = () => {
    setNickname(localStorage.getItem('name'))
    setUserRole(localStorage.getItem('role'))
  }

  useEffect(() => {
    initValue()
  }, [])

  const connect = (event) => {
    event.preventDefault()
    if (nickname) {
      const socket = new SockJS(`${baseUrl}/ws`)
      stompClient = Stomp.over(socket)
      stompClient.connect({}, onConnected, onError)
    }
    fetchAndDisplayUserChat()
  }

  const onError = () => {
    console.log('Could not connect to WebSocket server. Please refresh this page to try again!')
  }

  const onConnected = () => {
    if (stompClient && stompClient.connected) {
      stompClient.subscribe(
        `/user/${nickname}/queue/messages`,
        userRole === 'SHOP' ? onMessageReceived : onUserMessageReceived
      )

      stompClient.subscribe(`/user/public`, findAndDisplayConnectedUsers)
      stompClient.send('/app/user.addUser', {}, JSON.stringify({ nickname: nickname, status: 'ONLINE' }))
      console.log(`Connected successfully! ${nickname}`)
    } else {
      console.error('stompClient is not connected')
    }
  }

  const findAndDisplayConnectedUsers = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${baseUrl}/chatUserOnlines`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(response.data)
    let users = response.data.data
    users = users.filter((user) => user.nickname !== nickname)
    setConnectedUsers(users)
  }

  const userItemClick = (userId) => {
    setSelectedUserId(userId)
    fetchAndDisplayUserChat(userId)
  }

  const fetchAndDisplayUserChat = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${baseUrl}/messages/${nickname}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(response.data)
    const messages = response.data.data
    setChatMessages(messages)
    scrollToBottom()
  }

  const staffItemClick = (userId) => {
    setSelectedUserId(userId)
    localStorage.setItem('selectedUserId', userId)
    if (!hasUpdated) {
      updateRecipientChat(userId)
      setHasUpdated(true)
    }
    fetchAndDisplayStaffChat(userId)
  }

  const appendUserElement = (user) => {
    return (
      <li
        key={user.nickname}
        id={user.nickname}
        className='user-item flex items-center p-2 cursor-pointer hover:bg-gray-200'
        onClick={() => staffItemClick(user.nickname)}
      >
        <img
          src='https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultProfile.jpg'
          alt={user.nickname}
          className='w-8 h-8 rounded-full mr-2'
        />
        <span className='text-sm'>{user.nickname}</span>
        <span className='nbr-msg hidden text-sm ml-auto'>0</span>
      </li>
    )
  }
  const updateRecipientChat = async (userId) => {
    const token = localStorage.getItem('token')
    await axios.get(`${baseUrl}/messages/${userId}/${nickname}/update`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  const fetchAndDisplayStaffChat = async (userId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${baseUrl}/messages/${nickname}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(response.data)
    const messages = response.data.data
    setChatMessages(messages)
    setSelectedUserId(userId)
    scrollToBottom()
  }

  const onMessageReceived = async (payload) => {
    const message = JSON.parse(payload.body)
    if (localStorage.getItem('selectedUserId') === message.senderId) {
      setChatMessages((prevMessages) => [...prevMessages, message])
      scrollToBottom()
    }
  }
  const onUserMessageReceived = async (payload) => {
    const message = JSON.parse(payload.body)
    setChatMessages((prevMessages) => [...prevMessages, message])
    scrollToBottom()
  }

  const sendMessage = (event) => {
    event.preventDefault()
    if (messageInput && stompClient) {
      const chatMessage = {
        senderId: nickname,
        recipientId: selectedUserId,
        content: messageInput,
        timestamp: new Date()
      }
      stompClient.send('/app/chat', {}, JSON.stringify(chatMessage))
      setChatMessages([...chatMessages, chatMessage])
      setMessageInput('')
      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight
    }
  }

  const onLogout = () => {
    if (stompClient) {
      stompClient.send('/app/user.disconnectUser', {}, JSON.stringify({ nickname: nickname, status: 'OFFLINE' }))
      window.location.reload()
    }
  }

  return (
    <div className='fixed bottom-4 right-8 z-50'>
      <div className={`${isJoined ? 'opacity-0' : 'opacity-100'}`}>
        <form onSubmit={connect} className='space-y-4'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-3 py-3 rounded-full'
            onClick={() => {
              setIsJoined(true)
              userItemClick('SupportService')
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-10'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z'
              />
            </svg>
          </button>
        </form>
      </div>

      {isJoined && (
        <div className={`chat-container rounded-xl ${nickname ? '' : 'hidden'}`}>
          {userRole === 'SHOP' ? (
            <div className='users-list col-span-1'>
              <h2 className='text-lg font-bold'>Online Users</h2>
              <ul className='mt-2 space-y-2'>{connectedUsers.map((user) => appendUserElement(user))}</ul>
              <div className='chat-area col-span-3'>
                <div className='w-full flex gap-4 justify-between items-center px-2 py-2 border bg-gray-50'>
                  <div className='flex gap-3 items-center'>
                    <img
                      src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzWqYhEAvpn3JMQViAxdbz4ZAM9wW1AfQMQ&s'
                      className='lg:size-11 size-8 rounded-full border border-gray-300'
                    />
                    <div className=''>Shop staff</div>
                  </div>
                  <div className='flex gap-2'>
                    <button>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-7'
                        onClick={() => setIsJoined(false)}
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                      </svg>
                    </button>

                    <button onClick={onLogout}>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-7'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                </div>

                <div
                  ref={chatAreaRef}
                  onClick={() => {
                    setIsJoined(true)
                    userItemClick('SupportService')
                  }}
                  className='chat-messages p-4 h-[430px] w-[430px] overflow-y-auto border bg-gray-50'
                >
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${message.senderId === nickname ? 'text-right' : 'text-left'} mb-2 `}
                    >
                      <p
                        className={`inline-block p-2 rounded-full break-words max-w-[75%] 
    ${message.senderId === nickname ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                      >
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedUserId && (
                  <form onSubmit={sendMessage} className='message-form flex'>
                    <input
                      type='text'
                      id='message'
                      className='flex-grow border-x p-4 outline-none bg-gray-50'
                      value={messageInput}
                      onClick={() => {
                        setIsJoined(true)
                        userItemClick('SupportService')
                      }}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder='Aa'
                      required
                    />
                    <button className='bg-gray-50 border-r text-black px-2 py-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                        />
                      </svg>
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className='chat-area col-span-3'>
              <div className='w-full flex gap-4 justify-between items-center px-2 py-2 border bg-gray-50'>
                <div className='flex gap-3 items-center'>
                  <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPzWqYhEAvpn3JMQViAxdbz4ZAM9wW1AfQMQ&s'
                    className='lg:size-11 size-8 rounded-full border border-gray-300'
                  />
                  <div className=''>Shop staff</div>
                </div>
                <div className='flex gap-2'>
                  <button>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-7'
                      onClick={() => setIsJoined(false)}
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                    </svg>
                  </button>

                  <button onClick={onLogout}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-7'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                ref={chatAreaRef}
                onClick={() => {
                  setIsJoined(true)
                  userItemClick('SupportService')
                }}
                className='chat-messages p-4 h-[430px] w-[430px] overflow-y-auto border bg-gray-50'
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.senderId === nickname ? 'text-right' : 'text-left'} mb-2 `}
                  >
                    <p
                      className={`inline-block p-2 rounded-full break-words max-w-[75%] 
    ${message.senderId === nickname ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                    >
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              {selectedUserId && (
                <form onSubmit={sendMessage} className='message-form flex'>
                  <input
                    type='text'
                    id='message'
                    className='flex-grow border-x p-4 outline-none bg-gray-50'
                    value={messageInput}
                    onClick={() => {
                      setIsJoined(true)
                      userItemClick('SupportService')
                    }}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder='Aa'
                    required
                  />
                  <button className='bg-gray-50 border-r text-black px-2 py-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                      />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Chat
