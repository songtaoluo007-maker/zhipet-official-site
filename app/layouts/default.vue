<script setup lang="ts">
import AppFooter from '~/components/layout/AppFooter.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
</script>

<template>
  <div class="site-shell">
    <AppHeader />
    <main id="main-content" class="site-shell__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.site-shell {
  min-height: 100vh;
}

.site-shell__main {
  min-height: 60vh;
}
</style>
