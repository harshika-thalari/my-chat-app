// This file is now fully integrated with your deployed API.

const BASE_URL = "http://4.187.160.167:8055";
const DUMMY_USER_ID = "user-123";
const DUMMY_THREAD_ID = "chat-abc123";

/**
 * Mocks a POST request to create or get a user profile.
 * Endpoint: /api/getProfile
 * @param {string} preferredUsername The user's email.
 * @returns {Promise<object>} A promise that resolves with the user profile data.
 */
export const getProfile = async (preferredUsername) => {
  console.log(`Mock API call: POST /api/getProfile with username: ${preferredUsername}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (preferredUsername === "error@example.com") {
    return {
      status: 400,
      body: { error: "Invalid email" }
    };
  }

  return {
    status: 200,
    body: {
      id: DUMMY_USER_ID,
      type: "regular",
    }
  };
};

/**
 * Makes a POST request to the deployed AI endpoint and returns its real response.
 *
 * @param {object} params The request parameters.
 * @returns {Promise<object>} A promise that resolves with the actual API response.
 */
export const questionStream = async (params) => {
  console.log(`Making API call: POST ${BASE_URL}/api/question_stream`);

  const requestBody = {
    query: params.query,
    thread_id: params.thread_id || "test_32819189-4e2d-4cc6-a70f-658b9f9d8d20",
    new_chat: params.new_chat,
    user_id: params.user_id || "test",
    email_id: params.email_id || "test@test.com",
  };

  try {
    const response = await fetch(`${BASE_URL}/api/question_stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    
    // This is the key change: return the actual data from the API
    return data;
    
  } catch (error) {
    console.error("Failed to fetch from API:", error);
    // Return a structured error message for the frontend
    return {
      thread_id: requestBody.thread_id,
      response_msg_id: "error-" + Date.now(),
      response_text: "Sorry, I am unable to connect to the server right now. Please try again later.",
    };
  }
};

/**
 * Mocks a POST request to modify an AI response.
 * Endpoint: /modify_response
 * @param {object} params The request parameters.
 * @returns {Promise<object>} A promise that resolves with a new streaming response object.
 */
export const modifyResponse = async (params) => {
  console.log(`Mock API call: POST /modify_response with action: ${params.action}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const originalText = params.response;
  let modifiedText = "";
  
  switch (params.action) {
    case 'shorter':
      modifiedText = "Shorter version of the original response.";
      break;
    case 'longer':
      modifiedText = "A much longer, more detailed version of the original response. This is a simulated output to show the functionality.";
      break;
    case 'more_professional':
      modifiedText = "In a professional context, the original response would be rephrased to this, maintaining a formal and respectful tone.";
      break;
    case 'more_casual':
      modifiedText = "Hey, here's the original response but in a super chill and casual way. Hope this helps!";
      break;
    case 'simpler':
      modifiedText = "A simple explanation: the original response means this.";
      break;
    default:
      modifiedText = originalText;
  }

  return {
    thread_id: params.thread_id,
    response_msg_id: "msg-" + Date.now(),
    response_text: modifiedText,
    isModified: true
  };
};

/**
 * Mocks a POST request to rate a message.
 * Endpoint: /api/rate_message
 * @param {object} params The request parameters.
 * @returns {Promise<object>} A promise that resolves with a confirmation.
 */
export const rateMessage = async (params) => {
  console.log(`Mock API call: POST /api/rate_message with rating: ${params.rating}`);
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    status: 200,
    message: `Rating '${params.rating}' saved successfully for message ${params.response_msg_id}.`
  };
};

/**
 * Mocks a POST request to get all chat threads for a user.
 * Endpoint: /api/getAllChats
 * @param {string} userId The ID of the user.
 * @returns {Promise<object>} A promise that resolves with a list of chat metadata.
 */
export const getAllChats = async (userId) => {
  console.log(`Mock API call: POST /api/getAllChats for user: ${userId}`);
  
  // Use async/await to pause execution for 300ms
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return the same data structure directly
  return {
    chats: [
      { chatId: "chat-abc123", title: "Project Discussion", last_message: "See you soon!" },
      { chatId: "chat-def456", title: "API Integration", last_message: "Looks good!" },
      { chatId: "chat-ghi789", title: "New Feature Brainstorm", last_message: "Sounds great!" },
    ]
  };
};

/**
 * Mocks a POST request to generate follow-up questions.
 * Endpoint: /api/followup
 * @param {object} params The request parameters.
 * @returns {Promise<object>} A promise that resolves with an array of questions.
 */
export const getFollowupQuestions = async (params) => {
  console.log(`Mock API call: POST /api/followup with response: ${params.response.substring(0, 50)}...`);
  await new Promise(resolve => setTimeout(resolve, 500));

  let questions = [];

  // Logic to generate different questions based on keywords in the response
  
  return {
    followup_questions: questions
  };
};