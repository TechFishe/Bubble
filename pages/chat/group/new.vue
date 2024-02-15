<script setup lang="ts">
  useHead({
    title: "Bubble | New Group",
  });

  import { createAvatar } from "@dicebear/core";
  import { identicon } from "@dicebear/collection";

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const alertStore = useAlertStore();

  const name = ref("");

  async function addMember(groupIn: any) {
    if (!user.value) return;

    //@ts-expect-error
    const { error } = await supabase.from("group_members").insert({ user_id: user.value.id, added_by: user.value.id, group_id: groupIn.group_id, accepted: true });
    if (error) throw error;

    alertStore.msg = "New group created!";
    alertStore.type = "ok";
    alertStore.timesShown++;
  }

  async function newGroup() {
    if (!user.value) return;

    const avatar = createAvatar(identicon, { size: 64, seed: Math.random().toString() }).toDataUriSync();

    //@ts-expect-error
    const { data, error } = await supabase.from("groups").insert({ group_name: name.value, pfp: avatar, created_by: user.value.id }).select().single();
    if (error) throw error;

    await addMember(data);
    navigateTo("/chat");
  }
</script>

<template>
  <main class="flex w-3/4 items-center justify-center">
    <div class="flex w-2/3 flex-col items-center rounded-lg bg-shark-950 px-2 py-2">
      <h1 class="border-b-[3px] border-b-snow/15 bg-gradient-to-r from-snow to-aero-100 to-65% bg-clip-text px-4 font-mono text-7xl font-black uppercase text-transparent">New group</h1>
      <input v-model="name" type="text" placeholder="Group name" class="mt-2 h-8 w-full rounded-sm bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
      <button @click="newGroup" :disabled="name === ''" class="mt-2 rounded-md border border-snow/85 px-4 py-1 text-xl transition-all duration-200 ease-out enabled:hover:border-aero-200/85 enabled:hover:text-aero-400 enabled:hover:drop-shadow-[0_4px_3px_rgba(158,252,207,0.1)] disabled:cursor-not-allowed disabled:opacity-60">Create</button>
    </div>
  </main>
</template>

<style scoped>
  main {
    background-color: #201e1f;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
