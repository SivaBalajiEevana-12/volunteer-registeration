import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const CandidateExport = () => {
  const [data, setData] = useState([]);
  const [filteredCollege, setFilteredCollege] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://vrc-server-110406681774.asia-south1.run.app/api/data")
      .then((res) => res.json())
      .then((candidates) => {
        setData(candidates);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data", err);
        setLoading(false);
      });
  }, []);

  const filteredData = filteredCollege
    ? data.filter((c) => c.college === filteredCollege)
    : data;

  const uniqueColleges = [...new Set(data.map((c) => c.college))];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((row) => ({
        Name: row.name,
        Gender: row.gender,
        College: row.college,
        Phone: row.whatsappNumber,
        PaymentStatus: row.paymentStatus,
        Attendance: row.attendance ? "Yes" : "No",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(file, "candidates.xlsx");
  };

  if (loading)
    return (
      <Spinner size="xl" mt="20" ml="auto" mr="auto" display="block" />
    );

  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="lg">Candidate List</Heading>
        <Button colorScheme="blue" onClick={() => navigate("/admin/attendance")}>
          Go to Attendance
        </Button>
      </Box>

      <Select
        placeholder="Filter by College"
        mb={4}
        onChange={(e) => setFilteredCollege(e.target.value)}
        value={filteredCollege}
      >
        {uniqueColleges.map((college, i) => (
          <option key={i} value={college}>
            {college}
          </option>
        ))}
      </Select>

      <Button colorScheme="teal" mb={4} onClick={exportToExcel}>
        Export to Excel
      </Button>

      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Gender</Th>
            <Th>College</Th>
            <Th>Phone</Th>
            <Th>Payment</Th>
            {/* <Th>Attendance</Th> */}
          </Tr>
        </Thead>
        <Tbody>
          {filteredData.map((candidate, idx) => (
            <Tr key={idx}>
              <Td>{candidate.name}</Td>
              <Td>{candidate.gender}</Td>
              <Td>{candidate.college}</Td>
              <Td>{candidate.whatsappNumber}</Td>
              <Td>{candidate.paymentStatus}</Td>
              {/* <Td>{candidate.attendance ? "✅" : "❌"}</Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CandidateExport;
