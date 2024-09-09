import lang from "@/../lang.json";
import { Statistics, Dashboard as DashBoard } from "@features/StatisticsInfo";
import Icon from "@shared/ui/components/Icon";
import { useContext } from "react";
import { LangContext } from "@/app/context/LangaugeContext";

function Dashboard() {
  const { language } = useContext(LangContext);
  return (
    <div className="element-background grid grid-cols-1 gap-[15px]">
      <div className="flex flex-row items-center gap-[10px]">
        <p className="font-[700] text-[#fff] text-[20px]">
          {language.stacking.stacking}
        </p>
      </div>
      <Statistics />
      <div className="flex flex-row items-center gap-[10px]">
        <p className="font-[700] text-[#fff] text-[20px]">
          {language.stacking.statistic}
        </p>
      </div>
      <DashBoard />
    </div>
  );
}

export default Dashboard;
