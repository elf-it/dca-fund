import { createPortal } from "react-dom";

const Loader = () => {
  return createPortal(
    <div className="flex justify-center items-center absolute top-0 right-0 bottom-0 left-0 bg-black/50 z-[1000]">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
    </div>,
    document.body
  );
};

export default Loader;
