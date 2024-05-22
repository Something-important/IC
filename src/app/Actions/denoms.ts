import { assets, chains, ibc   } from 'chain-registry';
export const USK_Denom = "factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk"
export const USK_Receipt = "factory/kujira1w4yaama77v53fp0f9343t9w2f932z526vj970n2jv5055a7gt92sxgwypf/urcpt"

export const axlUSDC_Denom = "ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F"
export const axlUSDC_Receipt = "factory/kujira1e224c8ry0nuun5expxm00hmssl8qnsjkd02ft94p3m2a33xked2qypgys3/urcpt"

export const USDC_Denom = "ibc/FE98AAD68F02F03565E9FA39A5E627946699B2B07115889ED812D8BA639576A9"
export const USDC_Receipt = "factory/kujira1jelmu9tdmr6hqg0d6qw4g6c9mwrexrzuryh50fwcavcpthp5m0uq20853h/urcpt"

export const Kuji_Denom = "ukuji"

export const Evmos_Denom = "ibc/F3AA7EF362EC5E791FE78A0F4CCC69FEE1F9A7485EB1A8CAB3F6601C00522F10"

export const Nstake_Denom = "factory/kujira1aaudpfr9y23lt9d45hrmskphpdfaq9ajxd3ukh/unstk"

export const Mnta_Denom = "factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta"

export const Atom_Denom = "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"

export const wEth_Denom = "ibc/1B38805B1C75352B28169284F96DF56BDEBD9E8FAC005BDCC8CF0378C82AA8E7"

export const wBtc_Denom = "ibc/301DAF9CB0A9E247CD478533EF0E21F48FF8118C4A51F77C8BC3EB70E5566DBC"

export const nBtc_Denom = "ibc/A6826D67800ED864F3BF51D56B0165DAF2491B00D93433564158D87BAA0C82BE"

export const ATOM = "uatom";

export const denoms = {
    USK_Denom,
    USK_Receipt,
    axlUSDC_Denom,
    axlUSDC_Receipt,
    USDC_Denom,
    USDC_Receipt,
    Kuji_Denom,
    Evmos_Denom,
    Nstake_Denom,
    Mnta_Denom,
    Atom_Denom,
    wEth_Denom,
    wBtc_Denom,
    nBtc_Denom,
    ATOM

}

export const getDenomName = (denom: string) => {
    switch (denom) {
        case denoms.USK_Denom:
            return "USK";
        case denoms.Kuji_Denom:
            return "KUJI";
        case denoms.axlUSDC_Denom:
            return "axlUSDC";
        case denoms.Nstake_Denom:
            return "NSTK";
        case denoms.Mnta_Denom:
            return "MNTA";
        case denoms.nBtc_Denom:
            return "nBTC";
        case denoms.Atom_Denom:
            return "ATOM";
        case denoms.wBtc_Denom:
            return "wBTC";
        case denoms.wEth_Denom:
            return "wETH";
        case denoms.USDC_Denom:
            return "USDC";
        case denoms.Evmos_Denom:
            return "EVMOS";
        case denoms.ATOM:
            return "Atom";    

    }
};

export function getDenom(tokendenom: string, chain: string) { 
  const assetList =  assets.find(({chain_name})=>chain_name===chain); 
  let filteredArray =  assetList?.assets.filter(obj => obj.base === tokendenom);
  if (!filteredArray || filteredArray.length === 0) {
    // handle the case when filteredArray is empty
  } else {
    if (!filteredArray[0]) {
      // handle the case when filteredArray[0].traces is undefined
    } else {
      const symbol = filteredArray[0].symbol; const svg = filteredArray[0].images[0].png;
      return {symbol,svg};
    }
  }
}   
export  function getExponent(tokendenom: string, chain: string) { 
  const assetList =  assets.find(({chain_name})=>chain_name===chain); 
  let filteredArray =  assetList?.assets.filter(obj => obj.base === tokendenom);
  if (!filteredArray || filteredArray.length === 0) {
    // handle the case when filteredArray is empty
  } else {
    if (!filteredArray[0].denom_units) {
      return 1;
    } else {
      const decimalPlacesToMove: number = filteredArray[0].denom_units[1].exponent; 
      const TokenDecimals = 1 * Math.pow(10, decimalPlacesToMove);
      return TokenDecimals;
    }
  }
}
export function chainInfo(chain: string) { 
  const chainInfo =  chains.find(({chain_name})=>chain_name===chain); 
  if (!chainInfo) {
      // handle the case when assetList is undefined
  } else {
      return chainInfo;
  }
}