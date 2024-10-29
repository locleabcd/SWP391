import '../../init'
import { useState, useRef, useEffect } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import axios from 'axios'
import Draggable from 'react-draggable'
import '../../index.css'
import { useDarkMode } from '../../hooks/DarkModeContext'

var stompClient = null
const Chat = () => {
  const { isDarkMode } = useDarkMode()
  const [nickname, setNickname] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [connectedUsers, setConnectedUsers] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [hasUpdated, setHasUpdated] = useState(false)
  const chatAreaRef = useRef(null)
  const [messages, setMessages] = useState([])
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
  }

  const fetchAndDisplayUserChat = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`${baseUrl}/messages/${nickname}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data)
      const messages = response.data.data
      setChatMessages(messages)
      scrollToBottom()
    } catch (err) {
      console.log(nickname)
      console.log(err)
    }
  }

  const staffItemClick = (userId) => {
    setSelectedUserId(userId)
    localStorage.setItem('selectedUserId', userId)
    updateRecipientChat(userId)
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
      stompClient.disconnect()
    }

    setSelectedUserId(null)
    setChatMessages([])
    setConnectedUsers([])
    setIsJoined(false)
    console.log('Chat session closed.')
  }

  const messageList = ['Tôi là chat box của Koi Care System', 'Tôi sẽ trả lời các câu hỏi về dịch vụ']

  useEffect(() => {
    messageList.forEach((message, index) => {
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, message])
      }, index * 4000)
    })
  }, [])

  return (
    <Draggable>
      <div className='fixed bottom-4 left-1/5 z-50'>
        {userRole === 'SHOP' ? (
          <div className={`${isJoined ? 'opacity-0' : 'opacity-100'}`}>
            <form onSubmit={connect} className='space-y-4'>
              <button
                type='submit'
                className='text-white px-3 py-3 rounded-full'
                onClick={() => {
                  setIsJoined(true)
                }}
              >
                <img
                  alt='Chat Button'
                  data-src='https://bot.mygpt.vn/mygpt-chat-icon.png'
                  className='chat-button lazyloaded size-28 relative'
                  src='https://bot.mygpt.vn/mygpt-chat-icon.png'
                  loading='lazy'
                />

                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className='chat absolute text-white rounded-r-full shadow-xl text-xl top-8 w-96 px-10 left-28 py-4 bg-orange-500'
                  >
                    {msg}
                  </div>
                ))}

                {/* <div className='chat absolute opacity-0 hover:opacity-100 text-white rounded-r-full shadow-xl text-xl top-8 w-64 px-10 left-28 py-4 bg-orange-500'>
       Bạn cần tư vấn gì ?
     </div> */}
              </button>
            </form>
          </div>
        ) : (
          <div className={`${isJoined ? 'opacity-0' : 'opacity-100'}`}>
            <form onSubmit={connect} className='space-y-4'>
              <button
                type='submit'
                className='text-white px-3 py-3 rounded-full'
                onClick={() => {
                  setIsJoined(true)
                  userItemClick('Support Service')
                }}
              >
                <img
                  alt='Chat Button'
                  data-src='https://bot.mygpt.vn/mygpt-chat-icon.png'
                  className='chat-button lazyloaded size-28 relative'
                  src='https://bot.mygpt.vn/mygpt-chat-icon.png'
                  loading='lazy'
                />

                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className='chat absolute text-white rounded-r-full shadow-xl text-xl top-8 w-96 px-10 left-28 py-4 bg-orange-500'
                  >
                    {msg}
                  </div>
                ))}

                {/* <div className='chat absolute opacity-0 hover:opacity-100 text-white rounded-r-full shadow-xl text-xl top-8 w-64 px-10 left-28 py-4 bg-orange-500'>
                Bạn cần tư vấn gì ?
              </div> */}
              </button>
            </form>
          </div>
        )}

        {isJoined && (
          <div
            className={`chat-container rounded-xl ${isDarkMode ? 'bg-custom-dark' : 'bg-white'} ${nickname ? '' : 'hidden'}`}
          >
            {userRole === 'SHOP' ? (
              <div className='users-list flex border border-gray-100'>
                <ul className=' px-4 py-2 bg-gray-50'>{connectedUsers.map((user) => appendUserElement(user))}</ul>
                <div className='chat-area col-span-3 '>
                  <div className='w-full flex gap-4 justify-between items-center px-2 py-2 border bg-gray-50'>
                    <div className='flex gap-3 items-center'>
                      <img
                        src='https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultProfile.jpg'
                        className='lg:size-11 size-8 rounded-full border border-gray-300'
                      />
                      <div className=''>{selectedUserId}</div>
                    </div>
                    <div className='flex gap-2'>
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
                <div className='w-full flex gap-4 justify-between items-center px-2 py-2 border bg-blue-500 rounded-t-xl'>
                  <div className='py-2'>
                    <div className='text-xl text-white'>Koi Care System Chat Box</div>
                  </div>
                  <div className='text-white'>
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
    </Draggable>
  )
}

export default Chat
