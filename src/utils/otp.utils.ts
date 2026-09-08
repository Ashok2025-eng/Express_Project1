import crypto from "crypto";

export const createHash = (text: string) => {
  return crypto.createHash("sha512").update(text).digest("hex");
};

//* generate otp
export const generateOtp = (length: number = 6, expiryMin = 15) => {
  let otp = "";
  for (let i = 1; i <= length; i++) {
    const int = crypto.randomInt(10);
    otp += String(int);
  }
  const hash = createHash(otp);
  return {
    otp,
    hash,
    expiry: new Date(Date.now() + 15 * 60 * 1000),
  };
};
