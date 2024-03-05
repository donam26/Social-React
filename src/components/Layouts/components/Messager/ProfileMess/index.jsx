import { useState } from "react";
import { Modal, Popover } from "antd";
import "../ProfileMess/style.css";

const ProfileMess = ({ userconver }) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <style jsx="true">
        {`
          .ant-popover {
            width: 25%;
          }
        `}
      </style>
      <div>
        <div className="conversation-details">
          <div className="max-w-2xl sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white rounded-lg text-gray-900">
            <div className="rounded-t-lg h-32 overflow-hidden">
              <img
                className="object-cover object-top w-full"
                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                alt="Mountain"
              />
            </div>
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
              <img
                className="object-cover object-center h-32"
                src={
                  process.env.REACT_APP_URL_API +
                  "/storage/images/" +
                  (userconver.participants?.length <= 1
                    ? userconver?.participants[0].user.image
                    : userconver.image)
                }
                alt="Woman looking front"
              />
            </div>
            <div v-if="userconver.participants.length > 1">
              <div className="text-center mt-2">
                <h2 className="font-semibold">
                  {userconver.participants?.length <= 1
                    ? userconver?.participants[0].user.name
                    : userconver.name}
                </h2>
                <p className="text-gray-500">{userconver.address}</p>
              </div>
              <div>
                <ul className="p-2 rounded-lg">
                  <li className="flex items-center hover:bg-gray-100 p-2">
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                    </svg>
                    <span>Sửa tên nhóm</span>
                  </li>
                  <li className="flex items-center hover:bg-gray-100 p-2">
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                    >
                      <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                    </svg>
                    <span>Đổi ảnh</span>
                  </li>
                  <Popover
                    placement="bottom"
                    content={
                      <ul>
                        {userconver.participants?.map((participant) => (
                          <li
                            key={participant.id}
                            className="flex items-center hover:bg-gray-100 pl-2"
                          >
                            <div className="w-14 h-14 rounded-full overflow-hidden">
                              <img
                                src={
                                  process.env.REACT_APP_URL_API +
                                  "/storage/images/" +
                                  participant.user.image
                                }
                                alt="Woman looking front"
                              />
                            </div>
                            <div>
                              <h3 className="">{participant.user.name}</h3>
                              {userconver.created_user ===
                              participant.user.id ? (
                                <span
                                  type="button"
                                  className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2"
                                >
                                  Chủ nhóm
                                </span>
                              ) : (
                                <span
                                  type="button"
                                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2"
                                >
                                  Thành viên
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    }
                    title="Thành viên"
                    trigger="click"
                    open={open}
                    onOpenChange={handleOpenChange}
                  >
                    <li className="flex items-center hover:bg-gray-100 p-2">
                      <svg
                        className="mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                      <span>Xem thành viên</span>
                    </li>{" "}
                  </Popover>
                </ul>
                <div className="p-4 border-t mx-auto mt-2 text-center">
                  <button
                    onClick={showModal}
                    type="button"
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  >
                    Rời nhóm
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            title="Xác nhận rời nhóm"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
          >
            <div>
              <div className="p-3 ">
                <p>
                  Nếu rời khỏi nhóm, bạn sẽ không thể xem được cuộc trò chuyện.
                  Xác nhận rời ?
                </p>
                <div className="w-full">
                  <div className="float-right">
                    <button
                      onClick={handleOk}
                      type="button"
                      className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={handleCancel}
                      type="button"
                      className="text-white bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProfileMess;
