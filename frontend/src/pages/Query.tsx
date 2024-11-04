import { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { GetRequest, PostRequest } from "../utils/ApiManager";
import { Header } from "../components/Header/Header";

export const Query = () => {
  const [selectedQuery, setSelectedQuery] = useState("");
  const [data, setData] = useState<{ [key: string]: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);

  const queries = [
    { value: "1", label: "1. Sections of first chapter of textbooks" },
    { value: "2", label: "2. Faculty and Ta of all courses" },
    { value: "3", label: "3. Active courses" },
    { value: "4", label: "4. Largest waiting list" },
    { value: "5", label: "5. Contents of Chapter02, Textbook 101" },
    { value: "6", label: "6. Icorrect answers of Q2 Activity0" },
    { value: "7", label: "7. Book with active and inactive status" },
  ];

  const handleSelectQuery = (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;
    setSelectedQuery(selectedValue);

    if (selectedValue != 5) {
      fetchData(selectedValue);
    }
  };

  const fetchData = async (option: any) => {
    setLoading(true);
    const response: { [key: string]: string }[] = await GetRequest(
      "/common/get_query_data/" + "" + option
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
    });
    console.log(response);
    if (response.length > 0) {
      const headers = Object.keys(response[0]);
      setHeaders(headers);
      setData(response);
    } else {
      setData([]);
    }
    setLoading(false);
  };

  return (
    <>
      <Box p={3}>
        <FormControl fullWidth>
          <InputLabel>Select an Option</InputLabel>
          <Select
            value={selectedQuery}
            onChange={handleSelectQuery}
            label="Select an Option"
          >
            {queries.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedQuery === "5" ? (
          <Typography variant="h5">View the app for this query</Typography>
        ) : loading ? (
          <Box mt={3} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : data.length > 0 ? (
          <Table sx={{ mt: 3 }} aria-label="data table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header}>{item[header]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          selectedQuery && (
            <Typography mt={3} variant="body1" color="textSecondary">
              No data available
            </Typography>
          )
        )}
      </Box>
    </>
  );
};
