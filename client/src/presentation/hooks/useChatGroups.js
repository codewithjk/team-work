import { useEffect, useState, useCallback } from "react";
import projectApi from "../../infrastructure/api/projectApi";
import chatApi from "../../infrastructure/api/chatApi";
import { useDispatch } from "react-redux";
import { setGroups } from "../../application/slice/chatSlice";

export function useChatGroups() {
    // Initial value avoids unnecessary updates





    return {
        isMobile,
        selectedGroup,
        setSelectedGroup,
    };
}
