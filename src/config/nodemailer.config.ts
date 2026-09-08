import nodemailer from "nodemailer";
import dns from "node:dns"; // 1. Import Node's DNS module
import ENV_CONFIG from "./env.config";

// 2. Force Node.js to resolve IPv4 addresses first (fixes Render ENETUNREACH network crash)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: ENV_CONFIG.SMTP_HOST,
  service: ENV_CONFIG.SMTP_SERVICE,
  port: ENV_CONFIG.SMTP_PORT,
  secure: ENV_CONFIG.SMTP_PORT === 465,
  auth: {
    user: ENV_CONFIG.SMTP_USER,
    pass: ENV_CONFIG.SMTP_PASS,
  },
  // 3. Optional timeout protections to keep connections from stalling
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
});

export const verifySmtpConnection = async () => {
  try {
    await transporter.verify();
    console.log("server is ready to send email");
  } catch (error) {
    console.log("🚨 SMTP Verification Failed:", error);
  }
};

export default transporter;
