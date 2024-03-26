import {  chains   } from 'chain-registry';


export default function chainInfo(chain: string) { 
    const chainInfo =  chains.find(({chain_name})=>chain_name===chain); 
    // console.log(chainInfo)
    if (!chainInfo) {
        // handle the case when assetList is undefined
    } else {
        return chainInfo.logo_URIs?.png || chainInfo.logo_URIs?.svg;
    }
}

console.log(chainInfo("osmosis"));