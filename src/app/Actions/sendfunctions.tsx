"use client";
import {
    EncodeObject,
    Coin,
    MsgTransfer,
    StdFee
  } from "./interfaces"
export type CosmosClientType = "stargate" | "cosmwasm";
export type SignType = "amino" | "direct";
import { minFee, getExponent } from "../components/clientFunctions";




export async function Sendibc(
  origin: string,
  destination: string,
  senderAddress: string,
  receiveraddress: string,
  amount: number,
  tokenindenom: string,
  channel_id: string | undefined,
  feeDenom: string | undefined,
  minFee: number | undefined,
  simulatedClient: any,
) {
  console.log("sender chain normal: " + origin);
  console.log("receiver chain normal " + destination);
  console.log("sender address normal: " + senderAddress);
  console.log("receiver address: normal " + receiveraddress);
  console.log("amount: normal " + amount);
  console.log("sender denom normal: " + tokenindenom);
  console.log("channel id: " + channel_id);
  console.log("feeDenom: " + feeDenom);
  console.log("minFee: " + minFee);
  console.log("simulatedClient: " + simulatedClient);
  
    const value: Coin = {
      denom: tokenindenom,
      amount: amount.toString(),
    };
    const message: EncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: {
        sourcePort: "transfer",
        sourceChannel: channel_id,
        sender: senderAddress,
        receiver: receiveraddress,
        timeoutTimestamp: (new Date().getTime() + 120000) * 1000000,
        memo: "",
        token: value,
      },
    };
    const msg: EncodeObject[] = [message];
    const simulatedGas = await simulatedClient.simulate(senderAddress, msg, "");
    const gasPrice = Math.ceil(Number(simulatedGas * 1.7 * Number(minFee))).toFixed(0);
    const maxGas = simulatedGas * 1.7;
    const feevalue: Coin = {
      denom: feeDenom,
      amount: gasPrice,
    };

    const fee: StdFee = { amount: [feevalue], gas: maxGas.toFixed(0) };
    const memo: string = "Free IBC";
    const client: CosmosClientType | undefined = "stargate";

    return { msg, fee, memo, client };
  }


// normal transaction
export async function Send(recieverAddress: string,
  amount: string,
  tokenindenom: string,
  senderAddress: string,
  chain: string,
  simulatedClient: any) {
    const fees = minFee(chain);

  const messege: EncodeObject = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
          fromAddress: senderAddress,
          toAddress: recieverAddress,
          amount: [{
              denom: tokenindenom,
              amount: amount,
          }],
      }
  }
  const msg: EncodeObject[] = [messege];
  const simulatedGas = await simulatedClient.simulate(senderAddress, msg, "")
  const gasPrice = Math.ceil(Number((simulatedGas * 1.7) * fees.minFee)).toFixed(0);
  const maxGas = simulatedGas * 1.7

  const fee: StdFee = {
      amount: [{
          denom: fees.minFeeToken,
          amount: gasPrice,
      }], gas: maxGas.toFixed(0)
  };

  const client: CosmosClientType | undefined = "stargate";
  const memo: string = "";
  return { msg, fee, memo, client }

}
