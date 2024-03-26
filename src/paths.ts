import { assets, chains, ibc   } from 'chain-registry';
export function determinepaths(sourceChain: string, destinationChain: string, tokenindenom: string) {
    var chainFrom= sourceChain;
    var counterparty:string 
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
            paths.push([chainFrom,counterpartyChain,denom,channelid]);
            chainFrom = counterpartyChain; denom = counterpartyBaseDenom
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
         paths.push([chainFrom,destinationChain,denom,channel_id]) 
        }else{
          const channel_id= match?.channels[0].chain_2.channel_id;
          paths.push([chainFrom,destinationChain,denom,channel_id]) 
        }
    }else{
      const sortedChain = [chainFrom, destinationChain].sort((a, b) => a.localeCompare(b));
      const match = ibc.find(item => 
          item.chain_1.chain_name === sortedChain[0] && 
          item.chain_2.chain_name === sortedChain[1]
        );
        if(sourceChain ===sortedChain[0]){
         const channel_id= match?.channels[0].chain_1.channel_id;
         paths.push([chainFrom,destinationChain,denom,channel_id]) 
        }else{
          const channel_id= match?.channels[0].chain_2.channel_id;
          paths.push([chainFrom,destinationChain,denom,channel_id]) 
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
determinepaths("neutron", "osmosis", Natom);