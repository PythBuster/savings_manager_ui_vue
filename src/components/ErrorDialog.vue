<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
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
  errorMessage: String
})

const dialogVisible = defineModel()

function closeDialog() {
  dialogVisible.value = false
}
</script>
