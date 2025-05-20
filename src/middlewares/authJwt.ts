import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
  audience: `${process.env.SERVER_URL}/chat`,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  tokenSigningAlg: "RS256",
});

export default jwtCheck;
