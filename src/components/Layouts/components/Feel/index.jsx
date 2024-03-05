import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Modal, message } from "antd";
import { calculateTimeAgo } from "../../../Helper";
import "../Feel/style.css";
import { Link } from "react-router-dom";
import axios from "axios";
const Feel = ({ url, dataFromChild1 }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [feels, setFeel] = useState([]);
  const [editFeel, setEditFeel] = useState(false);
  const accessToken = user.access_token;

  useEffect(() => {
    if (Object.keys(dataFromChild1).length > 0) {
      setFeel((prevFeels) => [dataFromChild1, ...prevFeels]);
    }
  }, [dataFromChild1]);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_URL_API + `/api/auth/${url.param}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setFeel(response.data.data);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, url.param]);

  //comment
  const getComments = (feel) => {
    return feel.comments.sort((a, b) => b.id - a.id).slice(0, 3) || [];
  };

  const showEdit = (feelId) => {
    setEditFeel(feelId === editFeel ? null : feelId);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feelModel, setFeelModel] = useState([]);

  const showModal = (feel) => {
    setFeelModel(feel);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [contentComment, setContentComment] = useState("");
  const submitComment = (feel) => {
    let data = {
      post_id: feel.id,
      content: contentComment,
    };

    axios
      .post(process.env.REACT_APP_URL_API + "/api/auth/comment", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setContentComment("");
        feel.comments.unshift({
          id: response.data.data.id,
          user: user,
          post_id: feel.id,
          content: response.data.data.content,
        });
      });
  };
  const sendLike = async (feel) => {
    const data = {
      post_id: feel.id,
      user_id: user.id,
    };
    await axios.post(process.env.REACT_APP_URL_API + "/api/auth/like", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const updatedFeels = feels.map((item) => {
      if (item.id === feel.id) {
        const liked = item.likes.some((like) => like.user_id === user.id);
        if (liked) {
          item.likes = item.likes.filter((like) => like.user_id !== user.id);
        } else {
          item.likes.push({
            user_id: user.id,
            post_id: feel.id,
          });
        }
      }
      return item;
    });
    setFeel(updatedFeels);
  };

  const hiddenFeel = async (feelId) => {
    let data = {
      feel_id: feelId,
    };
    await axios.post(
      process.env.REACT_APP_URL_API + "/api/auth/hiddenFeel",
      data
    );
    let updatedFeels = feels.filter((item) => item.id !== feelId);
    setFeel(updatedFeels);
  };
  const deleteFeel = async (feelId) => {
    let data = {
      feel_id: feelId,
    };
    await axios.post(
      process.env.REACT_APP_URL_API + "/api/auth/deleteFeel",
      data
    );
    let updatedFeels = feels.filter((item) => item.id !== feelId);
    setFeel(updatedFeels);
    message.success("Đã xóa bài viết");
  };
  return (
    <>
      {feels.map((feel) => (
        <div
          className="mb-3 border-gray-300 bg-white shadow rounded-lg"
          key={feel.id}
        >
          <div className="flex justify-between px-2 py-3 mx-3">
            <div className="flex flex-row">
              <div className="w-auto h-auto rounded-full border-2 border-neutral-400">
              <Link to={`/user/${feel.user.id}`}>

                <img
                  className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
                  alt="User"
                  src={
                    process.env.REACT_APP_URL_API +
                    "/storage/images/" +
                    feel.user.image
                  }
                />
                </Link>
              </div>
              <div className="flex flex-col mb-2 ml-4 mt-1">
                <div className="text-gray-600 text-sm font-semibold">
              <Link to={`/user/${feel.user.id}`}>

                  {feel.user.name}
              </Link>

                </div>
                <div className="flex w-full mt-1">
                  <span className="text-gray-400 font-thin text-xs">
              <Link to={`/feel/${feel.id}`}>

                    • {calculateTimeAgo(feel.created_at)}
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            {feel.user_id === user.id ? (
              <div className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-gray-100">
                <div className="relative">
                  <button onClick={() => showEdit(feel.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="14"
                      viewBox="0 0 448 512"
                    >
                      <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                    </svg>
                  </button>
                  {editFeel === feel.id && (
                    <div className="dropdownContent absolute right-0 z-10">
                      <ul className="border bg-gray-50 border-gray-300 w-36 rounded-md shadow-md">
                        <li className="border-gray-300 p-2 pl-4 pr-4 hover:bg-gray-100 transition duration-300">
                          <button
                            onClick={() => {
                              hiddenFeel(feel.id);
                            }}
                            className=" flex items-center w-full"
                          >
                            <svg
                              className="mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="16"
                              viewBox="0 0 512 512"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="14"
                                viewBox="0 0 448 512"
                              >
                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                              </svg>
                              <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm175 79c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
                            </svg>
                            <span>Ẩn bài viết</span>
                          </button>
                        </li>
                        <li className="border-gray-300 flex items-center p-2 pl-4 pr-4 hover:bg-gray-100 transition duration-300">
                          <button
                            onClick={() => {
                              deleteFeel(feel.id);
                            }}
                            className=" flex items-center w-full"
                          >
                            <svg
                              className="mr-2"
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="14"
                              viewBox="0 0 448 512"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="14"
                                viewBox="0 0 448 512"
                              >
                                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                              </svg>
                              <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                            </svg>
                            <span>Xóa bài viết</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="border-b border-gray-100"></div>
          {feel.title && (
            <div className="text-gray-500 text-sm mb-3 mt-3 mx-3 px-2">
              {feel.title}
            </div>
          )}
          <div className="text-gray-400 font-medium text-sm mb-7 mt-6 mx-3 px-2">
            {feel.image && (
              <Image
                src={
                  process.env.REACT_APP_URL_API +
                  "/storage/images/" +
                  feel.image
                }
              />
            )}
          </div>

          <div className="flex w-full border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendLike(feel);
              }}
            >
              <div className="mt-2 mx-5 flex flex-row text-xs">
                <button
                  type="submit"
                  className="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 mb-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
                >
                  {feel.likes.some((item) => item.user_id === user.id) ? (
                    <svg
                      id="like"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1.5em"
                      viewBox="0 0 512 512"
                    >
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </svg>
                  ) : (
                    <svg
                      id="like"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1.5em"
                      viewBox="0 0 512 512"
                    >
                      <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />{" "}
                    </svg>
                  )}
                </button>
              </div>
            </form>
            <div className="mx-5 w-full flex justify-end text-xs">
              <div className="flex justify-end w-full mt-1 pt-2 pr-5">
                <div className="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">
                  Likes:
                  <div className="ml-1 text-gray-400 text-ms">
                    {feel.likes.length}
                  </div>
                </div>
                <div className="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">
                  <button onClick={() => showModal(feel)}>
                    Comments:
                    <span className="ml-1 text-gray-400 text-ms">
                      {feel.comments.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-1 pb-1">
            {getComments(feel).map((comment) => (
              <div
                key={comment.id}
                className="bg-white pl-2 m-2 border border-gray-300 rounded-2xl shadow-md md:min-w-[150px]"
              >
                <div className="flex">
                  <div className="p-2">
              <Link to={`/user/${comment.user.id}`}>

                    <img
                      className="w-x8 w-8 h-8 rounded-full"
                      src={
                        process.env.REACT_APP_URL_API +
                        "/storage/images/" +
                        comment.user.image
                      }
                      alt="avatar"
                    />
                    </Link>
                  </div>
                  <div className="flex-col m-1">
              <Link to={`/user/${comment.user.id}`}>

                    <div className="text-sm font-bold">{comment.user.name}</div>
                    </Link>
                    <div className="text-sm">{comment.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitComment(feel);
            }}
          >
            <div className="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
              <img
                className="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
                src={
                  process.env.REACT_APP_URL_API +
                  "/storage/images/" +
                  user.image
                }
                alt="avatar"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-6">
                <button
                  type="submit"
                  className="bg-slate-300 rounded-full p-1 focus:outline-none focus:shadow-none hover:text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                  </svg>
                </button>
              </span>
              <input
                type="text"
                className="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue"
                style={{ borderRadius: "25px" }}
                placeholder="Viết bình luận..."
                autoComplete="off"
                onChange={(e) => {
                  setContentComment(e.target.value);
                }}
                value={contentComment}
              />
            </div>
          </form>
        </div>
      ))}

      <Modal
        title={`Bài viết của ${feelModel.user?.name || ""}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ top: "20px" }} // Chỉnh khoảng cách top thành 100px
        footer={false}
      >
        <div className="flex justify-between">
          <div className="bg-white rounded-md w-2/3">
            <div className="pt-1 pb-1">
              <div className="flex">
                <div className="p-2">
                  <img
                    className="w-x8 w-8 h-8 rounded-full"
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      feelModel.user?.image
                    }
                    alt="avartar"
                  />
                </div>
                <div className="flex-col m-1">
                  <div className="text-sm font-bold">
                    {feelModel.user?.name}
                  </div>
                  <span className="text-gray-400 font-thin text-xs">
                    {calculateTimeAgo(feelModel?.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-gray-700 text-sm mb-3 mt-3 mx-3 px-2">
                {feelModel.title}
              </div>
              <div className="flex justify-center text-gray-500 text-center text-sm mb-3 mt-3 mx-3 px-2">
                {feelModel.image && (
                  <img
                    className="max-w-96 text-center"
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      feelModel.image
                    }
                    alt="avartar"
                  />
                )}
              </div>
              <div className="flex w-full border-t border-gray-100">
                <form>
                  <div className="mt-2 mx-5 flex flex-row text-xs">
                    <button
                      type="submit"
                      className="transition ease-out duration-300 hover:bg-gray-50 bg-gray-100 h-8 px-2 mb-2 py-2 text-center rounded-full text-gray-100 cursor-pointer"
                    >
                      {feelModel.likes?.some(
                        (item) => item.user_id === user.id
                      ) ? (
                        <svg
                          id="like"
                          xmlns="http://www.w3.org/2000/svg"
                          height="1.5em"
                          viewBox="0 0 512 512"
                        >
                          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </svg>
                      ) : (
                        <svg
                          id="like"
                          xmlns="http://www.w3.org/2000/svg"
                          height="1.5em"
                          viewBox="0 0 512 512"
                        >
                          <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />{" "}
                        </svg>
                      )}
                    </button>
                    <input type="text" hidden name="post_id" />
                  </div>
                </form>
                <div className="mx-5 w-full flex justify-end text-xs">
                  <div className="flex justify-end w-full mt-1 pt-2 pr-5">
                    <div className="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">
                      Likes:
                      <div className="ml-1 text-gray-400 text-ms">
                        {feelModel.likes?.length}
                      </div>
                    </div>
                    <div className="flex text-gray-700 font-normal rounded-md mb-2 mr-4 items-center">
                      Comments:
                      <span className="ml-1 text-gray-400 text-ms">
                        {feelModel.comments?.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <form>
                <div className="relative flex items-center self-center w-full max-w-xl p-4 overflow-hidden text-gray-600 focus-within:text-gray-400">
                  <img
                    className="w-10 h-10 object-cover rounded-full shadow mr-2 cursor-pointer"
                    alt="User"
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      user.image
                    }
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-6">
                    <button
                      type="submit"
                      className="bg-slate-300 rounded-full p-1 focus:outline-none focus:shadow-none hover:text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 512 512"
                      >
                        <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                      </svg>
                    </button>
                  </span>
                  <input
                    type="text"
                    className="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:text-gray-900 focus:shadow-outline-blue"
                    style={{ borderRadius: "25px" }}
                    placeholder="Post a comment..."
                    autoComplete="off"
                    value={contentComment}
                    onChange={(e) => {
                      setContentComment(e.target.value);
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="w-1/3 p-1 max-h-[80vh] overflow-y-auto border-l-2 border-gray-300">
            <h1 className="font-bold text-base">Bình luận</h1>
            <div className="bg-white pl-2 m-2 border border-gray-300 rounded-2xl shadow-md md:min-w-[150px]">
              {feelModel.comments?.map((comment) => (
                <div key={comment.id} className="flex">
                  <div className="p-2">
                    <img
                      className="w-x8 w-8 h-8 rounded-full"
                      src={
                        process.env.REACT_APP_URL_API +
                        "/storage/images/" +
                        comment.user.image
                      }
                      alt="avartar"
                    />
                  </div>
                  <div className="flex-col m-1">
                    <div className="text-sm font-bold">{comment.user.name}</div>
                    <div className="text-sm">{comment.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Feel;
