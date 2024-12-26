import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-gradient-to-b  text-black overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-twinkle star-bg" />
      </div>

      {/* Floating 404 */}
      <motion.h1
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-md"
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-4 text-2xl md:text-3xl text-gray-600 font-semibold"
      >
        This page is lost in the universe
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-600 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
        >
          Take Me Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
