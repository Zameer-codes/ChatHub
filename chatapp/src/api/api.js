import { userId } from "../App";
import { BaseUrl } from "../constants/Urls";
import axios from "axios";

// Fetch joined rooms from API
export const fetchJoinedRoomsApi = async () => {
    try {
        const response = await axios.get(`${BaseUrl}/api/Rooms/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching joined rooms:', error);
    }
};

// Fetch all messages from API
export const fetchAllMessagesApi = async () => {
    try {
        const response = await axios.get(`${BaseUrl}/api/Messages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching joined rooms:', error);
    }
};