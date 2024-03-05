import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button,message, Modal } from "antd";
import axios from "axios";
import { useSelector,useDispatch  } from "react-redux";
import { useNavigate } from "react-router-dom";
import { callListGroup } from "../../../../../redux/apiRequest";
import { addGroup } from "../../../../../redux/listGroup";

const SideBarGroup = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const listGroup = useSelector((state) => state.listGroup.listGroup);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [desc, setDesc] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
    const handleOk = () => {
      let data = new FormData();
      data.append("name", groupName);
      data.append("desc", desc);
      axios
        .post(process.env.REACT_APP_URL_API + "/api/auth/createGroup", data, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          dispatch(addGroup(response.data.data))
          message.success('Tạo nhóm thành công!')
          navigate(`/group/${response.data.data.id}`);
        });
      setIsModalOpen(false);
    };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
     callListGroup(dispatch, user.access_token);
      // eslint-disable-next-line
  }, []);

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 h-screen w-1/4 pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 bg-white">
        <div className="mb-2 space-y-2 font-medium">
          <Button onClick={showModal} className="w-full">
            + Tạo nhóm mới
          </Button>
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
                  <div className="flex pb-2">
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Giới thiệu về nhóm"
                      className="w-full rounded-lg p-2 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
                    ></textarea>
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

        <h1 className="font-semibold text-lg">Nhóm bạn đã tham gia</h1>
        <div className="max-h-full overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {listGroup.map((group) => (
              <li key={group.id}>
                <Link
                  to={`/group/${group.id}`}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100"
                >
                  <img
                    className="w-16"
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      group.image
                    }
                    alt=""
                  />
                  <span className="flex-1 ml-3 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {group.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};
export default SideBarGroup;
