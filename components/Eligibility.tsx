import { IPreMintContext, preMintContext } from "@/store/PreMint";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import { useContext } from "react";

export const Eligibility = () => {
  const { eligibilityConditions, eligibleConditions } = useContext(
    preMintContext
  ) as IPreMintContext;

  return eligibilityConditions ? (
    <Flex direction={"column"} gap="small">
      {eligibilityConditions.map((condition) => (
        <Flex gap=".5rem" alignItems={"center"}>
          <CheckCircleIcon
            color={eligibleConditions?.includes(condition) ? "green" : "grey"}
          />
          <Text fontWeight={"semibold"}>{condition.label}</Text>
        </Flex>
      ))}
    </Flex>
  ) : (
    <></>
  );
};

export default Eligibility;
