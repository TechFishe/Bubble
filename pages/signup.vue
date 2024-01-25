<script setup lang="ts">
    useHead({
        title: "Bubble | Sign up"
    })
    
    import { useAlertStore } from "~/stores/store";
    import { createAvatar } from '@dicebear/core';
    import { bottts } from '@dicebear/collection';

    const supabase = useSupabaseClient();
    const alertStore = useAlertStore();

    const email = ref("");
    const pass = ref("");
    const confirmPass = ref("");
    const firstName = ref("");
    const lastName = ref("");

    async function signUp(){
        if(pass.value.length < 6){
            alertStore.msg = "Your password must be at least 6 characters.";
            alertStore.type = "error";
            alertStore.timesShown++;
            return;
        }
        else if(pass.value != confirmPass.value){
            alertStore.msg = "Your passwords do not match.";
            alertStore.type = "error";
            alertStore.timesShown++;
            return;
        }

        const { data, error } = await supabase.auth.signUp({ email: email.value, password: pass.value });
        if(error) throw error;
        //@ts-expect-error
        else newUser(data.user?.id);
    }

    async function newUser(uuid: string){
        let avatar = createAvatar(bottts, { size: 64, seed: uuid }).toDataUriSync();
        let fullName = firstName.value + " " + lastName.value;
        let todayDate = new Date();
        let date = todayDate.getFullYear() + "-" + todayDate.getMonth() + "-" + todayDate.getDate();
        //@ts-expect-error
        const { error } = await supabase.from('users').insert({ user_id: uuid, full_name: fullName, friends: [], pfp: avatar, date_joined: date });
        if(error) throw error;
        else navigateTo("/login");
    }
</script>

<template>
    <main class="flex w-screen h-fullscreen justify-center items-center">
        <div class="flex flex-col bg-shark-950 rounded-lg items-center w-1/3 px-2 py-2">
            <h1 class="text-7xl uppercase font-mono font-black bg-clip-text border-b-[3px] border-b-snow/15 px-4 text-transparent bg-gradient-to-r from-snow to-65% to-aero-100">Sign up</h1>
            <section class="space-y-4 w-full flex flex-col items-center mt-4">
                <input v-model="email" type="email" placeholder="Email" class="w-full bg-shark-900 text-lg rounded-sm pl-2 h-8 placeholder:italic outline-0" />
                <input v-model="pass" type="password" placeholder="Password" class="w-full bg-shark-900 text-lg rounded-sm pl-2 h-8 placeholder:italic outline-0" />
                <input v-model="confirmPass" type="password" placeholder="Confirm Password" class="w-full bg-shark-900 text-lg rounded-sm pl-2 h-8 placeholder:italic outline-0" />
                <section class="flex space-x-2 justify-center w-full">
                    <input v-model="firstName" type="text" placeholder="First Name" class="w-full bg-shark-900 text-lg rounded-sm pl-2 h-8 placeholder:italic outline-0" />
                    <input v-model="lastName" type="text" placeholder="Last Name" class="w-full bg-shark-900 text-lg rounded-sm pl-2 h-8 placeholder:italic outline-0" />
                </section>
            </section>
            <section class="space-x-4 w-full justify-center flex mt-4">
                <button @click="signUp" :disabled="email === '' || pass === '' || confirmPass === '' || firstName === '' || lastName === ''" class="border border-snow/85 px-4 py-1 disabled:cursor-not-allowed disabled:opacity-60 rounded-md text-xl enabled:hover:text-aero-400 enabled:hover:border-aero-200/85 enabled:hover:drop-shadow-[0_4px_3px_rgba(158,252,207,0.1)] transition-all duration-200 ease-out">Sign up</button>
                <NuxtLink to="/login" class="border border-snow/85 px-4 py-1 rounded-md text-xl hover:text-red-400 hover:border-red-200/85 hover:drop-shadow-[0_4px_3px_rgba(254,202,202,0.1)] transition-all duration-200 ease-out">Back</NuxtLink>
            </section>
        </div>
    </main>
</template>

<style scoped>
  main{
    background-color: #201e1f;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c9ffe2' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
