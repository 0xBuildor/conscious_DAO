import { EligibilityCondition } from "@/types";
import { without } from "lodash";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { Address } from "wagmi";

export interface IPreMintContext {
  eligibilityConditions: EligibilityCondition[] | undefined;
  eligibleConditions: EligibilityCondition[] | undefined;
  isEligible: boolean | undefined;
}

export const preMintContext = createContext<IPreMintContext | null>(null);

export type ProviderProps = {
  recipient: Address;
  eligibilityConditions: EligibilityCondition[];
};

export const PreMintProvider: React.FC<PropsWithChildren & ProviderProps> = ({
  children,
  recipient,
  eligibilityConditions,
}) => {
  const [eligibleConditions, setEligibleConditions] =
    useState<EligibilityCondition[]>();
  const [isEligible, setIsEligible] = useState<boolean>();

  useEffect(() => {
    recipient &&
      eligibilityConditions?.length &&
      (setIsEligible(undefined),
      checkEligibility(recipient, eligibilityConditions));
  }, [recipient, eligibilityConditions]);

  const checkEligibility = (
    recipient: Address,
    conditions: EligibilityCondition[]
  ) =>
    Promise.all(
      conditions.map((condition) =>
        condition
          .condition(recipient)
          .then(
            (isEligible) => (
              setEligibleConditions(
                isEligible
                  ? [...eligibilityConditions, condition]
                  : without(eligibilityConditions, condition)
              ),
              isEligible
            )
          )
          .catch(console.error)
      )
    ).then((results) => setIsEligible(!results.includes(false)));

  return (
    <preMintContext.Provider
      value={{ eligibilityConditions, eligibleConditions, isEligible }}
    >
      {children}
    </preMintContext.Provider>
  );
};

export default PreMintProvider;
