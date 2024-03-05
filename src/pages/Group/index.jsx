import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { message } from "antd";
import { Link } from "react-router-dom";
const Group = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [listSuggest, setListSuggest] = useState([]);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_URL_API + "/api/auth/suggestGroup", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setListSuggest(response.data);
      });
  }, [user]);
  const requestGroup = async (id) => {
    await axios
      .post(
        process.env.REACT_APP_URL_API + `/api/auth/requestMember/${id}`,
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
        const updatedSuggests = listSuggest.filter(
          (suggest) => suggest.id !== id
        );
        setListSuggest(updatedSuggests);
      });
  };
  return (
    <>
      <div className="flex flex-wrap ">
        {listSuggest.map((user) => (
          <div
            key={user.id}
            className="w-1/2 md:w-1/3 lg:w-1/4 p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestGroup(user.id);
              }}
            >
              {" "}
              <div className="flex flex-col items-center pb-10">
                <Link
                  to={`/group/${user.id}`}
                  className="flex flex-col items-center"
                >
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
                    {user.desc}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.status === 1 ? "Công khai" : "Riêng tư"}
                  </span>
                </Link>
                <div className="flex mt-4 space-x-3 md:mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Tham gia nhóm
                  </button>
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </>
  );
};
export default Group;
