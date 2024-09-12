import { ChatBotMessages, userData, Users } from "@/pages/chat/data";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedExample: { name: "Messenger example", url: "/" },
  examples: [
    { name: "Messenger example", url: "/" },
    { name: "Chatbot example", url: "/chatbot" },
    { name: "Chatbot2 example", url: "/chatbot2" },
  ],
  input: "",
  chatBotMessages: ChatBotMessages,
  messages: userData[0].messages,
  hasInitialAIResponse: false,
  hasInitialResponse: false,
  selectedUser: Users[4],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedExample: (state, action) => {
      state.selectedExample = action.payload;
    },
    setExamples: (state, action) => {
      state.examples = action.payload;
    },
    setInput: (state, action) => {
      state.input = action.payload;
    },
    handleInputChange: (state, action) => {
      state.input = action.payload.target.value;
    },
    setChatBotMessages: (state, action) => {
      state.chatBotMessages = action.payload(state.chatBotMessages);
    },
    setMessages: (state, action) => {
      state.messages = action.payload(state.messages);
    },
    setHasInitialAIResponse: (state, action) => {
      state.hasInitialAIResponse = action.payload;
    },
    setHasInitialResponse: (state, action) => {
      state.hasInitialResponse = action.payload;
    },
  },
});

// Export actions
export const {
  setSelectedExample,
  setExamples,
  setInput,
  handleInputChange,
  setChatBotMessages,
  setMessages,
  setHasInitialAIResponse,
  setHasInitialResponse,
} = chatSlice.actions;
export default chatSlice.reducer;
