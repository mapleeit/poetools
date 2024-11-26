<template>
  <q-page>
    <q-card class="q-ma-md" flat>
      <q-input clearable filled color="green" v-model="modifier1" label="Modifier 1" />
      <q-input clearable filled color="green" v-model="modifier2" label="Modifier 2" class="q-mt-md" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'

const modifier1 = ref('')
const modifier2 = ref('')

watchEffect(() => {
  window.ioApi.send('auto-alter', {
    modifier1: modifier1.value,
    modifier2: modifier2.value
  })
})

onMounted(() => {
  modifier1.value = '灿烂的'
  modifier2.value = '稳步坚决的'
})
</script>
