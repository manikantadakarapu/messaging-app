import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch old messages
    axios.get('http://localhost:5000/api/messages')
      .then(res => setMessages(res.data))
      .catch(err => console.error('Failed to fetch messages:', err));
  }, []);

  useEffect(() => {
    // Receive real-time messages
    socket.on('receiveMessage', (data) => {
      setMessages(prev => [...prev, {
        sender: data.sender,
        content: data.text,
        timestamp: new Date()
      }]);
    });

    // Typing indicators
    socket.on('userTyping', (user) => {
      if (user !== username) {
        setTypingUser(user);
      }
    });

    socket.on('userStopTyping', (user) => {
      if (user !== username) {
        setTypingUser('');
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      sender: username,
      text: newMessage,
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
    setIsTyping(false);
    socket.emit('stopTyping', username);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', username);
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stopTyping', username);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <h2>Real-Time Chat</h2>

      <div style={styles.messagesBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === username ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === username ? '#DCF8C6' : '#EAEAEA',
            }}
          >
            <div style={styles.sender}>
              {msg.sender === username ? 'You' : msg.sender}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}
        {typingUser && (
          <div style={styles.typingIndicator}>
            {typingUser} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

const styles = {
  container: {
    width: '500px',
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
  },
  messagesBox: {
    border: '1px solid #ccc',
    padding: '10px',
    height: '400px',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
  },
  message: {
    marginBottom: '10px',
    padding: '8px 12px',
    borderRadius: '10px',
    maxWidth: '70%',
  },
  sender: {
    fontSize: '0.75rem',
    color: '#555',
    marginBottom: '3px',
  },
  typingIndicator: {
    fontStyle: 'italic',
    fontSize: '0.9rem',
    color: 'gray',
    marginBottom: '10px',
  },
  inputBox: {
    display: 'flex',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '1rem',
  },
  sendBtn: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};
