<script setup lang="ts">
  useHead({
    title: "Bubble | Login",
  });

  const supabase = useSupabaseClient();
  const alertStore = useAlertStore();

  const email = ref("");
  const pass = ref("");

  async function logInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: pass.value });
    if (error) {
      alertStore.msg = "Either your email or password is incorrect.";
      alertStore.type = "error";
      alertStore.timesShown++;
      throw error;
    }

    navigateTo("/confirm");
  }
</script>

<template>
  <main class="flex h-fullscreen w-screen items-center justify-center">
    <div class="flex w-1/3 flex-col items-center rounded-lg bg-shark-950 px-2 py-2">
      <h1 class="border-b-[3px] border-b-snow/15 bg-gradient-to-r from-snow to-aero-100 to-65% bg-clip-text px-4 font-mono text-7xl font-black uppercase text-transparent">Log in</h1>
      <section class="mt-4 flex w-full flex-col items-center space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
        <input v-model="pass" type="password" placeholder="Password" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
      </section>
      <p class="my-1">New to Bubble? Click <NuxtLink to="/signup" class="underline transition-colors duration-100 ease-linear hover:text-aero-200">here</NuxtLink> to sign up!</p>
      <button @click="logInWithEmail" :disabled="email === '' || pass === ''" class="rounded-md border border-snow/85 px-4 py-1 text-xl transition-all duration-200 ease-out enabled:hover:border-aero-200/85 enabled:hover:text-aero-400 enabled:hover:drop-shadow-[0_4px_3px_rgba(158,252,207,0.1)] disabled:cursor-not-allowed disabled:opacity-60">Login</button>
    </div>
  </main>
</template>

<style scoped>
  main {
    background-color: #201e1f;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
