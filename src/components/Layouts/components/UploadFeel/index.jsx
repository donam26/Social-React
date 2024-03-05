import { Modal, Upload, message } from "antd";
import { useState } from "react";
import ImgCrop from "antd-img-crop";
import axios from "axios";
import { useSelector } from "react-redux";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const UploadFeel = ({ groupId, onDataFromChild1 }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
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
  const [fileList, setFileList] = useState([]);
  const [content, setContent] = useState("");
  const submitFeel = async (e) => {
    e.preventDefault();
    if(fileList.length < 1 && content.trim() === '') {
      return
    }
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("images[]", file.originFileObj); // Append each file separately
    });
    formData.append("title", content);
    formData.append("group_id", groupId);

    await axios
      .post(process.env.REACT_APP_URL_API + "/api/auth/post", formData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "multipart/form-data", // Change content type to multipart/form-data
        },
      })
      .then((response) => {
      message.success(response.data.message)
        onDataFromChild1(response.data.data);
        setContent("");
        setFileList([]);
      });
  };

  return (
    <>
      <form
        onSubmit={submitFeel}
        className="border border-gray-200 bg-white shadow rounded-lg mb-6 px-4 pt-4"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bạn hãy viết gì đó..."
          className="w-full rounded-lg p-2 text-sm bg-gray-100 border border-transparent appearance-none rounded-tg placeholder-gray-400"
        ></textarea>
        <footer className="flex justify-between mt-2">
          <div className="flex gap-2">
            <ImgCrop rotationSlider>
              <Upload
                action={process.env.REACT_APP_URL_API + "/api/auth/image"}
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}
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
          <button
            type="submit"
            className="flex items-center py-2 px-4 rounded-lg h-10 text-sm bg-blue-600 text-white shadow-lg"
          >
            Gửi
            <svg
              className="ml-1"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </footer>
      </form>
    </>
  );
};

export default UploadFeel;
