import { Link } from "react-router-dom";
import "../SideBarMess/style.css";
import { calculateTimeAgo } from "../../../../Helper";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import Echo from "laravel-echo";
import { callListConversation } from "../../../../../redux/apiRequest";
import { addConversation } from "../../../../../redux/listConverSlice";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
window.Pusher = require("pusher-js");
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const SideBarMess = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [groupName, setGroupName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancelImage = () => setPreviewOpen(false);
  const dispatch = useDispatch();
  const [listFriend, setListFriend] = useState([]);
  const listConversation = useSelector(
    (state) => state.listConverSlice.conversations
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const handleChangeImage = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const showModal = () => {
    axios
      .get(process.env.REACT_APP_URL_API + "/api/auth/listFriend", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setListFriend(response.data);
      });
    setIsModalOpen(true);
  };
  const [selectedUser, setSelectedUser] = useState([]);

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedUser((prevSelectedUser) => {
      const index = prevSelectedUser.findIndex((user) => user.id === value); // Giả sử id là trường unique để xác định user
      if (index !== -1) {
        const updatedUsers = [...prevSelectedUser];
        updatedUsers[index] = [...updatedUsers[index]];
        return updatedUsers;
      } else {
        return [...prevSelectedUser, value];
      }
    });
  };

  const handleOk = () => {
    let data = new FormData();
    data.append("name", groupName);
    data.append("participant_ids", selectedUser);
    data.append("image", fileList[0].originFileObj);
    axios
      .post(process.env.REACT_APP_URL_API + "/api/auth/createGroupChat", data, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        dispatch(addConversation(response.data.data, user.access_token));
      });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    callListConversation(dispatch, user.access_token);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
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
    const addGroupListener = window.Echo.private(
      "AddGroupToUser." + user.id
    ).listen("AddGroupToUser", (e) => {
      // setListConversation((pre) => [...pre, e.conversation]);
    });

    return () => {
      addGroupListener.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <section className="flex flex-col flex-none w-full max-sm:hidden group lg:max-w-sm  transition-all duration-300 ease-in-out">
      <div className="header pr-4 pl-4 flex flex-row justify-between items-center flex-none">
        <p className="text-xl p-2 w-full h-full font-bold md:block group-hover:block">
          Messenger
        </p>
        <button
          onClick={showModal}
          className="block rounded-full hover:bg-gray-700 bg-slate-100 w-10 h-10 p-2 md:block"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z" />
          </svg>
        </button>
      </div>
      <div className="search-box pl-4 pr-4 flex-none">
        <div className="relative">
          <label>
            <input
              // @keyup="search"
              v-model="search_result"
              className="rounded-full py-2 pr-6 pl-10 w-full border focus:outline-none focus:shadow-md transition duration-300 ease-in"
              type="text"
              placeholder="Search Messenger"
            />
            <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  fill="#bbb"
                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                />
              </svg>
            </span>
          </label>
        </div>
      </div>

      <div className="h-[78vh]">
        <div className="contacts p-2 flex-1 overflow-y-scroll h-[78vh]">
          {listConversation.map((listConver) => (
            <Link
              to={`/messager/${listConver.id}`}
              className="flex justify-between items-center pt-3 pb-3 pl-3 hover:bg-gray-800 rounded-lg relative"
              key={listConver.id}
            >
              <div className="w-16 h-16 relative flex flex-shrink-0">
                <img
                  className="shadow-md rounded-full w-full h-full object-cover"
                  src={
                    process.env.REACT_APP_URL_API +
                    "/storage/images/" +
                    (listConver.participants?.length <= 1
                      ? listConver.participants[0].user.image
                      : listConver.image)
                  }
                  alt="avatar"
                />
              </div>
              <div className="flex-auto min-w-0 ml-4 hidden md:block group-hover:block">
                <p className="font-semibold">
                  {listConver.name === null
                    ? listConver.participants[0].user.name
                    : listConver.name}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-3/4">
                    <div className="min-w-0">
                      <p className="truncate">
                        {listConver.latest_message
                          ? listConver.latest_message.content
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="w-1/4">
                    <p className="ml-2 text-xs whitespace-no-wrap">
                      {listConver.latest_message
                        ? calculateTimeAgo(listConver.latest_message.created_at)
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Modal
        title="Tạo nhóm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <div>
          <div className="p-3 ">
            <div
              v-click-outside="closeModal"
              className="bg-white rounded-md max-h-[80vh]"
            >
              <div className="p-2 pb-5">
                <div className="flex pb-2">
                  <div className="p-3 mr-1 border bg-slate-50 border-gray-950 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                    </svg>
                    <ImgCrop rotationSlider>
                      <Upload
                        action={
                          process.env.REACT_APP_URL_API + "/api/auth/image"
                        }
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChangeImage}
                        onPreview={handlePreview}
                        width={100}
                        className="customUpload"
                      >
                        {fileList.length < 1 && "+ Image"}
                      </Upload>
                    </ImgCrop>
                    <Modal
                      open={previewOpen}
                      title={previewTitle}
                      footer={null}
                      onCancel={handleCancelImage}
                    >
                      <img
                        alt="example"
                        style={{
                          width: "100%",
                        }}
                        src={previewImage}
                      />
                    </Modal>
                  </div>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                    }}
                    className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên nhóm"
                  />
                </div>
                <div>
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
                      type="text"
                      className="block w-full pl-8 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên hoặc email"
                    />
                  </div>
                </div>
                <div className="m-1 mt-2 mb-2">
                  <span className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-3 py-1 me-2">
                    Tất cả
                  </span>
                </div>
                <div className="border-t-2 pl-3 border-slate-400 overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                  <h2 className="font-bold">Bạn bè</h2>
                  <div className="mt-2">
                    {listFriend.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center mb-4 w-full"
                      >
                        <input
                          id={"user" + friend.id}
                          type="checkbox"
                          value={friend.id}
                          onChange={handleChange}
                          className=" w-4 h-4 text-blue-600 bg-gray-200 border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={"user" + friend.id}
                          className="w-full flex items-center ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <img
                            className="rounded-full w-10 h-10 mr-2"
                            src={
                              process.env.REACT_APP_URL_API +
                              "/storage/images/" +
                              friend.image
                            }
                            alt="avatar"
                          />
                          <span>{friend.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full border-t-2 border-slate-400">
                  <div className="pt-2 float-right">
                    <button
                      type="button"
                      onClick={handleOk}
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 dark:shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                    >
                      Tạo nhóm
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="text-white bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};
export default SideBarMess;
