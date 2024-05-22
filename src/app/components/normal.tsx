"use client";
import '../css/globals.css';
import '../css/style.css';
// import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
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
import { SigningStargateClient } from "@cosmjs/stargate";
interface OptionType {
  value: string;
  label: string;
  logoUrl: string;
}
import Image from "next/image";
import { options } from "./chains";
import { getAddress } from "./clientFunctions";
import "@interchain-ui/react/styles";
const Normal: React.FC = () => {
  const [isNormal, setIsNormal] = useState(true);
  const [chain, setChain] = useState<string>("cosmoshub");
  const [data, setData] = useState<DataItem[]>([]);
  const [SelectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState(0.0);
  const [destinationChain, setDestination] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [outputArray, setOutputArray] = useState<({ chainFrom: string; hash: string })[]>([]);
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
    if (!isWalletConnected) {
      connect();
    }
  }
  //   function that fetches data
  const fetchData = async () => {
    const response = await axios.get(`/api/bal/${address}`);
    setData(response.data);
  };
  //Effect that fetches new data when address changes
  useEffect(() => {
    if (address) {
      console.log("address change on origin change ", address);
      fetchData();
    }
  }, [address]);
  //   address change on destination change
  useEffect(() => {
    if (address && destinationChain) {
      let newAddress = getAddress(destinationChain, address);
      setDestinationAddress(newAddress);
    }
  }, [address, destinationChain]);
  // setting the Selected chain
  function handleOriginChange(newValue: { value: string; label: string } | null) {
    if (newValue) {
      setChain(newValue.value);
      connectWallet();
    }
  }
  // setting the destination address
  function handleDestinationChange(newValue: { value: string; label: string } | null) {
    if (newValue) {
      setDestination(newValue.value);
    }
  }
  //  display the amount of the selected token in the wallet
  const renderData = () => {
    const selectedEntry = data.find((entry) => entry.denom.includes(SelectedToken));
    if (selectedEntry) {
      const returnedamount = (Number(selectedEntry.amount) / Number(getExponent(SelectedToken, chain))).toFixed(3);
      return returnedamount;
    } else {
      // handle the case when SelectedToken is not found
      return null; // or return a default value
    }
  }

  //  display the amount of the selected token in the wallet
  const renderFunds = (value: string, chain: string) => {
    const selectedEntry = data.find((entry) => entry.denom.includes(value));
    if (selectedEntry) {
      const returnedamount = (Number(selectedEntry.amount) / Number(getExponent(value, chain))).toFixed(3);
      return returnedamount;
    } else {
      // handle the case when SelectedToken is not found
      return null; // or return a default value
    }
  }
  // function that fetches paths
  function getPath() {
    if (chain && address && amount && SelectedToken && destinationChain && destinationAddress) {
      // search for assets on sspecific chain
      let assetList = assets.find(({ chain_name }) => chain_name === chain);
      // search for asset info with specific denom identity
      let filteredArray = assetList?.assets.filter(obj => obj.base === SelectedToken);
      if (filteredArray && filteredArray?.length > 0) {
        const paths = determinepaths(chain, destinationChain, SelectedToken, address, destinationAddress, amount);
        setPaths(paths);
      }
      else { }
    }
  }
  // getting route
  useEffect(() => {
    if (address && chain && destinationChain && SelectedToken && amount && destinationAddress) {
      getPath();
    }
  }, [address, chain, destinationChain, destinationAddress, SelectedToken, amount]);
  //sign and broadcast
  async function inciatransaction(path: any) {
    if (chain === destinationChain) {
      try {
        // create message
        const simulateClient = await getSigningStargateClient();
        const sendResponse = await Send(
          address,
          destinationAddress,
          amount,
          SelectedToken,
          chain,
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
      console.log("started inciatransaction with path", path);
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
        const simulateClientFinal: SigningStargateClient = await getSigningStargateClient();
        const response = await signAndBroadcast(
          SendIBCResponse.msg,
          SendIBCResponse.fee,
          SendIBCResponse.memo,
          simulateClientFinal
        );
        // Update the output array state
        console.log(response);
        console.log(outputArray);
        setOutputArray(prevArray => [...prevArray, { chainFrom: path.chainFrom, hash: response.transactionHash }]);
        // show transaction hash on window
        console.log("output array", outputArray);
        setChain(path.counterpartyChain || destinationChain);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delayle.log("chain after try catch",chain)
        alert(response.transactionHash);
        // setChain(path.counterpartyChain || destinationChain);
      } catch (error: any) {
        console.error(error.message);
      }
    }
  }
  // filtering through the transaction hashes
  function filterHash(chainFrom: string) {
    const filteredItem = outputArray.filter(obj => obj.chainFrom === chainFrom);
    if (filteredItem[0]) {
      return filteredItem[0].hash; // Display the hash value for the specific chainFrom
    } else {
      console.log('ChainFrom not found');
    }
  }
  // set logic for which type of transaction to be displayed
  async function decision() {
    console.log("from chain is", chain);
    console.log("destination chain is:", destinationChain)
    if (chain === destinationChain && address && amount && SelectedToken && destinationAddress) {
      let finalAmount: string = (Number((amount) * getExponent(SelectedToken, chain))).toString();
      console.log("amount", finalAmount)
      console.log('inside normal send');
      connectWallet();
      const simulateClient = await getSigningStargateClient();
      const sendResponse = await Send(destinationAddress, finalAmount, SelectedToken, address, chain, simulateClient);


      const response = await signAndBroadcast(sendResponse.msg, sendResponse.fee, sendResponse.memo, sendResponse.client);
      if (!response) {
        console.log("step 3")
        alert("Transaction Failed please try again");
      }
      if (response) {
        alert(response.transactionHash);
        if (response.code === 0) {
          alert("Transaction Successful");
        }
      }

    } else {
      setShowPopover(!showPopover);
      setOutputArray([]);
    }
  }
  return (
    <section className="dashboard">
      <div className="normal">
        <div className="toggle">
          <button className="toggleActive">Normal</button>
          <button className="toggleInactive"><a href='./Pro'>Advanced</a></button>
        </div>
        <div className="swapCard">
          <h4>IBC Transfer</h4>
          <div className="networkAssetGroup">
            <div className="networks">
              <p className="paragraphMediumRegular">Networks</p>
              <div className="cardTransferGroup">
                <button className="cardTransfer">
                  <div className="crypto">
                    <Select
                      placeholder="Cosmos Hub" // Placeholder value here
                      value={options.find((c) => c.value === chain)}
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
                  {chain ? (
                    <div>
                      <div className="flex justify-center">
                        <h1 className="text-2xl font-bold text-black">
                          {address?.slice(0, 8)}...{address?.slice(-9)}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <h1></h1>
                  )}{" "}
                  <div className="dropdownIcon">
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </button>
                <button className="transferIcon">
                  <i className="fa-solid fa-arrow-right-arrow-left"></i>
                </button>
                <button className="cardTransfer">
                  <div className="crypto">
                    <Select
                      options={options}
                      placeholder="Cosmos Hub" // Placeholder value here
                      value={options.find((c) => c.value === destinationChain)}
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
                  {destinationChain ? (
                    <div className="flex justify-center">
                      <input
                        type="text"
                        className="text-2xl font-bold"
                        style={{ backgroundColor: 'black', color: 'white' }}
                        value={`${destinationAddress?.slice(0, 10)}...${destinationAddress?.slice(-10)}`}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                      />
                    </div>
                  ) : (
                    <h1>{"  "}</h1>
                  )}
                </button>
              </div>
            </div>
            <div className="asset">
              <Select
                placeholder="Select asset" // Placeholder value here
                options={data.map((entry) => ({
                  label: getDenom(entry.denom, chain)?.symbol,
                  value: entry.denom,
                }))}
                formatOptionLabel={(option) => (
                  <div className="flex flex-row items-center">
                    <div>{option.label}</div>
                    <div className="ml-2">
                      <img
                        src={getDenom(option?.value, chain)?.svg}
                        height="20"
                        width="20"
                      />
                    </div>
                    <div className="ml-2">{renderFunds(option?.value, chain)}</div>
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
              <div className="cardAssetBalance">
                <div className="cardAssetGroup">
                  <div className="assetNumber">
                    {SelectedToken ? (
                      <input
                        type="number"
                        placeholder={Number(renderData()).toFixed(3)}
                        min={0.0}
                        name={"amount"}
                        step="0.001"
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                      />
                    ) : <input type="number" name="" id="" placeholder="0" />}
                  </div>
                </div>
                <div className="balance">
                  <p className="paragraphMediumRegular">{Number(renderData()).toFixed(3)}</p>
                </div>
              </div>
            </div>
          </div>
          <button className="primaryBtn">
            Send
          </button>
        </div>

        <div className="colorMode">
        </div>
      </div>
    </section>
  );
}

export default Normal;