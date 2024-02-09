<script setup lang="ts">
  interface User {
    id: number;
    user_id: string;
    full_name: string;
    pfp: string;
    joined_at: string;
    username: string;
    birthday: string;
  }

  interface Chat {
    id: number;
    msg: string;
    created_at: string;
    sent_by: string;
    sent_to: string;
  }

  interface Group {
    id: number;
    group_id: string;
    created_at: string;
    group_name: string;
    pfp: string;
    created_by: string;
  }

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const friends: Ref<User[]> = ref([]);
  const friendRequests: Ref<User[]> = ref([]);

  const groups: Ref<Group[]> = ref([]);
  const groupRequests: Ref<Group[]> = ref([]);

  async function getFriendIds() {
    if (!user.value) return;

    const { data: data1, error: error1 } = await supabase.from("friends").select().eq("user_1", user.value.id);
    if (error1) throw error1;

    const { data: data2, error: error2 } = await supabase.from("friends").select().eq("user_2", user.value.id);
    if (error2) throw error2;

    let friendIds: string[] = [],
      requestIds: string[] = [];
    for (let i = 0; i < data1.length; i++) {
      //@ts-expect-error
      let tempId = data1[i].user_2;
      friendIds.push(tempId);
    }
    for (let i = 0; i < data2.length; i++) {
      //@ts-expect-error
      let tempId = data2[i].user_1;
      //@ts-expect-error
      if (!data2[i].user_2_allow) requestIds.push(tempId);
      else friendIds.push(tempId);
    }

    getFinalFriends(friendIds, requestIds);
  }

  async function getGroupIds() {
    if (!user.value) return;

    const { data, error } = await supabase.from("group_members").select().eq("user_id", user.value.id);
    if (error) throw error;

    let groupIds: string[] = [],
      requestIds: string[] = [];
    for (let i = 0; i < data.length; i++) {
      //@ts-expect-error
      let tempId = data[i].group_id;
      //@ts-expect-error
      if (!data[i].accepted) requestIds.push(tempId);
      else groupIds.push(tempId);
    }

    getFinalGroups(groupIds, requestIds);
  }

  async function getFinalFriends(friendIds: string[], requestIds: string[]) {
    const { data: data1, error: error1 } = await supabase.from("users").select().in("user_id", friendIds);
    if (error1) throw error1;

    const { data: data2, error: error2 } = await supabase.from("users").select().in("user_id", requestIds);
    if (error2) throw error2;

    friends.value = data1;
    friendRequests.value = data2;
  }

  async function getFinalGroups(groupIds: string[], requestIds: string[]) {
    const { data: data1, error: error1 } = await supabase.from("groups").select().in("group_id", groupIds);
    if (error1) throw error1;

    const { data: data2, error: error2 } = await supabase.from("groups").select().in("group_id", requestIds);
    if (error2) throw error2;

    groups.value = data1;
    groupRequests.value = data2;
  }

  async function allowFriend(requestIn: User) {
    if (!user.value) return;

    //@ts-expect-error
    const { error } = await supabase.from("friends").update({ user_2_allow: true }).eq("user_1", requestIn.user_id).eq("user_2", user.value.id);
    if (error) throw error;

    getFriendIds();
  }

  async function rejectFriend(requestIn: User) {
    if (!user.value) return;

    const { error } = await supabase.from("friends").delete().eq("user_1", requestIn.user_id).eq("user_2", user.value.id);
    if (error) throw error;

    getFriendIds();
  }

  async function allowGroup(requestIn: Group) {
    if (!user.value) return;

    //@ts-expect-error
    const { error } = await supabase.from("group_members").update({ accepted: true }).eq("user_id", user.value.id).eq("group_id", requestIn.group_id);
    if (error) throw error;

    getGroupIds();
  }

  async function rejectGroup(requestIn: Group) {
    if (!user.value) return;

    const { error } = await supabase.from("group_members").delete().eq("user_id", user.value.id).eq("group_id", requestIn.group_id);
    if (error) throw error;

    getGroupIds();
  }

  onMounted(() => {
    getFriendIds();
    getGroupIds();
  });
</script>

<template>
  <aside class="flex h-fullscreen w-1/4 flex-col border-r-2 border-r-snow/45">
    <article class="h-2/3">
      <div class="mx-1 flex items-center justify-between">
        <h2 class="font-mono text-5xl font-semibold">Friends</h2>
        <NuxtLink to="/chat/private/add" class="transition-colors duration-200 ease-in hover:text-aero-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
        </NuxtLink>
      </div>
      <ul id="noScrollbar" v-if="friendRequests.length !== 0" class="mb-1 flex w-full space-x-1 overflow-x-scroll px-1">
        <li v-for="request in friendRequests" class="flex h-16 w-fit whitespace-nowrap rounded-md bg-shark-900 px-1 py-0.5">
          <div class="flex flex-col">
            <section class="flex items-center">
              <img :src="request.pfp" alt="Request pfp" width="32px" height="32px" />
              <span class="ml-1 flex h-fit flex-grow text-xl">{{ request.username }}</span>
            </section>
            <p class="text-sm italic tracking-tight text-snow/75">Wants to be friends with you!</p>
          </div>
          <div class="ml-1 flex flex-col justify-center space-y-1">
            <button @click="allowFriend(request)" class="transition-colors duration-200 ease-in hover:text-aero-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
            <button @click="rejectFriend(request)" class="transition-colors duration-200 ease-in hover:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
      <ul id="noScrollbar" class="overflow-y-scroll pl-2">
        <li v-for="friend in friends" class="flex items-center border-b border-b-snow/25 py-0.5 first:pt-0 last:border-b-transparent last:pb-0">
          <img :src="friend.pfp" alt="Friend pfp" width="32px" height="32px" />
          <span class="ml-1 flex h-fit flex-grow text-xl">{{ friend.username }}</span>
          <NuxtLink :to="`/chat/private/${friend.user_id}`" class="transition-colors duration-200 ease-in hover:text-aero-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </NuxtLink>
        </li>
      </ul>
    </article>
    <article class="h-1/3 border-t border-t-snow/45">
      <div class="mx-1 flex items-center justify-between">
        <h2 class="font-mono text-5xl font-semibold">Groups</h2>
        <NuxtLink to="/chat/group/new" class="transition-colors duration-200 ease-in hover:text-aero-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </NuxtLink>
      </div>
      <ul id="noScrollbar" v-if="groupRequests.length !== 0" class="mb-1 flex w-full space-x-1 overflow-x-scroll px-1">
        <li v-for="request in groupRequests" class="flex h-16 w-fit whitespace-nowrap rounded-md bg-shark-900 px-1 py-0.5">
          <div class="flex flex-col">
            <section class="flex items-center">
              <img :src="request.pfp" alt="Request pfp" width="32px" height="32px" />
              <span class="ml-1 flex h-fit flex-grow text-xl">{{ request.group_name }}</span>
            </section>
            <p class="text-sm italic tracking-tight text-snow/75">Wants you to join!</p>
          </div>
          <div class="ml-1 flex flex-col justify-center space-y-1">
            <button class="transition-colors duration-200 ease-in hover:text-aero-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </button>
            <button class="transition-colors duration-200 ease-in hover:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
      <ul id="noScrollbar" class="overflow-y-scroll pl-2">
        <li v-for="group in groups" class="flex items-center border-b border-b-snow/25 py-0.5 first:pt-0 last:border-b-transparent last:pb-0">
          <img :src="group.pfp" alt="Group pfp" width="24px" height="24px" />
          <span class="ml-1 flex h-fit flex-grow text-xl">{{ group.group_name }}</span>
          <NuxtLink :to="`/chat/group/${group.group_id}`" class="transition-colors duration-200 ease-in hover:text-aero-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </NuxtLink>
        </li>
      </ul>
    </article>
  </aside>
</template>

<style scoped>
  #noScrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
