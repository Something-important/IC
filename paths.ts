import { assets, chains, ibc   } from 'chain-registry';
import { pubkeyToAddress } from "@cosmjs/amino";
import { toHex, toBech32,fromBech32 } from "@cosmjs/encoding";
export function determinepaths(sourceChain: string, destinationChain: string, tokenindenom: string, fromAddress: string,amount:string) {
  console.log(sourceChain, destinationChain, tokenindenom, fromAddress)
    var chainFrom= sourceChain;
    var counterparty:string 
    var from= fromAddress;
    var denom =tokenindenom;
    var ready = false;
    var paths = [];
    if (typeof denom === 'string') {
    if(denom.slice(0,3) === "ibc"){
      while(ready == false){    
        // search for assets on sspecific chain
        const assetList = assets.find(({chain_name})=>chain_name===chainFrom);  
        // search for asset info with specific denom identity
        let filteredArray = assetList?.assets.filter(obj => obj.base === denom);
        // looking for specific info
        if(!filteredArray){}else{if(!filteredArray[0].traces){} else{
            const counterpartyChain = filteredArray[0].traces[0].counterparty.chain_name; const counterpartyBaseDenom= filteredArray[0].traces[0].counterparty.base_denom; const channelid= filteredArray[0].traces[0].chain.channel_id;
         // determine from address
            const nakedaddress = fromBech32(from).data;
            var prefix = chains.find(({chain_name})=>chain_name=== counterpartyChain)?.bech32_prefix; var feeDenom = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].denom; var minFee = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].low_gas_price;
            var toAddress = toBech32(prefix, nakedaddress);
            // setting amount
            var decimalPlacesToMove: number = filteredArray[0].denom_units[1].exponent; 
            var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
            var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
            // push required data to array
            paths.push({chainFrom,from,counterpartyChain,toAddress,denom,channelid,feeDenom,minFee,amountToTransfer});
            // update data for new cycle
            chainFrom = counterpartyChain; denom = counterpartyBaseDenom; from = toAddress
            if(counterpartyBaseDenom.slice(0,3) === "ibc"){
              
          }else{
            ready = true;
          }
        }
        }
      }
      const sortedChain = [chainFrom, destinationChain].sort((a, b) => a.localeCompare(b));
      const match = ibc.find(item => 
          item.chain_1.chain_name === sortedChain[0] && 
          item.chain_2.chain_name === sortedChain[1]
        );
        if(chainFrom ===sortedChain[0]){
         const channel_id= match?.channels[0].chain_1.channel_id;
         // determine from address
         const nakedaddress = fromBech32(from).data;
         var prefix = chains.find(({chain_name})=>chain_name=== destinationChain)?.bech32_prefix;var feeDenom = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].denom; var minFee = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].low_gas_price;
         var toAddress = toBech32(prefix, nakedaddress);
         // setting amount
         // search for assets on sspecific chain
        const assetList = assets.find(({chain_name})=>chain_name===chainFrom);  
        // search for asset info with specific denom identity
        let filteredArray = assetList?.assets.filter(obj => obj.base === denom);
         var decimalPlacesToMove: number = filteredArray[0].denom_units[1].exponent; 
         var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
         var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
         // push required data to array
         paths.push({chainFrom,from,destinationChain,toAddress,denom,channel_id,feeDenom,minFee,amountToTransfer}) 
        }else{
          const channel_id= match?.channels[0].chain_2.channel_id;
          // determine from address
         const nakedaddress = fromBech32(from).data;
         var prefix = chains.find(({chain_name})=>chain_name=== destinationChain)?.bech32_prefix;var feeDenom = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].denom; var minFee = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].low_gas_price;
         var toAddress = toBech32(prefix, nakedaddress);
         // setting amount
         // search for assets on sspecific chain
        const assetList = assets.find(({chain_name})=>chain_name===chainFrom);  
        // search for asset info with specific denom identity
        let filteredArray = assetList?.assets.filter(obj => obj.base === denom);
         var decimalPlacesToMove: number = filteredArray[0].denom_units[1].exponent; 
         var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
         var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
         // push required data to array
         paths.push({chainFrom,from,destinationChain,toAddress,denom,channel_id,feeDenom,minFee,amountToTransfer}) 
        }
    }else{
      const sortedChain = [chainFrom, destinationChain].sort((a, b) => a.localeCompare(b));
      const match = ibc.find(item => 
          item.chain_1.chain_name === sortedChain[0] && 
          item.chain_2.chain_name === sortedChain[1]
        );
        if(sourceChain ===sortedChain[0]){
         const channel_id= match?.channels[0].chain_1.channel_id;
         // determine from address
         const nakedaddress = fromBech32(from).data;
         var prefix = chains.find(({chain_name})=>chain_name=== destinationChain)?.bech32_prefix;var feeDenom = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].denom; var minFee = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].low_gas_price;
         var toAddress = toBech32(prefix, nakedaddress);
         // setting amount
         // search for assets on sspecific chain
        const assetList = assets.find(({chain_name})=>chain_name===chainFrom);  
        // search for asset info with specific denom identity
        let filteredArray = assetList?.assets.filter(obj => obj.base === denom);
         var decimalPlacesToMove: number = filteredArray[0].denom_units[1].exponent; 
         var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
         var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
         // push required data to array
         paths.push({chainFrom,from,destinationChain,toAddress,denom,channel_id,feeDenom,minFee,amountToTransfer})
        }else{
          const channel_id= match?.channels[0].chain_2.channel_id;
           // determine from address
         const nakedaddress = fromBech32(from).data;
         var prefix = chains.find(({chain_name})=>chain_name=== destinationChain)?.bech32_prefix;var feeDenom = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].denom; var minFee = chains.find(({chain_name})=>chain_name=== chainFrom)?.fees?.fee_tokens[0].low_gas_price;
         var toAddress = toBech32(prefix, nakedaddress);
         // setting amount
         // search for assets on sspecific chain
        const assetList = assets.find(({chain_name})=>chain_name===chainFrom);  
        // search for asset info with specific denom identity
        let filteredArray = assetList?.assets.filter(obj => obj.base === denom);
         var decimalPlacesToMove: number = filteredArray[0].denom_units[1].exponent; 
         var TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
         var amountToTransfer = Number(Number(amount).toFixed(3)) * TokenDecimals;
         // push required data to array
         paths.push({chainFrom,from,destinationChain,toAddress,denom,channel_id,feeDenom,minFee,amountToTransfer}) 
        }
    }
  }else{}
  return paths; 
}
const Usdc ="ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F"
const Osmo ="uosmo"
const Natom="ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9"
const ntrn="untrn"
const Atom="uatom"
const address ="kujira1mtcjwphtmu3lhs27u0smqrps9ctfm3mup32vyn"
const n ="neutron1mtcjwphtmu3lhs27u0smqrps9ctfm3mu5xpkn7"
const amount= "1";
const paths= determinepaths("kujira", "osmosis", "uusk",address,amount);

paths.forEach(element => {
  console.log(element);
});