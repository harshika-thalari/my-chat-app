import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import LoginPage from './components/LoginPage';
import { getProfile, questionStream, getFollowupQuestions } from './api/mockApi';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [followupQuestions, setFollowupQuestions] = useState([]);
  const DUMMY_USER_EMAIL = "harshika@example.com";
  const DUMMY_USER_ID = "user-123";

  const handleLogin = async (email) => {
    if (email === DUMMY_USER_EMAIL) {
      alert("Login successful!");
      setIsLoggedIn(true);
      const response = await getProfile(DUMMY_USER_EMAIL);
      console.log("User Profile:", response.body);
    } else {
      alert("Login failed: Incorrect email.");
    }
  };

  const handleSendMessage = async (input) => {
    const userMessage = { id: "user-" + Date.now(), sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setFollowupQuestions([]); 

    const responseText = await questionStream({
      query: input,
      thread_id: activeChatId,
      new_chat: !activeChatId,
      user_id: DUMMY_USER_ID,
      email_id: DUMMY_USER_EMAIL
    });

    const aiMessage = { 
      id: "ai-" + Date.now(),
      sender: 'ai', 
      text: responseText,
      isModified: false 
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    
    if (!activeChatId) {
      setActiveChatId("new-chat-" + Date.now());
    }

    // You will need to update this logic later once the API returns a JSON
    // object with a valid response text.
    // const followupResponse = await getFollowupQuestions({ response: responseText });
    // setFollowupQuestions(followupResponse.followup_questions);
  };

  const handleModifiedMessage = (originalMessageId, modifiedMessage) => {
    setMessages(prevMessages => {
      const index = prevMessages.findIndex(msg => msg.id === originalMessageId);
      if (index !== -1) {
        const newMessages = [...prevMessages];
        newMessages.splice(index + 1, 0, modifiedMessage);
        return newMessages;
      }
      return prevMessages;
    });

    getFollowupQuestions({ response: modifiedMessage.text }).then(response => {
      setFollowupQuestions(response.followup_questions);
    });
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setMessages([
      { id: "ai-1", sender: 'ai', text: `You've selected chat ID: ${chatId}.` },
      { id: "ai-2", sender: 'ai', text: `This is a dummy chat history.` },
    ]);
    setFollowupQuestions([]);
  };

  const handleRefreshChat = () => {
    setMessages([
      { id: "ai-1", sender: 'ai', text: `Chat refreshed. This is the latest message.` },
      { id: "ai-2", sender: 'ai', text: `A dummy message to simulate chat history.` },
    ]);
    setFollowupQuestions([]);
  };

  const handleClearChat = () => {
    setMessages([]);
    setFollowupQuestions([]);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar onSelectChat={handleSelectChat} />
      <div className="main-content">
        <ChatWindow 
          messages={messages} 
          threadId={activeChatId}
          onModifiedMessage={handleModifiedMessage}
          onRefreshChat={handleRefreshChat}
          onClearChat={handleClearChat}
        />
        <MessageInput 
          onSendMessage={handleSendMessage} 
          followupQuestions={followupQuestions}
        />
      </div>
    </div>
  );
}

export default App;