<script setup>
import AppHeader from '../components/ui/AppHeader.vue'
import AppFooter from '../components/ui/AppFooter.vue'
</script>

<template>
  <div class="relative w-full">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
