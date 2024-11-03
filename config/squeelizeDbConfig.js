// db.js
import Client from "pg";

export const connectToDatabase = async () => {
  const client = new Client({
    user: "mustafaadmin", // Your database username
    host: "localhost", // Your database host (usually localhost)
    database: "glambeautyData", // Your database name
    password: "zmaim1122", // Your database password
    port: 5432, // Your database port (default is 5432 for PostgreSQL)
  });

  try {
    // Connect to the PostgreSQL database
    await client.connect();
    console.log("Connected to PostgreSQL database successfully.");

    // You can execute queries here if needed
    // const res = await client.query('SELECT NOW()');
    // console.log(res.rows[0]);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close the connection when done
    await client.end();
  }
};
