<script setup lang="ts">
    const user = useSupabaseUser()
    watch(user, () => {
      if (user.value) {
        return navigateTo('/chat')
      }
    }, { immediate: true })
</script>

<template>
  <main>Waiting for login...</main>
</template>