<script setup lang="ts">
    useHead({
        title: "Bubble | Chats"
    });

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
        pfp: string,
        created_by: string
    }

    interface Member{
        id: number,
        added_at: string,
        user_id: string,
        added_by: string,
        group_id: string,
        accepted: boolean
    }

    import type { RealtimeChannel } from '@supabase/supabase-js';

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();

    const alertStore = useAlertStore();

    const route = useRoute();
    const msg = ref("");
    const isGroup = ref(true);
    const group: Ref<Group> = ref({ id: 0, group_id: "", created_at: "", group_name: "", pfp: "", created_by: "" });
    const chats: Ref<Chat[]> = ref([]);
    const members: Ref<User[]> = ref([]);

    async function getChats(){
        if(!user.value) return;

        const { data, error } = await supabase.from("group_chats").select().eq("sent_to", route.params.id);
        if(error) throw error;

        chats.value = data;
    }

    async function getMembers(){
        const { data: data1, error: error1 } = await supabase.from("group_members").select().eq("group_id", route.params.id);
        if(error1) throw error1;

        let filter: string[] = [];
        for(let i = 0; i < data1.length; i++){
            filter.push(data1[i].user_id);
        }

        const { data: data2, error: error2 } = await supabase.from("users").select().in("user_id", filter);
        if(error2) throw error2;

        members.value = data2;
    }

    function checkId(chatIn: Chat){
        for(let i = 0; i < members.value.length; i++){
            if(chatIn.sent_by === members.value[i].user_id) return members.value[i].username
        }
    }

    async function getGroup(){
        const { data, error } = await supabase.from("groups").select().eq("group_id", route.params.id).single();
        if(error) throw error;

        group.value = data;
        getMembers();
        getChats();
    }

    onMounted(() => {
        async function checkGroup(){
            if(!user.value) return;

            const { data, error } = await supabase.from("group_members").select().eq("user_id", user.value.id).eq("group_id", route.params.id);
            if(error) throw error;
            
            if(data.length != 1) isGroup.value = false;
            else getGroup();
        }

        checkGroup();
    });
</script>

<template>
    <div class="flex h-fullscreen">
        <Sidebar />
        <main v-if="isGroup" class="w-3/4 flex flex-col pb-2">
            <section class="w-screen ml-1 flex h-[5.5rem] items-center">
                <img :src="group.pfp" alt="Friend pfp" width="48px" height="48px" />
                <h1 class="text-6xl ml-1 font-mono leading-snug font-semibold bg-clip-text text-transparent bg-gradient-to-r from-snow to-65% to-aero-100 w-fit h-fit">{{ group.group_name }}</h1>
            </section>
            <ul id="noScrollbar" class="ml-2 pb-2 overflow-y-scroll max-h-chatView flex w-screen flex-col-reverse">
                <li v-for="chat in chats" class="flex space-x-2 hover:bg-shark-900 hover:cursor-default w-fit group rounded-md py-px px-2 transition-all duration-100 ease-out">
                    <p v-if="chat.sent_by === user?.id"><span class="text-aero-300">You</span>:</p>
                    <p v-else><span class="text-sky-300">{{ checkId(chat) }}</span>:</p>
                    <p class="text-wrap">{{ chat.msg }}</p>
                    <section class="hidden group-hover:flex">
                        <button @click="copyChat(chat)" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                        </button>
                        <button :disabled="chat.sent_by != user?.id" @click="deleteChat(chat)" class="enabled:hover:text-red-400 disabled:text-snow/70 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </section>
                </li>
            </ul>
            <div class="flex flex-grow"></div>
            <div class="mr-8 h-8 flex">
                <input @keypress.enter="sendChat" type="text" v-model="msg" placeholder="Enter message" class="w-full bg-shark-900 text-lg rounded-l-sm pl-2 h-8 placeholder:italic outline-0">
                <button @click="sendChat" :disabled="msg === ''" class="bg-shark-900 rounded-r-sm pr-2 text-snow/60 enabled:hover:text-aero-200 transition-colors duration-200 ease-out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </main>
        <main v-else id="bg-grid" class="2xl:w-5/6 w-9/12 flex flex-col justify-center items-center">
            <h1 class="text-8xl uppercase font-mono font-black bg-clip-text border-b-[3px] border-b-snow/15 px-4 text-transparent bg-gradient-to-r from-snow to-65% to-aero-100">Not a friend :(</h1>
            <p class="text-2xl">You'll need to add this person as a friend before you can talk with them</p>
        </main>
    </div>
</template>

<style scoped>
    #noScrollbar::-webkit-scrollbar{
        display: none;
    }

    #bg-grid{
        background-color: #201e1f;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>
