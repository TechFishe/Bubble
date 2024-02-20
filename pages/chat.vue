<script setup lang="ts">
  onMounted(() => {
    if (Notification.permission === "default") Notification.requestPermission();
  });
</script>

<template>
  <div class="flex h-fullscreen">
    <aside class="flex h-fullscreen w-1/4 flex-col border-r-2 border-r-snow/45">
      <FriendList />
      <GroupList />
    </aside>
    <NuxtPage />
  </div>
</template>

<style scoped>
  #noScrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
