<template>
  <q-page>
    <q-card class="q-pa-md" flat>
      <div v-for="(modifier, index) in modifiers" :key="index" class="q-mb-lg">
        <div class="row items-center">
          <div class="col">
            <q-input clearable filled color="green" v-model="modifier.description" :label="`Modifier ${index + 1}`" />
          </div>
          <div class="col-auto q-ml-md">
            <q-btn flat round color="red" icon="remove" @click="removeModifier(index)" v-if="modifiers.length > 1"/>
          </div>
        </div>
        <q-input type="number" v-model="modifier.min" :label="`Modifier ${index + 1} Min`" class="q-mt-md" />
        <q-input type="number" v-model="modifier.max" :label="`Modifier ${index + 1} Max`" class="q-mt-md" />
      </div>

      <q-btn color="primary" class="q-mt-md" icon="add" label="Add Modifier" @click="addModifier" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'

interface Modifier {
  description: string
  min: number
  max: number
}

const modifiers = ref<Modifier[]>([
  {
    description: '',
    min: -Infinity,
    max: Infinity
  },
  {
    description: '',
    min: -Infinity,
    max: Infinity
  }
])

const addModifier = () => {
  modifiers.value.push({
    description: '',
    min: -Infinity,
    max: Infinity
  })
}

const removeModifier = (index: number) => {
  modifiers.value.splice(index, 1)
}

watchEffect(() => {
  const data = modifiers.value.reduce((acc, modifier, index) => {
    acc[`modifier${index + 1}`] = {
      description: modifier.description,
      min: modifier.min,
      max: modifier.max
    }
    return acc
  }, {} as Record<string, Modifier>)

  window.ioApi.send('auto-alter', data)
})

onMounted(() => {
  modifiers.value = [
    {
      description: '迸出的',
      min: -Infinity,
      max: Infinity
    },
    {
      description: '无情的',
      min: -Infinity,
      max: Infinity
    },
    {
      description: '独裁者的',
      min: -Infinity,
      max: Infinity
    }
  ]
})
</script>
