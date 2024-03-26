// app/providers.tsx
"use client";
// 1. user context

import { createContext, useState } from "react";

export const UserC = createContext({});

export function UserF({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  return <UserC.Provider value={{ user, setUser }}>{children}</UserC.Provider>;
}

// 2.cosmos kit

import * as React from "react";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
// import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapwallets } from "@cosmos-kit/leap";
// Import this in your top-level route/layout
import "@interchain-ui/react/styles";
// import next ui
import { NextUIProvider } from "@nextui-org/system";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ChainProvider
        chains={chains} // supported chains
        assetLists={assets} // supported asset lists
        wallets={[...keplrWallets, ...leapwallets]}
      >
        <UserF>{children}</UserF>
      </ChainProvider>
    </NextUIProvider>
  );
}
