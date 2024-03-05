import { useEffect, useState } from "react";
import { Button, Popover, message, Tabs, Modal } from "antd";
import UploadFeel from "../../components/Layouts/components/UploadFeel";
import Feel from "../../components/Layouts/components/Feel";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Avatar, List, Card } from "antd";
import { useNavigate } from "react-router-dom";
import "../GroupDetail/style.css";
import { Input, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { editGroup, outGroup } from "../../redux/listGroup";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const { Meta } = Card;
const Group = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [postApprove, setPostApprove] = useState([]);
  const [memberApprove, setMemberApprove] = useState([]);
  const handleCancelImage = () => setPreviewOpen(false);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const group = useSelector((state) => state.listGroup.listGroup);
  const { groupId } = useParams();
  const param = `groupFeels/${groupId}`;
  const [open, setOpen] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileGroup, setProfileGroup] = useState({});
  const [listMember, setListMember] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const [listFriend, setListFriend] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelDeleteGroup, setModelDeleteGroup] = useState(false);
  const [modelShowProfileGroup, setModelShowProfileGroup] = useState(false);
  const [modelApprovePost, setModelApprovePost] = useState(false);
  const [modelApproveMember, setModelApproveMember] = useState(false);

  const [checkedItems, setCheckedItems] = useState({});
  const data = [
    {
      name: "Nam",
      title: "Ant Design Title 1",
    },
    {
      name: "Hoàng",
      title: "Ant Design Title 2",
    },
    {
      name: "Khải",
      title: "Ant Design Title 3",
    },
  ];
  const [dataFromChild1, setDataFromChild1] = useState({});
  // Hàm để cập nhật state với dữ liệu từ ChildComponent1
  const handleDataFromChild1 = (data) => {
    setDataFromChild1(data);
  };

  const handleChange = (event) => {
    const { id, checked } = event.target;
    setCheckedItems({ ...checkedItems, [id]: checked });
  };
  useEffect(() => {
    const initialCheckedItems = {};
    listFriend.forEach((friend) => {
      initialCheckedItems["user" + friend.id] = false;
    });
    setCheckedItems(initialCheckedItems);
  }, [listFriend, user.access_token]);
  const handleOk = () => {
    const selectedUsers = Object.keys(checkedItems)
      .filter((key) => checkedItems[key])
      .map((key) => key.replace("user", ""));
    let data = {
      user_ids: selectedUsers,
    };
    axios
      .post(
        process.env.REACT_APP_URL_API + `/api/auth/addMember/${groupId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        message.success(response.data.message);
      });
    setIsModalOpen(false);
  };
  const handleDeleteGroup = () => {
    setModelDeleteGroup(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setModelDeleteGroup(false);
    setModelShowProfileGroup(false);
    setModelApprovePost(false);
    setModelApproveMember(false);
  };
  const showModalDelteGroup = () => {
    setModelDeleteGroup(true);
  };
  const showModal = () => {
    axios
      .get(
        process.env.REACT_APP_URL_API + `/api/auth/listMemberSugest/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setListFriend(response.data);
      });
    setIsModalOpen(true);
  };
  const hide = () => {
    axios
      .post(
        process.env.REACT_APP_URL_API + `/api/auth/outGroup/${groupId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        message.success(response.data.message);
        let index = response.data.data.id;
        dispatch(outGroup({ index }));
        setOpen(false);
        navigate("/group");
      });
  };
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const showProfileGroup = () => {
    setFileList([
      {
        uid: "-1",
        name: "Feature.png",
        status: "done",
        url:
          process.env.REACT_APP_URL_API +
          "/storage/images/" +
          profileGroup?.image,
      },
    ]);
    setGroupName(profileGroup.name);
    setGroupDesc(profileGroup.desc);
    setModelShowProfileGroup(true);
  };

  const items = [
    {
      key: "1",
      label: "Bài viết",
      children: (
        <div className="flex">
          <div className="w-2/3 mr-4">
            <UploadFeel
              groupId={groupId}
              onDataFromChild1={handleDataFromChild1}
            />
            <Feel url={{ param }} dataFromChild1={dataFromChild1} />
          </div>

          <div className="w-1/3">
            <div className="border border-gray-200 bg-white shadow rounded-lg mb-6 px-4 py-4">
              <h1 className="font-semibold text-xl text-slate-700">
                Giới thiệu
              </h1>
              <p>{profileGroup?.desc}</p>
              <p>{profileGroup?.status === 1 ? "Công khai" : "Riêng tư"}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Thành viên",
      children: (
        <List
          itemLayout="horizontal"
          dataSource={listMember}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      item.image
                    }
                  />
                }
                title={<a href="https://ant.design">{item.name}</a>}
                description={item.address}
              />
            </List.Item>
          )}
        />
      ),
    },
  ];
  useEffect(() => {
    if (groupId) {
      axios
        .get(process.env.REACT_APP_URL_API + `/api/auth/group/${groupId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setProfileGroup(response.data.data);
          const isAdmin = response.data.data.created_user === user.id;
          setIsAdmin(isAdmin);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
    // eslint-disable-next-line
  }, [groupId, group]);
  useEffect(() => {
    if (groupId) {
      axios
        .get(process.env.REACT_APP_URL_API + `/api/auth/members/${groupId}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          let idCheck = user.id;
          const isMember = response.data.data.some(
            (user) => user.id === idCheck
          );
          setIsMember(isMember);
          setListMember(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
    // eslint-disable-next-line
  }, [groupId]);
  const requestGroup = () => {
    axios
      .post(
        process.env.REACT_APP_URL_API + `/api/auth/requestMember/${groupId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        message.success(response.data.message);
      });
  };
  const deleteGroup = () => {
    axios
      .post(
        process.env.REACT_APP_URL_API + `/api/auth/deleteGroup/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        message.success(response.data.message);
        navigate("/group");
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
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
  const [fileList, setFileList] = useState([]);
  const handleChangeImage = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const submitSetting = (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append("id", user.id);
    data.append("name", groupName);
    data.append("desc", groupDesc);
    data.append("image", fileList[0].originFileObj);
    axios
      .post(`http://127.0.0.1:8000/api/auth/updateGroup/${groupId}`, data, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        let index = response.data.data.id;
        let dataUpdate = response.data.data;
        dispatch(editGroup({ index, dataUpdate }));
        message.success("Đã cập nhật thông tin nhóm");
        setModelShowProfileGroup(false);
      });
  };
  const handleAcceptPost = (id) => {
    let data = {
      feel_id: id,
    };
    axios
      .post(`http://127.0.0.1:8000/api/auth/displayFeel`, data, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((response) => {
        message.success(response.data.message);
        const newArray = postApprove.filter((item) => item.id !== id);
        setPostApprove(newArray);
      });
  };
  const handleDeletePost = (id) => {
    let data = {
      feel_id: id,
    };
    axios
      .post(`http://127.0.0.1:8000/api/auth/deleteFeel`, data, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((response) => {
        message.success(response.data.message);
        const newArray = postApprove.filter((item) => item.id !== id);
        setPostApprove(newArray);
      });
  };
  const handleAcceptMember = (id) => {
    let data = {
      user_id: id,
    };
    axios
      .post(`http://127.0.0.1:8000/api/auth/acpMember/${groupId}`, data, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((response) => {
        message.success(response.data.message);
        const newArray = memberApprove.filter((item) => item.id !== id);
        setMemberApprove(newArray);
      });
  };
  const handleDeleteMember = (id) => {
    let data = {
      feel_id: id,
    };
    axios
      .post(`http://127.0.0.1:8000/api/auth/deleteFeel/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((response) => {
        message.success(response.data.message);
        const newArray = postApprove.filter((item) => item.id !== id);
        setPostApprove(newArray);
      });
  };
  return (
    <div>
      <div className="bg-white">
        <div className="h-60 bg-slate-300 overflow-hidden">
          {profileGroup?.image && (
            <img
              className="w-full h-full object-cover"
              src={
                process.env.REACT_APP_URL_API +
                "/storage/images/" +
                profileGroup?.image
              }
              alt="Group"
            />
          )}
        </div>
        <div className="m-4 flex">
          <div className="w-1/2">
            <h2 className="text-2xl font-bold">{profileGroup?.name}</h2>
            <h2 className="text-sm text-gray-600">
              {listMember.length} thành viên
            </h2>
          </div>
          <div className="flex justify-center w-1/2">
            {isAdmin ? (
              <>
                <Button
                  type="primary"
                  onClick={showModal}
                  style={{ backgroundColor: "#1677ff", marginRight: "10px" }}
                >
                  Mời bạn bè
                </Button>

                <Popover
                  placement="bottom"
                  content={
                    <div className="flex flex-col">
                      <Button
                        className="mb-1"
                        onClick={showProfileGroup}
                        type="primary"
                        style={{ backgroundColor: "#1677ff" }}
                      >
                        Thông tin nhóm
                      </Button>
                      <Button
                        className="mb-1"
                        onClick={(newOpen) => {
                          axios
                            .get(
                              process.env.REACT_APP_URL_API +
                                `/api/auth/approvePost/${groupId}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${user.access_token}`,
                                  "Content-Type": "application/json",
                                },
                              }
                            )
                            .then((response) => {
                              setPostApprove(response.data.data);
                              setModelApprovePost(true);
                              setOpen(!newOpen);
                            });
                        }}
                        type="primary"
                        style={{ backgroundColor: "#1677ff" }}
                      >
                        Phê duyệt bài viết
                      </Button>
                      <Button
                        onClick={(newOpen) => {
                          axios
                            .get(
                              process.env.REACT_APP_URL_API +
                                `/api/auth/approveMember/${groupId}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${user.access_token}`,
                                  "Content-Type": "application/json",
                                },
                              }
                            )
                            .then((response) => {
                              setMemberApprove(response.data.data);
                              setModelApproveMember(true);
                              setOpen(!newOpen);
                            });
                        }}
                        className="mb-1"
                        type="primary"
                        style={{ backgroundColor: "#1677ff" }}
                      >
                        Phê duyệt thành viên
                      </Button>
                      <Button
                        className="mb-1"
                        type="primary"
                        danger
                        onClick={showModalDelteGroup}
                      >
                        Xóa nhóm
                      </Button>
                    </div>
                  }
                  title="Lựa chọn"
                  trigger="click"
                  open={open}
                  onOpenChange={handleOpenChange}
                  className="clickpopup"
                >
                  <Button style={{ display: "flex", alignItems: "center" }}>
                    Cài đặt
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="8"
                      viewBox="0 0 320 512"
                      className="ml-2"
                    >
                      <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                    </svg>
                  </Button>
                </Popover>
              </>
            ) : !isMember ? (
              <Button
                type="primary"
                onClick={requestGroup}
                style={{ backgroundColor: "#1677ff", marginRight: "10px" }}
              >
                Tham gia nhóm
              </Button>
            ) : (
              <>
                <Button
                  type="primary"
                  onClick={showModal}
                  style={{ backgroundColor: "#1677ff", marginRight: "10px" }}
                >
                  Mời bạn bè
                </Button>
                <Popover
                  placement="bottom"
                  content={
                    <Button type="primary" danger onClick={hide}>
                      Rời khỏi nhóm
                    </Button>
                  }
                  title="Lựa chọn"
                  trigger="click"
                  open={open}
                  onOpenChange={handleOpenChange}
                  className="clickpopup"
                >
                  <Button style={{ display: "flex", alignItems: "center" }}>
                    Đã tham gia
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="10"
                      viewBox="0 0 320 512"
                      className="ml-2"
                    >
                      <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                    </svg>
                  </Button>
                </Popover>
              </>
            )}
          </div>
        </div>
        {profileGroup?.status === 0 && !isMember ? (
          <div className="bg-gray-200 p-20">
            <div className="bg-white flex flex-col items-center justify-center py-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="66"
                width="56"
                viewBox="0 0 448 512"
              >
                {" "}
                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
              </svg>
              <h1 className="font-semibold text-xl">Đây là nhóm riêng tư</h1>
              <p className="text-gray-500">
                Hãy tham gia nhóm để tham gia thảo luận nhé!
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-4">
            <Tabs defaultActiveKey="1" items={items} />
          </div>
        )}
        <Modal
          title="Mời bạn bè"
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
                  <div className="border-t-2 pl-3 border-slate-400 overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                    <h2 className="font-bold">Bạn bè</h2>
                    <div className="mt-2">
                      {listFriend.length > 0 &&
                        listFriend.map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center mb-4 w-full"
                          >
                            <input
                              id={"user" + friend.id}
                              type="checkbox"
                              value={friend.id}
                              checked={
                                checkedItems["user" + friend.id] || false
                              }
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 bg-gray-200 border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                        Xác nhận
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

        {/* model comfirm delete group */}
        <Modal
          title="Xác nhận rời nhóm"
          open={modelDeleteGroup}
          onOk={handleDeleteGroup}
          onCancel={handleCancel}
          footer={false}
        >
          <div>
            <div className="p-3 ">
              <p>
                Nếu xóa nhóm, tất cả bài viết và hình ảnh liên quan sẽ không thể
                khôi phục. Xác nhận xóa ?
              </p>
              <div className="w-full">
                <div className="float-right">
                  <button
                    onClick={deleteGroup}
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

        {/* model show profile group */}
        <Modal
          title="Thông tin nhóm"
          open={modelShowProfileGroup}
          onOk={handleDeleteGroup}
          onCancel={handleCancel}
          footer={false}
        >
          <form onSubmit={submitSetting}>
            <div>
              <div className="p-3 ">
                <div>
                  <p className="mb-1">Tên nhóm</p>
                  <Input
                    onChange={(e) => {
                      setGroupName(e.target.value);
                    }}
                    value={groupName}
                  />
                </div>
                <div className="mt-2">
                  <p className="mb-1">Giới thiệu</p>
                  <Input
                    onChange={(e) => {
                      setGroupDesc(e.target.value);
                    }}
                    value={groupDesc}
                  />
                </div>
                <div className="mt-2">
                  <p className="mb-1">Ảnh nhóm</p>
                  <ImgCrop rotationSlider showGrid aspect={16 / 9}>
                    <Upload
                      action={process.env.REACT_APP_URL_API + "/api/auth/image"}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChangeImage}
                      onPreview={handlePreview}
                      width={200}
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
                <div className="mt-4 w-full">
                  <div className="float-right">
                    <button
                      type="submit"
                      className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Thay đổi
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
          </form>
        </Modal>

        {/* model approvePost */}
        <Modal
          title="Bài viết cần phê duyệt"
          open={modelApprovePost}
          onCancel={handleCancel}
          footer={false}
          width={720}
          style={{ top: 10 }}
          styles={{
            body: { maxHeight: "calc(100vh - 128px)", overflowY: "auto" },
          }}
        >
          <div className="flex items-center flex-col">
            {postApprove.map((post) => (
              <div key={post.id} className="p-3 ">
                <Card
                  style={{
                    width: 400,
                  }}
                  cover={
                    post.image && (
                      <img
                        alt="example"
                        src={
                          process.env.REACT_APP_URL_API +
                          "/storage/images/" +
                          post.image
                        }
                      />
                    )
                  }
                  actions={[
                    <span
                      key="setting"
                      onClick={() => handleAcceptPost(post.id)}
                    >
                      <CheckOutlined />
                      <p className="ml-1 inline-block">Phê duyệt</p>
                    </span>,
                    <span key="edit" onClick={() => handleDeletePost(post.id)}>
                      <CloseOutlined />
                      <p className="ml-1 inline-block">Gỡ</p>
                    </span>,
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar
                        src={
                          process.env.REACT_APP_URL_API +
                          "/storage/images/" +
                          post.user.image
                        }
                      />
                    }
                    title={post.user.name}
                    description={post.title}
                  />
                </Card>
              </div>
            ))}
          </div>
        </Modal>

        {/* model approveMember */}
        <Modal
          title="Thành viên cần phê duyệt"
          open={modelApproveMember}
          onCancel={handleCancel}
          footer={false}
          width={720}
          style={{ top: 10 }}
          styles={{
            body: { maxHeight: "calc(100vh - 128px)", overflowY: "auto" },
          }}
        >
          <div className="flex items-center flex-col">
            {memberApprove.map((member) => (
              <div key={member.id} className="p-3 ">
                <Card
                  style={{
                    width: 400,
                  }}
                  actions={[
                    <span
                      key="setting"
                      onClick={() => handleAcceptMember(member.id)}
                    >
                      <CheckOutlined />
                      <p className="ml-1 inline-block">Phê duyệt</p>
                    </span>,
                    <span
                      key="edit"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <CloseOutlined />
                      <p className="ml-1 inline-block">Gỡ</p>
                    </span>,
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar
                        src={
                          process.env.REACT_APP_URL_API +
                          "/storage/images/" +
                          member.image
                        }
                      />
                    }
                    title={member.name}
                    description={member.address}
                  />
                </Card>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default Group;
