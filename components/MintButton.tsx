import useMintPaidGatedNFT, {
  ProcessingStage,
} from "@/models/cyberConnect/useMintPaidGatedNFT";
import { IPreMintContext, preMintContext } from "@/store/PreMint";
import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { Address } from "wagmi";

export const MintButton = ({
  recipient,
  profileId,
  essenceId,
}: {
  recipient: Address;
  profileId: number;
  essenceId: number;
}) => {
  const { mint, currentProcess: mintingProcess } = useMintPaidGatedNFT({
    recipient,
  });
  const { isEligible } = useContext(preMintContext) as IPreMintContext;

  const onMintButtonClick = async () => {
    isEligible && mint(profileId, essenceId);
  };

  return (
    <Button
      onClick={onMintButtonClick}
      isDisabled={!isEligible}
      isLoading={mintingProcess.includes(ProcessingStage.MINTING)}
    >
      Mint
    </Button>
  );
};

export default MintButton;
