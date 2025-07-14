import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, VStack, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ThankYou = () => {
  const { id } = useParams(); // Get payment ID from URL
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | invalid | error
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(`/api/verify-payment/${id}`);
        if (res.data.success) {
          setCandidate(res.data.candidate);
          setStatus("success");
        } else {
          setStatus("invalid");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [id]);

  const renderContent = () => {
    if (status === "loading") {
      return <Spinner size="xl" color="teal.500" />;
    }

    if (status === "invalid") {
      return (
        <>
          <Heading size="lg" color="red.500">Invalid Payment</Heading>
          <Text>This payment ID is not valid or doesn't match any registration.</Text>
        </>
      );
    }

    if (status === "error") {
      return (
        <>
          <Heading size="lg" color="orange.500">Server Error</Heading>
          <Text>Something went wrong while verifying your payment. Please try again later.</Text>
        </>
      );
    }

    return (
      <>
        <Heading size="lg" color="teal.600">
          🎉 Registration Successful!
        </Heading>
        <Text fontSize="lg">
          Thank you, {candidate.name}. We’ve received your details and payment.
        </Text>
        <Text color="gray.500" fontSize="md">
          Payment ID: {candidate.paymentId}
        </Text>
        <Text color="gray.500" fontSize="md">
          Amount Paid: ₹{candidate.paymentAmount}
        </Text>
        <Text color="gray.500" fontSize="md">
          You’ll receive event updates on WhatsApp and email.
        </Text>
      </>
    );
  };

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
        {renderContent()}

        <Button
          colorScheme="teal"
          size="md"
          onClick={() => navigate("/")}
        >
          Go Back to Home
        </Button>
      </VStack>
    </Box>
  );
};

export default ThankYou;
