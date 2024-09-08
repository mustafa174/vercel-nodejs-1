const express = require("express");
const cors = require("cors"); // Import the cors package
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors()); // Allows all origins by default

// Define a port
const port = process.env.PORT || 3000;

// Define a GET route
app.get("/", (req, res) => {
  res.send("Hello, World from MUSTAFA");
});
const data = [
  { id: 1, name: "Item 1", description: "Description of Item 1" },
  { id: 2, name: "Item 2", description: "Description of Item 2" },
  { id: 3, name: "Item 3", description: "Description of Item 3" },
];
// Define the /get-data route
app.get("/get-data", (req, res) => {
  // Create an array of objects

  // Send the array of objects as JSON
  res.json(data);
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
