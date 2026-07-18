import { Resend } from "resend";

let client;

export const resend = () => {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
};
