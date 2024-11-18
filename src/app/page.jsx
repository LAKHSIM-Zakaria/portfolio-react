"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { logVisitor } from "../app/utils/logVistors"; // Adjust the path as needed
import React, { useEffect } from 'react'; // Add this line

const Homepage = () => {
  useEffect(() => {
    logVisitor();
  }, []);
  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <div className="h-full flex flex-col lg:flex-row justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48">
        {/* IMAGE CONTAINER */}
        <div className="h-1/2 lg:h-1/2 lg:w-1/2 relative">
          <Image
            src="/herome-removebg-r.png"
            width={400}
            height={400}
            className="object-cover"
            style={{ height: "auto", maxHeight: "400px" }} // Use object-cover to maintain aspect ratio
          />
        </div>
        {/* TEXT CONTAINER */}
        <div className="h-1/2 lg:h-full lg:w-1/2 flex flex-col gap-8 items-center justify-center">
          {/* TITLE */}
          <h1 className="text-4xl md:text-6xl font-bold">
            Software Engineer.
          </h1>
          {/* DESC */}
          <p className="md:text-xl">
            I am a seasoned Software Engineer with a strong track record of success. 
            Currently, I am thriving in my role as a Software Engineer at Capgemini Engineering 
            in Casablanca-Settat, Morocco, where I have gained valuable experience over the past 4 years.
          </p>
          {/* BUTTONS */}
          <div className="w-full flex gap-4">
            <Link href="/portfolio" className="p-4 rounded-lg ring-1 ring-black bg-black text-white">
              View My Work
            </Link>
            <Link href="/contact" className="p-4 rounded-lg ring-1 ring-black">
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Homepage;
