import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ExecuteJsProps, ExecuteJsResponse } from "@lit-protocol/types";
import { useState } from "react";
import { IS_TEST_ENV } from "../../consts";

export const useSign = (params?: Omit<ExecuteJsProps, "authSig">) => {
  const [response, setResponse] = useState<ExecuteJsResponse>();

  const sign = async (
    rewriteParams: Omit<ExecuteJsProps, "authSig"> = params
  ) => {
    if (!rewriteParams) return null;

    const authSig = await auth();

    const client = new LitJsSdk.LitNodeClient({
      litNetwork: "serrano",
      debug: true,
    });

    await client.connect();

    const response = await client.executeJs({
      ...rewriteParams,
      authSig,
    });

    setResponse(response);

    return response;
  };

  const auth = () =>
    LitJsSdk.checkAndSignAuthMessage({
      chain: IS_TEST_ENV ? "bscTestnet" : "bsc",
    });

  return {
    response,
    sign,
  };
};

export default useSign;
