import { createHash } from "crypto";
import cryptoRandomString from "crypto-random-string";
import type { LoginState } from "~~/composables/nso";
import { base64url } from 'rfc4648';


function sha256digestOf(x: string) {
  const sha = createHash("sha256");
  sha.update(x);
  return sha.digest();
}

function toBase64Url(x: string | Buffer): string {
  // using rfc4648 for Cloudflare compatibility
  return base64url.stringify(typeof x === 'string' ? new TextEncoder().encode(x) : x, {pad: false});
}

function generateAuthChallenge() {
  const state = toBase64Url(
    cryptoRandomString({ length: 36, type: "url-safe" }),
  );

  const codeVerifier = toBase64Url(
    cryptoRandomString({ length: 32, type: "url-safe" }),
  );
  const cvHashDigest = sha256digestOf(codeVerifier);

  const codeChallenge = toBase64Url(cvHashDigest);

  return {
    state,
    codeVerifier,
    codeChallenge,
  };
}

export default defineEventHandler((event): LoginState => {
  const challenge = generateAuthChallenge();

  const query = {
    "state": challenge.state,
    "redirect_uri": "npf71b963c1b7b6d119://auth",
    "client_id": "71b963c1b7b6d119",
    "scope": "openid user user.birthday user.mii user.screenName",
    "response_type": "session_token_code",
    "session_token_code_challenge": challenge.codeChallenge,
    "session_token_code_challenge_method": "S256",
    "theme": "login_form",
  };

  const baseUrl = "https://accounts.nintendo.com/connect/1.0.0/authorize";

  const params = new URLSearchParams(query);

  const browserUrl = new URL(baseUrl + "?" + params.toString());

  return {
    loginUrl: browserUrl.toString(),
    codeVerifier: challenge.codeVerifier,
    codeChallenge: challenge.codeChallenge,
    code: "",
    sessionToken: "",
    error: "",
  };
});
