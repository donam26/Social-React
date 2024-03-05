import { useEffect, useState } from "react";
import Feel from "../../components/Layouts/components/Feel";
import UploadFeel from "../../components/Layouts/components/UploadFeel";
import { useSelector } from "react-redux";
import axios from "axios";
import { Image } from "antd";

const Profile = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [listImages, setListImages] = useState([]);
  const param = "myFeels";
  const groupId = "0";

  const [dataFromChild1, setDataFromChild1] = useState({});
  // Hàm để cập nhật state với dữ liệu từ ChildComponent1
  const handleDataFromChild1 = (data) => {
    setDataFromChild1(data);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_URL_API + "/api/auth/listImage/" + user.id,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setListImages(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.id, user.access_token]);

  return (
    <div className="mt-14">
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-12 w-2xl container px-2 mx-auto">
        <article className="">
          <span className="font-bold text-3xl mb-3">Bài viết của bạn</span>
          <UploadFeel
            groupId={groupId}
            onDataFromChild1={handleDataFromChild1}
            className="mt-7" />
          <Feel url={{param}} dataFromChild1={dataFromChild1} />
        </article>
        <aside className="">
          <div className="bg-white shadow rounded-lg p-10">
            <div className="flex flex-col gap-1 text-center items-center">
              <img
                className="h-32 w-32 bg-white p-2 rounded-full shadow mb-4"
                src={
                  process.env.REACT_APP_URL_API +
                  "/storage/images/" +
                  user.image
                }
                alt=""
              />
              <p className="font-semibold">{user.name}</p>
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
                {user.address}
              </div>
            </div>
          </div>

          <div className="bg-white shadow mt-6  rounded-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-4">
              Hình ảnh
            </h3>
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
        </aside>
      </main>
    </div>
  );
};

export default Profile;
