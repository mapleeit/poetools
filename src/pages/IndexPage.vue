<template>
  <q-page>
    <q-card class="q-pa-md" flat>
      <q-input clearable filled color="green" v-model="modifier1" label="Modifier 1" />
      <q-input type="number" v-model="modifier1Min" label="Modifier 1 Min" class="q-mt-md" />
      <q-input type="number" v-model="modifier1Max" label="Modifier 1 Max" class="q-mt-md" />
      <q-input clearable filled color="green" v-model="modifier2" label="Modifier 2" class="q-mt-md" />
      <q-input type="number" v-model="modifier2Min" label="Modifier 2 Min" class="q-mt-md" />
      <q-input type="number" v-model="modifier2Max" label="Modifier 2 Max" class="q-mt-md" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'

const modifier1 = ref('')
const modifier1Min = ref(-Infinity)
const modifier1Max = ref(Infinity)
const modifier2 = ref('')
const modifier2Min = ref(-Infinity)
const modifier2Max = ref(Infinity)

watchEffect(() => {
  window.ioApi.send('auto-alter', {
    modifier1: {
      description: modifier1.value,
      min: modifier1Min.value,
      max: modifier1Max.value
    },
    modifier2: {
      description: modifier2.value,
      min: modifier2Min.value,
      max: modifier2Max.value
    }
  })
})

onMounted(() => {
  modifier1.value = '能量护盾上限提高'
  modifier1Min.value = 13
  modifier1Max.value = 20
  modifier2.value = '你和你的召唤生物受到的反射元素伤害降低'
  modifier2Min.value = 46
  modifier2Max.value = 100
})
</script>
