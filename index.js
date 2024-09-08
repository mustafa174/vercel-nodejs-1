const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a port
const port = process.env.PORT || 3000;

// Define a GET route
app.get("/", (req, res) => {
  res.send("Hello, World from MUSTAFA");
});

// Define the /get-data route
app.get("/get-data", (req, res) => {
  res.send("Hello, World from MUSTAFA");
});

// Define a POST endpoint
app.post("/data", (req, res) => {
  const receivedData = req.body;
  res.json({
    message: "POST request received!",
    data: receivedData,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
