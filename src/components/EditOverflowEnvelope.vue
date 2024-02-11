<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ $t('settings') }}</h1>
      </v-col>
    </v-row>
    <v-row>
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
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn>{{ $t('save') }}</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({})

const selectedMode = ref(t('add-up'))

const modes = [t('add-up'), t('fill-envelopes'), t('collect')]
</script>
