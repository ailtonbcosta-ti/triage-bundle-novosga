<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'triage'
  }
</script>

<style>
  @import "~bulma/css/bulma.css";
  @import "~font-awesome/css/font-awesome.min.css";

  /* Ajuste visual leve: tipografia, cantos arredondados e profundidade sutil */
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .button {
    border-radius: 10px;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(10, 10, 10, 0.08);
    transition: transform .12s ease, box-shadow .12s ease;
  }

  .button:hover:not([disabled]) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(10, 10, 10, 0.14);
  }

  .button:active:not([disabled]) {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(10, 10, 10, 0.1);
  }

  .input,
  .textarea,
  .select select {
    border-radius: 8px;
  }

  .modal-card,
  .box,
  .card {
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(10, 10, 10, 0.12);
  }

  .table {
    border-radius: 8px;
    overflow: hidden;
  }
</style>
