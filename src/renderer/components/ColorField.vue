<template>
  <div class="color-field">
    <input
      type="color"
      class="color-field-swatch"
      :value="normalized"
      @input="$emit('input', $event.target.value)">
    <input
      class="input is-medium"
      type="text"
      placeholder="#000000"
      :value="value"
      @input="$emit('input', $event.target.value)">
  </div>
</template>

<script>
  export default {
    name: 'ColorField',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    computed: {
      normalized () {
        return /^#[0-9a-fA-F]{6}$/.test(this.value || '') ? this.value : '#000000'
      }
    }
  }
</script>

<style lang="sass">
  .color-field
    display: flex
    align-items: stretch

    .color-field-swatch
      flex: 0 0 44px
      width: 44px
      padding: 2px
      margin-right: .5rem
      border: 1px solid #dbdbdb
      border-radius: 4px
      cursor: pointer
      background: none

    .input
      flex: 1
</style>
