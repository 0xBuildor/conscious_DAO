import { Address } from "wagmi";

export type CCProfile = {
  id: string;
  profileID: number;
  handle: string;
  avatar: string;
  owner: {
    address: Address;
  };
};

export type EligibilityCondition = {
  label: string;
  description?: string;
  condition: (payload?: any) => Promise<boolean>;
};
