<template>
  <q-page>
    <q-card class="q-pa-md" flat>
      <div class="row q-mb-md">
        <div class="col">
          <h5 class="q-my-none">自动改造配置</h5>
        </div>
      </div>

      <div v-for="(modifier, index) in modifiers" :key="index" class="q-mb-lg">
        <div class="row items-center q-mb-md">
          <div class="col">
            <q-input
              clearable
              filled
              color="primary"
              v-model="modifier.description"
              :label="`Modifier ${index + 1}`"
              class="text-weight-medium"
            />
          </div>
          <div class="col-auto q-ml-md">
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="removeModifier(index)"
              v-if="modifiers.length > 1"
            />
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input
              type="number"
              filled
              v-model="modifier.min"
              :label="`Minimum Value`"
              color="primary"
            />
          </div>
          <div class="col-6">
            <q-input
              type="number"
              filled
              v-model="modifier.max"
              :label="`Maximum Value`"
              color="primary"
            />
          </div>
        </div>
      </div>

      <q-btn color="primary" class="q-mt-md" icon="add" label="Add Modifier" @click="addModifier" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, watch } from 'vue'

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
  window.ioApi.send('auto-alter', modifiers.value.map(item => ({
    description: item.description,
    min: item.min,
    max: item.max
  })))
})

watch(modifiers, async (newVal) => {
  await window.ioApi.saveData('modifiers', newVal.map(item => ({
    description: item.description,
    min: item.min,
    max: item.max
  })))
}, { deep: true })

onMounted(async () => {
  // Try to load saved modifiers first
  try {
    const result = await window.ioApi.loadData('modifiers')
    if (result.success && result.data) {
      modifiers.value = result.data as Modifier[]
    }
  } catch (error) {
    console.error('Error loading modifiers on startup:', error)
  }
})
</script>
