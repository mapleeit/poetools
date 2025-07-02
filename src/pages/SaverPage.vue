<template>
  <q-page>
    <q-card class="q-pa-md" flat>
      <div class="row q-mb-md">
        <div class="col">
          <h5 class="q-my-none">自动存包配置</h5>
        </div>
      </div>

      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model="saveName"
            label="Save Name"
            outlined
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const saveName = ref('')
</script>
