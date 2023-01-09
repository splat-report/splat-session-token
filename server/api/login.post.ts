const NSO_APP_VERSION = "2.4.0";

export default defineEventHandler(async (event) => {
  const { code, codeVerifier } = await readBody<
    { code: string; codeVerifier: string }
  >(event);
  if (!code) {
    return Response.json("parameter [code] is missing", { status: 400 });
  }
  if (!codeVerifier) {
    return Response.json("parameter [codeVerifier] is missing", {
      status: 400,
    });
  }

  const appVersion = await getNSOAppVersion();

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

  return {
    sessionToken,
  };
});

async function getNSOAppVersion() {
  return NSO_APP_VERSION;
}
