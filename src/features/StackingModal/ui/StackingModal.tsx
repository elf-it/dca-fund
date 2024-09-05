import { createPortal } from "react-dom";
import Modal from "@shared/ui/components/Modal";
import Input from "@shared/ui/components/Input";
import Select from "@/shared/ui/components/Select";
import React, { useState } from "react";
import Button from "@shared/ui/components/Button";
import useStackingModal from "@/features/StackingModal/model/useStackingModal";

interface IProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const data = [
  {
    value: 3,
    title: "3 месяца",
  },
  {
    value: 6,
    title: "6 месяцев",
  },
  {
    value: 9,
    title: "9 месяцев",
  },
  {
    value: 12,
    title: "12 месяцев",
  },
];

function StackingModal({ isVisible, setIsVisible }: IProps) {
  const { inputRef, value, setValue, setPeriod, error, onHandleClick } =
    useStackingModal();

  return createPortal(
    <Modal visible={isVisible} setVisible={setIsVisible}>
      <div>
        <p className="text-[32px] text-white font-[700] text-center w-full mb-[46px]">
          Стекирование
        </p>
        <div className="w-full mb-[20px]">
          <p className="w-full text-[16px] text-white font-[700] mb-[12px]">
            Выберите период стекирования:
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
        <div className="w-full">
          <Button
            onClick={onHandleClick}
            type="button"
            view="primary"
            disabled={!value.length}
          >
            Застекировать
          </Button>
        </div>
      </div>
    </Modal>,
    document.body
  );
}

export default StackingModal;
