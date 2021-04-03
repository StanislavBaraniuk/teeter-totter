<template>
  <div class="wrapper" v-once>
    <div class="modal">
      <p class="modal__text" v-text="text"></p>
      <p class="modal__hint" v-text="hint"></p>
      <button ref="button" type="button" class="modal__button" @click="$emit('onButtonClick')" v-text="button"></button>
      <span class="modal__button-hint"> Or press Еnter/Space</span>
    </div>
  </div>
</template>

<script>

export default {
  name: "ModalFrame",
  props: {
    text: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    button: {
      type: String,
      default: ''
    }
  },
  mounted() {
    const that = this;
    const s = {
      handleEvent: function(e) {
        if (e.code === 'Enter' ||  e.code === 'Space') {
          document.removeEventListener('keydown', this, true);
          that.$refs['button']?.click()
          e.stopPropagation()
        }
      },
      addHandler: function () {
        document.addEventListener('keydown', this, true)
      }
    }

    s.addHandler()
  }
}
</script>

<style scoped lang="scss">

  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.5);
  }

  .modal {
    padding: 20px;
    min-width: 300px;
    width: 500px;
    height: auto;
    border-radius: 5px;
    border: 1px solid rgba(0,0,0,0.2);
    background-color: #fff;
    -webkit-box-shadow: 0px 0px 30px 0px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 0px 30px 0px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 0px 30px 0px rgba(34, 60, 80, 0.2);

    &__text {
      padding-top: 10px;
      padding-bottom: 20px;
      font-size: 20px;
      font-weight: bold;
    }
    &__hint {
      font-size: 15px;
      font-weight: lighter;
    }
    &__button {
      margin-top: 30px;
      width: 100px;
      height: 50px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background-color: #dedede;
      transition: .3s;
      outline: none;

      &-hint {
        padding-left: 10px;
        font-size: 12px;
      }

      &:hover {
        background-color: #868686;
        color: white;
      }

      &:focus {
        background-color: #5b5b5b;
        color: white;
      }
    }
  }
</style>