// zootols API - https://zootools.notion.site/ZooTools-API-v-1-BETA-f630964dc4924b3a939cfd382935d196

import { Address } from "wagmi";
import { EligibilityCondition } from "../../types";

const ZOOTOOLS_LIST_ID = "MmgAXFwxoCnON7jLBQcx";

export const followsTwitterDiscord: EligibilityCondition = {
  label: "Following Twitter/Discord",
  condition: (profileOwner: Address) =>
    new Promise((res, rej) => {
      fetch(
        `https://audience-consumer-api.zootools.co/lists/${ZOOTOOLS_LIST_ID}/members/search`,
        {
          method: "post",
          body: `{"cryptoAddress": "${profileOwner}"}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_ZOOTOOLS_API_KEY!,
          },
        }
      )
        .then((body) => body.json())
        .then((data) =>
          res(
            data?.goals &&
              Object.keys(data?.goals as object)
                ?.map(
                  (goalId) =>
                    data?.goals[goalId]?.connect_twitter?.status == "completed"
                )
                .includes(true)
          )
        )
        .catch(rej);
    }),
};

export default followsTwitterDiscord;
