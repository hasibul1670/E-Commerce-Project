import app from "./app";
import config, { serverPort } from "./config";
import { connectDB } from "./config/db";



const port = config.port;
app.listen(serverPort, async () => {
  console.log(`Server is running at http://localhost:${serverPort}`);
  await connectDB();
});
