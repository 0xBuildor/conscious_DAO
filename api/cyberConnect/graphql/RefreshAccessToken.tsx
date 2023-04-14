import { gql } from "@apollo/client";

export const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken($input: RefreshAccessTokenInput!) {
    refreshAccessToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`;
