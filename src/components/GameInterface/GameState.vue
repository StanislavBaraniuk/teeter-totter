<template>
  <div class="state">
    <p class="state__title" v-text="title"></p>
    <p class="state__value" v-text="value"></p>
  </div>
</template>

<script>
export default {
  name: "GameState",
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
  $title-padding: 10px;
  $title-font-s: 20px;
  $value-padding-b: 10px;
  $value-font-s: 15px;

  .state {
    width: 100%;
    height: 100%;

    &__title {
      padding: $title-padding;
      font-size: $title-font-s;
      white-space: nowrap;
    }

    &__value {
      padding-bottom: $value-padding-b;
      font-size: $value-font-s;
    }
  }

  @media all and (max-width: 528px) {
    .state {
      &__title {
        padding: $title-padding/2;
        font-size: $title-font-s/2;
      }
      &__value {
        padding-bottom: $value-padding-b/2;
        font-size: $value-font-s/2;
      }
    }
  }
</style>