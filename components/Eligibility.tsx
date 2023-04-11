import { EligibilityCondition } from "@/types";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const Eligibility = ({
  conditions,
  prover,
}: {
  conditions: EligibilityCondition[];
  prover: any;
}) => {
  const [eligibileConditions, setEligibileConditions] = useState<
    EligibilityCondition[]
  >([]);

  useEffect(() => {
    conditions && checkEligibility(conditions);
  }, [conditions]);

  const checkEligibility = (conditions: EligibilityCondition[]) =>
    conditions.map((condition) =>
      condition
        .condition(prover)
        .then(
          (isEligible) => (
            isEligible &&
              setEligibileConditions([...eligibileConditions, condition]),
            isEligible
          )
        )
    );

  return (
    conditions && (
      <Flex direction={"column"} gap="small">
        {conditions.map((condition) => (
          <Flex gap=".5rem" alignItems={"center"}>
            <CheckCircleIcon
              color={eligibileConditions.includes(condition) ? "green" : "grey"}
            />
            <Text fontWeight={"semibold"}>{condition.label}</Text>
          </Flex>
        ))}
      </Flex>
    )
  );
};

export default Eligibility;
