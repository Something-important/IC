import { toHex, toBech32,fromBech32 } from "@cosmjs/encoding";
import { assets, chains, ibc } from "chain-registry";
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