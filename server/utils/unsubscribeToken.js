import { createHmac, timingSafeEqual } from "node:crypto";

export const signUnsubscribeToken = (email) =>
  createHmac("sha256", process.env.UNSUBSCRIBE_SECRET)
    .update(email.toLowerCase())
    .digest("hex");

export const verifyUnsubscribeToken = (email, token) => {
  const expected = Buffer.from(signUnsubscribeToken(email));
  const provided = Buffer.from(String(token || ""));
  return expected.length === provided.length && timingSafeEqual(expected, provided);
};
