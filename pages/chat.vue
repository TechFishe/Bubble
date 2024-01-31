<script setup lang="ts">
    useHead({
        title: "Bubble | Chats"
    });
    
    import { useAlertStore } from '#imports';
    import { useUserStore } from '#imports';
    import type { RealtimeChannel } from '@supabase/supabase-js';

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const alertStore = useAlertStore();
    const userStore = useUserStore();

    let privateChatChannel: RealtimeChannel, groupChatChannel: RealtimeChannel;

    interface User{
        id: number,
        user_id: string,
        full_name: string,
        friends:string[],
        pfp: string,
        date_joined: string
    }

    interface Chat{
        id: number,
        msg: string,
        sent_by: string,
        sent_to: string
    }

    interface Group{
        id: number,
        group_id: string,
        members: string[],
        group_name: string,
        pfp: string
    }

    const customUser: Ref<User> = ref({ id: 0, user_id: "", full_name: "", friends: [], pfp: "", date_joined: "" });
    const currentFriend: Ref<User> = ref({ id: 0, user_id: "", full_name: "", friends: [], pfp: "", date_joined: "" });
    const currentGroup: Ref<Group> = ref({ id: 0, group_id: "", members: [], group_name: "", pfp: "" })
    const chats: Ref<Chat[]> = ref([]);
    const friends: Ref<User[]> = ref([]);
    const groups: Ref<Group[]> = ref([]);
    const groupMembers: Ref<User[]> = ref([]);

    const msg = ref("");

    function setFriend(friendIn: User){
        currentGroup.value = { id: 0, group_id: "", members: [], group_name: "", pfp: "" };
        currentFriend.value = friendIn;
        getChats(false);
    }

    async function setGroup(groupIn: Group){
        currentFriend.value = { id: 0, user_id: "", full_name: "", friends: [], pfp: "", date_joined: "" };
        currentGroup.value = groupIn;

        const { data, error } = await supabase.from("users").select().in("user_id", groupIn.members);
        if(error) throw error;
        else groupMembers.value = data;

        getChats(true);
    }

    function checkId(sentBy: string){
        for(let i = 0; i < groupMembers.value.length; i++){
            if(sentBy === groupMembers.value[i].user_id) return groupMembers.value[i].full_name;
        }
    }

    function copyChat(chatIn: Chat){
        navigator.clipboard.writeText(chatIn.msg);
    }

    async function getChats(isGroup: boolean){
        if(!isGroup){
            const tempArray:string[] = [customUser.value.user_id, currentFriend.value.user_id];
            const { data, error } = await supabase.from("private_chats").select().in("sent_by", tempArray).in("sent_to", tempArray).order("id", { ascending: false });

            if(error) throw error;
            //@ts-ignore
            else chats.value = data;
        } else{
            const { data, error } = await supabase.from("group_chats").select().eq("sent_to", currentGroup.value.group_id).order("id", { ascending: false });

            if(error) throw error;
            //@ts-ignore
            else chats.value = data;
        }
    }

    async function privateChatTableInsert(payload: any){
        let sentBy: User;
        const { data: data1, error: error1 } = await supabase.from("users").select().eq("user_id", payload.new.sent_by).single();
        if(error1) throw error1;
        else sentBy = data1;

        if(sentBy.user_id === currentFriend.value.user_id) getChats(false);

        if(Notification.permission === "granted"){
            const notify = new Notification("New chat", { body: `You got a new message from ${sentBy.full_name}!` });
        }
    }

    async function groupChatTableInsert(payload: any){
        let sentBy: User;
        const { data: data1, error: error1 } = await supabase.from("users").select().eq("user_id", payload.new.sent_by).single();
        if(error1) throw error1;
        else sentBy = data1;

        for(let i = 0; i < groupMembers.value.length; i++){
            if(sentBy.user_id === groupMembers.value[i].user_id){
                getChats(true);
                break;
            }
        }

        if(Notification.permission === "granted" && sentBy.user_id != customUser.value.user_id){
            const notify = new Notification("New chat", { body: `You got a new message from ${sentBy.full_name} in ${currentGroup.value.group_name} group chat!` });
        }
    }

    async function sendChat(){
        if(msg.value === ""){
            alertStore.msg = "You need to enter text into the text box.";
            alertStore.type = "error";
            alertStore.timesShown++;
            return;
        }

        if(currentFriend.value.id != 0){
            //@ts-expect-error
            const { error } = await supabase.from("private_chats").insert({ msg: msg.value, sent_by: customUser.value.user_id, sent_to: currentFriend.value.user_id });

            if(error) throw error;
            else{
                msg.value = "";
                getChats(false);
            }
        } else{
            //@ts-expect-error
            const { error } = await supabase.from("group_chats").insert({ msg: msg.value, sent_by: customUser.value.user_id, sent_to: currentGroup.value.group_id });

            if(error) throw error;
            else{
                msg.value = "";
                getChats(true);
            }
        }
    }

    
    async function deleteChat(chatIn: Chat){
        if(currentFriend.value.id != 0){
            const { error } = await supabase.from("private_chats").delete().eq("id", chatIn.id);
            if(error) throw error;
            else getChats(false);
        } else{
            const { error } = await supabase.from("group_chats").delete().eq("id", chatIn.id);
            if(error) throw error;
            else getChats(true);
        }
    }

    onMounted(async () => {
        if (!user.value) return;
        
        let groupIds: string[] = [];

        const { data: data1, error: error1 } = await supabase.from('users').select().eq('user_id', user.value.id).single();
        if(error1) throw error1
        else customUser.value = data1;

        //@ts-expect-error
        userStore.id = data1.id; userStore.user_id = data1.user_id; userStore.full_name = data1.full_name; userStore.friends = data1.friends; userStore.pfp = data1.pfp; userStore.date_joined = data1.date_joined;

        const { data: data2, error: error2 } = await supabase.from('users').select().in('user_id', customUser.value.friends);
        if(error2) throw error2;
        else friends.value = data2;

        const { data: data3, error: error3 } = await supabase.from("groups").select();
        if(error3) throw error3;
        else{
            let groupsIn: number[] = [];

            for(let i = 0; i < data3.length; i++){
                //@ts-expect-error
                for(let m = 0; m < data3[i].members.length; m++){
                    //@ts-expect-error
                    if(data3[i].members[m] === customUser.value.user_id){
                        //@ts-expect-error
                        groupsIn.push(data3[i].id); groupIds.push(data3[i].group_id);
                        break;
                    }
                }
            }

            const { data: data4, error: error4 } = await supabase.from("groups").select().in("id", groupsIn);
            if(error4) throw error4;
            else groups.value = data4;
        }

        //@ts-expect-error
        let privateMsgFilter = `sent_to=eq.${data1.user_id}`, groupMsgFilter = `sent_to=in.(${groupIds.toString().replace(",", ", ")})`;
        privateChatChannel = supabase.channel('public:private_chats').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'private_chats', filter: privateMsgFilter }, (payload) => privateChatTableInsert(payload)).on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'private_chats', filter: privateMsgFilter }, () => getChats(false));
        groupChatChannel = supabase.channel('public:group_chats').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_chats', filter: groupMsgFilter }, (payload) => groupChatTableInsert(payload)).on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'group_chats', filter: groupMsgFilter }, () => getChats(true));
        privateChatChannel.subscribe();
        groupChatChannel.subscribe();

        if(Notification.permission === "default") Notification.requestPermission();
    });

    onUnmounted(() => {
        supabase.removeChannel(privateChatChannel);
        supabase.removeChannel(groupChatChannel);
    });
</script>

<template>
    <div class="flex h-fullscreen">
        <aside class="2xl:w-1/6 w-3/12 border-r-2 border-r-snow/45 flex h-fullscreen flex-col">
            <article class="h-2/3">
                <div class="flex items-center justify-between">
                    <h2 class="text-5xl font-mono font-semibold">Friends</h2>
                    <NuxtLink>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                    </NuxtLink>
                </div>
                <ul class="pl-2">
                    <li v-for="friend in friends" class="flex items-center border-b border-b-snow/25 pb-1.5 last:pb-0 last:border-b-transparent">
                        <img :src="friend.pfp" alt="Friend pfp" width="32px" height="32px" />
                        <span class="text-xl text-aero-100 flex flex-grow h-fit ml-1">{{ friend.full_name }}</span>
                        <button @click="setFriend(friend)" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </article>
            <article class="h-1/3 border-t border-t-snow/45">
                <h2 class="text-5xl font-mono font-semibold">Groups</h2>
                <ul class="pl-2">
                    <li v-for="group in groups" class="flex items-center border-b border-b-snow/25 pb-1.5 last:pb-0 last:border-b-transparent">
                        <img :src="group.pfp" alt="Group pfp" width="24px" height="24px" />
                        <span class="text-xl text-aero-100 flex flex-grow h-fit ml-1">{{ group.group_name }}</span>
                        <button @click="setGroup(group)" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </article>
        </aside>
        <main v-if="currentFriend.full_name != '' || currentGroup.group_name != ''" class="2xl:w-5/6 w-9/12 flex flex-col pb-2">
            <section v-if="currentFriend.full_name != ''" class="w-screen ml-1 flex h-16 items-center">
                <img :src="currentFriend.pfp" alt="Friend pfp" width="48px" height="48px" />
                <h1 class="text-6xl ml-1 font-mono font-semibold bg-clip-text text-transparent bg-gradient-to-r from-snow to-65% to-aero-100 w-fit">{{ currentFriend.full_name }}</h1>
            </section>
            <section v-else class="w-screen flex h-16 items-center ml-1">
                <img :src="currentGroup.pfp" alt="Friend pfp" width="48px" height="48px" />
                <h1 class="text-6xl ml-1 font-mono font-semibold bg-clip-text text-transparent bg-gradient-to-r from-snow to-65% to-aero-100 w-fit">{{ currentGroup.group_name }}</h1>
            </section>
            <ul id="chatbox" class="ml-2 pb-2 overflow-y-scroll max-h-chatView flex w-screen flex-col-reverse">
                <li v-if="currentFriend.full_name != ''" v-for="chat in chats" class="flex space-x-2 hover:bg-shark-900 w-fit rounded-md py-px px-2">
                    <p v-if="chat.sent_by === currentFriend.user_id"><span class="text-sky-300">{{ currentFriend.full_name }}</span>:</p>
                    <p v-else-if="chat.sent_by === customUser.user_id"><span class="text-aero-300">{{ customUser.full_name }}</span>:</p>
                    <p>{{ chat.msg }}</p>
                    <!-- <div class="flex flex-grow"></div>
                    <section class="hidden group-hover:flex">
                        <button @click="copyChat(chat)" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                        </button>
                        <button v-show="chat.sent_by === customUser.user_id" @click="deleteChat(chat)" class="hover:text-red-400 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </section> -->
                </li>
                <li v-else v-for="chat in chats" class="flex space-x-2 max-w-[61%] group">
                    <p v-if="chat.sent_by != customUser.user_id"><span class="text-sky-300">{{ checkId(chat.sent_by) }}</span>:</p>
                    <p v-else><span class="text-aero-300">{{ customUser.full_name }}</span>:</p>
                    <p>{{ chat.msg }}</p>
                    <!-- <div class="flex flex-grow"></div>
                    <section class="hidden group-hover:flex">
                        <button @click="copyChat(chat)" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                        </button>
                        <button v-show="chat.sent_by === customUser.user_id" @click="deleteChat(chat)" class="hover:text-red-400 transition-colors duration-200 ease-in">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </section> -->
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
        <main v-else id="noChats" class="2xl:w-5/6 w-9/12 flex flex-col justify-center items-center">
            <h1 class="text-8xl uppercase font-mono font-black bg-clip-text border-b-[3px] border-b-snow/15 px-4 text-transparent bg-gradient-to-r from-snow to-65% to-aero-100">No friend picked</h1>
            <p class="text-2xl">Click the ">" next to one of your friends to chat with them!</p>
        </main>
    </div>
</template>

<style scoped>
    #chatbox::-webkit-scrollbar{
        background: transparent;
    }

    #noChats{
        background-color: #201e1f;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>
