import hasCCProfile from "@/models/conditions/hasCCProfile";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Eligibility from "./Eligibility";
import MintButton from "./MintButton";

export default function Hero() {
  return (
    <Container maxW={"7xl"}>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column", md: "row" }}
      >
        <Flex
          flex={1}
          justify={"center"}
          align={"center"}
          position={"relative"}
          w={"full"}
        >
          <Box
            position={"relative"}
            height={"500px"}
            rounded={"2xl"}
            boxShadow={"2xl"}
            width={"full"}
            overflow={"hidden"}
          >
            <Image
              alt={"Hero Image"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={"100%"}
              src={"/bg.png"}
            />
          </Box>
        </Flex>
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text as={"span"}>Conscious Turtles</Text>
            <br />
            {/**<Text as={'span'} color={'red.400'}>
                use everywhere!
              </Text>*/}
          </Heading>
          <Text color={"gray.500"}>
            Snippy is a rich coding snippets app that lets you create y<br />
            - Follow ConsciouDAO on Twitter
            <br />- Follow ConsciousDAO on Link3
          </Text>
          {/* just an example */}
          <Eligibility
            conditions={[hasCCProfile]}
            prover={"0x5b3999bc2e8c46f75BF629DA951559D83E34FBdD"}
          />
          <MintButton />
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: "column", sm: "row" }}
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"red"}
              bg={"blue.400"}
              _hover={{ bg: "blue.500" }}
            >
              Connect
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}
