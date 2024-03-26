"use client";
// import '../../../Arrow.css'; // Import CSS file where you define your animations
import { useChain } from "@cosmos-kit/react";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  DataItem,
  EncodeObject,
  Coin,
  MsgSend,
  MsgTransfer,
  StdFee,
  CosmosClientType,
  SignType,
} from "../Actions/interfaces";
import { Sendibc, Send } from "../Actions/sendfunctions";
import { chainInfo, getExponent, getDenom } from "../Actions/denoms";
import Select, { OptionProps } from "react-select";
import { determinepaths } from "../Actions/pathsAdvanced";
import { assets, chains, ibc } from "chain-registry";
import {SigningStargateClient} from "@cosmjs/stargate";

interface OptionType {
  value: string;
  label: string;
  logoUrl: string;
}
import Image from "next/image";
import { options } from "./chains";
import "@interchain-ui/react/styles";
export default function Main() {
  const [chain, setChain] = useState<string>("kujira");
  const [originChain, setOrigin] = useState<string>("");
  const [originaddress, setOriginChain] = useState("");
  const [data, setData] = useState<DataItem[]>([]);
  const [SelectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState(0.0);
  const [destinationChain, setDestination] = useState("");
  const [destinationaddress, setDestinationChain] = useState("");
  const [isCalledDestination, setIsCalledDestination] = useState(false);
  const [isCalledOrigin, setIsCalledOrigin] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [outputArray, setOutputArray] = useState<({chainFrom:string; hash: string})[]>([]);
  const [paths, setPaths] = useState<({
    chainFrom: string;
    from: string;
    counterpartyChain: string;
    toAddress: string;
    denom: string;
    channelid: any;
    feeDenom: string | undefined;
    minFee: number | undefined;
    amountToTransfer: number;
    destinationChain?: undefined;
    channel_id?: undefined;
    destinationAddress: string;
  })[]>([]);

  //   chain context
  const chainContext = useChain(chain);
  const {
    username,
    address,
    isWalletConnected,
    connect,
    disconnect,
    getSigningStargateClient,
    getSigningCosmWasmClient,
    signAndBroadcast
  } = chainContext;
  function connectWallet() {
    if(!isWalletConnected){
      connect();
    }
  }
  //   function that fetches data
  const fetchData = async () => {
    const response = await axios.get(`/api/bal/${originaddress}`);
    setData(response.data);
  };
  //Effect that fetches new data when address changes
  useEffect(() => {
    setIsCalledDestination(false);
    setIsCalledOrigin(false);
    if (!originaddress) {
    } else {
      console.log("address change on origin change ", originaddress);
      fetchData();
    }
  }, [originaddress]);
  // setting the Selected chain
  function handleOriginChange(newValue: { value: string; label: string } | null) {
    setIsCalledOrigin(true);
    setIsCalledDestination(false);
    if (newValue) {
    setChain(newValue.value);
    setOrigin(newValue.value);
    }
  }
  // setting the destination address
  function handleDestinationChange(newValue: { value: string; label: string } | null) {
    setIsCalledDestination(true);
    setIsCalledOrigin(false);
    if (newValue) {
    setChain(newValue.value);
    setDestination(newValue.value);
    }
  }
  if (isCalledOrigin === true) {
    if (!address) {
      connectWallet();
      setOriginChain(address);
      console.log("this is destination address", originaddress); console.log("this is newaddress", address);
      setIsCalledOrigin(false);
    } else { connect(); setOriginChain(address); setIsCalledOrigin(false); console.log("this is destination address", originaddress); console.log("this is newaddress", address); }
  } else { };
  if (isCalledDestination === true) {
    if (!address) {
      connectWallet();
      setDestinationChain(address);
      console.log("this is destination address", destinationaddress); console.log("this is newaddress", address);
     setIsCalledDestination(false);
    } else { connectWallet(); setDestinationChain(address); setIsCalledDestination(false); console.log("this is destination address", destinationaddress); console.log("this is newaddress", address); }
  } else { };
  //  display the amount of the selected token in the wallet
  const renderData = () => {
    const selectedEntry = data.find((entry) => entry.denom.includes(SelectedToken));
    if (selectedEntry) {
      const returnedamount = (Number(selectedEntry.amount) / Number(getExponent(SelectedToken, originChain))).toFixed(3);
      return returnedamount;
    } else {
      // handle the case when SelectedToken is not found
      return null; // or return a default value
    }
  }
  // function that fetches paths
  function getPath() {
    if(originChain){
      // search for assets on sspecific chain
      let assetList = assets.find(({chain_name})=>chain_name===originChain);
      // search for asset info with specific denom identity
      let filteredArray = assetList?.assets.filter(obj => obj.base === SelectedToken);
      if(filteredArray && filteredArray?.length>0){
    const paths = determinepaths(originChain, destinationChain, SelectedToken, originaddress,destinationaddress, amount);
    setPaths(paths);}
    else{}
    }
  }
  // getting route
  useEffect(() => {
    if (originaddress && originChain && destinationChain && SelectedToken && amount && destinationaddress) {
      getPath();
    }
  }, [originaddress, originChain, destinationChain,destinationaddress, SelectedToken, amount]);
  //sign and broadcast
  async function inciatransaction(path:any) {
    if (originChain === destinationChain) {
      try {
        // create message
        const simulateClient = await getSigningStargateClient();
        const sendResponse = await Send(
          originaddress,
          destinationaddress,
          amount,
          SelectedToken,
          simulateClient
        );
        //  sign and broadcast message
        const response = await signAndBroadcast(
          sendResponse.msg,
          sendResponse.fee,
          sendResponse.memo,
          sendResponse.client
        );
        // show transaction hash on window
        alert(response.transactionHash);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("started inciatransaction with path",path);
    setChain(path.chainFrom)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delayle.log("chain after try catch",chain)
    connectWallet();
    const simulateClient = await getSigningStargateClient(); 
      try {
        const SendIBCResponse = await Sendibc(
          path.chainFrom,
          path.counterpartyChain || destinationChain,
          path.from,
          path.toAddress,
          path.amountToTransfer,
          path.denom,
          path.channelid || path.channel_id,
          path.feeDenom,
          path.minFee,
          simulateClient
        );
        const simulateClientFinal:SigningStargateClient = await getSigningStargateClient();
        const response = await signAndBroadcast(
          SendIBCResponse.msg,
          SendIBCResponse.fee,
          SendIBCResponse.memo,
          simulateClientFinal
        );
        // Update the output array state
        console.log(response);
        console.log(outputArray);
        setOutputArray(prevArray => [...prevArray, {chainFrom: path.chainFrom, hash: response.transactionHash}]);
        // show transaction hash on window
        console.log("output array",outputArray);
        alert(response.transactionHash);
        // setChain(path.counterpartyChain || destinationChain);
      } catch (error: any) {
        console.error(error.message);
      } 
    }
  }
   // filtering through the transaction hashes
   function filterHash(chainFrom:string){
    const filteredItem = outputArray.filter(obj => obj.chainFrom === chainFrom);
    if (filteredItem[0]) {
     return filteredItem[0].hash; // Display the hash value for the specific chainFrom
   } else {
     console.log('ChainFrom not found');
   }
  }
  return (
     // main division
     <div
      
     >
       {/* normal */}
<div
className="parentDivision rounded-2xl flex flex-row bg-black"
style={{ width: "100%", height: "100%" }}
>
{/* left division */}
<div className="flex flex-col w-1/2  h-full rounded-2xl">
  {/* inner division top left*/}
  <div
    id="innerDiv1"
    className="flex flex-col items-center justify-center  w-full rounded-2xl bg-transparent "
  >
    <h1
      className="flex-auto font-bold text-white"
      style={{ marginTop: "calc(1/6 * 100%)" }}
    >
      Origin Chain
    </h1>
    <div style={{ flex: "calc(1/3 * 100%)"  ,width:"200px"}}>
      <Select
        placeholder="Cosmos Hub" // Placeholder value here
        options={options}
        formatOptionLabel={(option) => (
          <div className="flex flex-row">
            <div>{option.label}</div>
            <div className="ml-2">
              <img
                src={option.logoUrl}
                alt={option.label}
                height="20"
                width="20"
              />
            </div>
          </div>
        )}
        onChange={handleOriginChange}
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: "white",
            borderColor: "black",
            borderRadius: "10px",
          }),
        }}
      />
    </div>
    <div style={{ flex: "calc(1/2 * 100%)" }}></div>
    <div className="flex items-center rounded-10px">
      {chain ? (
        <div>
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-white">
              {originaddress?.slice(0, 5)}...{originaddress?.slice(-5)}
            </h1>
          </div>
        </div>
      ) : (
        <h1></h1>
      )}{" "}
    </div>
  </div>
  {/* inner division top left end */}
  {/* inner division bottom left */}
  <div
    id="innerDiv3"
    className="flex flex-col items-center justify-center h-2/3 w-full rounded-2xl p-5"
  >
    <h1 className="text-2xl font-bold text-white mb-4">Asset to send</h1>
    <div style={{ width: "200px" }}>
    <Select
      placeholder="Select asset" // Placeholder value here
      options={data.map((entry) => ({
        label: getDenom(entry.denom, originChain)?.symbol,
        value: entry.denom,
      }))}
      formatOptionLabel={(option) => (
        <div className="flex flex-row items-center">
          <div>{option.label}</div>
          <div className="ml-2">
            <img
              src={getDenom(option?.value, originChain)?.svg}
              height="20"
              width="20"
            />
          </div>
        </div>
      )}
      onChange={(option) => option && setSelectedToken(option.value)}
      styles={{
        control: (provided) => ({
          ...provided,
          backgroundColor: "white",
          borderColor: "black",
          borderRadius: "10px",
        }),
      }}
    />
  </div>
    {SelectedToken ? (
      <div className="flex items-center mt-4">
        <input
          className="text-indigo-300 rounded-2xl w"
          type="number"
          placeholder={Number(renderData()).toFixed(3)}
          min={0.0}
          name={"amount"}
          step="0.001"
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          style={{ width: "200px" }}
        />
      </div>
    ) : null}
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
      onClick={() => setShowPopover(!showPopover)}
    >
      Send
    </button>
  </div>
  {/* inner division bottom left end */}
</div>
{/* left division end */}
{/* right division */}
<div className="flex flex-col items-center justify-center w-1/2  rounded-2xl">
  {/* inner division top right */}
  <div
    id="innerDiv2"
    className="flex flex-col items-center justify-center h-1/2 w-full rounded-2xl "
  >
    <h1
      className="flex-auto font-bold text-white"
      style={{ marginTop: "calc(1/6 * 100%)" }}
    >
      Destination Chain
    </h1>
    <div style={{ flex: "calc(1/3 * 100%)" ,width:"200px" }}>
      <Select
        options={options}
        formatOptionLabel={(option) => (
          <div className="flex flex-row">
            <div>{option.label}</div>
            <div className="ml-2">
              <img
                src={option.logoUrl}
                alt={option.label}
                height="20"
                width="20"
              />
            </div>
          </div>
        )}
        onChange={handleDestinationChange}
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: "white",
            borderColor: "black",
            borderRadius: "10px",
          }),
        }}
      />
    </div>
    <div style={{ flex: "calc(1/2 * 100%)" }}></div>
    <div className="flex items-center rounded-10px">
      {destinationChain ? (
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-white">{destinationaddress?.slice(0, 5)}...{destinationaddress?.slice(-5)}</h1>
          </div>
      ) : (
        <h1></h1>
      )}
    </div>
  </div>
  {/* inner division top right end */}
  {/* inner division bottom right */}
  <div
id="innerDiv4"
className="flex flex-col items-center justify-center h-1/2 w-full rounded-2xl overflow-hidden" // Tailwind classes
>
<div>
{paths.map((path, index) => (
<div key={index} className="flex items-center justify-between w-full mr-12 ml-(-4) mb-2 mt-2"> 
  <img
    src={chainInfo(path.chainFrom)?.logo_URIs?.svg || chainInfo(path.chainFrom)?.logo_URIs?.png}
    alt={path.chainFrom}
    className="mr-2" // Tailwind class for margin-right
    style={{ width: '12%', height: 'auto' }} // Inline CSS for image size
  />
  <div className="relative flex-1 flex justify-center"> 
  <img
            src="https://cdn.pixabay.com/photo/2015/10/14/18/44/arrow-988169_1280.png"
            alt="arrow"
            className="arrow-animation absolute top-1/2 transform -translate-y-1/2 z-10" // Tailwind classes
            style={{ width: '30%', height: 'auto' }} // Inline CSS for image size
          />
  </div>
  <img
    src={chainInfo(path.counterpartyChain)?.logo_URIs?.svg || chainInfo(path.counterpartyChain)?.logo_URIs?.png || chainInfo(path.destinationChain)?.logo_URIs?.svg || chainInfo(path.destinationChain)?.logo_URIs?.png}
    alt={chainInfo(path.destinationChain)?.logo_URIs?.svg || chainInfo(path.destinationChain)?.logo_URIs?.png}
    className="ml-2" // Tailwind class for margin-left
    style={{ width: '12%', height: 'auto' }} // Inline CSS for image size
  />
</div>
))}
</div>
</div>

  {/* inner division bottom right end */}
</div>
{/* right division end */}
</div>
    {/* normal division end */}
{/* popover start */}
<div className="parentDivision rounded-2xl flex flex-row"
      style={{ width: "100%", height: "100%" }}>
    {showPopover && (
    <div className="parentDivision rounded-2xl flex-center fixed inset-0 backdrop-blur-md"
    style={{ width: "100%", height: "100%" }}>
      <div className="flex justify-center items-center h-screen  ">
      <div className="relative w-2/5 h-3/5 rounded-2xl  flex flex-col items-center bg-black"> 
      {/* Your popover items go here */}
      {paths.map((path, index) => (
    <div key={index} className="popover-item m-2 border-2 border-grey-500" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="flex items-center justify-center">
            <img
                src={chainInfo(path.chainFrom)?.logo_URIs?.svg || chainInfo(path.chainFrom)?.logo_URIs?.png}
                alt={path.chainFrom}
                className="mr-2"
                style={{ width: '12%', height: 'auto' }}
            />
            <div className="relative flex-1 flex justify-center"> 
          <img
            src="https://cdn.pixabay.com/photo/2015/10/14/18/44/arrow-988169_1280.png"
            alt="arrow"
            className="arrow-animation absolute top-1/2 transform -translate-y-1/2 z-10" // Tailwind classes
            style={{ width: '30%', height: 'auto' }} // Inline CSS for image size
          />
        </div>
            <img
                src={chainInfo(path.counterpartyChain)?.logo_URIs?.svg || chainInfo(path.counterpartyChain)?.logo_URIs?.png || chainInfo(path.destinationChain)?.logo_URIs?.svg || chainInfo(path.destinationChain)?.logo_URIs?.png}
                alt={path.chainFrom}
                className="ml-2"
                style={{ width: '12%', height: 'auto' }}
            />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <input className="bg-black text-white" type="text" value={path.from} readOnly style={{ fontSize: '10px', width: '100%', border: '1px solid black'  }} />
            <input className="bg-black text-white" type="text" value={path.destinationAddress || path.toAddress} readOnly style={{ fontSize: '10px', width: '100%', border: '1px solid black'  }} />
        </div>
        <input className="bg-black text-white" type="text" placeholder="hash" value={filterHash(path.chainFrom)} readOnly style={{ width: '100%', fontSize: '12px' }} />
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
            onClick={() => inciatransaction(path)}
        >
            send From: {path.chainFrom}
        </button>
    </div>
))}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-4"
        onClick={() => {
          setShowPopover(!showPopover);
          setOutputArray([]);
          // Call another function here
        }}
      >
        Done
      </button>
    </div>
    </div>
    </div>
  
  )}
</div>
 
    {/* popover end */}
</div>
// main division end
);
}
