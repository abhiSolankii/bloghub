import React from "react";

const Loader = ({
  width = "w-8", // default width using Tailwind classes
  height = "h-8", // default height using Tailwind classes
  color = "border-blue-500", // default color
  text = "Loading...", // default text
  textColor = "text-blue-500", // default text color
  borderWidth = "border-4", // default border width
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`border-t-transparent ${borderWidth} ${color} ${width} ${height} border-solid rounded-full animate-spin`}
        style={{ borderTopColor: "transparent" }}
      />
      {text && <p className={`${textColor} text-lg`}>{text}</p>}
    </div>
  );
};

export default Loader;
