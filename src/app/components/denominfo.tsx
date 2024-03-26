import React from 'react';
import { assets, chains, ibc   } from 'chain-registry';
interface DenomComponentProps {
    tokendenom: string;
    schain: string;
  }
function getDenom(tokendenom:string, chain:string) {
  const assetList = assets.find(({ chain_name }) => chain_name === chain);
  let filteredArray = assetList?.assets.filter(obj => obj.base === tokendenom);
  if (!filteredArray || filteredArray.length === 0) {
    // handle the case when filteredArray is empty
  } else {
    if (!filteredArray[0]) {
      // handle the case when filteredArray[0].traces is undefined
    } else {
      const symbol = filteredArray[0].symbol; const svg = filteredArray[0].images[0].svg;
      console.log(symbol,svg)
      return [symbol,svg];
    }
  }
}

export default function DenomComponent({ tokendenom, schain }: DenomComponentProps) {
  const symbol = getDenom(tokendenom, schain);

  return (
    <div>
      <p>{symbol?.[0]}
      <img className='bg-black h-4 w-4' src={symbol?.[1]} alt="Kuji SVG" />
      </p>
    </div>
  );
}

{/* <DenomComponent tokendenom={entry.denom } schain={chain} /> */}
