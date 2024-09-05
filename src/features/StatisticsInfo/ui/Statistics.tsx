import lang from "../../../../lang.json";
import Button from "@shared/ui/components/Button";
import PercentInfoBlock from "@shared/ui/components/PercentInfoBlock";
import { StackingModal } from "@features/StackingModal";
import { useState } from "react";
import { useAccount } from "wagmi";

const fakeData = [
  {
    percent: 6,
    period: "3 месяца",
  },
  {
    percent: 8,
    period: "6 месяцев",
  },
  {
    percent: 9,
    period: "9 месяцев",
  },
  {
    percent: 10,
    period: "12 месяцев",
  },
];

function Statistics() {
  const [isVisibleStackingModal, setIsVisibleStackingModal] = useState(false);
  const { address } = useAccount()
  return (
    <>
      <div className="bg-[#A8BBFF0A] p-[40px] rounded-[30px] flex flex-col gap-[30px] items-start">
        <div className="grid grid-cols-4 max-[676px]:grid-cols-1 max-[1024px]:grid-cols-2 max-[1024px]:gap-[20px]  items-center justify-between w-full">
          {fakeData.map((item, i) => (
            <PercentInfoBlock
              key={i}
              percent={item.percent}
              period={item.period}
            />
          ))}
        </div>
        <div className="w-[190px] max-[576px]:w-full">
          <Button
            onClick={() => {
              if(address){
                setIsVisibleStackingModal(true)
              }else{
                alert("Кошелек не подключен")
              }
            }}
            type="button"
            view="primary"
          >
            {lang.stacking.ru.createStaking}
          </Button>
        </div>
      </div>
      <StackingModal
        isVisible={isVisibleStackingModal}
        setIsVisible={setIsVisibleStackingModal}
      />
    </>
  );
}

export default Statistics;
