import { Tendermint37Client } from "@cosmjs/tendermint-rpc";
import {
    BankExtension,
    QueryClient,
    setupBankExtension,
  } from "@cosmjs/stargate";
  import { assets, chains, ibc   } from 'chain-registry';
  import { toHex, toBech32,fromBech32 } from "@cosmjs/encoding";

export async function getWalletBalanceOnChain(Address: string) {
  const prefix = fromBech32(Address).prefix;
  const chainInfo =  chains.find(({bech32_prefix})=>bech32_prefix===prefix); 
  var RPC = chainInfo?.apis?.rpc
  let success = false;
  let balance;
    // looping through rpcs
    while (!success) {
      const randomIndex = Math.floor(Math.random() * RPC.length);
      const rpc = RPC[randomIndex].address;
      try {
        const client = await Tendermint37Client.connect(rpc);
        const Query = QueryClient.withExtensions(client);
        const Bank = setupBankExtension(Query);
        balance = Bank.bank.allBalances(Address);
        success = true;
      } catch (error) {
        console.log(`Failed to connect to RPC: ${rpc}. Error: ${error}`);
      }
    }
    return balance;
  }