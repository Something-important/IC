import { assets, chains, ibc } from "chain-registry";
import chainInfo from "../Actions/chainInfo";
export const options: { value: string; label: string; logoUrl: string | undefined }[] = [

  ...chains.map(({ chain_name}) => ({
    value: chain_name,
    label: chain_name,
    logoUrl: chainInfo(chain_name),
  })),
  
].filter(chain => !chain.value.toLowerCase().includes("testnet" ) && !chain.value.toLowerCase().includes("devnet"));
const optionwithouttestnet: { value: string; label: string; logoUrl: string | undefined }[] = [
  ...chains.map(({ chain_name }) => ({
    value: chain_name,
    label: chain_name,
    logoUrl: chainInfo(chain_name),
  })),
].filter(chain => !chain.value.toLowerCase().includes("testnet"));
// export  const options: { value: string; label: string; logoUrl: string }[] = [
//     { value: "kujira", label: "Kujira", logoUrl: "https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/kuji.png" },
//     { value: "osmosis", label: "Osmosis", logoUrl: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg" },
//     { value: "cosmoshub", label: "Cosmos Hub", logoUrl: "https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png" },
//     { value: "bitcanna", label: "Bitcanna", logoUrl: "https://raw.githubusercontent.com/cosmos/chain-registry/master/bitcanna/images/bcna.png" },
//     {value: "axelar", label: "Axelar", logoUrl: "https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/axl.png"},
//     {value:"evmos", label: "Evmos", logoUrl: "https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png"},
//     // Add more options as needed
//   ];