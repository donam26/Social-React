import { useEffect, useState } from "react";
import { loginUser } from "../../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { message } from "antd";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitLogin = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };
    loginUser(user, dispatch)
    .then(() => {
      message.success('Đăng nhập thành công!')
      navigate("/");
    })

    .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Đăng nhập không thành công. Vui lòng thử lại sau.");
        console.log(error);
      }
    }); 
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="w-full p-8 lg:w-1/2">
      <form onSubmit={submitLogin}>
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Social
        </h2>
        <p className="text-xl text-gray-600 text-center">Vui lòng đăng nhập!</p>
        <div className="mt-2 h-6 text-center">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          {/* eslint-disable-next-line */}
          <span className="text-xs text-center text-gray-500 uppercase">
            đăng nhập
          </span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>
        <div className="mt-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
          id="email"
            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            {/* eslint-disable-next-line */}
            <a href="#" className="text-xs text-gray-500">
              Quên mật khẩu?
            </a>
          </div>
          <input
          id="password"
            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
          >
            Đăng nhập
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="border-b w-1/5 md:w-1/4"></span>
          {/* eslint-disable-next-line */}
            <p className="text-xs text-gray-500">hoặc</p>
          <Link to={`/register`} className="text-xs text-gray-500 uppercase">
            <span className="bg-gray-700 text-white font-bold py-1 px-2 w-full rounded hover:bg-gray-600">
              đăng kí
            </span>
          </Link>
          <span className="border-b w-1/5 md:w-1/4"></span>
        </div>
      </form>
    </div>
  );
};

export default Login;
