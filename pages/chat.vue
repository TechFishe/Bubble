<script setup lang="ts">
    useHead({
        title: "Bubble | Chats"
    })
    
    import { useAlertStore } from '~/stores/store';

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const alertStore = useAlertStore();

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

    const customUser: Ref<User> = ref({ id: 0, user_id: "", full_name: "", friends: [], pfp: "", date_joined: ""});
    const friends: Ref<User[]> = ref([]);
    const currentFriend: Ref<User> = ref({ id: 0, user_id: "", full_name: "", friends: [], pfp: "", date_joined: ""});
    const chats: Ref<Chat[]> = ref([]);

    let msg = "";

    onMounted(async () => {
        if (!user.value) return;
        
        const { data: data1, error: error1 } = await supabase.from('users').select().eq('user_id', user.value.id).single();
        if(error1) throw error1
        else customUser.value = data1;

        const { data: data2, error: error2 } = await supabase.from('users').select().in('user_id', customUser.value.friends);
        if(error2) throw error2;
        else friends.value = data2;
    });

    async function setFriend(friendIn: User){
        currentFriend.value = friendIn;
        getChats();
    }

    async function getChats(){
        const tempArray:string[] = [customUser.value.user_id, currentFriend.value.user_id];
        const {data, error} = await supabase.from("chats").select().in("sent_by", tempArray).in("sent_to", tempArray).order("id", { ascending: false });
        if(error) throw error;
        else chats.value = data;
    }

    async function sendChat(){
        if(msg === ""){
            alertStore.msg = "You need to enter text into the text box.";
            alertStore.type = "error";
            alertStore.timesShown++;
            return;
        }

        //@ts-expect-error
        const { error } = await supabase.from("chats").insert({ msg: msg, sent_by: customUser.value.user_id, sent_to: currentFriend.value.user_id });
        if(error) throw error;
        else{
            msg = "";
            getChats();
        }
    }

</script>

<template>
    <div class="flex h-fullscreen">
        <aside class="2xl:w-1/6 w-1/3 border-r-2 border-r-snow/45">
            <h2 class="text-5xl font-mono font-semibold">Friends</h2>
            <ul class="pl-2">
                <li v-for="friend in friends" class="flex items-center border-b border-b-snow/25 pb-1.5 last:pb-0 last:border-b-transparent">
                    <img :src="friend.pfp" alt="Friend pfp" width="32px" height="32px" />
                    <span class="text-xl text-aero-100 flex flex-grow h-fit">{{ friend.full_name }}</span>
                    <button @click="setFriend(friend)" class="hover:text-aero-200 transition-colors duration-200 ease-in">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </li>
            </ul>
        </aside>
        <main v-if="currentFriend.full_name != ''" class="2xl:w-5/6 w-2/3 flex flex-col pb-2">
            <section class="w-screen flex h-16 items-center">
                <img :src="currentFriend.pfp" alt="Friend pfp" width="48px" height="48px" />
                <h1 class="text-6xl font-mono font-semibold bg-clip-text text-transparent bg-gradient-to-r from-snow to-65% to-aero-100 w-fit">{{ currentFriend.full_name }}</h1>
            </section>
            <ul id="chatbox" class="ml-2 pb-2 overflow-y-scroll max-h-chatView flex w-screen flex-col-reverse">
                <li v-for="chat in chats" class="flex space-x-2">
                    <p v-if="chat.sent_by === currentFriend.user_id"><span class="text-sky-300">{{ currentFriend.full_name }}</span>:</p>
                    <p v-else-if="chat.sent_by === customUser.user_id"><span class="text-aero-300">{{ customUser.full_name }}</span>:</p>
                    <p>{{ chat.msg }}</p>
                </li>
            </ul>
            <div class="flex flex-grow"></div>
            <div class="mr-8 h-8 flex">
                <input @keypress.enter="sendChat" type="text" v-model="msg" placeholder="Enter message" class="w-full bg-shark-900 text-lg rounded-l-sm pl-2 h-8 placeholder:italic outline-0">
                <button @click="sendChat" class="bg-shark-900 rounded-r-sm pr-2 hover:text-aero-100 transition-colors duration-200 ease-out">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </main>
        <main v-else id="noChats" class="2xl:w-5/6 w-2/3 flex flex-col justify-center items-center">
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
