import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

const Chat = ({socket,username,room,goBack }) => {
  const [currentMessage,setCurrentMessage] = useState('')
  const [messageList,setMessageList] = useState([]);
  
  const sendMessage=async()=>{
    if(currentMessage!=''){
      const messageData = {
        room,
        author:username,
        message:currentMessage,
        time:new Date(Date.now()).getHours() +":"+new Date(Date.now()).getMinutes()
      }

      await socket.emit('send_anonymous',messageData)
      setMessageList(list=>[...list,messageData])
      setCurrentMessage('')
    }
  }


  useEffect(()=>{
    socket.on('receive_anonymous',(data)=>{
      setMessageList(list=>[...list,data])
    })
  },[socket])

  return (
 <div className="flex flex-col h-screen w-full max-w-2xl mx-auto shadow-xl bg-white border border-gray-200">
  <div className="chat-header bg-blue-600 text-white py-3 px-4 text-xl font-semibold rounded-t">
    <p>Live Chat</p>
  </div>

  <div className="chat-body flex-1 overflow-y-auto px-4 py-2 bg-gray-50">
    <ScrollToBottom className="h-full">
      {messageList.map((each, index) => (
        <div
          key={index}
          className={`flex ${username === each.author ? 'justify-end' : 'justify-start'} my-2`}
        >
          <div
            className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
              username === each.author
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-900 rounded-bl-none'
            }`}
          >
            <p className="text-sm">{each.message}</p>
            <div className="text-xs mt-1 flex justify-between gap-2 opacity-70">
              <p>{each.time}</p>
              <p>{each.author}</p>
            </div>
          </div>
        </div>
      ))}
    </ScrollToBottom>
  </div>

  <div className="chat-footer flex items-center border-t border-gray-300 p-4 gap-2">
    <input
      type="text"
      placeholder="Type your message..."
      onChange={(e) => setCurrentMessage(e.target.value)}
      value={currentMessage}
      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <button
      onClick={sendMessage}
      className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
    >
      &#9658;
    </button>
  </div>
        <button
          onClick={goBack}
          className="absolute top-6 left-6 text-blue-600 hover:text-blue-800 text-lg font-bold cursor-pointer"
        >
          ← Back
        </button>
</div>

  )
}

export default Chat