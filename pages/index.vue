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
      <ul>
        <li>
          <a href="https://battles.splat.report">battles</a>
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
</script>
