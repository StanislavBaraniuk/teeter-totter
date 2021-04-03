<template>
    <button type="button" class="play-button" @click="toggleButton">
      <PlaySvg v-if="!status" class="play-button__icon"/>
      <PauseSvg v-else class="play-button__icon"/>
      <span class="play-button__hint">Click here  or press 'Space' for Start/Stop</span>
    </button>
</template>

<script>
import PlaySvg from '@/assets/icons/Play.svg'
import PauseSvg from '@/assets/icons/Pause.svg'

function keySpaceHandler(e) {
  if (e.code === 'Space') this.$el.click()
}

export default {
  name: "PlayButton",
  props: {
    status: {
      type: Boolean,
      default: false
    },
    keyboard: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      keySpaceHandler: keySpaceHandler.bind(this)
    }
  },
  components: {
    PlaySvg,
    PauseSvg
  },
  methods: {
    toggleButton() {
      this.$emit('toggle', !this.$props.status)
    },
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keySpaceHandler)
  },
  mounted() {
    window.addEventListener('keydown', this.keySpaceHandler)
  }
}
</script>

<style scoped lang="scss">
  .play-button {
    width: 100vw;
    height: 90px;
    line-height: 90px;
    display: flex;
    justify-content: center;
    border: none;
    background-color: #0096db;
    cursor: pointer;
    outline: none;

    $parent: &;
    &:hover {
      transition: .3s;
      background-color: rgba(0, 150, 219, 0.8);

      #{$parent}__icon {
        padding: 18px;
        width: 52px;
      }
    }

    &__icon {
      transition: .2s;
      padding: 20px;
      width: 50px;
    }

    &__hint {
      font-size: 15px;
      font-weight: bold;
    }
  }

  @media all and (max-width: 528px) {
    .play-button {
      height: 50px;
      line-height: 50px;
      &__icon {
        padding: 10px;
        width: 30px;
      }
      &__hint {
        font-size: 10px;
      }
      $parent: &;
      &:hover {
        #{$parent}__icon {
          padding: 8px;
          width: 32px;
        }
      }
    }
  }
</style>