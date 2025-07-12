import React from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      justifyContent="center"   
      alignItems="center"
      p={6}
    >
      <VStack
        spacing={6}
        p={10}
        bg="white"
        boxShadow="lg"
        borderRadius="2xl"
        maxW="500px"
        textAlign="center"
      >
        <Heading size="lg" color="teal.600">
          🎉 Registration Successful!
        </Heading>
        <Text fontSize="lg">
          Thank you for registering. We’ve received your details and payment.
        </Text>
        <Text color="gray.500" fontSize="md">
          You will receive event updates on your WhatsApp and email.
        </Text>

        <Button
          colorScheme="teal"
          size="md"
          onClick={() => navigate("/register")}
        >
          Go Back to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default ThankYou;
