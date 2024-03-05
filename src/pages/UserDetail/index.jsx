import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Image } from "antd";
import { Dropdown, Space } from "antd";
import { DownOutlined, CloseOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { calculateTimeAgo } from "../../components/Helper";
import { useNavigate } from "react-router-dom";

const UserDetail = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [listImages, setListImages] = useState([]);
  const [profile, setProfile] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

 
  const [feels, setFeel] = useState([]);

  useEffect(() => {
    if(parseInt(userId, 10) === user.id) {
      console.log('navigation')
      navigate("/profile");

    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(process.env.REACT_APP_URL_API + `/api/auth/profile/${userId}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            setProfile(response.data);
            const feelsWithImages = response.data.data.filter(
              (feel) => feel.image !== null
            );
            setListImages(feelsWithImages);
          });
          await axios
          .get(process.env.REACT_APP_URL_API + `/api/auth/userFeel/${userId}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            setFeel(response.data.data);
          })
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [userId]);
  const items = [
    {
      key: "1",
      label: (
        <button target="_blank" rel="noopener noreferrer">
          Hủy lời mời
        </button>
      ),
      icon: <CloseOutlined />,
    },
    {
      key: "2",
      label: (
        <button target="_blank" rel="noopener noreferrer">
          Hủy kết bạn
        </button>
      ),
      icon: <CloseOutlined />,
    },
  ];
  //comment
  const getComments = (feel) => {
    return feel.comments.sort((a, b) => b.id - a.id).slice(0, 3) || [];
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
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setContentComment('')
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
        Authorization: `Bearer ${user.access_token}`,
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

  return (
    <div>
      <div className="bg-white shadow rounded-lg p-10">
        <div className="flex flex-col gap-1 text-center items-center">
          <img
            className="h-32 w-32 bg-white p-2 rounded-full shadow mb-4"
            src={
              process.env.REACT_APP_URL_API +
              "/storage/images/" +
              profile.profile?.image
            }
            alt="prof"
          />
          <p className="font-semibold">{profile.profile?.name}</p>
          <div className="text-sm leading-normal text-gray-400 flex justify-center items-center">
            <svg
              viewBox="0 0 24 24"
              className="mr-1"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {profile.profile?.address}
          </div>
        </div>
        <div className="flex justify-center items-center gap-2 my-1">
          {(() => {
            switch (profile.status_friend?.status) {
              case 0:
                return profile.status_friend?.user_id === user.id ? (
                  <div className="font-semibold text-center">
                    <Dropdown
                      menu={{
                        items: [items[0]],
                      }}
                      placement="bottom"
                    >
                      <button
                        className="flex text-black bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Space>
                          <DownOutlined />
                          Đã gửi kết bạn
                        </Space>
                      </button>
                    </Dropdown>
                  </div>
                ) : (
                  <div className="font-semibold text-center">
                    <button
                      type="button"
                      className="flex text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                    >
                      <svg
                        className="mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="20"
                        viewBox="0 0 640 512"
                      >
                        <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                      </svg>
                      <span>Chấp nhận kết bạn</span>
                    </button>
                  </div>
                );
              case 1:
                return (
                  <div className="flex justify-center items-center">
                    <div className="font-semibold text-center">
                      <Dropdown
                        menu={{
                          items: [items[1]],
                        }}
                        placement="bottom"
                      >
                        <button
                          className="flex text-black bg-gray-200 hover:bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Space>
                            <DownOutlined />
                            Bạn bè
                          </Space>
                        </button>
                      </Dropdown>
                    </div>
                    <div className="font-semibold text-center">
                      <button
                        type="button"
                        className="flex text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                      >
                        <svg
                          className="mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="16"
                          viewBox="0 0 512 512"
                        >
                          <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                        </svg>
                        <span>Nhắn tin</span>
                      </button>
                    </div>
                  </div>
                );
              default:
                return (
                  <div className="font-semibold text-center">
                    <button
                      type="button"
                      className="flex text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                    >
                      <svg
                        className="mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="20"
                        viewBox="0 0 640 512"
                      >
                        <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                      </svg>
                      <span>Kết bạn</span>
                    </button>
                  </div>
                );
            }
          })()}
        </div>
        <div className="flex justify-center items-center gap-2 my-3">
          <div className="font-semibold text-center mx-4">
            <p className="text-black">102</p>
            <span className="text-gray-400">Posts</span>
          </div>
          <div className="font-semibold text-center mx-4">
            <p className="text-black">102</p>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="font-semibold text-center mx-4">
            <p className="text-black">102</p>
            <span className="text-gray-400">Folowing</span>
          </div>
        </div>
      </div>

      <div className="bg-white shadow mt-6  rounded-lg p-6">
        <h3 className="text-gray-600 text-sm font-semibold mb-4">Hình ảnh</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {listImages.map((listImage) => (
            <div
              key={listImage.id}
              className="flex items-center justify-center rounded-lg max-w-full h-48 overflow-hidden"
            >
              <Image
                src={
                  process.env.REACT_APP_URL_API +
                  "/storage/images/" +
                  listImage.image
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white shadow mt-6  rounded-lg p-6">
        <h3 className="text-gray-600 text-sm font-semibold mb-4">Bài viết</h3>
        {feels.map((feel) => (
        <div
          className="mb-3 border-gray-300 bg-white shadow rounded-lg"
          key={feel.id}
        >
          <div className="flex justify-between px-2 py-3 mx-3">
            <div className="flex flex-row">
              <div className="w-auto h-auto rounded-full border-2 border-neutral-400">
                <img
                  className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
                  alt="User"
                  src={
                    process.env.REACT_APP_URL_API +
                    "/storage/images/" +
                    feel.user.image
                  }
                />
              </div>
              <div className="flex flex-col mb-2 ml-4 mt-1">
                <div className="text-gray-600 text-sm font-semibold">
                  {feel.user.name}
                </div>
                <div className="flex w-full mt-1">
                  <span className="text-gray-400 font-thin text-xs">
                    • {calculateTimeAgo(feel.created_at)}
                  </span>
                </div>
              </div>
            </div>
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
                  <button>
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
                    <img
                      className="w-x8 w-8 h-8 rounded-full"
                      src={
                        process.env.REACT_APP_URL_API +
                        "/storage/images/" +
                        comment.user.image
                      }
                      alt="avatar"
                    />
                  </div>
                  <div className="flex-col m-1">
                    <div className="text-sm font-bold">{comment.user.name}</div>
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
      </div>
    </div>
  );
};

export default UserDetail;