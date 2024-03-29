<script setup lang="ts">
  import type { RealtimeChannel } from "@supabase/supabase-js";

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const friends: Ref<User[]> = ref([]);
  const friendRequests: Ref<User[]> = ref([]);

  const notifications: Ref<Notify[]> = ref([]);
  const showNotify = ref(true);

  let privateNotifyChannel: RealtimeChannel;

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
      if (!data2[i].accepted) requestIds.push(tempId);
      else friendIds.push(tempId);
    }

    getFinalFriends(friendIds, requestIds);
  }

  async function getFinalFriends(friendIds: string[], requestIds: string[]) {
    const { data: data1, error: error1 } = await supabase.from("users").select().in("user_id", friendIds);
    if (error1) throw error1;

    const { data: data2, error: error2 } = await supabase.from("users").select().in("user_id", requestIds);
    if (error2) throw error2;

    friends.value = data1;
    friendRequests.value = data2;
  }

   async function allowFriend(requestIn: User) {
    if (!user.value) return;

    //@ts-expect-error
    const { error } = await supabase.from("friends").update({ accepted: true }).eq("user_1", requestIn.user_id).eq("user_2", user.value.id);
    if (error) throw error;

    getFriendIds();
  }

  async function rejectFriend(requestIn: User) {
    if (!user.value) return;

    const { error } = await supabase.from("friends").delete().eq("user_1", requestIn.user_id).eq("user_2", user.value.id);
    if (error) throw error;

    getFriendIds();
  }

  async function getNotify() {
    if (!user.value) return;

    const { data, error } = await supabase.from("private_notify").select().eq("sent_to", user.value.id);
    if (error) throw error;

    notifications.value = data;
  }

  function checkNotify(uuid: string) {
    for (let i = 0; i < notifications.value.length; i++) {
      if (notifications.value[i].sent_by === uuid) return true;
    }

    return false;
  }

  function getNotifyNum(uuid: string) {
    let outputNum = 0;
    for (let i = 0; i < notifications.value.length; i++) {
      if (notifications.value[i].sent_by === uuid) outputNum++;
    }

    return outputNum;
  }

  onMounted(() => {
    function getChannels() {
      if (!user.value) return;

      let notifyFilter = `sent_to=eq.${user.value.id}`;
      privateNotifyChannel = supabase.channel("private_notify").on("postgres_changes", { event: "*", schema: "public", table: "private_notify", filter: notifyFilter }, () => getNotify());
      privateNotifyChannel.subscribe();
    }

    getFriendIds();
    getChannels();
    getNotify();
  });

  onUnmounted(() => {
    supabase.removeChannel(privateNotifyChannel);
  });
</script>

<template>
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
            <div v-if="checkNotify(friend.user_id) && showNotify" class="mr-2 flex h-6 w-6 justify-center rounded-full bg-aero-200 p-0.5 text-shark-950">
              <span class="text-xs">{{ getNotifyNum(friend.user_id) }}</span>
            </div>
            <NuxtLink :to="`/chat/private/${friend.user_id}`" class="transition-colors duration-200 ease-in hover:text-aero-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </NuxtLink>
          </li>
        </ul>
      </article>
</template>

  
<style scoped>
  #noScrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
