<template>
  <div class="mb-28">
    <article class="prose">
      <h1>Splat Session Token</h1>
    </article>
    <article class="prose">
      <LoginFlow @token="callback" />

      <p class="my-12 max-w-lg" :class="{'opacity-30': !sessionToken}">
        <h3>Your session token</h3>
        <span class="float-right">
          <span v-if="!copied" class="material-symbols-outlined opacity-50 hover:cursor-pointer hover:opacity-100"
            @click="copyToken">content_copy</span>
          <span v-else class="text-xs text-green-800 pl-1 opacity-80">Copied</span>
        </span>
        <code class="select-all py-2" ref="sessionTokenElem">{{ sessionToken }}</code>
      </p>
    </article>

    <article class="prose">
      <h3>Sites</h3>
      <p class="text-slate-500 ml-4">
        <div class="text-purple-500"><span>?sessionToken=</span><input v-model="sessionToken" type="text" class="text-xs p-0" /></div>
        <div v-if="sessionToken">
          Your session token is attached to URLs below.<br />
          You should not share the URLs with others, but bookmark them if you would like to access easily next time for your own use 👍
        </div>
      </p>
      <ul>
        <li>
          <a :href="withSessionTokenQuery('https://battles.splat.report/x-battles')" target="_blank">battles.splat.report/x-battles<span v-if="sessionToken" class="opacity-50">?sessionToken=...</span> <span class="!text-[1rem] material-symbols-outlined"
            @click="copyToken">tab</span></a>
        </li>
      </ul>
    </article>
  </div>
</template>

<style scoped>
code {
  @apply max-w-lg overflow-scroll;
}
</style>

<script setup lang="ts">
useHead({
  title: "Splat Session Token",
});

const sessionTokenElem = ref<HTMLElement | null>(null);
const copied = ref(false);

const sessionToken = ref('');

function callback(token: string) {
  sessionToken.value = token;
}

async function copyToken() {
  await navigator.clipboard.writeText(sessionToken.value);
  copied.value = true;

  const elem = sessionTokenElem.value;
  if (elem) {
    document.getSelection()?.setBaseAndExtent(elem, 0, elem, elem.childNodes.length)
  }
}

function withSessionTokenQuery(url: string) {
  const token = sessionToken.value;
  if (!token) {
    return url;
  }
  const u = new URL(url);
  u.searchParams.set('sessionToken', token);
  return u.toString();
}
</script>
