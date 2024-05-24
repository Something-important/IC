"use client"
import Main from "./pro";
import { useState } from "react";

            

export default function swap() {
   
      return (
        <div className="flex justify-center items-center h-screen  ">
      <div className="relative w-2/5 h-3/5 rounded-2xl  flex flex-col items-center bg-transparent">
        <div className="w-full h-1/5 bg-transparent ">
        <div><a className="absolute top-0 left-0 mt-4 mr-4 h-12 w-32 bg-blue-500 text-white font-bold py-2 px-4 rounded" href="/">Home</a></div>
        </div>
        <div className="w-full h-4/5 ">
           <Main/> 
        </div>
      </div>
    </div>
      );
  }