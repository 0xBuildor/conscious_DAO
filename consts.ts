import { bsc, bscTestnet } from "wagmi/chains";

export const IS_TEST_ENV = false;
export const DEFAULT_CHAIN = IS_TEST_ENV ? bscTestnet : bsc;

export const CASHIER_CONTRACT_ADDRESS = IS_TEST_ENV
  ? "0xe37dd9dd04b7302132e6ac1486fa39f9c65535d8"
  : "0xe37dd9dd04b7302132e6ac1486fa39f9c65535d8";

export const LIT_PKP_PUBKEY =
  "0x049eb115c0a128724dfe746660eb6ea8b069b3b23b4ae38477ced7fca2bc543d0d6a2174d1e7b8b96a5cbecfd28fc06a565f283450e4e7ad6488bef7fa35f9e9b9";

export const TURTLE_NFT_PROFILE_ID = 578;
export const TURTLE_NFT_ESSENCE_ID = 1;
