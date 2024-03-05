import axios from "axios";
import { loginSuccess, logoutSuccess } from "./authSlice";
import { setListGroup } from "./listGroup";
import { setListConversation } from "./listConverSlice";

export const loginUser = async (user, dispatch, navigate) => {
  const res = await axios.post(
    process.env.REACT_APP_URL_API + "/api/login",
    user
  );
  dispatch(loginSuccess(res.data));
  return res.data;
};

export const logoutUser = async (dispatch,accessToken) => {
  await axios.post(
    process.env.REACT_APP_URL_API + "/api/auth/logout",
    {}, // Empty data object as there's no payload to send
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`, 
        'Content-Type': 'application/json',
      }
    }
  );
  dispatch(logoutSuccess());
};

export const callListGroup = async ( dispatch,accessToken) => {
  const res = await axios.get(
    process.env.REACT_APP_URL_API + "/api/auth/listGroup",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  dispatch(setListGroup(res.data.data));
  return res.data;
};

export const callListConversation = async ( dispatch,accessToken) => {
  await axios
  .get(process.env.REACT_APP_URL_API + "/api/auth/listMess", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    const updatedList = response.data.data.slice().sort((a, b) => {
      const dateA = new Date(a.latest_message?.created_at);
      const dateB = new Date(b.latest_message?.created_at);
      return dateB - dateA;
    });
    dispatch(setListConversation(updatedList));
  });
};