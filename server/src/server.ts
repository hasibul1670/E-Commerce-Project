import app from "./app";
import { connectDB } from "./config/db";
import { serverPort } from "./secret";
 


app.listen(serverPort,async() => {
  console.log(`Server is running at http://localhost:${serverPort}`);
 await connectDB();
});
