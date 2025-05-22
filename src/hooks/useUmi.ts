import { useEffect, useState } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Umi } from "@metaplex-foundation/umi";
import { useWallet } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

export const useUmi = (): Umi => {
  const wallet = useWallet();

  const [umi, setUmi] = useState<Umi>(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (!rpcUrl) {
      throw new Error("RPC URL is not defined");
    }
    return createUmi(rpcUrl);
  });

  useEffect(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (!rpcUrl) {
      throw new Error("RPC URL is not defined");
    }

    const _umi = createUmi(rpcUrl).use(walletAdapterIdentity(wallet));

    setUmi(_umi);
  }, [wallet]);

  return umi;
};
