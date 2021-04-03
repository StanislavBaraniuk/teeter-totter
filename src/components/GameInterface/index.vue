<template>
  <div class="interface" id="interface">
    <div class="interface__nav">
      <play-button :status="gameStatus" @toggle="updateGameStatus"/>
    </div>
    <div class="interface__stats">
      <game-state class="interface__stats-item" v-for="item in gameStats" :title="item.title" :value="item.value" :key="item.title"/>
    </div>
    <game-settings/>
    <modal-frame
        v-if="gameOverModal.status"
        text="Game over :))"
        hint="The outcome of the game will send to session statistic."
        button="COOL"
        @onButtonClick="gameOverModal.callback"
    />
  </div>
</template>

<script>
import {
  ATTEMPTS_COUNTER,
  USED_WEIGHT,
  WINS_COUNTER,
  INCREASE_COUNTER
} from '@/store/storedDataConstants'
import PlayButton from "./PlayButton";
import {mapGetters, mapActions} from 'vuex'
import GameState from "./GameState";
import GameSettings from "./GameSettings";
import ModalFrame from "./ModalFrame";
export default {
  name: "index",
  components: {
    ModalFrame,
    GameSettings,
    GameState,
    PlayButton
  },
  computed: {
    ...mapGetters('game', [
        'gameStatus',
        'gameOverModal'
    ]),
    ...mapGetters('storedData', [
        ATTEMPTS_COUNTER,
        WINS_COUNTER
    ]),
    gameStats: function () {
      return [
        { title: 'Game attempts', value: this.$store.getters['storedData/' + ATTEMPTS_COUNTER] },
        { title: 'Weight used', value: this.$store.getters['storedData/' + USED_WEIGHT ] },
      ]
    }
  },
  methods: {
    ...mapActions('game', {
      updateGameStatus: 'gameStatus'
    }),
    ...mapActions('storedData', {
      attemptsCounterIncrease: ATTEMPTS_COUNTER + INCREASE_COUNTER
    })
  }
}
</script>

<style scoped lang="scss">
  .interface {
    width: 100%;
    &__stats {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      &-item {
        flex: 1;
        background-color: rgba(166, 1, 203, 1);
        color: white;

        &:nth-child(2n+1) {
          background-color: rgba(166, 1, 203, 0.5);
          color: black;
        }
      }
    }
  }
</style>