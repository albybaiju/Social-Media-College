import React from 'react'
import {
          Box,
          Button,
          Card,
          CardContent,
          IconButton,
          Paper,
          Stack,
          Table,
          TableBody,
          TableCell,
          TableContainer,
          TableHead,
          TableRow,
          TextField,
          Typography,
        } from "@mui/material";
        import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

const AddSections = () => {
  return (
          <Box className="box" component="form" >
          <Card elevation={2} className="card">
            <div>
              <Typography variant="h3" className="aad">
                Add College Sections
              </Typography>
              <CardContent>
                <Stack spacing={2} direction="column">
                  <TextField
                    id="outlined-basic"
                    label="place"
                    variant="outlined"
                  />
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                </Stack>
              </CardContent>
            </div>
          </Card>
    
          </Box>
     
  )
}

export default AddSections