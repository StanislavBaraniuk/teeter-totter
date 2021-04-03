import {
    ATTEMPTS_COUNTER,
    USED_WEIGHT,
    WINS_COUNTER,
    INCREASE_COUNTER
} from '../storedDataConstants'

const state = {
    gameStatus: null,
    isBotActive: false,
    gameDelegate: null,
    gameOverModalData: {
        status: false,
        callback: () => {}
    }
}

const getters = {
    gameStatus: (state) => state.gameStatus,
    isBotActive: (state) => state.isBotActive,
    gameDelegate: (state) => state.gameDelegate,
    gameOverModal: (state) => state.gameOverModalData
}

const mutations = {
    stopGame: (state) => {
        state.gameStatus = false
        state.gameDelegate.pause()
    },
    resumeGame: (state) => {
        state.gameStatus = true
        if (!state.gameDelegate.isStarted) state.gameDelegate.start()
        else if (state.gameDelegate.isPause) state.gameDelegate.resume()
    },
    activateBot: (state) => {
        state.gameDelegate.players.left.keyboard = false
        state.isBotActive = true
    },
    deactivateBot: (state) => {
        state.gameDelegate.players.left.keyboard = true
        state.isBotActive = false
    },
    gameDelegate: (state, gameDelegate) => {
        state.gameDelegate = gameDelegate
    },
    updateGameOverModal: (state, callback = null) => {
        state.gameOverModalData.callback = callback
        state.gameOverModalData.status =  typeof callback === 'function'
    },
}

const actions = {
    gameStatus: ({commit}, newStatus) => commit(newStatus ? 'resumeGame' : 'stopGame'),
    toggleBotStatus: ({commit}, newStatus) => commit(newStatus ? 'activateBot' : 'deactivateBot'),
    gameDelegate: ({commit, state, dispatch}, gameDelegate) => {
        commit('gameDelegate', gameDelegate)

        const oldFinish = gameDelegate.finish.bind(state.gameDelegate)
        const oldPause = gameDelegate.pause.bind(state.gameDelegate)
        // Few delegate methods are modificated for creating of dependencies with store
        gameDelegate.pause = () => {
            oldPause()
            state.gameStatus = false
        }

        gameDelegate.finish = () => {
            // Opening of 'game over' modal frame and waite of it closing
            new Promise((resolve) => {
                commit('updateGameOverModal', resolve)
                // update statistic even if user close page
                window.onunload = resolve
            }).then(() => {
                const sd = 'storedData/'
                dispatch(sd + ATTEMPTS_COUNTER + INCREASE_COUNTER, {}, {root:true})
                dispatch(sd + USED_WEIGHT + INCREASE_COUNTER, gameDelegate.getPlayerWeights('left'), {root:true})
                oldFinish()
                commit('stopGame')
                commit('updateGameOverModal')
            })
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};