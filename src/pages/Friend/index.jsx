import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
const { TabPane } = Tabs;

const Friend = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [listSuggest, setListSuggest] = useState([]);
  const [listRequest, setListRequest] = useState([]);
  const addFriend = async (id) => {
    await axios
      .post(
        process.env.REACT_APP_URL_API + `/api/auth/addFriend/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        const updatedSuggests = listSuggest.filter(
          (suggest) => suggest.id !== id
        );
        setListSuggest(updatedSuggests);
      });
  };
  const acceptRequest = async (id) => {
    await axios
      .post(
        process.env.REACT_APP_URL_API + `/api/auth/acceptFriend/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        const updatedSuggests = listRequest.filter(
          (suggest) => suggest.id !== id
        );
        setListRequest(updatedSuggests);
      });
  };
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_URL_API + "/api/auth/suggestList", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setListSuggest(response.data);
      });
    axios
      .get(process.env.REACT_APP_URL_API + "/api/auth/requestList", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setListRequest(response.data);
      });
  }, [user]);

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Có thể quen" key="1">
        <div className="flex flex-wrap ">
          {listSuggest.map((user) => (
            <div
              key={user.id}
              className="w-1/2 md:w-1/3 lg:w-1/4 p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addFriend(user.id);
                }}
              >
                {" "}
                <div className="flex flex-col items-center pb-10">
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      user.image
                    }
                    alt="Bonnie"
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.address}
                  </span>
                  <div className="flex mt-4 space-x-3 md:mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        addFriend(user.id);
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Gửi kết bạn
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ))}
        </div>
      </TabPane>
      <TabPane tab="Yêu cầu kết bạn" key="2">
        <div className="flex flex-wrap ">
          {listRequest.map((user) => (
            <div
              key={user.id}
              className="w-1/2 md:w-1/3 lg:w-1/4 p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addFriend(user.id);
                }}
              >
                {" "}
                <div className="flex flex-col items-center pb-10">
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={
                      process.env.REACT_APP_URL_API +
                      "/storage/images/" +
                      user.image
                    }
                    alt="Bonnie"
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.address}
                  </span>
                  <div className="flex mt-4 space-x-3 md:mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        acceptRequest(user.id);
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Chấp nhận
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ))}
        </div>{" "}
      </TabPane>
    </Tabs>
  );
};

export default Friend;
