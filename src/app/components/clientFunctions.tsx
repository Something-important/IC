import { toHex, toBech32,fromBech32 } from "@cosmjs/encoding";
import { assets, chains, ibc } from "chain-registry";

export declare class Denom {
  reference: string;
  underlying?: Denom[] | undefined;
  symbol: string;
  decimals: number;
  trace?: {
      path: string;
      base_denom: string;
  };
  ics20?: {
      contract: string;
      router: string;
      channel: string;
  };
  constructor(reference: string, underlying?: Denom[] | undefined);
  static from(string: string): Denom;
  static from_path(port: string, channel: string, denom: string): Denom;
  eq: (other: Denom) => boolean;
  compare: (other: Denom) => number;
  normalizedReference: () => string;
}
export function getAddress(chainName:string,address:string) {
  let filteredChains = chains.filter(({ chain_name }) => chain_name === chainName);
  let prefix = filteredChains[0].bech32_prefix;
    const nakedaddress = fromBech32(address).data;
    var newAddress = toBech32(prefix, nakedaddress);
    return newAddress
  } 

export function minFee(chain:string){
  var minFee = chains.find(
    ({ chain_name }) => chain_name === chain
  )?.fees?.fee_tokens[0].low_gas_price;
  var minFeeToken = chains.find(
    ({ chain_name }) => chain_name === chain
  )?.fees?.fee_tokens[0].denom;
  return{minFee,minFeeToken}
  
} 

export function getExponent(tokendenom: string, chain: string = "kujira") {
    let TokenDecimals
    if (tokendenom.includes("ibc/")) {
        const denom = Denom.from(tokendenom);
        const decimalPlacesToMove = denom.decimals;
        TokenDecimals = Number(Math.pow(10, decimalPlacesToMove));
    } else {
        const assetList = assets.find(({ chain_name }) => chain_name === chain);
        if (!assetList) throw new Error("Chain not found");
        const filteredArray = assetList?.assets.find(obj => obj.base === tokendenom);
        if (!filteredArray) throw new Error("Token not found");
        const decimalPlacesToMove = filteredArray.denom_units[1].exponent;
        TokenDecimals = Number(Math.pow(10, decimalPlacesToMove));
    }
    return TokenDecimals
}