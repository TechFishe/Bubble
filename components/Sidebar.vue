<script setup lang="ts">
    interface User{
        id: number,
        user_id: string,
        full_name: string,
        pfp: string,
        joined_at: string,
        username: string,
        birthday: string
    }

    interface Chat{
        id: number,
        msg: string,
        created_at: string,
        sent_by: string,
        sent_to: string
    }

    interface Group{
        id: number,
        group_id: string,
        created_at: string,
        group_name: string,
        pfp: string
    }

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();

    const friends: Ref<User[]> = ref([]);
    const friendRequests: Ref<User[]> = ref([]);

    const groups: Ref<Group[]> = ref([]);
    //const groupMembers: Ref<User[]> = ref([]);

    async function getFriendIds(){
        if(!user.value) return;

        const { data: data1, error: error1 } = await supabase.from("friends").select().eq("user_1", user.value.id);
        if(error1) throw error1;

        const { data: data2, error: error2 } = await supabase.from("friends").select().eq("user_2", user.value.id);
        if(error2) throw error2;

        let friendIds: string[] = [], requestIds: string[] = [];
        for(let i = 0; i < data1.length; i++){
            //@ts-expect-error
            let tempId = data1[i].user_2;
            friendIds.push(tempId);
        }
        for(let i = 0; i < data2.length; i++){
            //@ts-expect-error
            let tempId = data2[i].user_1;
            //@ts-expect-error
            if(!data2[i].user_2_allow) requestIds.push(tempId);
            else friendIds.push(tempId);
        }

        getFinalFriends(friendIds, requestIds);
    }

    async function getFinalFriends(friendIds: string[], requestIds: string[]){
        const { data: data1, error: error1 } = await supabase.from("users").select().in("user_id", friendIds);
        if(error1) throw error1;

        const { data: data2, error: error2 } = await supabase.from("users").select().in("user_id", requestIds);
        if(error2) throw error2;
        
        friends.value = data1;
        friendRequests.value = data2;
    }

    async function allowFriend(requestIn: User){
        if(!user.value) return;

        //@ts-expect-error
        const { error } = await supabase.from("friends").update({ user_2_allow: true }).eq("user_1", requestIn.user_id).eq("user_2", user.value.id);
        if(error) throw error;

        getFriendIds();
    }

    async function rejectFriend(requestIn: User){
        if(!user.value) return

        const { error } = await supabase.from("friends").delete().eq("user_1", requestIn.user_id).eq("user_2", user.value.id);
        if(error) throw error;

        getFriendIds();
    }

    onMounted(() => {
        getFriendIds();
    });
</script>

<template>
    <aside class="w-1/4 border-r-2 border-r-snow/45 flex h-fullscreen flex-col">
        <article class="h-2/3">
            <div class="flex items-center justify-between mx-1">
                <h2 class="text-5xl font-mono font-semibold">Friends</h2>
                <NuxtLink to="/add-friend" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                </NuxtLink>
            </div>
            <ul id="noScrollbar" v-if="friendRequests.length !== 0" class="px-1 space-x-1 flex w-full overflow-x-scroll mb-1">
                <li v-for="request in friendRequests" class="bg-shark-900 rounded-md h-16 whitespace-nowrap w-fit py-0.5 px-1 flex">
                    <div class="flex flex-col">
                        <section class="flex items-center">
                            <img :src="request.pfp" alt="Request pfp" width="32px" height="32px" />
                            <span class="text-xl flex flex-grow h-fit ml-1">{{ request.username }}</span>
                        </section>
                        <p class="text-sm tracking-tight text-snow/75 italic">Wants to be friends with you!</p>
                    </div>
                    <div class="ml-1 flex flex-col space-y-1 justify-center">
                        <button @click="allowFriend(request)" class="hover:text-aero-400 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </button>
                        <button @click="rejectFriend(request)" class="hover:text-red-400 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
            <ul id="noScrollbar" class="pl-2 overflow-y-scroll">
                <li v-for="friend in friends" class="flex items-center border-b border-b-snow/25 pb-1.5 last:pb-0 last:border-b-transparent">
                    <img :src="friend.pfp" alt="Friend pfp" width="32px" height="32px" />
                    <span class="text-xl flex flex-grow h-fit ml-1">{{ friend.username }}</span>
                    <NuxtLink :to="`/chat/private/${friend.user_id}`" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </NuxtLink>
                </li>
            </ul>
        </article>
        <article class="h-1/3 border-t border-t-snow/45">
            <div class="flex items-center justify-between mx-1">
                <h2 class="text-5xl font-mono font-semibold">Groups</h2>
                <NuxtLink class="hover:text-aero-200 transition-colors duration-200 ease-in">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </NuxtLink>
            </div>
            <ul id="noScrollbar" class="pl-2 overflow-y-scroll">
                <li v-for="group in groups" class="flex items-center border-b border-b-snow/25 pb-1.5 last:pb-0 last:border-b-transparent">
                    <img :src="group.pfp" alt="Group pfp" width="24px" height="24px" />
                    <span class="text-xl flex flex-grow h-fit ml-1">{{ group.group_name }}</span>
                    <NuxtLink :to="`/chat/group/${group.group_id}`" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </NuxtLink>
                </li>
            </ul>
        </article>
    </aside>
</template>

<style scoped>
    #noScrollbar::-webkit-scrollbar{
        display: none;
    }
</style>