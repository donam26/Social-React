import { useState } from "react";
import Feel from "../../components/Layouts/components/Feel";
import Suggest from "../../components/Layouts/components/Suggest";
import UploadFeel from "../../components/Layouts/components/UploadFeel";
const Home = () => {
  const param = "feels";
  const groupId = "0";

  const [dataFromChild1, setDataFromChild1] = useState({});
  // Hàm để cập nhật state với dữ liệu từ ChildComponent1
  const handleDataFromChild1 = (data) => {
    setDataFromChild1(data);
  };

  return (
    <main className="container mx-auto">
      <div className="flex">
        <div className="flex-auto w-3/5">
          <span className="font-bold text-3xl">Bảng tin</span>
          <main className="grid grid-cols-1 gap-6 my-12 w-2xl container px-2 mx-auto">
            <article className="">
              <UploadFeel groupId={groupId} onDataFromChild1={handleDataFromChild1} />
              <Feel url={{param}} dataFromChild1={dataFromChild1} />
            </article>
          </main>
        </div>
        <div className="max-lg:hidden flex-auto w-2/5 ">
          <Suggest />
        </div>
      </div>
    </main>
  );
};
export default Home;
