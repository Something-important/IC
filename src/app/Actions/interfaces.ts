export interface DataItem {
    denom: string;
    amount: string;
  }
  
  export interface EncodeObject {
    readonly typeUrl: string;
    readonly value: any;
  }
  export interface Coin {
    denom: string;
    amount: string;
  }
  export interface MsgSend {
    fromAddress: string;
    toAddress: string;
    amount: Coin[];
  }
  export interface Height {
    /** the revision that the client is currently on */
    revisionNumber: Long;
    /** the height within the given revision */
    revisionHeight: Long;
  }
  export interface MsgTransfer {
    /** the port on which the packet will be sent */
    sourcePort: string;
    /** the channel by which the packet will be sent */
    sourceChannel: string;
    /** the tokens to be transferred */
    token?: Coin;
    /** the sender address */
    sender: string;
    /** the recipient address on the destination chain */
    receiver: string;
    /**
     * Timeout height relative to the current block height.
     * The timeout is disabled when set to 0.
     */
    timeoutHeight?: Height;
    /**
     * Timeout timestamp in absolute nanoseconds since unix epoch.
     * The timeout is disabled when set to 0.
     */
    timeoutTimestamp: any;
    /** optional memo */
    memo: string;
  }
  export interface StdFee {
    readonly amount: readonly Coin[];
    readonly gas: string;
    /** The granter address that is used for paying with feegrants */
    readonly granter?: string;
    /** The fee payer address. The payer must have signed the transaction. */
    readonly payer?: string;
  }
  export type CosmosClientType = "stargate" | "cosmwasm";
  export type SignType = "amino" | "direct";
  