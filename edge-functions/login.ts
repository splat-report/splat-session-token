import type { Context } from "https://edge.netlify.com";
import type { LoginState } from "../composables/nso.ts";
import { base64url } from 'https://esm.sh/rfc4648';



const textEncoder = new TextEncoder();

export default async function(request: Request, context: Context) {
  const data = await makeState();
  return Response.json(data);
}


async function sha256digestOf(x: string) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', textEncoder.encode(x));
  return new Uint8Array(hashBuffer);
}

function toBase64Url(x: string | Uint8Array): string {
  if (typeof x === 'string') {
    return base64url.stringify(textEncoder.encode(x), {pad:false});
  }
  return base64url.stringify(x, {pad: false});
}

async function generateAuthChallenge() {
  const state = toBase64Url(crypto.randomUUID());
  const codeVerifier = toBase64Url(crypto.randomUUID());

  const cvHashDigest = await sha256digestOf(codeVerifier);

  const codeChallenge = toBase64Url(cvHashDigest);

  return {
    state,
    codeVerifier,
    codeChallenge,
  };
}

async function makeState(): Promise<LoginState> {
  const challenge = await generateAuthChallenge();

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
}
