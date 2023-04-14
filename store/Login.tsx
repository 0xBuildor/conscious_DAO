import { LOGIN_GET_MESSAGE } from "@/api/cyberConnect/graphql/LoginGetMessage";
import { LOGIN_VERIFY } from "@/api/cyberConnect/graphql/LoginVerify";
import { REFRESH_ACCESS_TOKEN } from "@/api/cyberConnect/graphql/RefreshAccessToken";
import { VERIFY_ACCESS_TOKEN } from "@/api/cyberConnect/graphql/VerifyAccessToken";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { Address, useAccount, useSignMessage } from "wagmi";

const LOGIN_DOMAIN = "verceltwitter.vercel.app";
const ACCESS_TOKEN_STORAGE_KEY = "cyberConnectAccessToken";
const REFRESH_TOKEN_STORAGE_KEY = "cyberConnectRefreshToken";
const LOGGED_IN_ADDRESS_STORAGE_KEY = "cyberConnectLoggedInAddress";

export interface ILoginContext {
  mbLogin: (cb?: CallableFunction) => Promise<unknown>;
  isLoggingIn: boolean | undefined;
  isLoggedIn: boolean | undefined;
}

export const loginContext = createContext<ILoginContext | null>(null);

export const LoginProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { address: connectedWalletAddress } = useAccount();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginCb, setLoginCb] = useState<CallableFunction>();

  const { openConnectModal } = useConnectModal();
  const [loginGetMessage] = useMutation(LOGIN_GET_MESSAGE);
  const [loginVerify] = useMutation(LOGIN_VERIFY);
  const [verifyAccessToken] = useLazyQuery(VERIFY_ACCESS_TOKEN);
  const [refreshAccessTokenMutation] = useMutation(REFRESH_ACCESS_TOKEN);

  const [loginMessageToSign, setLoginMessageToSign] = useState<string>();
  const {
    data: signedMessage,
    signMessage,
    reset: resetSignedMessage,
  } = useSignMessage({
    message: loginMessageToSign,
  });

  useEffect(() => {
    connectedWalletAddress
      ? (resetSignedMessage(), checkIfLoggedIn(connectedWalletAddress))
      : setIsLoggedIn(false);

    setConnectedWalletAddressAccessToken(
      getAccessToken(connectedWalletAddress as Address)
    );
  }, [connectedWalletAddress]);

  useEffect(() => {
    isLoggingIn
      ? signedMessage && verifyLogin(signedMessage)
      : setLoginMessageToSign(undefined);
  }, [isLoggingIn, signedMessage]);

  useEffect(() => {
    isLoggingIn &&
      (!connectedWalletAddress && openConnectModal?.(),
      !isLoggedIn && connectedWalletAddress && signLoginMessage());
  }, [isLoggedIn, isLoggingIn, connectedWalletAddress]);

  useEffect(() => {
    isLoggedIn && (setIsLoggingIn(false), loginCb?.());
  }, [isLoggingIn]);

  const setConnectedWalletAddressAccessToken = (token: string | null) =>
    token && localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);

  const checkIfLoggedIn = (address: Address) => {
    hasAccessToken(address)
      ? (setIsLoggingIn(true),
        verifyAccessToken({
          variables: { input: { accessToken: getAccessToken(address) } },
        })
          .then((response) =>
            !response.data.verifyAccessToken.isValid
              ? (setIsLoggedIn(true), setIsLoggingIn(false))
              : refreshAccessToken(address)
                  .then(() => setIsLoggedIn(true))
                  .catch(() => setIsLoggedIn(false))
                  .finally(() => setIsLoggingIn(false))
          )
          .catch(
            (e) => (
              setIsLoggedIn(false),
              console.error("Error while verifying access token", e)
            )
          ))
      : setIsLoggedIn(false);
  };

  const signLoginMessage = async () => {
    const messageResult = await loginGetMessage({
      variables: {
        input: {
          address: connectedWalletAddress,
          domain: LOGIN_DOMAIN,
        },
      },
    });

    signMessage({ message: messageResult?.data?.loginGetMessage?.message });
  };

  const verifyLogin = async (signedMessage: string) => {
    const accessTokenResult = await loginVerify({
      variables: {
        input: {
          address: connectedWalletAddress,
          domain: LOGIN_DOMAIN,
          signature: signedMessage,
        },
      },
    });

    setAccessToken(
      connectedWalletAddress as Address,
      accessTokenResult?.data?.loginVerify?.accessToken
    );
    setRefreshToken(
      connectedWalletAddress as Address,
      accessTokenResult?.data?.loginVerify?.refreshToken
    );
    setConnectedWalletAddressAccessToken(
      accessTokenResult?.data?.loginVerify?.accessToken
    );

    setIsLoggingIn(false);
    setIsLoggedIn(true);

    loginCb?.();
  };

  const setAccessToken = (address: Address, token: string) =>
    token &&
    localStorage.setItem(`${ACCESS_TOKEN_STORAGE_KEY}_${address}`, token);

  const setRefreshToken = (address: Address, token: string) =>
    token &&
    localStorage.setItem(`${REFRESH_TOKEN_STORAGE_KEY}_${address}`, token);

  const getAccessToken = (address: Address) =>
    localStorage.getItem(`${ACCESS_TOKEN_STORAGE_KEY}_${address}`);

  const getRefreshToken = (address: Address) =>
    localStorage.getItem(`${REFRESH_TOKEN_STORAGE_KEY}_${address}`);

  const hasAccessToken = (address: Address) => !!getAccessToken(address);

  const hasRefreshToken = (address: Address) => !!getRefreshToken(address);

  const refreshAccessToken = (address: Address) =>
    new Promise(
      (res, rej) =>
        hasRefreshToken(address) &&
        refreshAccessTokenMutation({
          variables: { input: { refreshToken: getRefreshToken(address) } },
        })
          .then(
            ({ data }) =>
              data.refreshAccessToken.accessToken &&
              data.refreshAccessToken.refreshToken &&
              (setAccessToken(address, data.refreshAccessToken.accessToken),
              setRefreshToken(address, data.refreshAccessToken.refreshToken),
              setConnectedWalletAddressAccessToken(
                data.refreshAccessToken.accessToken
              ),
              res(true))
          )
          .catch(rej)
    );

  const mbLogin = (cb?: CallableFunction) =>
    new Promise((res) => {
      !isLoggedIn ? (setIsLoggingIn(true), setLoginCb(() => cb)) : res(null);
    });

  return (
    <loginContext.Provider value={{ isLoggedIn, isLoggingIn, mbLogin }}>
      {children}
    </loginContext.Provider>
  );
};

export default LoginProvider;
