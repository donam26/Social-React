import { useEffect, useState } from "react";
import { calculateTimeAgo } from "../../components/Helper";
import axios from "axios";
import { useSelector } from "react-redux";
import { Image } from "antd";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Search = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const [listFriend, setListFriend] = useState([]);
  const [listFeel, setListFeel] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(
            process.env.REACT_APP_URL_API + `/api/auth/dataFriend?name=${name}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            setListFriend(response.data.data);
          });

        await axios
          .get(
            process.env.REACT_APP_URL_API + `/api/auth/dataFeel?name=${name}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            setListFeel(response.data.data);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    //eslint-disable-next-line
  }, [name]);
  return (
    <div className="flex justify-center">
      <div className="mb-3 w-6/12 p-4 border-gray-300 bg-white shadow rounded-lg flex flex-col">
        <div>
          <h2 className="font-semibold text-2xl">Mọi người</h2>
          <div>
            {listFriend.map((friend) => (
              <div key={friend.id} className="flex items-center mt-3">
                <div className="flex items-center ">
                  <Link to={`/user/${friend.id}`}>
                    <img
                      className="w-14 h-14 rounded-full"
                      src={
                        process.env.REACT_APP_URL_API +
                        "/storage/images/" +
                        friend.image
                      }
                      alt="user"
                    />
                  </Link>
                  <div className="flex flex-col ml-2">
                    <Link to={`/user/${friend.id}`}>
                      <h2 className="text-gray-800 font-semibold text-xl">
                        {friend.name}
                      </h2>
                    </Link>
                    <p className="text-gray-800 text-sm">
                      Sống tại {friend.address}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t-2 my-4 border-gray-200 border-solid"></div>
        <div>
          <h2 className="font-semibold text-2xl">Bài viết</h2>
          <div className="flex justify-center">
            <div className="border-gray-300 bg-white shadow rounded-lg">
              {listFeel.map((feel) => (
                <div key={feel.id} className="border-b-2">
                  <div className="flex justify-between px-2 py-3 mx-3">
                    <div className="flex flex-row">
                      <div className="w-auto h-auto rounded-full border-2 border-neutral-400">
                        <Link to={`/user/${feel.user?.id}`}>
                          <img
                            className="w-12 h-12 object-cover rounded-full shadow cursor-pointer"
                            alt="User"
                            src={
                              process.env.REACT_APP_URL_API +
                              "/storage/images/" +
                              feel.user?.image
                            }
                          />
                        </Link>
                      </div>
                      <div className="flex flex-col mb-2 ml-4 mt-1">
                        <Link
                          to={`/user/${feel.user?.id}`}
                          className="text-gray-600 text-sm font-semibold"
                        >
                          {feel.user?.name}
                        </Link>
                        <div className="flex w-full mt-1">
                          <Link
                            to={`/feel/${feel.id}`}
                            className="text-gray-400 font-thin text-xs"
                          >
                            • {calculateTimeAgo(feel.created_at)}
                          </Link>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Search;
