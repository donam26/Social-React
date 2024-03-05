import Header from "../components/Header";
import SideBarMess from "../components/Messager/SideBarMess";
function MessagerLayout({ children }) {
  return (
    <div>
      <Header />
      <div style={{ width: "100%" }} className="pt-[70px]">
        <div className="flex">
          <div className="w-1/4">
            <SideBarMess />
          </div>
          <div className="w-3/4">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default MessagerLayout;
