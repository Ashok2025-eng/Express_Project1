import "dotenv/config";
import http from "http";

import app from "./app";
import connectDataBase from "./config/db.config";
import ENV_CONFIG from "./config/env.config";
import { verifySmtpConnection } from "./config/nodemailer.config";
import dns from "node:dns";

// 🚀 THE FIX: Force Node to prioritize IPv4 addresses over broken IPv6 networks
dns.setDefaultResultOrder("ipv4first");

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;

//* connect database
connectDataBase(DB_URI);

//* http server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost${PORT}`);
  verifySmtpConnection();
});
