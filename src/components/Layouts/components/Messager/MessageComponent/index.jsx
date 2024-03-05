import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../MessageComponent/style.css";
const MessageComponent = ({ userconver }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { conversationId } = useParams();
  const chatHeight = `calc(100vh - 70px)`;
  useEffect(() => {
    const el = document.getElementById("messages");
    el.scrollTop = el.scrollHeight;
    if (conversationId) {
      axios
        .get(
          process.env.REACT_APP_URL_API +
            `/api/auth/getMessage/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        }); 
      
    }
   
    window.Echo.private("conversation." + conversationId).listen(
      "Test",
      (e) => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            user_id: e.message.user_id,
            conversation_id: e.message.conversation_id,
            content: e.message.content,
            id: e.message.id,
          }
        ]);
      }
    );
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);
  const sendMessage = (event) => {
      event.preventDefault(); 
      let data = {
        content: message,
      };
      setMessage("");
      axios.post(
        process.env.REACT_APP_URL_API + `/api/auth/sendMessage/${conversationId}`,
        data,{
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log( response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && message.trim().length > 0) {
      event.preventDefault(); 
      let data = {
        content: message,
      };
      setMessage("");
      axios.post(
        process.env.REACT_APP_URL_API + `/api/auth/sendMessage/${conversationId}`,
        data,{
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log( response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
    }
  };

  return (
    <>
      <section className="relative border-r border-l border-gray-800 h-full flex flex-col flex-auto ">
        <div className="absolute w-full chat-header px-2 sm:px-6 py-2 max-sm:py-0 flex flex-row flex-none justify-between items-center shadow">
          <div className="w-full flex justify-between">
            <div className="flex">
              <div className="w-12 h-12 max-sm:w-8 max-sm:h-8 sm:mr-4 mr-1 relative flex flex-shrink-0">
                {userconver.participants && (
                  <img
                    className="shadow-md rounded-full w-full h-full object-cover"
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      (userconver.participants.length > 1
                        ? userconver.image
                        : userconver.participants[0].user.image)
                    }
                    alt=""
                  />
                )}
              </div>
              <div className="text-sm">
                <p className="font-bold">
                  {userconver.name === null
                    ? userconver.participants[0].user.name
                    : userconver.name}
                </p>
                <p className="text-gray-400">1h trước</p>
              </div>
            </div>

            {/* <div className="chat-header px-2 sm:px-6 max-sm:py-0 flex flex-row flex-none items-center">
              <div className="flex">
                <a
                  href="/#"
                  className="block rounded-full hover:bg-gray-700 hover:text-slate-100 bg-slate-100 w-10 h-10 p-2 max-sm:w-5 max-sm:h-5 max-sm:p-0"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-full h-full fill-current hover:text-slate-100 text-gray-700"
                  >
                    <path d="M11.1735916,16.8264084 C7.57463481,15.3079672 4.69203285,12.4253652 3.17359164,8.82640836 L5.29408795,6.70591205 C5.68612671,6.31387329 6,5.55641359 6,5.00922203 L6,0.990777969 C6,0.45097518 5.55237094,3.33066907e-16 5.00019251,3.33066907e-16 L1.65110039,3.33066907e-16 L1.00214643,8.96910337e-16 C0.448676237,1.13735153e-15 -1.05725384e-09,0.445916468 -7.33736e-10,1.00108627 C-7.33736e-10,1.00108627 -3.44283713e-14,1.97634814 -3.44283713e-14,3 C-3.44283713e-14,12.3888407 7.61115925,20 17,20 C18.0236519,20 18.9989137,20 18.9989137,20 C19.5517984,20 20,19.5565264 20,18.9978536 L20,18.3488996 L20,14.9998075 C20,14.4476291 19.5490248,14 19.009222,14 L14.990778,14 C14.4435864,14 13.6861267,14.3138733 13.2940879,14.7059121 L11.1735916,16.8264084 Z" />
                  </svg>
                </a>
                <a
                  href="/#"
                  className="block rounded-full hover:bg-gray-700  bg-slate-100 w-10 h-10 p-2 ml-4 max-sm:w-5 max-sm:h-5 max-sm:p-0"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-full h-full fill-current hover:text-slate-100 text-gray-700"
                  >
                    <path d="M0,3.99406028 C0,2.8927712 0.894513756,2 1.99406028,2 L14.0059397,2 C15.1072288,2 16,2.89451376 16,3.99406028 L16,16.0059397 C16,17.1072288 15.1054862,18 14.0059397,18 L1.99406028,18 C0.892771196,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M8,14 C10.209139,14 12,12.209139 12,10 C12,7.790861 10.209139,6 8,6 C5.790861,6 4,7.790861 4,10 C4,12.209139 5.790861,14 8,14 Z M8,12 C9.1045695,12 10,11.1045695 10,10 C10,8.8954305 9.1045695,8 8,8 C6.8954305,8 6,8.8954305 6,10 C6,11.1045695 6.8954305,12 8,12 Z M16,7 L20,3 L20,17 L16,13 L16,7 Z" />
                  </svg>
                </a>
                <a
                  href="/#"
                  className="block rounded-full hover:bg-gray-700 hover:text-slate-100 bg-slate-100 w-10 h-10 p-2 ml-4 max-sm:w-5 max-sm:h-5 max-sm:p-0"
                >
                  <svg
                    viewBox="0 0 20 20"
                    className="w-full h-full fill-current hover:text-slate-100 text-gray-700"
                  >
                    <path d="M2.92893219,17.0710678 C6.83417511,20.9763107 13.1658249,20.9763107 17.0710678,17.0710678 C20.9763107,13.1658249 20.9763107,6.83417511 17.0710678,2.92893219 C13.1658249,-0.976310729 6.83417511,-0.976310729 2.92893219,2.92893219 C-0.976310729,6.83417511 -0.976310729,13.1658249 2.92893219,17.0710678 Z M9,11 L9,10.5 L9,9 L11,9 L11,15 L9,15 L9,11 Z M9,5 L11,5 L11,7 L9,7 L9,5 Z" />
                  </svg>
                </a>
              </div>
            </div> */}
          </div>{" "}
        </div>
        <div
          style={{ height: chatHeight }}
          className="flex antialiased text-gray-800 pt-16"
        >
          <div className="flex-1 p:2 justify-between flex flex-col h-full">
            <div
              id="messages"
              className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            >
              {messages.map((message) => (
                <div key={message.id} className="chat-message">
                  <div
                    className={`flex items-end ${
                      message.user_id === user.id ? "justify-end" : ""
                    }`}
                  >
                    <div
                      className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 items-start ${
                        message.user_id === user.id ? "order-1" : "order-2"
                      }`}
                    >
                      <div>
                        <span
                          className={`px-4 py-2 rounded-lg inline-block rounded-bl-none ${
                            message.user_id === user.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {message.content}
                        </span>
                      </div>
                    </div>
                    {userconver.participants?.map((participant) => {
                      if (participant.user_id === message.user_id) {
                        return (
                          <img
                            key={participant.user.id}
                            src={
                              process.env.REACT_APP_URL_API +
                              "/storage/images/" +
                              participant.user.image
                            }
                            alt="Participant profile"
                            className="w-6 h-6 rounded-full order-1"
                          />
                        );
                      }
                      return null;
                    })}
                    {!userconver.participants?.find(
                      (participant) => participant.user_id === message.user_id
                    ) &&
                      user.id === message.user_id && (
                        <img
                          key={user.id}
                          src={
                            process.env.REACT_APP_URL_API +
                            "/storage/images/" +
                            user.image
                          }
                          alt="My profile"
                          className="w-6 h-6 rounded-full order-1"
                        />
                      )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-gray-200 px-1 pb-2 pt-2 mb-2 sm:mb-0">
              <div className="relative flex">
                <form onSubmit={sendMessage} className="w-full">
                  <span className="absolute inset-y-0 flex items-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        ></path>
                      </svg>
                    </button>
                  </span>
                  <input
                    type="text"
                    placeholder="Write your message!"
                    className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        ></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6 text-gray-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                    >
                      <span className="font-bold">Send</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-6 w-6 ml-2 transform rotate-90"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default MessageComponent;
