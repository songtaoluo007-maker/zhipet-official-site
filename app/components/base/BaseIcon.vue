<template>
  <svg
    class="base-icon"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :aria-hidden="label ? undefined : 'true'"
    :role="label ? 'img' : undefined"
    focusable="false"
  >
    <title v-if="label">{{ label }}</title>

    <g
      :stroke-width="strokeWidth"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <template v-if="name === 'arrow-right'">
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </template>

      <template v-else-if="name === 'arrow-up'">
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </template>

      <template v-else-if="name === 'building'">
        <path d="M4 21V5.8A1.8 1.8 0 0 1 5.8 4h7.4A1.8 1.8 0 0 1 15 5.8V21" />
        <path d="M15 9h3.2A1.8 1.8 0 0 1 20 10.8V21" />
        <path d="M8 8h3" />
        <path d="M8 12h3" />
        <path d="M8 16h3" />
        <path d="M4 21h17" />
      </template>

      <template v-else-if="name === 'chart'">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 15v-4" />
        <path d="M12 15V8" />
        <path d="M16 15v-6" />
      </template>

      <template v-else-if="name === 'check-circle'">
        <path d="M21 11.1V12a9 9 0 1 1-5.4-8.2" />
        <path d="m9.2 11.8 2.2 2.2L21 4.4" />
      </template>

      <template v-else-if="name === 'collar'">
        <path d="M5 9a7 7 0 0 0 14 0" />
        <path d="M4.4 7.4c4.7 1.8 10.5 1.8 15.2 0" />
        <path d="M8 8.4V6.8A1.8 1.8 0 0 1 9.8 5h4.4A1.8 1.8 0 0 1 16 6.8v1.6" />
        <path d="M12 15v4" />
        <path d="M10.5 19h3" />
      </template>

      <template v-else-if="name === 'headset'">
        <path d="M4.5 13.5v-1.2a7.5 7.5 0 0 1 15 0v1.2" />
        <path d="M6.8 18h-1A1.8 1.8 0 0 1 4 16.2v-1.4A1.8 1.8 0 0 1 5.8 13h1.4v5Z" />
        <path d="M17.2 18h1a1.8 1.8 0 0 0 1.8-1.8v-1.4a1.8 1.8 0 0 0-1.8-1.8h-1.4v5Z" />
        <path d="M16.8 18c-.6 1.2-1.7 2-3.2 2H12" />
      </template>

      <template v-else-if="name === 'heart-pulse'">
        <path
          d="M20.8 8.6c0 5.1-8.8 10.1-8.8 10.1S3.2 13.7 3.2 8.6A4.4 4.4 0 0 1 11 5.8a4.4 4.4 0 0 1 9.8 2.8Z"
        />
        <path d="M7.6 12h2.2l1.2-2.6 2.1 5.1 1.4-2.5h2" />
      </template>

      <template v-else-if="name === 'home'">
        <path d="m3.5 11 8.5-7 8.5 7" />
        <path d="M5.5 10v9.2A1.8 1.8 0 0 0 7.3 21h9.4a1.8 1.8 0 0 0 1.8-1.8V10" />
        <path d="M9.5 21v-6h5v6" />
      </template>

      <template v-else-if="name === 'hospital'">
        <path d="M4 21V6.8A1.8 1.8 0 0 1 5.8 5h12.4A1.8 1.8 0 0 1 20 6.8V21" />
        <path d="M9 21v-5h6v5" />
        <path d="M12 8.5v5" />
        <path d="M9.5 11h5" />
        <path d="M3 21h18" />
      </template>

      <template v-else-if="name === 'lock'">
        <path d="M7 10V7.8a5 5 0 0 1 10 0V10" />
        <path d="M6.8 10h10.4A1.8 1.8 0 0 1 19 11.8v6.4a1.8 1.8 0 0 1-1.8 1.8H6.8A1.8 1.8 0 0 1 5 18.2v-6.4A1.8 1.8 0 0 1 6.8 10Z" />
        <path d="M12 14v2.5" />
      </template>

      <template v-else-if="name === 'mail'">
        <path
          d="M4.8 6h14.4A1.8 1.8 0 0 1 21 7.8v8.4a1.8 1.8 0 0 1-1.8 1.8H4.8A1.8 1.8 0 0 1 3 16.2V7.8A1.8 1.8 0 0 1 4.8 6Z"
        />
        <path d="m4 7 8 6 8-6" />
      </template>

      <template v-else-if="name === 'map-pin'">
        <path d="M12 21s6.5-5.3 6.5-11a6.5 6.5 0 0 0-13 0c0 5.7 6.5 11 6.5 11Z" />
        <path d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
      </template>

      <template v-else-if="name === 'menu'">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </template>

      <template v-else-if="name === 'phone'">
        <path
          d="M8 3.5h8A2.5 2.5 0 0 1 18.5 6v12A2.5 2.5 0 0 1 16 20.5H8A2.5 2.5 0 0 1 5.5 18V6A2.5 2.5 0 0 1 8 3.5Z"
        />
        <path d="M10 17.5h4" />
      </template>

      <template v-else-if="name === 'search'">
        <path d="m20 20-4.6-4.6" />
        <path d="M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
      </template>

      <template v-else-if="name === 'shield-check'">
        <path d="M12 21s7-3.5 7-10V5.5L12 3 5 5.5V11c0 6.5 7 10 7 10Z" />
        <path d="m9.4 11.6 1.8 1.8 3.8-4" />
      </template>

      <template v-else-if="name === 'sparkles'">
        <path d="M12 3 13.6 8.4 19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
        <path d="M5 16.5 5.8 19l2.7.8-2.7.8L5 23l-.8-2.4-2.7-.8 2.7-.8L5 16.5Z" />
      </template>

      <template v-else-if="name === 'store'">
        <path d="M4 10h16" />
        <path d="M5 10 6.2 4h11.6L19 10" />
        <path d="M6 10v9a1.8 1.8 0 0 0 1.8 1.8h8.4A1.8 1.8 0 0 0 18 19v-9" />
        <path d="M9.5 21v-5h5v5" />
      </template>

      <template v-else-if="name === 'users'">
        <path d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20" />
        <path d="M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M20 20v-1.2a3.2 3.2 0 0 0-2.4-3.1" />
        <path d="M15.7 4.3a3.3 3.3 0 0 1 0 6.4" />
      </template>

      <template v-else-if="name === 'x'">
        <path d="M6 6 18 18" />
        <path d="M18 6 6 18" />
      </template>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { IconName } from '~/types/ui'

withDefaults(
  defineProps<{
    name: IconName
    label?: string
    strokeWidth?: number
  }>(),
  {
    label: undefined,
    strokeWidth: 1.8,
  },
)
</script>

<style scoped>
.base-icon {
  display: block;
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
}
</style>
