import { useState } from "react";
import Icon from "@shared/ui/components/Icon";

interface ISelect {
  listItems: ListItem[];
  defaultIndex?: number;
  cb?: (...args: any[]) => any;
}

type ListItem = {
  title: React.ReactNode;
  value: number | string;
};

function Select({ listItems, cb, defaultIndex = 0 }: ISelect) {
  const [list, setList] = useState(listItems);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [isShowed, setIsShowed] = useState(false);

  const closeList = () => {
    setIsShowed(false);
  };

  const handleSelect = (item: ListItem, i: number) => {
    setSelectedIndex(i);
    closeList();
    if (cb) {
      cb(item.value);
    }
  };

  const listStyle = isShowed
    ? "absolute rounded-[8px] visible overflow-hidden top-[60px] w-full shadow transition-all opacity-100 z-[10]"
    : "absolute rounded-[8px] invisible overflow-hidden top-[50px] w-full opacity-0 shadow transition-all z-[9]";

  return (
    <div className="relative w-full z-0">
      <div
        onClick={() => setIsShowed((prev) => !prev)}
        className="z-[11] flex flex-row items-center justify-between element-background px-[20px] py-[15px] pr-[13px] rounded-[8px] cursor-pointer"
      >
        <p className="text-[16px] text-[#6C7E8C] select-none">
          {list[selectedIndex].title}
        </p>
        <Icon
          className={`${isShowed ? "rotate-180" : "rotate-0"} transition-all`}
          name="arrow-down"
          width={22}
          color="#6C7E8C"
        />
      </div>
      <div className={listStyle}>
        <ul className="m-0 bg-[#272B34] rounded-[8px] p-0 ">
          {list.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSelect(item, i)}
              className="select-none z-10 text-[16px] text-white p-2 hover:bg-[#A8BBFF0A] px-[20px] py-[15px] cursor-pointer"
            >
              {item.title}
            </li>
          ))}
        </ul>
        <div
          onClick={closeList}
          className="fixed left-0 top-0 bottom-0 right-0 z-[-1]"
        ></div>
      </div>
    </div>
  );
}

export default Select;
