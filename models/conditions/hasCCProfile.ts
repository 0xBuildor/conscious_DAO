import { Address } from "wagmi";
import { apolloClient } from "../../api/cyberConnect/client";
import { PRIMARY_PROFILE } from "../../api/cyberConnect/graphql/PrimaryProfile";
import { EligibilityCondition } from "../../types";

export const hasCCProfile: EligibilityCondition = {
  label: "Has CCProfile",
  condition: (profileOwner: Address) =>
    new Promise((res, rej) => {
      apolloClient
        .query({
          query: PRIMARY_PROFILE,
          variables: { address: profileOwner },
        })
        .then((response) =>
          response.data?.address?.wallet?.primaryProfile?.id
            ? res(true)
            : res(false)
        )
        .catch(rej);
    }),
};

export default hasCCProfile;
