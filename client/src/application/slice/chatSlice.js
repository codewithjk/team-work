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
  groups:[],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setGroups:(state,action)=>{
      state.groups = action.payload
    },
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
      console.log("called",action.payload);
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
    sortGroups: (state, action) => {
      const lastMessageGroupId = action.payload.groupId;
      state.groups = state.groups.map((group) => {
        if (group._id === lastMessageGroupId) {
          group.lastMessage = action.payload; 
        }
        return group;
      });
      state.groups = state.groups.sort((a, b) => {
        if (a.lastMessage && b.lastMessage) {
          return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
        }
        return b.lastMessage ? 1 : -1; 
      });
    }
    
  },
});

// Export actions
export const {
  setGroups,
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
  sortGroups
} = chatSlice.actions;
export default chatSlice.reducer;
