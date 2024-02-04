<script setup>
    const user = useSupabaseUser();

    watch(user, async () => {
        if (user.value) {
            return navigateTo('/chat');
        }
    }, { immediate: true });
</script>

<template>
    <div>
        loading. . .
    </div>
</template>