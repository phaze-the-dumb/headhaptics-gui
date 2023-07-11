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

  <div class="bottom-tip">Not seeing your device? Make sure it has the <span class="link" id="runtime-link">kaluma runtime</span> installed</div>

  <div class="bottom-minimise">
    <Button text="Minimise" id="minimise-button"></Button>
  </div>

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

  .bottom-tip{
    position: fixed;
    bottom: 20px;
    font-size: 14px;
    padding: 10px;
  }

  .link{
    cursor: pointer;
    color: #00ccff;
  }

  .bottom-minimise{
    position: fixed;
    bottom: 0px;
    font-size: 14px;
    padding: 10px;
    width: calc(100% - 20px);
  }
</style>
