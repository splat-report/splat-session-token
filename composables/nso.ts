export type LoginState = {
  loginUrl: string;
  codeVerifier: string;
  codeChallenge: string;
  code: string;
  sessionToken: string;
  error: string;
};

const _state = reactive<LoginState>({
  loginUrl: "",
  codeVerifier: "",
  codeChallenge: "",
  code: "",
  sessionToken: "",
  error: "",
});


export function useLoginFlow() {
  return {
    state: _state,
    startLogin: startLogin(_state),
    setSessionTokenCodeFromUrl: setSessionTokenCodeFromUrl(_state),
    fetchSessionToken: fetchSessionToken(_state),
  };
}

const startLogin = (state: LoginState) => async () => {
  const { data } = await useFetch<LoginState>("/api/login");

  state.loginUrl = data.value?.loginUrl || "";
  state.codeVerifier = data.value?.codeVerifier || "";
  state.codeChallenge = data.value?.codeChallenge || "";
};

const setSessionTokenCodeFromUrl =
  (state: LoginState) => (sessionUrl: string) => {
    const code = extractSessionTokenCodeFromUrl(sessionUrl);
    state.code = code || "";
    const success = !!code;
    return success;
  };

function extractSessionTokenCodeFromUrl(sessionUrl: string) {
  const m = /(\?|&)session_token_code=([^&]+)(&|$)/.exec(sessionUrl);

  if (!m) {
    return null;
  }

  const code = m[2];

  return code;
}

const fetchSessionToken = (state: LoginState) => async () => {
  state.error = "";
  const { data, error } = await useFetch<LoginState>("/api/login", {
    method: "POST",
    body: state,
  });

  state.sessionToken = data.value?.sessionToken || "";
  state.error = error.value ? "" + error.value : "";
};
