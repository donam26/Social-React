import Header from "../components/Header";
import SideBar from "../components/SideBar";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <SideBar />
      <div className="bg-gray-50 sm:p-8 max-sm:pt-8 max-sm:ml-2 sm:ml-64">
        <div className="mt-14">{children}</div>
      </div>
    </div>
   );
}
export default DefaultLayout; 
