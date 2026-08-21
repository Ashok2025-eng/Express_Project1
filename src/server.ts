import http from "http";
import app from "./app";
import connectDataBase from "./config/db.config";
const PORT = 8080;
const DB_URI = "mongodb://localhost:27017/my_project";

//* connect database
connectDataBase(DB_URI);

//* http server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost${PORT}`);
});
