import Vue from 'vue'
import Vuex from 'vuex'
import game from './modules/game'
import storedData from './modules/storedData'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        game,
        storedData
    },
});