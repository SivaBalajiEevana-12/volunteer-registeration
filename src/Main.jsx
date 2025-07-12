import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  RadioGroup,
  Radio,
  Stack,
  Select as ChakraSelect,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import Select from "react-select";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Main = () => {
  const toast = useToast();
    const navigate = useNavigate();
  const [collegeOptions, setCollegeOptions] = useState([]);

  const [formData, setFormData] = useState({
    serialNo: "",
    name: "",
    whatsappNumber: "",
    email: "",
    gender: "",
    dayScholarOrHostler: "",
    areaOfResidence: "",
    collegeName: "",
    course: "",
    year: "",
    dob: "",
    amount: "9900", // ₹99.00
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get("https://vrc-server-110406681774.asia-south1.run.app/college"); // Replace with actual URL
        const options = res.data.map((college) => ({
          label: college.name,
          value: college.name,
        }));
        setCollegeOptions(options);
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
      }
    };

    fetchColleges();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, whatsappNumber, email, gender, dayScholarOrHostler, areaOfResidence, collegeName, course, year, dob } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(whatsappNumber.replace(/\D/g, ""))) {
      newErrors.whatsappNumber = "Enter a valid 10-digit number";
    }
    if (!email.trim()) newErrors.email = "Email is required";
    if (!gender) newErrors.gender = "Please select gender";
    if (!dayScholarOrHostler) {
      newErrors.dayScholarOrHostler = "Select day scholar or hostler";
    }
    if (dayScholarOrHostler === "dayscholar" && !areaOfResidence.trim()) {
      newErrors.areaOfResidence = "Area of residence is required";
    }
    if (!collegeName.trim()) newErrors.collegeName = "College name is required";
    if (!course.trim()) newErrors.course = "Course is required";
    if (!year) newErrors.year = "Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      const orderRes = await fetch("https://vrc-server-110406681774.asia-south1.run.app/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseInt(formData.amount) }),
      });

      const orderData = await orderRes.json();
      if (!orderData.id) throw new Error("Order creation failed");

      const options = {
        key: "rzp_test_kC99JKxEFoZUns",
        amount: orderData.amount,
        currency: "INR",
        name: "Event Registration",
        description: "Registration Fee",
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch("https://vrc-server-110406681774.asia-south1.run.app/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                formData: {
                  ...formData,
                  paymentMethod: "Online",
                  receipt: `receipt_${Date.now()}`,
                },
              }),
            });

            const result = await verifyRes.json();

            if (result.status === "success") {
              navigate('/thankyou');
              toast({
                title: "Registration successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              
              setFormData({
                serialNo: "",
                name: "",
                whatsappNumber: "",
                email: "",
                gender: "",
                dayScholarOrHostler: "",
                areaOfResidence: "",
                collegeName: "",
                course: "",
                year: "",
                dob: "",
                amount: "9900",
              });
              
            } else {
              throw new Error(result.message);
            }
          } catch (err) {
            toast({
              title: "Payment verification failed",
              description: err.message || "Try again later",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: `91${formData.whatsappNumber}`,
        },
        theme: { color: "#0a9396" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast({
        title: "Payment failed",
        description: err.message || "Try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <Heading size="lg" mb={4}>Registration Form</Heading>

      <FormControl isInvalid={!!errors.name} mb={4}>
        <FormLabel>Name</FormLabel>
        <Input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.dob} mb={4}>
        <FormLabel>Date of Birth</FormLabel>
        <Input type="date" value={formData.dob} onChange={(e) => handleInputChange("dob", e.target.value)} />
        <FormErrorMessage>{errors.dob}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.whatsappNumber} mb={4}>
        <FormLabel>WhatsApp Number</FormLabel>
        <Input type="tel" value={formData.whatsappNumber} onChange={(e) => handleInputChange("whatsappNumber", e.target.value)} />
        <FormErrorMessage>{errors.whatsappNumber}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.email} mb={4}>
        <FormLabel>Email</FormLabel>
        <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
        <FormErrorMessage>{errors.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.gender} mb={4}>
        <FormLabel>Gender</FormLabel>
        <RadioGroup value={formData.gender} onChange={(val) => handleInputChange("gender", val)}>
          <Stack direction="row">
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
            <Radio value="Other">Other</Radio>
          </Stack>
        </RadioGroup>
        <FormErrorMessage>{errors.gender}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.dayScholarOrHostler} mb={4}>
        <FormLabel>Day Scholar / Hostler</FormLabel>
        <ChakraSelect value={formData.dayScholarOrHostler} onChange={(e) => handleInputChange("dayScholarOrHostler", e.target.value)}>
          <option value="">--Select--</option>
          <option value="dayscholar">Day Scholar</option>
          <option value="hostler">Hostler</option>
        </ChakraSelect>
        <FormErrorMessage>{errors.dayScholarOrHostler}</FormErrorMessage>
      </FormControl>

      {formData.dayScholarOrHostler === "dayscholar" && (
        <FormControl isInvalid={!!errors.areaOfResidence} mb={4}>
          <FormLabel>Area of Residence</FormLabel>
          <Input value={formData.areaOfResidence} onChange={(e) => handleInputChange("areaOfResidence", e.target.value)} />
          <FormErrorMessage>{errors.areaOfResidence}</FormErrorMessage>
        </FormControl>
      )}

      <FormControl isInvalid={!!errors.collegeName} mb={4}>
        <FormLabel>College Name</FormLabel>
        <Select
          options={collegeOptions}
          value={collegeOptions.find((opt) => opt.value === formData.collegeName)}
          onChange={(option) => handleInputChange("collegeName", option?.value || "")}
          placeholder="Select or search college"
          isClearable
        />
        <FormErrorMessage>{errors.collegeName}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.course} mb={4}>
        <FormLabel>Course</FormLabel>
        <Input value={formData.course} onChange={(e) => handleInputChange("course", e.target.value)} />
        <FormErrorMessage>{errors.course}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.year} mb={4}>
        <FormLabel>Year</FormLabel>
        <ChakraSelect value={formData.year} onChange={(e) => handleInputChange("year", e.target.value)}>
          <option value="">--Select Year--</option>
          <option value="1">1st</option>
          <option value="2">2nd</option>
          <option value="3">3rd</option>
          <option value="4">4th</option>
        </ChakraSelect>
        <FormErrorMessage>{errors.year}</FormErrorMessage>
      </FormControl>

      <Text fontSize="xl" fontWeight="bold" mt={4}>Fee: ₹99.00</Text>

      <Button mt={6} colorScheme="teal" onClick={handlePayment}>Pay & Register</Button>
    </Box>
  );
};

export default Main;
