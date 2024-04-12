<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4">{{ $t('settings') }}</h1>
      </v-col>
    </v-row>
    <v-row :class="display.smAndUp ? 'mt-16' : ''">
      <v-col cols="12" sm="6">
        <v-card>
          <v-list v-model="selectedMode">
            <v-list-item
              v-for="(mode, index) in modes"
              :key="index"
              :value="mode"
              @click="selectedMode = mode"
              :class="{ 'v-list-item--active': selectedMode === mode }"
            >
              <v-list-item-title>{{ mode }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4" offset-md="1">
        <SavingsSettingsOverview />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn @click="saveClicked">{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import router from '@/router/index.js'
import { ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

const { t } = useI18n({})

const selectedMode = ref(t('add-up'))

const modes = ref([])

// Use watchEffect to automatically update when locale changes
watchEffect(() => {
  modes.value = [t('add-up'), t('fill-envelopes'), t('collect')]
})

function saveClicked() {
  router.push({
    path: '/overflow'
  })
}
</script>
