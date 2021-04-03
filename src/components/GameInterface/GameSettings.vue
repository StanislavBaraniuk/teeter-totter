<template>
  <div class="settings" v-if="!gameStatus" @mouseleave="open = false">
    <button type="button" v-if="!open" class="settings__activator" @click="open = true">
      <SettingsSVG class="settings__activator-icon"/>
    </button>
    <div v-else class="settings__menu">
      <div class="settings__menu-item">
        <label class="checkbox">
          <span class="checkbox__title">AI Control</span>
          <input
              class="checkbox__input"
              type="checkbox"
              :checked="isBotActive"
              @change="(e) => toggleBotStatus(e.currentTarget.checked)"
          >
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsSVG from '@/assets/icons/Settings.svg'
import {mapGetters, mapActions} from 'vuex'
export default {
  name: "GameSettings",
  components: {
    SettingsSVG
  },
  data: () => ({
    open: false
  }),
  computed: {
    ...mapGetters('game', [
        "gameStatus",
        "isBotActive"
    ])
  },
  methods: {
    ...mapActions('game', [
        "toggleBotStatus"
    ])
  }
}
</script>

<style scoped lang="scss">
  $icon-size: 50px;
  $padding-main: 20px;
  $bgc: #0096db;
  $border-radius: 20px;

  .settings  {
    position: fixed;
    right: 20px;
    bottom: 20px;

    &__activator {
      padding: $padding-main;
      width: $icon-size + $padding-main * 2;
      height: $icon-size + $padding-main * 2;
      background-color: $bgc;
      border-radius: 100%;
      border: none;
      outline: none;
      cursor: pointer;
      transition: .3s;
      -webkit-box-shadow: 0px 0px 30px 0px rgba(34, 60, 80, 0.2);
      -moz-box-shadow: 0px 0px 30px 0px rgba(34, 60, 80, 0.2);
      box-shadow: 0px 0px 30px 0px rgba(34, 60, 80, 0.2);

      $parent: &;
      &:hover {
        background-color: rgba(0, 150, 219, 0.9);
        #{$parent}-icon {
          margin-left: -2px;
          margin-top: -2px;
          width: $icon-size + 4px;
          height: $icon-size + 4px;
        }
      }

      &-icon {
        transition: .3s;
        width: $icon-size;
        height: $icon-size;
      }
    }

    &__menu {
      min-height: $icon-size;
      padding: $padding-main;
      background-color: $bgc;
      border-radius: $border-radius;
      animation: menuAnimation 1s ease;
      overflow: hidden;
    }
  }

  .checkbox {
    width: 100%;
    &__title {
      font-size: 20px;
      padding: 5px;
    }
  }

  @media all and (max-width: 528px) {
    .settings {
      right: 10px;
      bottom: 10px;
      &__activator {
        padding: $padding-main / 2;
        width: ($icon-size + $padding-main * 2) / 2;
        height: ($icon-size + $padding-main * 2) / 2;

        $parent: &;
        &:hover {
          #{$parent}-icon {
            margin-left: -1px;
            margin-top: -1px;
            width: $icon-size/2 + 2px;
            height: $icon-size/2 + 2px;
          }
        }

        &-icon {
          width: $icon-size/2;
          height: $icon-size/2;
        }
      }

      &__menu {
        min-height: $icon-size/2;
        padding: $padding-main/2;
        border-radius: $border-radius/2;
      }
    }
  }
</style>