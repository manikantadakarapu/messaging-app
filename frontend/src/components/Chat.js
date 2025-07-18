import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend server

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Receive message
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Clean up on unmount
    return () => socket.off('receiveMessage');
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msgObj = { text: message, time: new Date().toLocaleTimeString() };
      socket.emit('sendMessage', msgObj);
      setMessages((prev) => [...prev, msgObj]); // Show immediately
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.time}</strong>: {msg.text}</div>
        ))}
      </div>
      <form onSubmit={handleSend}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
