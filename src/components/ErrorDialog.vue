<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title class="text-error">{{ $t('error') }}</v-card-title>
      <v-card-text>{{ errorMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="closeDialog">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  errorMessage: {
    type: String,
    default: ''
  }
})

// Keep same v-model binding as before
const dialogVisible = defineModel()

function closeDialog() {
  dialogVisible.value = false
}
</script>
