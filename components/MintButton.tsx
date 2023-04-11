import useMintPaidGatedNFT, {
  ProcessingStage,
} from "@/models/cyberConnect/useMintPaidGatedNFT";
import { EligibilityCondition } from "@/types";
import { Button } from "@chakra-ui/react";
import { Address } from "wagmi";

export const MintButton = (
  recipient: Address,
  profileId: number,
  essenceId: number,
  eligibilityConditions: EligibilityCondition[]
) => {
  const {
    mint,
    currentProcess: mintingProcess,
    isEligible,
  } = useMintPaidGatedNFT({
    recipient,
    eligibilityConditions,
  });
  const canMint = recipient && isEligible;

  const onMintButtonClick = () => {
    mint(profileId, essenceId);
  };

  return (
    <Button
      onClick={onMintButtonClick}
      isDisabled={!canMint}
      isLoading={mintingProcess.includes(ProcessingStage.CHECKING_ELIGIBILITY)}
    >
      Mint
    </Button>
  );
};

export default MintButton;
