import React, { useState } from 'react';
import Icon from './Icon';

interface IProps{
    label:string;
    checked?:boolean;
    onChange?: (state:boolean) => void
}

const CustomCheckbox = ({ label , checked, onChange }:IProps) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (onChange) {
      onChange(!isChecked);
    }
  };

  return (
    <div className="flex flex-row items-start gap-[20px] cursor-pointer" onClick={handleCheckboxChange}>
      <div className='border border-white border-solid w-[24px] h-[24px] rounded-[5px] shrink-0'>
        {isChecked &&   <Icon width={22} color="transparent" name="done" />}
      </div>
      {label && <span className="text-[14px] text-[#8296A4]">{label}</span>}
    </div>
  );
};

export default CustomCheckbox;
