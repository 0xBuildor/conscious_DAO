import { without } from "lodash";
import { useState } from "react";
import { Address, useContractWrite } from "wagmi";
import CashierABI from "../../abi/Cashier.json";
import {
  CASHIER_CONTRACT_ADDRESS,
  DEFAULT_CHAIN,
  LIT_PKP_PUBKEY,
} from "../../consts";
import useLitSign from "../lit/useSign";

export enum ProcessingStage {
  IDLE,
  MINTING,
}

export const useMintPaidGatedNFT = ({
  recipient,
}: {
  recipient: Address | undefined;
}) => {
  const [currentProcess, setCurrentProcess] = useState<ProcessingStage[]>([
    ProcessingStage.IDLE,
  ]);

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

  const _mint = async (
    recipient: Address,
    profileId: number,
    essenceId: number
  ) => {
    try {
      setCurrentProcess([...currentProcess, ProcessingStage.MINTING]);

      const litSignResponse = await litSign({
        code: `
        var __assign=function(){return(__assign=Object.assign||function e(t){for(var r,a=1,s=arguments.length;a<s;a++)for(var n in r=arguments[a])Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n]);return t}).apply(this,arguments)},TypedDataUtils={encodeDigest:function(e){var t=ethers.ethers.utils.arrayify("0x1901"),r=TypedDataUtils.hashStruct(e,"EIP712Domain",e.domain),a=TypedDataUtils.hashStruct(e,e.primaryType,e.message),s=ethers.ethers.utils.solidityPack(["bytes","bytes32","bytes32"],[t,zeroPad(r,32),zeroPad(a,32)]),n=ethers.ethers.utils.keccak256(s);return ethers.ethers.utils.arrayify(n)},encodeData:function(e,t,r){var a=e.types,s=a[t];if(!s||0===s.length)throw Error("TypedDataUtils: "+e.primaryType+" type is not unknown");var n=new ethers.ethers.utils.AbiCoder,i=[],y=[],u=TypedDataUtils.typeHash(e.types,t);i.push("bytes32"),y.push(zeroPad(u,32));for(var o=function(t,r,s){if(void 0!==a[r])return["bytes32",ethers.ethers.utils.arrayify(ethers.ethers.utils.keccak256(TypedDataUtils.encodeData(e,r,s)))];if("bytes"===r||"string"===r){var i=void 0;return i="string"===r?ethers.ethers.utils.toUtf8Bytes(s):ethers.ethers.utils.arrayify(s),["bytes32",ethers.ethers.utils.arrayify(ethers.ethers.utils.hexZeroPad(ethers.ethers.utils.keccak256(i),32))]}if(!(r.lastIndexOf("[")>0))return[r,s];var y=r.slice(0,r.lastIndexOf("[")),i=s.map(function(e){return o(t,y,e)});return["bytes32",ethers.ethers.utils.arrayify(ethers.ethers.utils.keccak256(ethers.ethers.utils.arrayify(n.encode(i.map(function(e){return e[0]}),i.map(function(e){return e[1]})))))]},p=0,l=s;p<l.length;p++){var h=l[p],d=o(h.name,h.type,r[h.name]),c=d[0],f=d[1];i.push(c),y.push(f)}return ethers.ethers.utils.arrayify(n.encode(i,y))},hashStruct:function(e,t,r){return ethers.ethers.utils.arrayify(ethers.ethers.utils.keccak256(TypedDataUtils.encodeData(e,t,r)))},typeHash:function(e,t){return ethers.ethers.utils.arrayify(ethers.ethers.utils.keccak256(ethers.ethers.utils.toUtf8Bytes(TypedDataUtils.encodeType(e,t))))},encodeType:function(e,t){var r=e[t];if(!r||0===r.length)throw Error("TypedDataUtils: "+t+" type is not defined");for(var a=[],s=t+"(",n=0;n<r.length;n++){var i=r[n],y=i.type.indexOf("["),u=y<0?i.type:i.type.slice(0,y);if(e[u]&&e[u].length>0){for(var o=!1,p=0;p<a.length;p++)a[p]===u&&(o=!0);o||a.push(u)}s+=i.type+" "+i.name,n<r.length-1&&(s+=",")}s+=")",a.sort();for(var n=0;n<a.length;n++)s+=TypedDataUtils.encodeType(e,a[n]);return s},domainType:function(e){var t=[];return e.name&&t.push({name:"name",type:"string"}),e.version&&t.push({name:"version",type:"string"}),e.chainId&&t.push({name:"chainId",type:"uint256"}),e.verifyingContract&&t.push({name:"verifyingContract",type:"address"}),e.salt&&t.push({name:"salt",type:"bytes32"}),t},buildTypedData:function(e,t,r,a){var s=TypedDataUtils.domainType(e);return{domain:e,types:__assign({EIP712Domain:s},t),primaryType:r,message:a}}},encodeTypedDataDigest=function(e){return TypedDataUtils.encodeDigest(e)},buildTypedData=function(e,t,r,a){return TypedDataUtils.buildTypedData(e,t,r,a)},domainType=function(e){return TypedDataUtils.domainType(e)},zeroPad=function(e,t){return ethers.ethers.utils.arrayify(ethers.ethers.utils.hexZeroPad(ethers.ethers.utils.hexlify(e),t))};

    const go = async () => {
      const mintRequestData = {
        types: {
          EIP712Domain: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "version",
              type: "string",
            },
            {
              name: "chainId",
              type: "uint256",
            },
            {
              name: "verifyingContract",
              type: "address",
            },
          ],
          mint: [
            {
              name: "to",
              type: "address",
            },
            {
              name: "profileId",
              type: "uint256",
            },
            {
              name: "essenceId",
              type: "uint256",
            },
            {
              name: "price",
              type: "uint256",
            },
          ],
        },
        primaryType: "mint",
        domain: {
          name: "consciousdao",
          version: "1",
          chainId: 97,
          // chainId: 56,
          verifyingContract: "0xe37dd9dd04b7302132e6ac1486fa39f9c65535d8"
        },
        message: {
          to: recipient,
          essenceId,
          profileId,
          price: "1",
        },
      };

      const permissionMwPreData = {
        types: {
          EIP712Domain: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "version",
              type: "string",
            },
            {
              name: "chainId",
              type: "uint256",
            },
            {
              name: "verifyingContract",
              type: "address",
            },
          ],
          mint: [
            {
              name: "to",
              type: "address",
            },
            {
              name: "profileId",
              type: "uint256",
            },
            {
              name: "essenceId",
              type: "uint256",
            },
            {
              name: "nonce",
              type: "uint256",
            },
            {
              name: "deadline",
              type: "uint256",
            },
          ],
        },
        primaryType: "mint",
        domain: {
          name: "CollectPermissionMw",
          version: "1",
          chainId: 97,
          // chainId: 56,
          verifyingContract: "0xbbbab0257edba5823ddb5aa62c08f07bd0d302d9"
          // verifyingContract: "0x01fafdbfbb1a56d4a58bb1f7472fb866922ff6c"
        },
        message: {
          to: recipient,
          essenceId,
          profileId,
          nonce: 0,
          deadline: 999999999,
        },
      };

      TypedDataUtils.encodeDigest();

      // const resp = await (await fetch(gatingConditionsUrl)).text();

      // const conditionResult = await eval(eval(resp)); // ikr

      // console.log(conditionResult);

      // if (conditionResult === true) {
        // const permissionMwSig = await LitActions.signEcdsa({ toSign: permissionMwPreDataDigest, publicKey , sigName: "permissionMwSig" });
        // const mintRequestSig = await LitActions.signEcdsa({ toSign: mintRequestDigest, publicKey , sigName: "mintRequestSig" });
      // }
      LitActions.setResponse({response: JSON.stringify({hello: 'wor'})})
    };

    go()
    `,
        // ipfsId: "QmT4KeHeR13UuLt9WVK8kKwrLBUYyqw45oEdgngrsBnBa4",
        jsParams: {
          // permissionMwPreDataDigest:
          //   TypedDataUtils.encodeDigest(permissionMwPreData),
          // mintRequestDigest: TypedDataUtils.encodeDigest(mintRequestData),
          recipient,
          profileId,
          essenceId,
          publicKey: LIT_PKP_PUBKEY,
        },
      });

      // if (
      //   !litSignResponse.signatures.mintRequestSig?.signature ||
      //   !litSignResponse.signatures.permissionMwSig?.signature
      // ) {
      //   throw new Error(litSignResponse.response);
      // }

      // const splitMintRequestSig = ethers.utils.splitSignature(
      //   litSignResponse.signatures.mintRequestSig.signature
      // );

      // const splitPermissionMwSig = ethers.utils.splitSignature(
      //   litSignResponse.signatures.permissionMwSig.signature
      // );

      // const writeResponse = await mintWrite({
      //   recklesslySetUnpreparedArgs: [
      //     profileId,
      //     essenceId,
      //     recipient,
      //     litSignResponse.response, // NFT price from signed typed data
      //     ethers.utils.defaultAbiCoder.encode(
      //       ["uint8", "bytes32", "bytes32"],
      //       [
      //         splitMintRequestSig.v,
      //         splitMintRequestSig.r,
      //         splitMintRequestSig.s,
      //       ]
      //     ),
      //     ethers.utils.defaultAbiCoder.encode(
      //       ["uint8", "bytes32", "bytes32", "uint256"],
      //       [
      //         splitPermissionMwSig.v,
      //         splitPermissionMwSig.r,
      //         splitPermissionMwSig.s,
      //         "999999999",
      //       ]
      //     ),
      //   ],
      //   recklesslySetUnpreparedOverrides: {
      //     value: litSignResponse.response,
      //   },
      // });

      // await writeResponse.wait();

      setCurrentProcess(without(currentProcess, ProcessingStage.MINTING));

      return true;
    } catch (e) {
      setCurrentProcess(without(currentProcess, ProcessingStage.MINTING));
      console.error(e);

      return false;
    }
  };

  const mint = (profileId: number, essenceId: number, _recipient = recipient) =>
    _recipient && _mint(_recipient, profileId, essenceId);

  return {
    currentProcess,
    mint,
    mintError,
    isSuccessMint,
  };
};

export default useMintPaidGatedNFT;
