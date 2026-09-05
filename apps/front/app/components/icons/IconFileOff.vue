<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path
      d="M4 5.5C4 4.67 4.67 4 5.5 4H15l4 4v10.5c0 .83-.67 1.5-1.5 1.5h-12A1.5 1.5 0 0 1 4 18.5v-13Z"
    />
    <path d="M15 4v4h4" />
    <path d="m9.5 12.5 5 5" />
    <path d="m14.5 12.5-5 5" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 24 })
</script>
