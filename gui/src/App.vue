<script setup lang="ts">
  import Button from './components/Button.vue';
</script>

<template>
  <div class="nav-bar"></div>
  <br />

  <h1>Head Haptics</h1>
  <h2 class="sub">Manager</h2>
  <br />

  <div class="indicator">
    <div class="indicator-light" id="indicator-light"></div>
    <div class="spacer"></div>
    <span id="indicator-text">Not Connected</span>
  </div>
  <br />

  <Button text="Detect Device" id="detect-devices-btn"></Button>

  <div class="waiting-for-backend">
    Waiting for backend...
  </div>
</template>

<style scoped>
  .nav-bar{
    height: 10px;
    width: 100%;
    -webkit-app-region: drag;
    background: #0002;
  }

  .sub{
    font-weight: 300;
    color: #777;
    font-size: 20px;
  }

  .spacer{
    padding: 5px;
  }

  .indicator{
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
  }

  .indicator-light{
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }

  .waiting-for-backend{
    position: fixed;
    bottom: 5px;
    left: 5px;
    font-size: 12px;
    display: none;
  }
</style>
