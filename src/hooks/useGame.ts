import { useCallback, useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUmi } from "./useUmi";
import {
  coinFlipControllerPlay,
  gamesControllerDeposit,
  gamesControllerGetGameWalletAddress,
  gamesControllerWithdrawFromCoinFlip,
  PlayCoinFlipDtoChoice,
  slotMachineControllerPlay,
  useCoinFlipControllerGetHistory,
  useCoinFlipControllerGetStats,
  useGamesControllerGetBalance,
  useSlotMachineControllerGetHistory,
  useSlotMachineControllerGetStats,
} from "@/api";
import {
  transferSol,
  setComputeUnitPrice,
} from "@metaplex-foundation/mpl-toolbox";
import { publicKey, sol } from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { getReferenceId } from "@/lib/utils";

export type Game = "coinflip" | "slotmachine";

const getQueryOptions = (
  publicKey: string | undefined,
  enabled: boolean,
  queryType: string
) => ({
  query: {
    enabled: !!publicKey && enabled,
    queryKey: [publicKey, queryType],
  },
});

export const useGame = (activeGame: Game) => {
  const { publicKey: connectedPublicKey } = useWallet();
  const umi = useUmi();

  // Fetch balance
  const {
    data: solBalanceData,
    isLoading: isBalanceLoading,
    refetch: refreshBalance,
    error: balanceError,
  } = useGamesControllerGetBalance(
    {
      accountId: connectedPublicKey?.toString() || "",
      tokenType: "SOL",
    },
    getQueryOptions(connectedPublicKey?.toString(), true, "balance")
  );

  // Fetch coinflip data
  const {
    data: coinFlipStats,
    isLoading: isCoinFlipStatsLoading,
    refetch: refreshCoinFlipStats,
    error: coinFlipStatsError,
  } = useCoinFlipControllerGetStats(
    {
      accountId: connectedPublicKey?.toString() || "",
      tokenType: "SOL",
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      activeGame === "coinflip",
      "coinflip-stats"
    )
  );

  const {
    data: coinFlipHistory,
    isLoading: isCoinFlipHistoryLoading,
    refetch: refreshCoinFlipHistory,
    error: coinFlipHistoryError,
  } = useCoinFlipControllerGetHistory(
    {
      accountId: connectedPublicKey?.toString() || "",
      page: 0,
      limit: 10,
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      activeGame === "coinflip",
      "coinflip-history"
    )
  );

  // Fetch slot machine data
  const {
    data: slotMachineStats,
    isLoading: isSlotMachineStatsLoading,
    refetch: refreshSlotMachineStats,
    error: slotMachineStatsError,
  } = useSlotMachineControllerGetStats(
    {
      accountId: connectedPublicKey?.toString() || "",
      tokenType: "SOL",
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      activeGame === "slotmachine",
      "slotmachine-stats"
    )
  );

  const {
    data: slotMachineHistory,
    isLoading: isSlotMachineHistoryLoading,
    refetch: refreshSlotMachineHistory,
    error: slotMachineHistoryError,
  } = useSlotMachineControllerGetHistory(
    {
      accountId: connectedPublicKey?.toString() || "",
      page: 0,
      limit: 10,
    },
    getQueryOptions(
      connectedPublicKey?.toString(),
      activeGame === "slotmachine",
      "slotmachine-history"
    )
  );

  // Centralized wallet check
  const checkWalletConnected = useCallback(() => {
    if (!connectedPublicKey) {
      throw new Error("Please connect your wallet");
    }
    return connectedPublicKey.toString();
  }, [connectedPublicKey]);

  // Centralized balance check
  const checkBalance = useCallback(
    (amount?: number, skipBalanceCheck: boolean = false) => {
      if (!skipBalanceCheck) {
        if (!solBalanceData) {
          throw new Error("Balance data is not available");
        }
        if (amount && parseFloat(solBalanceData.availableBalance) < amount) {
          throw new Error(
            `Insufficient balance: ${solBalanceData.availableBalance} SOL available`
          );
        }
      }
    },
    [solBalanceData]
  );

  // Utility to handle refetches with error logging
  const handleRefetches = useCallback(
    async (refetchFunctions: Array<() => Promise<unknown>>) => {
      try {
        await Promise.all(refetchFunctions.map((refetch) => refetch()));
      } catch (error) {
        console.error(
          "Refetch failed:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    },
    []
  );

  // Deposit SOL to game wallet
  const depositSol = useCallback(
    async (amount: number) => {
      const accountId = checkWalletConnected();
      const destinationWallet = await gamesControllerGetGameWalletAddress();
      const referenceId = getReferenceId();

      try {
        const transferResult = await transferSol(umi, {
          source: umi.identity,
          destination: publicKey(destinationWallet),
          amount: sol(amount),
        })
          .add(setComputeUnitPrice(umi, { microLamports: 25_000 }))
          .sendAndConfirm(umi, {
            send: { skipPreflight: true, maxRetries: 3 },
            confirm: { commitment: "processed" },
          });

        const signature = base58.deserialize(transferResult.signature)[0];

        const depositResult = await gamesControllerDeposit({
          referenceId,
          tokenType: "SOL",
          accountId,
          amount: amount.toString(),
          chainTrxId: signature,
          senderWalletAddress: accountId,
          receiverWalletAddress: destinationWallet,
        });

        // Refetch balance
        await handleRefetches([refreshBalance]);

        return depositResult;
      } catch (error) {
        throw new Error(
          `Deposit failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [checkWalletConnected, umi, refreshBalance, handleRefetches]
  );

  // Withdraw SOL from game
  const withdrawSol = useCallback(
    async (amount: number) => {
      const accountId = checkWalletConnected();
      checkBalance(amount);

      const referenceId = getReferenceId();

      try {
        const withdrawResult = await gamesControllerWithdrawFromCoinFlip({
          referenceId,
          accountId,
          tokenType: "SOL",
          amount: amount.toString(),
          destinationAddress: accountId,
        });

        // Refetch balance
        await handleRefetches([refreshBalance]);

        return withdrawResult;
      } catch (error) {
        throw new Error(
          `Withdrawal failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [checkWalletConnected, checkBalance, refreshBalance, handleRefetches]
  );

  // Play slot machine
  const playSlotMachine = useCallback(
    async (amount: number) => {
      const accountId = checkWalletConnected();
      checkBalance(amount);

      const referenceId = getReferenceId();

      try {
        const slotGameResult = await slotMachineControllerPlay({
          accountId,
          betAmount: amount,
          tokenType: "SOL",
          referenceId,
        });

        // Refetch balance, stats, and history
        await handleRefetches([
          refreshBalance,
          refreshSlotMachineStats,
          refreshSlotMachineHistory,
        ]);

        return slotGameResult;
      } catch (error) {
        throw new Error(
          `Slot machine play failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [
      checkWalletConnected,
      checkBalance,
      refreshBalance,
      refreshSlotMachineStats,
      refreshSlotMachineHistory,
      handleRefetches,
    ]
  );

  // Play coin flip
  const playCoinFlip = useCallback(
    async (amount: number, choice: PlayCoinFlipDtoChoice) => {
      const accountId = checkWalletConnected();
      checkBalance(amount);

      const referenceId = getReferenceId();

      try {
        const coinFlipResult = await coinFlipControllerPlay({
          accountId,
          betAmount: amount,
          tokenType: "SOL",
          referenceId,
          choice,
        });

        // Refetch balance, stats, and history
        await handleRefetches([
          refreshBalance,
          refreshCoinFlipStats,
          refreshCoinFlipHistory,
        ]);

        return coinFlipResult;
      } catch (error) {
        throw new Error(
          `Coin flip play failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [
      checkWalletConnected,
      checkBalance,
      refreshBalance,
      refreshCoinFlipStats,
      refreshCoinFlipHistory,
      handleRefetches,
    ]
  );

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      solBalance: solBalanceData
        ? {
            ...solBalanceData,
            isLoading: isBalanceLoading,
            error: balanceError, // Expose error for balance
          }
        : undefined,
      depositSol,
      withdrawSol,
      slotMachine: {
        play: playSlotMachine,
        stats: slotMachineStats,
        history: slotMachineHistory,
        isLoading: isSlotMachineStatsLoading || isSlotMachineHistoryLoading,
        statsError: slotMachineStatsError, // Expose error for stats
        historyError: slotMachineHistoryError, // Expose error for history
      },
      coinFlip: {
        play: playCoinFlip,
        stats: coinFlipStats,
        history: coinFlipHistory,
        isLoading: isCoinFlipStatsLoading || isCoinFlipHistoryLoading,
        statsError: coinFlipStatsError, // Expose error for stats
        historyError: coinFlipHistoryError, // Expose error for history
      },
    }),
    [
      solBalanceData,
      isBalanceLoading,
      balanceError,
      depositSol,
      withdrawSol,
      playSlotMachine,
      slotMachineStats,
      slotMachineHistory,
      isSlotMachineStatsLoading,
      isSlotMachineHistoryLoading,
      slotMachineStatsError,
      slotMachineHistoryError,
      playCoinFlip,
      coinFlipStats,
      coinFlipHistory,
      isCoinFlipStatsLoading,
      isCoinFlipHistoryLoading,
      coinFlipStatsError,
      coinFlipHistoryError,
    ]
  );
};
