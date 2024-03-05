import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, message, Steps, theme } from "antd";
import { Card } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sex, setSex] = useState(0);
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const next = () => {
    if(current === 0) {
      if(fullName.trim() === '' || address.trim() === '') {
        message.warning('Vui lòng kiểm tra thông tin!')
        return
      }
    } else if (current === 1) {
      if(email.trim() === '' || password.trim() === '') {
        message.warning('Vui lòng kiểm tra thông tin!')
        return
      }
      if(password !== confirmPassword) {
        message.warning('Mật khẩu không khớp!')
        return
      }
    }
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Thông tin",
      content: (
        <>
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Họ tên
            </label>
            <input
              className="bg-gray-50 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-2 block w-full appearance-none"
              type="text"
              autoComplete="off"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
              }}
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Giới tính
            </label>

            <select
              defaultValue={sex}
              id="countries"
              onChange={(e) => {
                setSex(e.target.value);
              }} // Bắt sự kiện thay đổi
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
            </select>
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Địa chỉ
            </label>
            <input
              className="bg-gray-50 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-2 w-full appearance-none"
              type="text"
              autoComplete="off"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </div>
        </>
      ),
    },
    {
      title: "Tài khoản",
      content: (
        <>
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="bg-gray-100 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-2 block w-full appearance-none"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mật khẩu
            </label>
            <input
              className="bg-gray-100 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-2 w-full appearance-none"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Xác nhận mật khẩu
            </label>
            <input
              className="bg-gray-100 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-2 w-full appearance-none"
              type="password"
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
        </>
      ),
    },
    {
      title: "Xác nhận",
      content: (
        <>
          <Card
            title="Thông tin đăng kí"
            bordered={false}
            style={{
              width: 300,
            }}
          >
            <p>Email: {email}</p>
            <p>Họ tên: {fullName}</p>
            <p>Giới tính: {parseInt(sex, 10) === 1 ? 'Nam': 'Nữ'}</p>
            <p>Địa chỉ: {address}</p>
          </Card>
        </>
      ),
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    padding: 8,
  };

  const submitRegister = (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
      password_confirmation: confirmPassword,
      sex: sex,
      address: address,
      name: fullName,
    };
    axios
      .post(process.env.REACT_APP_URL_API + "/api/register", user)
      .then(() => {
        message.success("Đăng kí tài khoản thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message.warning('Vui lòng sử dụng email khác!')
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Đăng nhập không thành công. Vui lòng thử lại sau.");
          console.log(error);
        }
      });
  };

  return (
    <div className="w-full p-8 lg:w-1/2">
      <form onSubmit={submitRegister}>
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Social
        </h2>
        <p className="text-xl text-gray-600 text-center">
          Vui lòng tạo tài khoản!
        </p>
        <div className="mt-2 h-6 text-center">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
        <div className="mt-4 mb-4 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-gray-500 uppercase">
            Đăng kí
          </span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current < steps.length - 1 && (
            <Button
              style={{ backgroundColor: "#8ee33e" }}
              type="primary"
              onClick={() => next()}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              style={{ backgroundColor: "#1677ff" }}
              onClick={submitRegister}
            >
              Đăng kí
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Quay lại
            </Button>
          )}
          <Link to={`/login`} className="float-right text-xs text-gray-500 uppercase">
            <Button
              style={{
                margin: "0 8px",
              }}
            >
              Đăng nhập
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
