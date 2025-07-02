<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
        <q-list padding>
          <q-item
            clickable
            v-ripple
            :active="currentRoute === '/craft'"
            active-class="bg-primary text-white"
            to="/craft"
          >
            <q-item-section avatar>
              <q-icon name="construction" />
            </q-item-section>

            <q-item-section>
              Craft
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="currentRoute === '/saver'"
            active-class="bg-primary text-white"
            to="/saver"
          >
            <q-item-section avatar>
              <q-icon name="save" />
            </q-item-section>

            <q-item-section>
              Saver
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute()
const drawer = ref(false)

const currentRoute = computed(() => route.path)
</script>
