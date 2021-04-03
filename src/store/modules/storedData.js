const getFromStorage = (key) => +(localStorage.getItem(key) ?? 0)

import {
    ATTEMPTS_COUNTER,
    USED_WEIGHT,
    INCREASE_COUNTER
} from '../storedDataConstants'

const state = {
    [ATTEMPTS_COUNTER]: getFromStorage(ATTEMPTS_COUNTER),
    [USED_WEIGHT]: getFromStorage(USED_WEIGHT),
}

const getters = {
    [ATTEMPTS_COUNTER]: (state) => state[ATTEMPTS_COUNTER],
    [USED_WEIGHT]: (state) => state[USED_WEIGHT],
}

const mutations = {
    [ATTEMPTS_COUNTER + INCREASE_COUNTER]: (state) => ++state[ATTEMPTS_COUNTER],
    [USED_WEIGHT + INCREASE_COUNTER]: (state, addWeight) => state[USED_WEIGHT] = state[USED_WEIGHT] + addWeight,
}

const actions = {
    [ATTEMPTS_COUNTER + INCREASE_COUNTER]: ({commit, state}) => {
        localStorage.setItem(ATTEMPTS_COUNTER, state[ATTEMPTS_COUNTER]+1)
        commit(ATTEMPTS_COUNTER + INCREASE_COUNTER)
    },
    [USED_WEIGHT + INCREASE_COUNTER]: ({commit, state}, addWeight) => {
        localStorage.setItem(USED_WEIGHT, state[USED_WEIGHT]+addWeight)
        commit(USED_WEIGHT + INCREASE_COUNTER, addWeight)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};