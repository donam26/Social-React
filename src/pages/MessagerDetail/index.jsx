import { useEffect, useState } from "react";
import MessageComponent from "../../components/Layouts/components/Messager/MessageComponent";
import ProfileMess from "../../components/Layouts/components/Messager/ProfileMess";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const MessagerDetail = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  const { conversationId } = useParams();
  const [userconver, setUserconver] = useState({});
  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_URL_API +
          `/api/auth/getUserRoom/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setUserconver(response.data);
      });
       // eslint-disable-next-line
  }, [conversationId]);
  return (
    <>
      <div className="flex">
        <div className="w-2/3">
          <MessageComponent userconver={ userconver }/>
        </div>
        <div className="w-1/3">
          <ProfileMess userconver={ userconver }/>
        </div>
      </div>
    </>
  );
};
export default MessagerDetail;
