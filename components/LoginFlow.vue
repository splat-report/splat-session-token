<template>
  <div>
    <h3>NSO Login</h3>
    <div v-if="state.loginUrl">
      <p>
        Open <NuxtLink :to="state.loginUrl" target="_blank" rel="noopener noreferrer">NSO login</NuxtLink> (and login if
        prompted).<br />
        <strong>Copy</strong> the url of 「この人にする」("Select this account").<br />
        (URL starts with <code class="inline">npf71b963c1b7b6d119://auth#...</code>)
        <img src="~/assets/images/account-login.png" class="border-2 max-w-md" />
      </p>
      <p>
        Paste the URL.
        <input type="text" v-model="sessionUrl" placeholder="npf71b963c1b7b6d119://auth#..." class="block w-full max-w-lg text-xs p-1" :class="{invalid: sessionUrlError}" />
      </p>
    </div>

    <div>
      <button @click="fetchSessionToken" :disabled="!state.code">Fetch session token</button>
    </div>

    <p v-if="state.error" class="my-1 text-red-600">
      Something wrong. Please reload the page and try again.<br />
      * Login url above cannot be reused.
    </p>

    <hr />
    <div class="opacity-20 hover:opacity-100">
      <code>{{ JSON.stringify(state, null, 2) }}</code>
    </div>
  </div>
</template>

<style scoped>
.invalid {
  @apply border-pink-500 text-pink-500 ring-0;
}

button {
  @apply rounded-md ring-0 text-white font-bold bg-indigo-500 hover:bg-indigo-600 hover:text-slate-100 hover:cursor-pointer;
  @apply disabled:bg-indigo-300 disabled:hover:bg-indigo-400 disabled:hover:cursor-default;
  @apply py-1 px-2
}

code {
  @apply max-w-lg overflow-scroll;
}
</style>


<script setup lang="ts">
const emit = defineEmits<{
  (e: 'token', value: string): void;
}>();

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
