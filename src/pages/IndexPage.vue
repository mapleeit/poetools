<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="moveMouse">Move Mouse</q-btn>
  </q-page>
</template>

<script setup lang="ts">
const moveMouse = () => {
  window.electron.moveMouse(100, 100)
}
</script>
