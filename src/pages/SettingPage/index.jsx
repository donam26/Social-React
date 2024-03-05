import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import { updateUser } from "../../redux/authSlice";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const SettingPage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [sex, setSex] = useState(user.sex);
  const dispatch = useDispatch();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancel = () => setPreviewOpen(false);
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
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "Feature.png",
      status: "done",
      url: process.env.REACT_APP_URL_API + "/storage/images/" + user.image,
    },
  ]);
  const submitSetting = (e) => {
    e.preventDefault();
    if(name!==user.name || sex!== user.sex || address!== user.address) {
      let data = new FormData();
      data.append("id", user.id);
      data.append("name", name);
      data.append("image", fileList[0].originFileObj);
      data.append("sex", sex);
      data.append("address", address);
      axios
        .post(`http://127.0.0.1:8000/api/auth/user/${user.id}`, data, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          dispatch(
            updateUser({
              name: response.data.data.name,
              address: response.data.data.address,
              sex: response.data.data.sex,
              image: response.data.data.image,
            })
          );
          message.success('Cập nhật thông tin thành công!')
        });
    }
  };
  return (
    <>
      <form onSubmit={submitSetting}>
        <div className="space-y-12 p-10">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-2xl font-semibold leading-7 text-gray-900">
              Thông tin cá nhân
            </h2>
            <div className="flex mt-8">
              <div className="w-1/2 pr-20">
                <div className="col-span-full pt-3">
                  <label
                    htmlFor="street-name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Họ tên
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="street-name"
                      autoComplete="street-address"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      className=" bg-gray-50 border border-gray-300 block w-full rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset p-2 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full pt-3">
                  <label
                    htmlFor="street-email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="street-email"
                      autoComplete="street-address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      className=" bg-gray-50 border border-gray-300 block w-full rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset p-2 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full pt-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Giới tính
                  </label>
                  <div className="mt-2">
                  <select defaultValue={sex}
                      id="countries"
                      onChange={(e) => { setSex(e.target.value) }} // Bắt sự kiện thay đổi
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="1">Nam</option>
                      <option value="0">Nữ</option>
                    </select>
                  </div>
                </div>
                <div className="col-span-full pt-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Địa chỉ
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="street-address"
                      autoComplete="street-address"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      className=" bg-gray-50 border border-gray-300 block w-full rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset p-2 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="w-1/2 ">
                <div className="col-span-full pt-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium leading-6 ml-2 text-gray-900"
                  >
                    Ảnh đại diện
                  </label>
                  <ImgCrop rotationSlider>
                    <Upload
                      action={process.env.REACT_APP_URL_API + "/api/auth/image"}
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChange}
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
                    onCancel={handleCancel}
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
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
};
export default SettingPage;
