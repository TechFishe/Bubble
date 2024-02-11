<script setup lang="ts">
  useHead({
    title: "Bubble | Add Member",
  });

  interface User {
    id: number;
    user_id: string;
    full_name: string;
    pfp: string;
    joined_at: string;
    username: string;
    birthday: string;
  }

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const alertStore = useAlertStore();

  const route = useRoute();
  const list: Ref<User[]> = ref([]);
  const members: Ref<string[]> = ref([]);

  async function getMemberIds() {
    if (!user.value) return;

    const { data, error } = await supabase.from("group_members").select().eq("group_id", route.params.id).neq("user_id", user.value.id);
    if (error) throw error;

    for (let i = 0; i < data.length; i++) {
      //@ts-expect-error
      let tempData = data[i].user_id;
      members.value.push(tempData);
    }

    getFriendIds();
  }

  async function getFriendIds() {
    if (!user.value) return;

    const { data: data1, error: error1 } = await supabase.from("friends").select().eq("user_1", user.value.id);
    if (error1) throw error1;

    const { data: data2, error: error2 } = await supabase.from("friends").select().eq("user_2", user.value.id);
    if (error2) throw error2;

    let friendIds: string[] = [];

    for (let i = 0; i < data1.length; i++) {
      //@ts-expect-error
      let tempId = data1[i].user_2,
        addId = true;
      for (let i = 0; i < members.value.length; i++) {
        if (tempId === members.value[i]) {
          addId = false;
          break;
        }
      }

      if (addId) friendIds.push(tempId);
    }
    for (let i = 0; i < data2.length; i++) {
      //@ts-expect-error
      let tempId = data2[i].user_1,
        addId = true;
      for (let i = 0; i < members.value.length; i++) {
        if (tempId === members.value[i]) {
          addId = false;
          break;
        }
      }

      if (addId) friendIds.push(tempId);
    }

    getFinalFriends(friendIds);
  }

  async function getFinalFriends(friendIds: string[]) {
    const { data, error } = await supabase.from("users").select().in("user_id", friendIds);
    if (error) throw error;

    list.value = data;
  }

  async function addMember(userIn: User) {
    if (!user.value) return;

    //@ts-expect-error
    const { error } = await supabase.from("group_members").insert({ user_id: userIn.user_id, added_by: user.value.id, group_id: route.params.id, accepted: false }).single();
    if (error) throw error;

    alertStore.msg = "Request sent!";
    alertStore.type = "ok";
    alertStore.timesShown++;

    getMemberIds();
  }

  onMounted(() => {
    getMemberIds();
  });
</script>

<template>
  <main class="flex h-fullscreen w-screen items-center justify-center">
    <div class="flex flex-col items-center space-y-2 rounded-lg bg-shark-950 px-2 py-2 md:w-2/3 2xl:w-1/2">
      <h1 class="border-b-[3px] border-b-snow/15 bg-gradient-to-r from-snow to-aero-100 to-65% bg-clip-text px-4 font-mono text-7xl font-black uppercase text-transparent">Add Member</h1>
      <div class="flex h-8 w-1/2 items-center space-x-1 rounded-sm bg-shark-900 pr-2">
        <input type="search" placeholder="Search" class="w-full bg-shark-900 pl-2 text-lg outline-0 placeholder:italic" />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
      <ul class="grid w-full grid-cols-4 grid-rows-5">
        <li v-for="user in list" class="flex items-center border-r border-r-snow/45 px-1 py-0.5">
          <img :src="user.pfp" alt="Friend pfp" width="32px" height="32px" />
          <span class="ml-1 flex h-fit flex-grow text-xl">{{ user.username }}</span>
          <button @click="addMember(user)" class="transition-colors duration-200 ease-in hover:text-aero-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
  main {
    background-color: #201e1f;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
