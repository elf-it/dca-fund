import React, { HTMLAttributes, createElement } from "react";

interface IButton extends HTMLAttributes<HTMLButtonElement> {
  type: "link" | "button";
  view: "primary" | "secondary";
  disabled?: boolean;
  children?: React.ReactNode;
}

const styles = {
  primary:
    "rounded-[8px] text-[#272B34] p-3 min-w-[190px] flex flex-row items-center gap-[10px] justify-center bg-gradient-to-l from-[#F9B100] to-[#FDDF96] shadow-[0_4px_25px_0px_#FDDF964D] font-[700] max-[1024px]:p-2 w-full mb-2",
  secondary:
    "rounded-[8px] text-[#FFFFFF] p-3 min-w-[190px] flex flex-row items-center gap-[10px] justify-center border border-[#6C7E8C] border-solid font-[700] max-[1024px]:p-2 w-full mb-2",
};

const disbledStyles =
  "bg-gradient-to-l from-[#fff]/5 to-[#fff]/5 text-[#FFFFFF]/20 font-[400] pointer-events-none shadow-none";

function Button(props: IButton) {
  const { type, view, children, disabled = false, ...prop } = props;

  return createElement(
    type,
    {
      className: [styles[view], disabled ? disbledStyles : ""].join(" "),
      ...prop,
    },
    children
  );
}

export default Button;
