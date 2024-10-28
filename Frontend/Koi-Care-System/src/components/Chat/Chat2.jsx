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
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>One to One Chat | Spring Boot & Websocket</h2>
      <div className={`user-form`}>
        <form onSubmit={connect} className='space-y-4'>
          <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => setIsJoined(true)}>
            Enter Chatroom
          </button>
        </form>
      </div>

      {isJoined && (
        <div className={`chat-container ${nickname ? '' : 'hidden'} grid grid-cols-4 gap-4`}>
          {userRole === 'SHOP' ? (
            <div className='users-list col-span-1'>
              <h2 className='text-lg font-bold'>Online Users</h2>
              <ul className='mt-2 space-y-2'>{connectedUsers.map((user) => appendUserElement(user))}</ul>
              <div className='mt-4'>
                <button onClick={onLogout} className='bg-red-500 text-white px-4 py-2 rounded mt-2'>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className='users-list col-span-1'>
              <h2 className='text-lg font-bold'>Online Users</h2>
              <button className='mt-2 space-y-2' onClick={() => userItemClick('SupportService')}>
                Support Service
              </button>
              <div className='mt-4'>
                <button onClick={onLogout} className='bg-red-500 text-white px-4 py-2 rounded mt-2'>
                  Logout
                </button>
              </div>
            </div>
          )}

          <div className='chat-area col-span-3'>
            <div ref={chatAreaRef} className='chat-messages p-4 h-96 overflow-y-auto border bg-gray-100'>
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.senderId === nickname ? 'text-right' : 'text-left'} mb-2`}
                >
                  <p
                    className={`inline-block p-2 rounded ${message.senderId === nickname ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}
            </div>

            {selectedUserId && (
              <form onSubmit={sendMessage} className='message-form mt-4 flex'>
                <input
                  type='text'
                  id='message'
                  className='flex-grow border p-2'
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder='Type your message...'
                  required
                />
                <button className='bg-blue-500 text-white px-4 py-2 rounded ml-2'>Send</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
