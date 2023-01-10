<template>
  <div>
    <h3>NSO Login</h3>
    <div v-if="state.loginUrl">
      <p>
        Open <NuxtLink :to="state.loginUrl" target="_blank" rel="noopener noreferrer">NSO login</NuxtLink> (and login if
        prompted).<br />
        <strong>Copy</strong> the url of <span class="mx-2 rounded-full py-1 px-4 bg-red-500 text-white font-bold">この人にする</span>("Select this account").
        <img src="~/assets/images/account-login.png" class="border-2 max-w-md mt-4" />
      </p>
      <p>
        Paste the URL.
        <input type="text" v-model="sessionUrl" placeholder="npf71b963c1b7b6d119://auth#..." class="block w-full max-w-lg text-xs p-1" :class="{invalid: sessionUrlError}" />
        <span v-if="sessionUrlError" class="text-red-600">* URL must start with <code class="inline text-red-600">npf71b963c1b7b6d119://auth#...</code></span>
        <span v-else class="opacity-0">_</span>
      </p>
    </div>

    <div>
      <h3>Session Token</h3>
      <button @click="fetchSessionToken" :disabled="!state.code" class="button">Fetch session token</button>
    </div>

    <p v-if="state.error" class="my-1 text-red-600">
      Something wrong. Please reload the page and try again.<br />
      * Login url above cannot be reused.
    </p>

    <div class="float-right">
      <div v-if="!debug"><button @click="debug = true" class="rounded-md border border-slate-300 hover:bg-slate-100 px-2">show state</button></div>
      <div v-else="debug">
        <code>{{ JSON.stringify(state, null, 2) }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.invalid {
  @apply border-pink-500 text-pink-500 ring-0;
}

.button {
  @apply rounded-md ring-0 text-white font-bold bg-indigo-500 hover:bg-indigo-600 hover:text-slate-100 hover:cursor-pointer;
  @apply disabled:bg-indigo-300 disabled:hover:bg-indigo-400 disabled:hover:cursor-default;
  @apply py-1 px-2;
}

code {
  @apply max-w-lg overflow-scroll;
}
</style>


<script setup lang="ts">
const emit = defineEmits<{
  (e: 'token', value: string): void;
}>();

const debug = ref(false);

const sessionUrlError = computed(() => {
  return sessionUrl.value && !state.code;
});

const sessionUrl = ref('');
watch(sessionUrl, url => {
  setSessionTokenCodeFromUrl(url);
});

const { state, startLogin, setSessionTokenCodeFromUrl, fetchSessionToken } = useLoginFlow();

startLogin();

watch(toRef(state, 'sessionToken'), token => {
  emit('token', token);
});
</script>
