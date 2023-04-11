import { bsc, bscTestnet } from "wagmi/chains";

export const IS_TEST_ENV = true;
export const DEFAULT_CHAIN = IS_TEST_ENV ? bscTestnet : bsc;

export const CASHIER_CONTRACT_ADDRESS = IS_TEST_ENV
  ? "0xe37dd9dd04b7302132e6ac1486fa39f9c65535d8"
  : "0xe37dd9dd04b7302132e6ac1486fa39f9c65535d8";

export const LIT_PKP_PUBKEY =
  "0x04bb329688a4a6e6865667187890ef2aec083d7c856f6b1d0ff66652a61794975056ff7b9bde2bdf592c3a2a8556aa5a8050732bc9fcdae3065be84ce1bdc03b26";
