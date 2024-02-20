<script setup lang="ts">
  import type { RealtimeChannel } from "@supabase/supabase-js";

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const groups: Ref<Group[]> = ref([]);
  const groupRequests: Ref<Group[]> = ref([]);

  const notifications: Ref<Notify[]> = ref([]);
  const showNotify = ref(true);

  let groupNotifyChannel: RealtimeChannel;
  
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

  async function getFinalGroups(groupIds: string[], requestIds: string[]) {
    const { data: data1, error: error1 } = await supabase.from("groups").select().in("group_id", groupIds);
    if (error1) throw error1;

    const { data: data2, error: error2 } = await supabase.from("groups").select().in("group_id", requestIds);
    if (error2) throw error2;

    groups.value = data1;
    groupRequests.value = data2;
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

  async function getNotify() {
    if (!user.value) return;

    const { data, error } = await supabase.from("group_notify").select().eq("sent_to", user.value.id);
    if (error2) throw error2;

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
      groupNotifyChannel = supabase.channel("group_notify").on("postgres_changes", { event: "*", schema: "public", table: "group_notify", filter: notifyFilter }, () => getNotify());
      groupNotifyChannel.subscribe();
    }

    getGroupIds();
    getChannels();
    getNotify();
  });

  onUnmounted(() => {
    supabase.removeChannel(groupNotifyChannel);
  });
</script>

<template>
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
              <button @click="allowGroup(request)" class="transition-colors duration-200 ease-in hover:text-aero-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </button>
              <button @click="rejectGroup(request)" class="transition-colors duration-200 ease-in hover:text-red-400">
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
            <div v-if="checkNotify(group.group_id) && showNotify" class="mr-2 flex h-6 w-6 justify-center rounded-full bg-aero-200 p-0.5 text-shark-950">
              <span class="text-xs">{{ getNotifyNum(group.group_id) }}</span>
            </div>
            <NuxtLink :to="`/chat/group/${group.group_id}`" class="transition-colors duration-200 ease-in hover:text-aero-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </NuxtLink>
          </li>
        </ul>
      </article>
</template>
