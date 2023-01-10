import type { Context } from "https://edge.netlify.com";
import type { LoginState } from "../composables/nso.ts";

const IS_DEV = Deno.env.get("NETLIFY_DEV") === "true";

const NSO_APP_VERSION = "2.4.0";

export default async function (request: Request, context: Context) {
  const { code, codeVerifier } = await request.json();

  try {
    const sessionToken = await getToken(code, codeVerifier);
    return Response.json({
      sessionToken,
    });
  } catch (error) {
    if (IS_DEV) {
      console.error(error);
    }
    return Response.json({error: '' + error});
  }
}

async function getToken(
  code: string,
  codeVerifier: string,
): Promise<LoginState["sessionToken"]> {
  if (!code) {
    throw new Error("parameter [code] is missing");
  }
  if (!codeVerifier) {
    throw new Error("parameter [codeVerifier] is missing");
  }

  const appVersion = NSO_APP_VERSION;

  const headers = {
    "User-Agent": "OnlineLounge/" + appVersion + " NASDKAPI Android",
    "Accept-Language": "en-US",
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const query = {
    "client_id": "71b963c1b7b6d119",
    "session_token_code": code,
    "session_token_code_verifier": codeVerifier,
  };

  const url = "https://accounts.nintendo.com/connect/1.0.0/api/session_token";

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: new URLSearchParams(query).toString(),
  });

  const data = await response.json();
  if (response.status !== 200 || data.error) {
    throw new Error(data);
  }

  const sessionToken = data["session_token"];
  if (!sessionToken) {
    throw new Error("No session token returned");
  }

  return sessionToken;
}
