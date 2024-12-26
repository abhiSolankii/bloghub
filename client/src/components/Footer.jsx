import React from "react";
import {
  FaCopyright,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
const Footer = () => {
  return (
    <div className="w-full  min-h-40 p-4 items-center flex flex-col justify-center gap-10 mb-10 pt-20">
      <Separator />
      <h1 className="font-serif font-semibold text-3xl">Connect with us!!</h1>
      <div className="flex gap-6 flex-row">
        <FaTwitter className="text-3xl" />
        <FaGithub className="text-3xl" />
        <FaFacebook className="text-3xl" />
        <FaInstagram className="text-3xl" />
      </div>
      <div className="flex flex-col items-center lg:flex-row gap-10 text-xl text-pretty capitalize">
        <Link className="hover:text-purple-500 font-serif " to="/">
          Home
        </Link>
        <Link className="hover:text-purple-500 font-serif " to="/about">
          About
        </Link>
        <Link className="hover:text-purple-500 font-serif " to="/posts">
          Posts
        </Link>
        <Link className="hover:text-purple-500 font-serif " to="/terms">
          Terms and services
        </Link>
        <Link className="hover:text-purple-500 font-serif " to="/contact">
          Contact Us
        </Link>
      </div>
      <div>
        <p className="hidden lg:flex lg:flex-row text-center items-center gap-2 font-serif font-semibold opacity-60 text-xl">
          Copyright
          <span>
            <FaCopyright />
          </span>
          2022; Designed by Abhishek solanki
        </p>
      </div>
      <div>
        <p className="lg:hidden flex flex-col text-center items-center gap-2 font-serif font-semibold opacity-60 text-xl">
          <div className="flex flex-row items-center gap-2">
            <span>Copyright</span>
            <span>
              <FaCopyright />
            </span>
            <span>2022;</span>
          </div>

          <span>Designed by Abhishek solanki</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
