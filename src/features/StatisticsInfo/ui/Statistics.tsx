import lang from "@/../lang";
import Button from "@shared/ui/components/Button";
import PercentInfoBlock from "@shared/ui/components/PercentInfoBlock";
import { StackingModal } from "@features/StackingModal";
import { useContext, useState } from "react";
import { useAccount } from "wagmi";
import { LangContext } from "@/app/context/LangaugeContext";
import { Bounce, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function Statistics() {
  const [isVisibleStackingModal, setIsVisibleStackingModal] = useState(false);
  const { address } = useAccount()

  const {language} = useContext(LangContext)

  const fakeData = [
    {
      percent: 6,
      period: `3 ${language.stacking.month}`,
    },
    {
      percent: 8,
      period: `6 ${language.stacking.months}`,
    },
    {
      percent: 9,
      period: `9 ${language.stacking.months}`,
    },
    {
      percent: 10,
      period: `12 ${language.stacking.months}`,
    },
  ];



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

                toast.error(language.stacking.notConnectedWallet, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                  transition: Bounce,
                });
              }
            }}
            type="button"
            view="primary"
          >
            {language.stacking.createStaking}
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
