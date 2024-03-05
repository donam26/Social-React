import Header from "../components/Header";
import SideBarGroup from "../components/Group/SideBarGroup";
function GroupLayout({ children }) {
  return (
    <div className="">
      <Header />
      <div style={{ width: "100%" }} className="pt-[70px]">
        <div className="flex">
          <div className="w-1/4">
            <SideBarGroup/>
          </div>
          <div className="w-3/4">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default GroupLayout;
