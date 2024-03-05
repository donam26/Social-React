import axios from "axios";
import { useSelector } from 'react-redux'; // Assuming you're using Redux
const auth = useSelector((state) => state.auth.login?.user);
const accessToken = auth.access_token

export const instance = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    headers: {
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json',
    }

})

