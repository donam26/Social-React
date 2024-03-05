import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Suggest = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [suggests, setSuggest] = useState([]);
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
        const updatedSuggests = suggests.filter((suggest) => suggest.id !== id);
        setSuggest(updatedSuggests);
      });
  };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_URL_API + "/api/auth/suggest", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setSuggest(response.data);
      });
  }, [user.access_token]);

  return (
    <main>
      <div
        style={{ marginTop: "85px" }}
        className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow "
      >
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900">
            Có thể biết
          </h5>
          <Link  to={'friend'}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Thêm
          </Link>
        </div>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 ">
            {suggests.map((suggest) => (
              <li key={suggest.id} className="py-2 sm:py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addFriend(suggest.id);
                  }}
                >
                  <div className="flex items-center ">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={
                          process.env.REACT_APP_URL_API +
                          "/storage/images/" +
                          suggest.image
                        }
                        alt="feature"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggest.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                        <span className="max-xl:hidden">
                          {suggest.email}
                          ok
                        </span>
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        <span className="max-xl:hidden">Thêm bạn bè</span>
                        <span className="xl:hidden">Thêm</span>
                      </button>
                    </div>
                  </div>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};
export default Suggest;
