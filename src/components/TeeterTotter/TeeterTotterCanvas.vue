<template>
  <div class="swing">
    <canvas class="swing__canvas" ref="canvas" width="700" height="700"/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {CanvasDelegate} from "../../Game/CanvasDelegate";
import {GameDelegate} from "../../Game/GameDelegate";
export default {
  name: "TeeterTotterCanvas",
  computed: {
    ...mapGetters('game', [
        "gameDelegate"
    ])
  },
  methods: {
    ...mapActions('game', {
      setGameDelegate: "gameDelegate"
    }),
  },
  mounted() {
    const ctx = this.$refs['canvas']?.getContext('2d');

    const interfaceHeight = () => document.getElementById('interface').clientHeight
    const interfaceWidth = () => document.getElementById('interface').clientWidth
    const canvasDelegate = new CanvasDelegate(ctx, interfaceWidth(), Math.min(screen.height, window.innerHeight) - interfaceHeight())
    const gameDelegate = new GameDelegate(canvasDelegate)

    // drop delegate to store
    this.setGameDelegate(gameDelegate)

    const that = this;

    // add screen resizing handler for change canvas dimensions
    window.onresize = () => {
      resizeThrottler.call(that)
    }

    let resizeTimeout;
    function resizeThrottler() {
      if ( !resizeTimeout ) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          actualResizeHandler.call(this);
        }, 66);
      }
    }

    function actualResizeHandler() {
      gameDelegate.changeCanvasDimensions(interfaceWidth(), Math.min(screen.height, window.innerHeight)  - interfaceHeight())
    }
  }
}
</script>

<style scoped lang="scss">
  .swing {
    width: 100%;
    //height: auto;

    &__canvas {
      //background-color: wheat;
      //width: 100%;
      //height: 100%;
    }
  }
</style>