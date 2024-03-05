import "../Header/Header.css";
import image from "../../../../assets/images/logo_new.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../../redux/apiRequest";
import { message } from "antd";
import axios from "axios";
import Echo from "laravel-echo";
import { calculateTimeAgo } from "../../../Helper";
window.Pusher = require("pusher-js");
function Header() {
  const [showCurrentUser, setShowCurrentUser] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [listNotification, setListNotification] = useState([]);
  const [key, setKey] = useState([]);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async () => {
    let accessToken = user.access_token;
    await logoutUser(dispatch, accessToken);
    navigate("/login");
  };

  if (user) {
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "anyKey",
      wsHost: process.env.REACT_APP_HOST_API,
      authEndpoint: process.env.REACT_APP_URL_API + "/broadcasting/auth",
      encrypted: false,
      forceTLS: false,
      wsPort: 6001,
      wssPort: 6001,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      auth: {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      },
      cluster: "mt1",
    });
  }

  useEffect(() => {
    if (user === null) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_URL_API + "/api/auth/notification",
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setListNotification(response.data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user) {
      window.Echo.private("NotificationMember." + user.id).listen(
        "NotificationMember",
        (e) => {
          message.success(e.message);
          setListNotification((pre) => [e.notification, ...pre]);
          console.log(e.notification);
        }
      );
      window.Echo.private("RequestMember." + user.id).listen(
        "RequestMember",
        (e) => {
          message.success(e.message);
          setListNotification((pre) => [e.notification, ...pre]);
        }
      );
      window.Echo.private("FeelBeLongTo." + user.id).listen(
        "CommentFeel",
        (e) => {
          console.log(e);
          message.success(e.message);
          setListNotification((pre) => [e.notification, ...pre]);
        }
      );
      return () => {
        window.Echo.leaveChannel("NotificationMember." + user.id);
        window.Echo.leaveChannel("RequestMember." + user.id);
        window.Echo.leaveChannel("FeelBeLongTo." + user.id);
      };
    }
  }, [user]);
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?name=${key}`);
  }
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>

              <Link to="/" className="flex ml-2 md:mr-24 sm:mr-4">
                <img src={image} className="h-12 sm:mr-3" alt="Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white max-sm:hidden">
                  Social
                </span>
              </Link>

              <form className="md:ml-10" onSubmit={handleSearch}>
                <label
                  htmlFor="default-search"
                  className="mb-2text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-2 pl-8 text-sm max-sm:w-[140px] text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tìm kiếm"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="flex items-center">
              <div className="flex justify-center items-center mr-3">
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  type="button"
                  className="flex text-sm rounded-full bg-gray-100 w-10 h-10 justify-center items-center focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded="false"
                  data-dropdown-toggle="dropdown-notification"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="16"
                    viewBox="0 0 448 512"
                  >
                    <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                  </svg>
                </button>
                <OutsideClickHandler
                  onOutsideClick={() => {
                    if (showNotification === true) setShowNotification(false);
                  }}
                >
                  <div
                    className={`z-50 fixed top-14 right-2 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                ${showNotification ? "" : "hidden"}`}
                  >
                    <div className="w-full notification h-96 overflow-y-auto relative shadow-xl">
                      <div className="bg-white  px-5 py-3 rounded-lg shadow hover:shadow-xl max-w-sm mx-auto transform hover:-translate-y-[0.125rem] transition duration-100 ease-linear">
                        {listNotification.map((notification) => {
                          return (
                            <Link to={notification.link} key={notification.id}>
                              {(() => {
                                switch (notification.type) {
                                  case 1:
                                    return (
                                      <div key={notification.id}>
                                        <h3>{notification.title}</h3>
                                        <p>{notification.content}</p>
                                      </div>
                                    );
                                  case 2:
                                    return (
                                      <div key={notification.id}>
                                        <div className="flex items-center mt-2 rounded-lg px-1 py-1 cursor-pointer">
                                          <div className="relative flex flex-shrink-0 items-end">
                                            <img
                                              className="h-16 w-16 rounded-full"
                                              src={
                                                process.env.REACT_APP_URL_API +
                                                "/storage/images/" +
                                                notification.member_image
                                              }
                                              alt="avatar"
                                            />
                                            <span className="absolute h-4 w-4 bg-green-400 rounded-full bottom-0 right-0 border-2 border-white"></span>
                                          </div>
                                          <div className="ml-3">
                                            <span className="font-semibold tracking-tight text-xs">
                                              {notification.member_name}
                                            </span>
                                            <span className="ml-1 text-xs leading-none opacity-50">
                                              đã bình luận về bài viết của bạn
                                            </span>
                                            <p className="text-xs leading-4 pt-2 italic opacity-70">
                                              "{notification.content}"
                                            </p>
                                            <span className="text-[10px] text-blue-500 font-medium leading-4 opacity-75">
                                              {calculateTimeAgo(
                                                notification.created_at
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );

                                  case 3:
                                    return (
                                      <div key={notification.id}>
                                        <h3>New friend request!</h3>
                                        <p>
                                          {notification.sender} wants to be your
                                          friend.
                                        </p>
                                      </div>
                                    );
                                  case 4:
                                    return (
                                      <div key={notification.id}>
                                        <div className="flex items-center mt-2 rounded-lg px-1 py-1 cursor-pointer">
                                          <div className="relative flex flex-shrink-0 items-end">
                                            <img
                                              className="h-16 w-16 rounded-full"
                                              src={
                                                process.env.REACT_APP_URL_API +
                                                "/storage/images/" +
                                                notification.member_image
                                              }
                                              alt="avatar"
                                            />
                                            <span className="absolute h-4 w-4 bg-green-400 rounded-full bottom-0 right-0 border-2 border-white"></span>
                                          </div>
                                          <div className="ml-3">
                                            <span className="font-semibold tracking-tight text-xs">
                                              {notification.member_name}
                                            </span>
                                            <span className="ml-1 text-xs leading-none opacity-50">
                                              đã mời bạn vào nhóm
                                            </span>
                                            <p className="text-xs leading-4 pt-2 italic opacity-70">
                                              "Click để xem chi tiết..."
                                            </p>
                                            <span className="text-[10px] text-blue-500 font-medium leading-4 opacity-75">
                                              {calculateTimeAgo(
                                                notification.created_at
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  case 5:
                                    return (
                                      <div key={notification.id}>
                                        <div className="flex items-center mt-2 rounded-lg px-1 py-1 cursor-pointer">
                                          <div className="relative flex flex-shrink-0 items-end">
                                            <img
                                              className="h-16 w-16 rounded-full"
                                              src={
                                                process.env.REACT_APP_URL_API +
                                                "/storage/images/" +
                                                notification.member_image
                                              }
                                              alt="avatar"
                                            />
                                            <span className="absolute h-4 w-4 bg-green-400 rounded-full bottom-0 right-0 border-2 border-white"></span>
                                          </div>
                                          <div className="ml-3">
                                            <span className="font-semibold tracking-tight text-xs">
                                              {notification.member_name}
                                            </span>
                                            <span className="ml-1 text-xs leading-none opacity-50">
                                              {notification.content}
                                            </span>
                                            <p className="text-xs leading-4 pt-2 italic opacity-70">
                                              "Click để xem chi tiết..."
                                            </p>
                                            <span className="text-[10px] text-blue-500 font-medium leading-4 opacity-75">
                                              {calculateTimeAgo(
                                                notification.created_at
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  default:
                                    return null;
                                }
                              })()}
                            </Link>
                          );
                        })}
                        {/* <div className="flex items-center mt-2 rounded-lg px-1 py-1 cursor-pointer">
                        <div className="relative flex flex-shrink-0 items-end">
                          <img
                            className="h-16 w-16 rounded-full"
                            src="https://i.pravatar.cc/300"
                            alt="avatar"
                          />
                          <span className="absolute h-4 w-4 bg-green-400 rounded-full bottom-0 right-0 border-2 border-white"></span>
                        </div>
                        <div className="ml-3">
                          <span className="font-semibold tracking-tight text-xs">
                            John Doe
                          </span>
                          <span className="text-xs leading-none opacity-50">
                            reacted to your comment:
                          </span>
                          <p className="text-xs leading-4 pt-2 italic opacity-70">
                            "This is the comment..."
                          </p>
                          <span className="text-[10px] text-blue-500 font-medium leading-4 opacity-75">
                            a few seconds ago
                          </span>
                        </div>
                      </div> */}
                      </div>
                    </div>
                  </div>
                </OutsideClickHandler>
              </div>

              <div className="flex items-center ml-3">
                <div>
                  <button
                    onClick={() => setShowCurrentUser(!showCurrentUser)}
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-10 h-10 rounded-full"
                      src={
                        process.env.REACT_APP_URL_API +
                        "/storage/images/" +
                        user?.image
                      }
                      alt="user"
                    />
                  </button>
                </div>
                <OutsideClickHandler
                  onOutsideClick={() => {
                    if (showCurrentUser === true) setShowCurrentUser(false);
                  }}
                >
                  <div
                    className={`z-50 fixed top-14 right-2 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600
                ${showCurrentUser ? "" : "hidden"}`}
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm text-gray-900 dark:text-white"
                        role="none"
                      >
                        {user?.name}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      >
                        {user?.email}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li className="hover:bg-gray-100">
                        <a
                          href="/#"
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                          alt="member"
                        >
                          Trang cá nhân
                        </a>
                      </li>
                      <li className="hover:bg-gray-100">
                        <a
                          href="/#"
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                        >
                          Cài đặt
                        </a>
                      </li>
                      <li className="hover:bg-gray-100">
                        <button
                          onClick={logout}
                          className="block px-4 py-2 text-sm text-gray-700"
                          role="menuitem"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                </OutsideClickHandler>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
