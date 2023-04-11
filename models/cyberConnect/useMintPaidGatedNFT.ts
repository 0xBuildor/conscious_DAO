import { ethers } from "ethers";
import { without } from "lodash";
import { useEffect, useState } from "react";
import { Address, useContractWrite } from "wagmi";
import CashierABI from "../../abi/Cashier.json";
import {
  CASHIER_CONTRACT_ADDRESS,
  DEFAULT_CHAIN,
  LIT_PKP_PKEY,
} from "../../consts";
import { EligibilityCondition } from "../../types";
import useLitSign from "../lit/useSign";
import useLogin from "./useLogin";

export enum ProcessingStage {
  IDLE,
  MINTING,
  CHECKING_ELIGIBILITY,
}

export const useMintPaidGatedNFT = ({
  recipient,
  eligibilityConditions,
}: {
  recipient: Address | undefined;
  eligibilityConditions: EligibilityCondition[] | undefined;
}) => {
  const [currentProcess, setCurrentProcess] = useState<ProcessingStage[]>([
    ProcessingStage.IDLE,
  ]);
  const [isEligible, setIsEligible] = useState<boolean>();
  const [metadata, setMetadata] = useState<object>();
  const [mintEligibility, setMintEligibility] = useState<
    EligibilityCondition[]
  >([]);

  const { mbLogin } = useLogin();
  const { sign: litSign } = useLitSign();

  const {
    writeAsync: mintWrite,
    error: mintError,
    isSuccess: isSuccessMint,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: CASHIER_CONTRACT_ADDRESS,
    abi: CashierABI.abi,
    chainId: DEFAULT_CHAIN.id,
    functionName: "preProcess",
  });

  useEffect(() => {
    recipient &&
      (eligibilityConditions
        ? (setMintEligibility([]),
          checkMintEligibility(recipient, eligibilityConditions))
        : setIsEligible(true));
  }, [recipient, eligibilityConditions]);

  const checkMintEligibility = (
    recipient: Address,
    eligibilityConditions: EligibilityCondition[]
  ) =>
    Promise.all(
      eligibilityConditions.map((condition) =>
        condition
          .condition(recipient)
          .then(
            (isEligible) => (
              isEligible && setMintEligibility([...mintEligibility, condition]),
              isEligible
            )
          )
      )
    )
      .then((results) => setIsEligible(!results.includes(false)))
      .catch(() => setIsEligible(false));

  const _mint = async (
    recipient: Address,
    profileId: number,
    essenceId: number
  ) => {
    try {
      setCurrentProcess([...currentProcess, ProcessingStage.MINTING]);

      return true;

      // todo transfer to PKP

      // const mintRequestData = {
      //   types: {
      //     EIP712Domain: [
      //       {
      //         name: "name",
      //         type: "string",
      //       },
      //       {
      //         name: "version",
      //         type: "string",
      //       },
      //       {
      //         name: "chainId",
      //         type: "uint256",
      //       },
      //       {
      //         name: "verifyingContract",
      //         type: "address",
      //       },
      //     ],
      //     mint: [
      //       {
      //         name: "to",
      //         type: "address",
      //       },
      //       {
      //         name: "profileId",
      //         type: "uint256",
      //       },
      //       {
      //         name: "essenceId",
      //         type: "uint256",
      //       },
      //       {
      //         name: "price",
      //         type: "uint256",
      //       },
      //     ],
      //   },
      //   primaryType: "mint",
      //   domain: {
      //     name: "consciousdao",
      //     version: "1",
      //     chainId: DEFAULT_CHAIN.id,
      //     verifyingContract: IS_TEST_ENV
      //       ? "0xe37dd9dd04b7302132e6ac1486fa39f9c65535d8"
      //       : "0xe37dd9dd04b7302132e6ac1486fa39f9c65535d8",
      //   },
      //   message: {
      //     to: recipient,
      //     essenceId,
      //     profileId,
      //     price: nftPrice,
      //   },
      // };

      // const permissionMwPreData = {
      //   types: {
      //     EIP712Domain: [
      //       {
      //         name: "name",
      //         type: "string",
      //       },
      //       {
      //         name: "version",
      //         type: "string",
      //       },
      //       {
      //         name: "chainId",
      //         type: "uint256",
      //       },
      //       {
      //         name: "verifyingContract",
      //         type: "address",
      //       },
      //     ],
      //     mint: [
      //       {
      //         name: "to",
      //         type: "address",
      //       },
      //       {
      //         name: "profileId",
      //         type: "uint256",
      //       },
      //       {
      //         name: "essenceId",
      //         type: "uint256",
      //       },
      //       {
      //         name: "nonce",
      //         type: "uint256",
      //       },
      //       {
      //         name: "deadline",
      //         type: "uint256",
      //       },
      //     ],
      //   },
      //   primaryType: "mint",
      //   domain: {
      //     name: "CollectPermissionMw",
      //     version: "1",
      //     chainId: DEFAULT_CHAIN.id,
      //     verifyingContract: IS_TEST_ENV
      //       ? "0xbbbab0257edba5823ddb5aa62c08f07bd0d302d9"
      //       : "0x01fafdbfbb1a56d4a58bb1f7472fb866922ff6c4",
      //   },
      //   message: {
      //     to: recipient,
      //     essenceId,
      //     profileId,
      //     nonce: 0,
      //     deadline: typedData.message.deadline,
      //   },
      // };

      const litSignResponse = await litSign({
        code: `
    const go = async () => {
      // const resp = await (await fetch(gatingConditionsUrl)).text();

      // const conditionResult = await eval(eval(resp)); // ikr

      // console.log(conditionResult);

      // if (conditionResult === true) {
        const permissionMwSig = await LitActions.signEcdsa({ toSign: permissionMwPreDataDigest, publicKey , sigName: "permissionMwSig" });
        const mintRequestSig = await LitActions.signEcdsa({ toSign: mintRequestDigest, publicKey , sigName: "mintRequestSig" });
      // }
    };

    go()
    `,
        // ipfsId: "QmT4KeHeR13UuLt9WVK8kKwrLBUYyqw45oEdgngrsBnBa4",
        jsParams: {
          permissionMwPreDataDigest:
            TypedDataUtils.encodeDigest(permissionMwPreData),
          mintRequestDigest: TypedDataUtils.encodeDigest(mintRequestData),
          publicKey: LIT_PKP_PKEY,
        },
      });

      if (
        !litSignResponse.signatures.mintRequestSig?.signature ||
        !litSignResponse.signatures.permissionMwSig?.signature
      ) {
        throw new Error(litSignResponse.response);
      }

      const splitMintRequestSig = ethers.utils.splitSignature(
        litSignResponse.signatures.mintRequestSig.signature
      );

      const splitPermissionMwSig = ethers.utils.splitSignature(
        litSignResponse.signatures.permissionMwSig.signature
      );

      const writeResponse = await mintWrite({
        recklesslySetUnpreparedArgs: [
          profileId,
          essenceId,
          recipient,
          litSignResponse.response, // NFT price from signed typed data
          ethers.utils.defaultAbiCoder.encode(
            ["uint8", "bytes32", "bytes32"],
            [
              splitMintRequestSig.v,
              splitMintRequestSig.r,
              splitMintRequestSig.s,
            ]
          ),
          ethers.utils.defaultAbiCoder.encode(
            ["uint8", "bytes32", "bytes32", "uint256"],
            [
              splitPermissionMwSig.v,
              splitPermissionMwSig.r,
              splitPermissionMwSig.s,
              "999999999",
            ]
          ),
        ],
        recklesslySetUnpreparedOverrides: {
          value: litSignResponse.response,
        },
      });

      await writeResponse.wait();

      setCurrentProcess(without(currentProcess, ProcessingStage.MINTING));

      return true;
    } catch (e) {
      setCurrentProcess(without(currentProcess, ProcessingStage.MINTING));
      console.error(e);

      return false;
    }
  };

  const mint = (profileId: number, essenceId: number, _recipient = recipient) =>
    isEligible &&
    _recipient &&
    mbLogin(() => _mint(_recipient, profileId, essenceId)).then(() =>
      _mint(_recipient, profileId, essenceId)
    );

  return {
    currentProcess,
    mintEligibility,
    isEligible,
    metadata,
    mint,
    mintError,
    isSuccessMint,
  };
};

export default useMintPaidGatedNFT;
