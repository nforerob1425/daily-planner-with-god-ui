<template>
    <div class="color-box" :style="{ backgroundColor: color }">
      <span class="rank-badge">#{{ rank }}</span>
    </div>
  </template>
  
  <script>
  export default {
    props: ['color', 'rank']
  }
  </script>
  
  <style scoped>
  .color-box {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    position: relative;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-left: 20px;
  }
  
  .rank-badge {
    position: absolute;
    bottom: -8px;
    right: -8px;
    background: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  </style>