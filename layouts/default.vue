<script setup lang="ts">
  import { useAlertStore } from '#imports'; 
  import { useUserStore } from '#imports';

  const showAlert = ref(false);
  const loggedIn = ref(false);

  const alertStore = useAlertStore();
  const userStore = useUserStore();

  alertStore.$subscribe(newAlert, { detached: true});
  userStore.$subscribe(changeIcon, { detached: true} );

  function newAlert(){
    showAlert.value = true;
    setTimeout(() => {
      showAlert.value = false;
    }, 5000)
  }

  function changeIcon(){
    loggedIn.value = !loggedIn.value;
  }
</script>

<template>
  <div id="screen" class="bg-shark-950 text-snow overflow-x-hidden min-h-screen">
      <header id="top" class="h-24 border-b-2 border-b-snow/45 bg-shark-950 flex w-screen px-8">
        <section class="flex items-center">
          <span class="text-6xl font-mono tracking-tight font-bold h-fit hidden md:flex">Bubble</span>
          <div class="flex max-h-fit md:-ml-2">
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 225" preserveAspectRatio="xMidYMid meet" class="w-20 h-20 text-aero-100">
              <g transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="currentColor">
                <path d="M1015 1908 c-148 -38 -276 -75 -282 -80 -25 -20 -15 -55 22 -77 49 -29 75 -75 75 -136 0 -76 -7 -88 -65 -123 -30 -18 -91 -60 -136 -95 -45 -34 -90 -68 -99 -75 -14 -10 -21 -6 -49 37 -69 108 -194 186 -313 198 -58 5 -68 3 -87 -16 -30 -30 -26 -60 19 -144 91 -168 104 -268 55 -415 -16 -46 -43 -109 -62 -140 -46 -75 -51 -104 -24 -131 43 -43 197 -18 302 50 54 35 117 106 138 157 l13 31 61 -48 c139 -109 245 -168 397 -222 96 -34 105 -39 112 -67 5 -20 3 -58 -7 -104 -19 -94 -19 -104 5 -128 17 -17 33 -20 120 -20 83 0 108 4 143 21 107 54 170 120 206 214 l18 47 94 25 c117 30 255 96 334 160 61 50 144 145 173 198 26 50 20 114 -18 181 -99 177 -235 299 -420 377 -36 16 -71 31 -78 35 -8 4 -22 31 -32 60 -55 156 -188 283 -312 297 -20 2 -143 -25 -303 -67z m353 -44 c28 -14 70 -46 91 -71 39 -44 88 -130 79 -139 -3 -2 -60 1 -126 8 -170 17 -306 -5 -474 -77 -16 -6 -18 -1 -18 36 -1 50 -21 112 -44 138 -15 17 -5 21 201 74 120 30 223 56 229 56 5 1 33 -11 62 -25z m167 -308 c237 -52 399 -162 524 -356 23 -35 44 -74 47 -87 13 -51 -132 -215 -249 -282 -139 -79 -304 -115 -532 -115 -157 0 -177 2 -260 28 -157 48 -333 147 -479 271 -38 32 -74 55 -84 53 -10 -2 -32 -34 -53 -76 -58 -117 -145 -189 -252 -208 l-39 -7 35 69 c98 195 103 353 16 532 -18 37 -35 71 -37 76 -3 4 6 5 19 1 90 -26 188 -103 254 -200 49 -70 66 -71 142 -4 170 150 372 263 553 310 89 23 280 21 395 -5z m-62 -947 c-8 -31 -71 -96 -123 -128 -43 -27 -60 -31 -119 -31 l-70 0 10 32 c5 18 9 58 9 88 l0 55 149 0 c136 1 148 0 144 -16z" />
                <path d="M1649 1231 c-20 -20 -29 -39 -29 -61 0 -43 47 -90 90 -90 43 0 90 47 90 90 0 22 -9 41 -29 61 -40 39 -82 39 -122 0z" />
              </g>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="-ml-3 w-[2.75rem] h-[2.75rem]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
        </section>
        <nav class="flex justify-end items-center w-full">
          <NuxtLink to="/" class="hover:text-aero-100 mr-1.5 hover:drop-shadow-navBtn transition-all duration-200 ease-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </NuxtLink>
          <div class="h-6 w-0 border border-snow/15"></div>
          <NuxtLink to="/chat" class="hover:text-aero-100 mx-1.5 hover:drop-shadow-navBtn transition-all duration-200 ease-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </NuxtLink>
          <div class="h-6 w-0 border border-snow/15"></div>
          <!-- <button class="hover:text-aero-100 mx-1.5 hover:drop-shadow-navBtn transition-all duration-200 ease-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </button>
          <div class="h-6 w-0 border border-snow/15"></div> -->
          <NuxtLink v-if="!loggedIn" to="/user" class="hover:text-aero-100 ml-1.5 hover:drop-shadow-navBtn transition-all duration-200 ease-out">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </NuxtLink>
          <NuxtLink v-else to="/user" class="ml-1.5">
            <img :src="userStore.pfp" alt="User pfp" width="40px" height="40px" />
          </NuxtLink>
        </nav>
        <article v-if="showAlert" :class="{'bg-red-400': alertStore.type === 'error', 'bg-amber-400': alertStore.type === 'warn', 'bg-aero-400': alertStore.type === 'ok'}" class="absolute w-1/6 rounded-b-md top-24 h-10 right-1/2 left-1/2 -translate-x-1/2">
          <p class="w-full text-center">{{ alertStore.msg }}</p>
        </article>
      </header>
      <slot />
      <footer class="flex w-screen min-h-24 border-t-2 border-snow/45 px-4 bg-shark-950">
        <div class="flex flex-grow"></div>
        <a href="#top" class="hover:text-aero-100 ml-1.5 hover:drop-shadow-navBtn transition-all duration-200 ease-out self-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
          </svg>
        </a>
      </footer>
  </div>
</template>
