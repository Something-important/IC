"use client"
import Advanced from "../components/advanced"
import Main from "./pro";
import { useState } from "react";
import Link from "next/link";

            

export default function swap() {
  const [isNormal, setIsNormal] = useState(true);
   
      return (
        <div className="flex justify-center items-center h-screen  ">
      <div className="relative w-2/5 h-3/5 rounded-2xl  flex flex-col items-center bg-transparent">
        <div className="w-full h-1/5 bg-transparent ">
        <div><Link className="absolute top-0 left-0 mt-4 mr-4 h-12 w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded" href="/">Home</Link></div>
          <button className="absolute top-0 right-0 mt-4 mr-4 h-12 w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => setIsNormal(prevIsNormal => !prevIsNormal)}>
            {isNormal ? "Advanced" : "Normal"}
          </button>
        </div>
        <div className="w-full h-4/5 ">
          {isNormal ? <Main/> : <Advanced />}
        </div>
      </div>
    </div>
      );
  }