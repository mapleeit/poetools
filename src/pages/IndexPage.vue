<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="moveMouse">Move Mouse</q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { Point } from '../../shared/Point'

const moveMouse = () => {
  window.mouseApi.setMousePosition(new Point(100, 100))
}
</script>
