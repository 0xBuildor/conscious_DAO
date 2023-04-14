import LoginProvider from "@/store/Login";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { PropsWithChildren } from "react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { apolloClient } from "../api/cyberConnect/client";
import { DEFAULT_CHAIN } from "../consts";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const { chains, provider } = configureChains(
    [
      {
        ...DEFAULT_CHAIN,
      },
    ],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "ConsciousDAO",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ChakraProvider>
            <LoginProvider>{children}</LoginProvider>
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
};
