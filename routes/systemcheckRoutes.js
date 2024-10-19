// // ===========================================

// const userRoutes = require("./routes/userRoutes");

// // ===========================================
// // / Get total system memory (in bytes)
// const totalMemory = osSyem.totalmem();

// // Get free system memory (in bytes)
// const freeMemory = osSyem.freemem();

// // Get the number of CPU cores
// const cpuCount = osSyem.cpus().length;

// // Get information about each CPU core
// const cpuDetails = osSyem.cpus();

// // Get system architecture (e.g., x64, arm)
// const architecture = osSyem.arch();

// // Get system platform (e.g., linux, win32, darwin for macOS)
// const platform = osSyem.platform();

// // Get system uptime (in seconds)
// const uptime = osSyem.uptime();

// // Get the hostname
// const hostname = osSyem.hostname();

// // Get the network interfaces
// const networkInterfaces = osSyem.networkInterfaces();
// // Middleware to parse JSON bodies

// const writeOSDetailsToFile = (details) => {
//   // Convert details to a string format
//   const data = `OS Details:\n${JSON.stringify(details, null, 2)}\n\n`;

//   // Append data to the text file
//   fs.appendFile(filePath, data, (err) => {
//     if (err) {
//       console.error("Error writing to file", err);
//     } else {
//       console.log("OS details saved to file");
//     }
//   });
// };

// // Define a GET route and create file
// app.get("/get-os", (req, res) => {
//   // Prepare the OS details object
//   const osDetails = {
//     totalMemory: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
//     freeMemory: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
//     cpuCount,
//     cpuDetails,
//     architecture,
//     platform,
//     uptime: `${(uptime / 3600).toFixed(2)} hours`,
//     hostname,
//     networkInterfaces,
//   };

//   // Write OS details to the text file
//   writeOSDetailsToFile(osDetails);

//   // Send the response back
//   res.json(osDetails);
// });

// //

// // Function to delete the text file
// const deleteFile = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve("File deleted successfully");
//       }
//     });
//   });
// };

// // API to delete the os-details.txt file
// app.delete("/delete-os-file", async (req, res) => {
//   try {
//     const message = await deleteFile(filePath);
//     res.json({ message });
//   } catch (err) {
//     console.error("Error deleting file", err);
//     res.status(500).json({ error: "File could not be deleted" });
//   }
// });

// //
// const data = [
//   { id: 1, name: "Item 1", description: "Description of Item 1" },
//   { id: 2, name: "Item 2", description: "Description of Item 2" },
//   { id: 3, name: "Item 3", description: "Description of Item 3" },
// ];
// // Define the /get-data route
// app.get("/get-data", (req, res) => {
//   // Create an array of objects

//   // Send the array of objects as JSON
//   res.json(data);
// });

// // Define a POST endpoint
// app.post("/data", (req, res) => {
//   const receivedData = req.body;
//   res.json({
//     message: "POST request received!",
//     data: receivedData,
//   });
// });

// // REAL ROUTESS
