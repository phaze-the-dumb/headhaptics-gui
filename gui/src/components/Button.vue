<script setup lang="ts">
  defineProps({ text: String, id: String });
</script>

<template>
  <div class="button" :id="id">
    {{ text }}
  </div>
</template>

<style scoped>
  .button{
    padding: 10px 20px;
    display: inline-block;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    transition: 0.5s;
    background: #001c46;
    box-shadow: #001c46 0 0 0;
  }

  .button:hover{
    background: #005bd1;
    box-shadow: #005bd1 0 0 10px;
  }
</style>