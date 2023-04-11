import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { IS_TEST_ENV } from "../../consts";

const httpLink = createHttpLink({
  uri: IS_TEST_ENV
    ? "https://api.cyberconnect.dev/testnet/"
    : "https://api.cyberconnect.dev/",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("cyberConnectAccessToken");

  return {
    headers: {
      ...headers,
      Authorization: token ? `bearer ${token}` : "",
      "X-API-KEY": process.env.CYBERCONNECT_API_KEY,
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
