import { BrowserRouter, Routes, Route } from "react-router-dom";
import { privateRoute, publicRoute } from "./router";
import { Fragment, useEffect } from "react";
import "../src/components/GlobalStyles/global.css";
import DefaultLayout from "./components/Layouts/DefaultLayout";
import RequireAuth from "./pages/RequireAuth";
import "./GlobalStyle.css";
import { useSelector } from "react-redux";
import Echo from "laravel-echo";
window.Pusher = require("pusher-js");
function App() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  useEffect(() => {
    if (user === null) {
      return;
    }
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "anyKey",
      wsHost: process.env.REACT_APP_HOST_API,
      authEndpoint: process.env.REACT_APP_URL_API + "/broadcasting/auth",
      encrypted: false,
      forceTLS: false,
      wsPort: 6001,
      wssPort: 6001,
      disableStats: true,
      enabledTransports: ["ws", "wss"],
      auth: {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      },
      cluster: "mt1",
    });
  }, [user]);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {privateRoute.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <RequireAuth>
                      <Page />
                    </RequireAuth>
                  </Layout>
                }
              />
            );
          })}
          {publicRoute.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
