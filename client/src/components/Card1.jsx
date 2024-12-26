//card for home page
import React from "react";
import { Button } from "./ui/button";
import getCategoryName from "./helpers/getCategoryName";
import formatDateAndTime from "./helpers/formatDateAndTime";
import stripHtmlTags from "./helpers/removeHtmlTags";

const Card1 = ({ image, title, content, topic, author, date, link }) => {
  return (
    <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 duration-300 hover:z-10 ">
      <div className=" w-[20rem] h-[28rem] border border-black p-2 rounded-md flex flex-col gap-2 hover:border-dotted hover:opacity-90 overflow-y-scroll scrollbar-none">
        <img
          src={image}
          alt={title}
          className="h-[50%] w-full rounded-md overflow-hidden object-cover "
        />
        <p className="opacity-60 text-[12px] font-serif">
          {formatDateAndTime(date)}
        </p>
        <h1 className="font-bold text-sm">{title.slice(0, 50)}...</h1>
        <p className="opacity-60 text-sm">
          {stripHtmlTags(content.slice(0, 80))}...
        </p>
        <div className="font-serif opacity-50 font-semibold text-sm">
          <p className="my-1">{getCategoryName(topic)}</p>
          <a href="#">
            <p className="hover:opacity-70">{author}</p>
          </a>
        </div>

        <a href="#">
          <Button variant="outline" size="sm">
            Read More
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Card1;
