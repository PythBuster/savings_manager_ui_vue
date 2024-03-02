<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500px"
    @update:model-value="updateVisibilityState"
  >
    <v-card>
      <v-card-title class="headline">{{ $t('error') }}</v-card-title>
      <v-card-text>{{ errorMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="closeDialog">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  errorMessage: String
})

const emit = defineEmits(['update:modelValue'])

function closeDialog() {
  emit('update:modelValue', false)
}

function updateVisibilityState(value) {
  emit('update:modelValue', value)
}
</script>
