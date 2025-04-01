<template>
    <div class="stat-card">
      <v-icon :color="color">{{ icon }}</v-icon>
      <div class="stat-content">
        <div class="stat-title">{{ title }}</div>
        <div class="stat-value" :style="{ color }">{{ value }}</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['icon', 'title', 'value', 'color']
  }
  </script>
  
  <style scoped>
  .stat-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .stat-content {
    margin-left: 1rem;
  }
  
  .stat-title {
    font-size: 0.9rem;
    color: #666;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
  }
  </style>