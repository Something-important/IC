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
import Select, { ClassNamesConfig, OptionProps } from "react-select";
import { determinepaths } from "../Actions/paths";
import { assets, chains, ibc } from "chain-registry";
import { getPrefix } from "../components/clientFunctions";

interface OptionType {
  value: string;
  label: string;
  logoUrl: string;
}
import { options } from "../components/chains";
import "@interchain-ui/react/styles";
export default function Pro() {
  const [chain, setChain] = useState<string>("cosmoshub");
  const [destinationChain, setDestination] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [data, setData] = useState<DataItem[]>([]);
  const [SelectedToken, setSelectedToken] = useState("");
  const [channel_id, setchannel_id] = useState<string>("");
  const [amount, setAmount] = useState(0.0);

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
    signAndBroadcast,
  } = chainContext;
  //   function that fetches data
  const fetchData = async () => {
    const response = await axios.get(`/api/bal/${address}`);
    setData(response.data);
  };
  // handle wallet connection
  function connectWallet() {
    if (!isWalletConnected) {
      connect();
    }
  }
  // setting the Selected chain
  const handleOriginChange = (
    newValue: { value: string; label: string } | null
  ) => {
    connectWallet();
    if (newValue) {
      setChain(newValue.value);
    }
  };
  //Effect that fetches new data when address changes
  useEffect(() => {
    console.log("address change on origin change ", address);
    fetchData();
  }, [address]);

  //  display the amount of the selected token in the wallet
  const renderData = () => {
    const selectedEntry = data.find((entry) =>
      entry.denom.includes(SelectedToken)
    );
    if (selectedEntry) {
      const returnedamount = (
        Number(selectedEntry.amount) / Number(getExponent(SelectedToken, chain))
      ).toFixed(3);
      return returnedamount;
    } else {
      // handle the case when SelectedToken is not found
      return null; // or return a default value
    }
  };
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
  //sign and broadcast
  async function inciatransaction() {
    console.log("started inciatransaction");
    if (address && toAddress && SelectedToken && amount) {
      let chainPrefix = getPrefix(address);
      let destinationChainPrefix = getPrefix(toAddress);
      if (chainPrefix === destinationChainPrefix) {
        let finalAmount: string = (Number((amount) * getExponent(SelectedToken, chain))).toString();
            console.log("amount", finalAmount)
            console.log('inside normal send');
            connectWallet();
            const simulateClient = await getSigningStargateClient();
            const sendResponse = await Send(toAddress, finalAmount, SelectedToken, address, chain, simulateClient);


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
      }
      else {
        // create message
        try {
          var minFee = chains.find(
            ({ chain_name }) => chain_name === chain
          )?.fees?.fee_tokens[0].low_gas_price;
          var feeDenom = chains.find(
            ({ chain_name }) => chain_name === chain
          )?.fees?.fee_tokens[0].denom;
          const simulateClient = await getSigningStargateClient();
          console.log("simulateClient outside send ibs", simulateClient)
          const SendIBCResponse = await Sendibc(
            chain,
            "",
            address,
            toAddress,
            amount,
            SelectedToken,
            channel_id,
            feeDenom,
            minFee,
            simulateClient
          );
          console.log("SendIBCResponse", SendIBCResponse);

          const response = await signAndBroadcast(
            SendIBCResponse.msg,
            SendIBCResponse.fee,
            SendIBCResponse.memo,
            SendIBCResponse.client
          );
          // show transaction hash on window
          alert(response.transactionHash);

          return JSON.stringify("success", null, 2);
        } catch (error: any) {
          console.error(error.message);
        }
      }
    }
  }

  return (
    // main division
    <div
      className="parentDivision rounded-2xl flex flex-row"
      style={{ width: "100%", height: "100%" }}
    >
      {/* left division */}
      <div className="flex flex-col w-1/2  h-full rounded-2xl">
        {/* inner division top left*/}
        <div
          id="innerDiv1"
          className="flex flex-col items-center justify-center w-full rounded-2xl bg-transparent"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}
        >
          <div>
            <h1
              className="flex-auto font-bold text-white"
              style={{ marginTop: 'calc(1/6 * 100%)' }}
            >
              Origin Chain
            </h1>
            <div style={{ width: "200px" }}>
              <Select
                placeholder="Cosmos Hub"
                options={options}
                formatOptionLabel={(option: any) => (
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
                  control: (provided: any) => ({
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
                      {address?.slice(0, 4)}...{address?.slice(-5)}
                    </h1>
                  </div>
                </div>
              ) : (
                <h1></h1>
              )}{" "}
            </div>
          </div>
          <div>
            {data.length === 0 ? (
              <p className="text-white">Fetching assets...</p>
            ) : (
              <div style={{ width: "200px" }}>
                <h1 className="text-2xl font-bold text-white mb-4">Asset in your wallet</h1>
                <Select
                  placeholder="Select asset"
                  options={data.map((entry) => ({
                    label: getDenom(entry.denom, chain)?.symbol,
                    value: entry.denom,
                  }))}
                  formatOptionLabel={(option: any) => (
                    <div className="w-200px flex flex-row">
                      <div className="ml-2 flex flex-row">
                        <img
                          src={getDenom(option?.value, chain)?.svg}
                          height="20"
                          width="20"
                        />
                        <div className="ml-2">{renderFunds(option?.value, chain)}</div>
                        <div className=""><h1 contentEditable style={{ overflowWrap: "break-word" }}>{option?.value}</h1> </div>
                      </div>
                    </div>
                  )}
                  onChange={(option: any) => option && setSelectedToken(option.value)}
                  styles={{
                    control: (provided: any) => ({
                      ...provided,
                      backgroundColor: "white",
                      borderColor: "black",
                      borderRadius: "10px",
                    }),
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {/* inner division top left end */}
        {/* inner division bottom left */}
        {/* Divison for assest denom */}
        <div className="flex flex-col items-center justify-center  bg-transparent">
          <div
            id="innerDiv3"
            className="flex flex-col items-center justify-center h-2/3 w-full rounded-2xl p-5"
          >
            {SelectedToken ? (
              <div className="width-200px items-center mt-4">
                <input
                  className="text-indigo-300 width-200px rounded-2xl "
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
              onClick={() => inciatransaction()}
            >
              Send
            </button>
          </div>
        </div>

        {/* inner division bottom left end */}
      </div>
      {/* left division end */}
      {/* right division */}
      <div className="flex flex-col items-center justify-center w-1/2  rounded-2xl">
        {/* Division for destination */}
        <div
          id="innerDiv2"
          className="flex flex-col items-center justify-center h-1/2 w-full rounded-2xl  mb-3 "
        >
          <h1
            className="flex-auto font-bold text-white"
            style={{ marginTop: "calc(1/6 * 100%)" }}
          >
            Destination address
          </h1>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <input
              className="rounded-2xl"
              type="string"
              placeholder="Destination address"
              onChange={(e) => setToAddress(e.target.value)}
              style={{ width: "200px", height: "40px", textAlign: "center" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "66%", width: "100%", padding: "5%" }}>
            <h1 className="flex-auto font-bold text-white">
              Channel ID
            </h1>
            <input
              className="rounded-2xl p-3"
              type="string"
              placeholder="Channel ID"
              onChange={(e) => setchannel_id(e.target.value)}
              style={{ width: "200px", height: "40px", textAlign: "center" }}
            />
          </div>
          <div style={{ flex: "50%" }}></div>
          <div className="flex items-center rounded-10px" style={{ display: "flex", justifyContent: "center" }}>
            {destinationChain ? (
              <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={chainInfo(destinationChain)?.logo_URIs?.svg}
                    className="h-10 w-10 inline"
                    alt="kujira"
                  />
                </div>
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
            <h1 className="flex-auto font-bold text-white">
              Assest Denom
            </h1>
            <div className="flex flex-col items-center p-1">
              <input
                className="flex flex-col items-center  justify-center  w-200px rounded-2xl  "
                type="string"
                placeholder={SelectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                style={{ width: "200px", height: "40px", textAlign: "center" }}
              />
            </div>
          </div>
        </div>

        {/* inner division bottom right end */}
      </div>
      {/* right division end */}
    </div>
    // main division end
  );
}
