<script setup lang="ts">
  useHead({
    title: "Bubble | Sign up",
  });

  import { createAvatar } from "@dicebear/core";
  import { bottts } from "@dicebear/collection";

  const supabase = useSupabaseClient();
  const alertStore = useAlertStore();

  const email = ref("");
  const pass = ref("");
  const confirmPass = ref("");
  const firstName = ref("");
  const lastName = ref("");

  const username = ref("");
  const birthday = ref("");

  const screenTwo = ref(false);

  async function nextPage() {
    if (pass.value.length < 6) {
      alertStore.msg = "Your password must be at least 6 characters.";
      alertStore.type = "error";
      alertStore.timesShown++;
      return;
    } else if (pass.value != confirmPass.value) {
      alertStore.msg = "Your passwords do not match.";
      alertStore.type = "error";
      alertStore.timesShown++;
      return;
    } else screenTwo.value = true;
  }

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({ email: email.value, password: pass.value });
    if (error) throw error;
    //@ts-expect-error
    else newUser(data.user?.id);
  }

  async function newUser(uuid: string) {
    let avatar = createAvatar(bottts, { size: 64, seed: uuid }).toDataUriSync();
    let fullName = firstName.value + " " + lastName.value;
    //@ts-expect-error
    const { error } = await supabase.from("users").insert({ user_id: uuid, full_name: fullName, pfp: avatar, username: username.value, birthday: birthday.value });
    if (error) throw error;
    else navigateTo("/login");
  }
</script>

<template>
  <main class="flex h-fullscreen w-screen items-center justify-center">
    <div class="flex w-1/3 flex-col items-center rounded-lg bg-shark-950 px-2 py-2">
      <h1 class="border-b-[3px] border-b-snow/15 bg-gradient-to-r from-snow to-aero-100 to-65% bg-clip-text px-4 font-mono text-7xl font-black uppercase text-transparent">Sign up</h1>
      <div v-if="!screenTwo" class="w-full">
        <section class="mt-4 flex w-full flex-col items-center space-y-4">
          <input v-model="email" type="email" placeholder="Email" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
          <input v-model="pass" type="password" placeholder="Password" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
          <input v-model="confirmPass" type="password" placeholder="Confirm Password" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
        </section>
        <section class="mt-4 flex w-full justify-center space-x-4">
          <button @click="nextPage" :disabled="email === '' || pass === '' || confirmPass === ''" class="rounded-md border border-snow/85 px-4 py-1 text-xl transition-all duration-200 ease-out enabled:hover:border-aero-200/85 enabled:hover:text-aero-400 enabled:hover:drop-shadow-[0_4px_3px_rgba(158,252,207,0.1)] disabled:cursor-not-allowed disabled:opacity-60">Next</button>
          <NuxtLink to="/login" class="rounded-md border border-snow/85 px-4 py-1 text-xl transition-all duration-200 ease-out hover:border-red-200/85 hover:text-red-400 hover:drop-shadow-[0_4px_3px_rgba(254,202,202,0.1)]">Back</NuxtLink>
        </section>
      </div>
      <div v-else class="w-full">
        <section class="mt-4 flex w-full flex-col items-center space-y-4">
          <section class="flex w-full items-end justify-center space-x-4">
            <label class="w-full">
              <span class="flex w-full items-center justify-center text-lg italic text-snow/65">Birthday</span>
              <input v-model="birthday" id="birthday" type="date" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0" />
            </label>
            <label class="w-full">
              <span class="flex w-full items-center justify-center text-lg italic text-snow/65">First name</span>
              <input v-model="firstName" type="text" placeholder="Enter text" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
            </label>
            <label class="w-full">
              <span class="flex w-full items-center justify-center text-lg italic text-snow/65">Last name</span>
              <input v-model="lastName" type="text" placeholder="Enter text" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
            </label>
          </section>
          <input v-model="username" type="text" placeholder="Username" class="h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
        </section>
        <section class="mt-4 flex w-full justify-center">
          <button @click="signUp" :disabled="username === '' || firstName === '' || lastName === '' || birthday === ''" class="rounded-md border border-snow/85 px-4 py-1 text-xl transition-all duration-200 ease-out enabled:hover:border-aero-200/85 enabled:hover:text-aero-400 enabled:hover:drop-shadow-[0_4px_3px_rgba(158,252,207,0.1)] disabled:cursor-not-allowed disabled:opacity-60">Sign up</button>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
  #birthday::-webkit-calendar-picker-indicator {
    color-scheme: dark;
  }

  main {
    background-color: #201e1f;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
