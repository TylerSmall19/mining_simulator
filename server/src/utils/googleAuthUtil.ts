import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();
export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const userid = payload && payload['sub'];
  return { userid, payload };
}