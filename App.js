import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // ✅ This line applies the CSS

const GEMINI_API_KEY = ''; // 
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newChat = [...chat, { role: 'user', text: userInput }];
    setChat(newChat);

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: userInput }] }]
        }
      );

      const botResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      setChat([...newChat, { role: 'bot', text: botResponse }]);
      setUserInput('');
    } catch (error) {
      console.error('Error:', error);
      setChat([...newChat, { role: 'bot', text: 'Error: Could not get response from Gemini API.' }]);
    }
  };

  return (
    <div className="App">
      <h1>Gemini Chatbot</h1>
      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={msg.role}>
            <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
