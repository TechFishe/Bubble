<script setup lang="ts">
    useHead({
        title: "Bubble | Add Friend"
    });

    import type { RealtimeChannel } from '@supabase/supabase-js';

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const alertStore = useAlertStore();

    let userChannel: RealtimeChannel, friendChannel: RealtimeChannel;

    interface User{
        id: number,
        user_id: string,
        full_name: string,
        pfp: string,
        joined_at: string,
        username: string,
        birthday: string
    }

    const list: Ref<User[]> = ref([]);
    const friendIds: Ref<string[]> = ref([]);

    async function getFriendIds(){
        if(!user.value) return;

        const { data: data1, error: error1 } = await supabase.from("friends").select().eq("user_1", user.value.id);
        if(error1) throw error1;

        const { data: data2, error: error2 } = await supabase.from("friends").select().eq("user_2", user.value.id);
        if(error2) throw error2;

        //@ts-expect-error
        for(let i = 0; i < data1.length; i++) friendIds.value.push(data1[i].user_2);
        //@ts-expect-error
        for(let i = 0; i < data2.length; i++) friendIds.value.push(data2[i].user_1);
    }

    async function getList(){
        if(!user.value) return;

        await getFriendIds();
        
        let tempFilter: string[] = [];
        for(let i = 0; i < friendIds.value.length; i++) tempFilter.push(friendIds.value[i]);
        let filter = `(${tempFilter.toString()})`;


        const { data, error } = await supabase.from("users").select().neq("user_id", user.value.id).not("user_id", "in", filter).limit(20);
        if(error) throw error;

        list.value = data;
    }

    async function addFriend(userIn: User){
        if(!user.value) return;

        //@ts-expect-error
        const { error } = await supabase.from("friends").insert({ user_1: user.value.id, user_2: userIn.user_id, user_1_allow: true, user_2_allow: false });
        if(error) throw error;

        alertStore.msg = "Friend request sent!";
        alertStore.type = "ok";
        alertStore.timesShown++;
    }

    onMounted(async () => {
        function connectChannels(){
            userChannel = supabase.channel("public:users").on("postgres_changes", { event: "*", schema: "public", table: "users" }, () => getList()).subscribe();
            friendChannel = supabase.channel("public:friends").on("postgres_changes", { event: "*", schema: "public", table: "friends" }, () => getList()).subscribe();
        }

        getList();
        connectChannels();
    });

    onUnmounted(() => {
        supabase.removeChannel(userChannel);
        supabase.removeChannel(friendChannel);
    });
</script>

<template>
    <main class="flex w-screen h-fullscreen justify-center items-center">
        <div class="flex flex-col bg-shark-950 rounded-lg items-center 2xl:w-1/2 md:w-2/3 px-2 py-2 space-y-2">
            <h1 class="text-7xl uppercase font-mono font-black bg-clip-text border-b-[3px] border-b-snow/15 px-4 text-transparent bg-gradient-to-r from-snow to-65% to-aero-100">Add Friend</h1>
            <div class="bg-shark-900 rounded-sm h-8 flex space-x-1 w-1/2 items-center pr-2">
                <input type="search" placeholder="Search" class="w-full bg-shark-900 text-lg pl-2 placeholder:italic outline-0" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
            <ul class="w-full grid grid-cols-4 grid-rows-5">
                <li v-for="user in list" class="flex items-center px-1 py-0.5 border-r border-r-snow/45 last:border-r-transparent">
                    <img :src="user.pfp" alt="Friend pfp" width="32px" height="32px" />
                    <span class="text-xl flex flex-grow h-fit ml-1">{{ user.full_name }}</span>
                    <button @click="addFriend(user)" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    </main>
</template>

<style scoped>
  main{
    background-color: #201e1f;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
