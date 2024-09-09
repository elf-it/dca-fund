import { createPortal } from "react-dom";
import Modal from "@shared/ui/components/Modal";
import Input from "@shared/ui/components/Input";
import Select from "@/shared/ui/components/Select";
import React, { useContext, useState } from "react";
import Button from "@shared/ui/components/Button";
import useStackingModal from "@/features/StackingModal/model/useStackingModal";
import { LangContext } from "@/app/context/LangaugeContext";
import CustomCheckbox from "@/shared/ui/components/CustomCheckbox";
import Loader from "@/shared/ui/components/Loader";

interface IProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}



function StackingModal({ isVisible, setIsVisible }: IProps) {
  const { inputRef, value, setValue, setPeriod, error, onHandleClick, loading } =
    useStackingModal();

    const {language} = useContext(LangContext)
    const [politicsChecked, setPoliticsChecked] = useState(false)

    const data = [
      {
        value: 3,
        title: `3 ${language.stacking.month}`,
      },
      {
        value: 6,
        title: `6 ${language.stacking.months}`,
      },
      {
        value: 9,
        title: `9 ${language.stacking.months}`,
      },
      {
        value: 12,
        title: `12 ${language.stacking.months}`,
      },
    ];


  return createPortal(
    <Modal visible={isVisible} setVisible={setIsVisible}>
      {loading && <Loader/>}
      <div>
        <p className="text-[32px] text-white font-[700] text-center w-full mb-[46px]">
         {language.stacking.stacking}
        </p>
        <div className="w-full mb-[20px]">
          <p className="w-full text-[16px] text-white font-[700] mb-[12px]">
            {language.stacking.chooseStackingPeriod}
          </p>
          <Select
            listItems={data}
            cb={setPeriod}
          />
        </div>
        <div className="w-full mb-[20px]">
          <Input
            ref={inputRef}
            label={"Введите количество USDT *"}
            val={value}
            setVal={setValue}
            placeholder={"Введите количество"}
            error={error}
          />
        </div>
        <div className="w-full mb-2">
          <CustomCheckbox label={language.stacking.agreement} onChange={(val) => setPoliticsChecked(val)}/>
        </div>
        <div className="w-full">
          <Button
            onClick={() => onHandleClick(() => setIsVisible(false))}
            type="button"
            view="primary"
            disabled={!value.length || !politicsChecked}
          >
            {language.stacking.createStaking}
          </Button>
        </div>
      </div>
    </Modal>,
    document.body
  );
}

export default StackingModal;
