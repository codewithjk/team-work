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
  messages: [],
  hasInitialAIResponse: false,
  hasInitialResponse: false,
  selectedGroup: null,
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
    setSelectedGroup: (state, action) => {
      console.log(action.payload);
      state.selectedGroup = action.payload;
    },
    setMessages: (state, action) => {
      console.log("called");
      state.messages.push(action.payload);
    },
    addOldMessages: (state, action) => {
      console.log("Old messages loaded");
      state.messages = [...action.payload, ...state.messages]; // Prepend old messages
    },
    setHasInitialAIResponse: (state, action) => {
      state.hasInitialAIResponse = action.payload;
    },
    setHasInitialResponse: (state, action) => {
      state.hasInitialResponse = action.payload;
    },
    resetMessages: (state, action) => {
      state.messages = [];
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
  resetMessages,
  setSelectedGroup,
  addOldMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
