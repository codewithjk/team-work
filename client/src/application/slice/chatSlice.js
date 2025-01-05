
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  input: "",
  messages: [],
  hasInitialAIResponse: false,
  hasInitialResponse: false,
  selectedGroup: null,
  groups: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setGroups: (state, action) => {
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
      state.selectedGroup = action.payload;
    },
    setMessages: (state, action) => {
      console.log("set message payload == ", action.payload)
      const { groupId, timestamp } = action.payload;

      // Find the group with the matching groupId
      const groupIndex = state.groups.findIndex((group) => group._id === groupId);

      if (groupIndex !== -1) {
        // Push the new message into the group's messages array
        state.groups[groupIndex].messages.push(action.payload);

        // Update the group's lastMessageTimestamp for sorting
        state.groups[groupIndex].lastMessageTimestamp = timestamp;

        // Sort the groups by the lastMessageTimestamp (descending order)
        state.groups = state.groups.sort((a, b) => {
          const latestMessageA = a.messages?.at(-1)?.timestamp || 0;
          const latestMessageB = b.messages?.at(-1)?.timestamp || 0;
          return new Date(latestMessageB) - new Date(latestMessageA);
        })
      } else {
        console.error(`Group with ID ${groupId} not found`);
      }
    },

    addOldMessages: (state, action) => {
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
      console.log('sort group worked', action.payload);

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
    },
    sortGroupsInitially: (state, action) => {
      console.log('sort group worked');

      // Sort the groups based on the latest message's timestamp
      state.groups = state.groups.sort((a, b) => {
        // Get the latest message for each group, or null if there are no messages
        const latestMessageA = a.messages.length > 0 ? a.messages[a.messages.length - 1] : null;
        const latestMessageB = b.messages.length > 0 ? b.messages[b.messages.length - 1] : null;

        // If both groups have no messages, consider them equal
        if (!latestMessageA && !latestMessageB) {
          return 0;
        }

        // If only one group has no messages, move the other group to the front
        if (!latestMessageA) {
          return 1;  // Move group `b` ahead
        }
        if (!latestMessageB) {
          return -1;  // Move group `a` ahead
        }

        // Both groups have messages, compare their timestamps
        return new Date(latestMessageB.timestamp) - new Date(latestMessageA.timestamp);
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
  sortGroups,
  sortGroupsInitially
} = chatSlice.actions;
export default chatSlice.reducer;
