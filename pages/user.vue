<script setup lang="ts">
    useHead({
        title: "Bubble | User"
    });
    
    import { useUserStore } from '#imports';
    import { createAvatar } from '@dicebear/core';
    import { identicon } from '@dicebear/collection';

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const userStore = useUserStore();

    interface User{
        id: number,
        user_id: string,
        full_name: string,
        friends:string[],
        pfp: string,
        date_joined: string
    }

    const customUser: Ref<User> = ref({ id: 0, user_id: "", full_name: "", friends: [], pfp: "", date_joined: ""});

    onMounted(async () => {
        if(!user.value) return;

        const { data, error } = await supabase.from('users').select().eq('user_id', user.value?.id).single();
        if(error) throw error
        else customUser.value = data;
    });

    async function logout(){
        if(!user.value) return;

        const { error } = await supabase.auth.signOut();
        if(error) throw error;
        else{
            userStore.$reset();
            reloadNuxtApp();
        }
    }
</script>

<template>
    <div class="flex h-fullscreen">
        <main>
            <section class="w-screen flex items-center h-24">
                <img :src="customUser.pfp" alt="User pfp" width="96" height="96" />
                <h1 class="text-7xl font-mono font-black bg-clip-text px-4 text-transparent bg-gradient-to-r from-snow to-65% to-aero-100">{{ customUser.full_name }}</h1>
                <div class="flex items-center space-x-3">
                    <button @click="logout" class="hover:text-aero-100 hover:drop-shadow-navBtn transition-all duration-200 ease-out">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                    </button>
                    <button class="hover:text-aero-100 hover:drop-shadow-navBtn transition-all duration-200 ease-out">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </button>
                </div>
            </section>
        </main>
    </div>
</template>
