import Player from "./Player";
import {CanvasDelegate} from "./CanvasDelegate";

/**
 * @param {CanvasDelegate} canvasDelegate
 * @constructor
 */
function GameDelegate(canvasDelegate) {
    Object.defineProperties(this, {
        canvasDelegate: { value: canvasDelegate },
    })

    this.canvasDelegate.initCanvas()
    this.canvasDelegate.initSwing()
    this.canvasDelegate.repaint()

    Object.defineProperty(this, 'players', {
        value: GameDelegate.getPlayers(canvasDelegate)
    })

    this.isStarted = false
    this.isPause = false
}

/**
 * Generate new players kit
 * @param {CanvasDelegate} canvasDelegate
 * @returns {{left: Player, right: Player}}
 */
GameDelegate.getPlayers = function (canvasDelegate) {
    return {
        left: new Player(1, true,
            canvasDelegate.stick.points.topLeft.x,
            canvasDelegate.stick.points.topLeft.x + canvasDelegate.stick.width/2 - 15
        ),
        right: new Player(2, false,
            canvasDelegate.stick.points.topLeft.x + canvasDelegate.stick.width/2 + 15,
            canvasDelegate.stick.points.topRight.x
        )
    }
}

/**
 * Will started loop of player moves
 */
GameDelegate.prototype.start = function () {
    this.isStarted = true
    this.canvasDelegate.startRepainting()
    this.canvasDelegate.allowCalculations()
    const leftPlayer = this.players.left;
    const rightPlayer = this.players.right;
    const makeMove = () => {this.move(rightPlayer).then(figure => {
        rightPlayer.figures.push(figure)
        this.move(leftPlayer).then(figure => {
            leftPlayer.figures.push(figure)
            this.canvasDelegate.recalculateStick()
            setTimeout(function () {
                if (this.isContinueGame()) makeMove()
                else setTimeout(this.finish.bind(this))
            }.bind(this), 1000)
        })
    })}
    makeMove()
}

GameDelegate.prototype.finish = function () {
    this.isStarted = false
    this.isPause = false
    this.players.left.figures = []
    this.players.right.figures = []
    this.canvasDelegate.stop()
}

GameDelegate.prototype.pause = function () {
    this.canvasDelegate.pauseAll()
    this.isPause = true
}

GameDelegate.prototype.resume = function () {
    this.canvasDelegate.resumeAll()
    this.isPause = false
}

/**
 * Make a move for as specified player
 * @param player
 * @returns {Promise<CanvasFigureRectangle|CanvasFigureCircle|CanvasFigureTriangle>}
 */
GameDelegate.prototype.move = function (player) {
    return new Promise((finish) => {
        const spawnX = getRandomInt(player.bounds.left, player.bounds.right)
        const figure = this.canvasDelegate.createFigure(spawnX, 100)

        const listenerThis = this;
        const keyboardListener = (e) => {
            const offset = 10;

            switch (e.key) {
                case 'ArrowRight':
                    if (figure.points.topRight.x + offset < player.bounds.right) {
                        listenerThis.canvasDelegate.figureXOffset += offset
                    }
                    break
                case 'ArrowLeft':
                    if (figure.points.topLeft.x - offset > player.bounds.left) {
                        listenerThis.canvasDelegate.figureXOffset -= offset
                    }
                    break
            }
        }

        if (player.keyboard) {
            window.addEventListener('keydown', keyboardListener)
        }

        this.canvasDelegate.dropFigure(figure.index, player.speed).then(() => {
            window.removeEventListener('keydown', keyboardListener)
            finish(figure)
        })
    })
}

/**
 * Check is game should to be continued
 * @returns {boolean}
 */
GameDelegate.prototype.isContinueGame = function () {
    let angle = this.canvasDelegate.mathModel.tiltAngle
    return angle * Math.sign(angle) < 10
}

/**
 * For resizing of canvas and it's content
 * @param {Number} width - new canvas width
 * @param {Number} height - new canvas width
 */
GameDelegate.prototype.changeCanvasDimensions = function (width, height) {
    this.pause()
    this.players.left.bounds.left = this.canvasDelegate.stick.points.topLeft.x;
    this.players.left.bounds.right = this.canvasDelegate.stick.points.topLeft.x + this.canvasDelegate.stick.width/2 - 15;
    this.players.right.bounds.left = this.canvasDelegate.stick.points.topLeft.x + this.canvasDelegate.stick.width/2 + 15;
    this.players.right.bounds.right = this.canvasDelegate.stick.points.topRight.x;
    const oldW = this.canvasDelegate.dimensions.width
    const oldH = this.canvasDelegate.dimensions.height
    this.canvasDelegate.setDimensions(width, height)
    this.canvasDelegate.initCanvas()
    const {
        stickW,
        stickH,
        palletS,
        stickY,
        stickX,
        palletY,
        palletX
    } = CanvasDelegate.getSwingGenerationData(width, height)
    this.canvasDelegate.stick.changeDimensions(stickW, stickH, stickX, stickY)
    this.canvasDelegate.pallet.changeDimensions(palletS, palletS, palletX, palletY)
    this.canvasDelegate.addOffsetForAllFigures(oldW, oldH, width, height)
    this.canvasDelegate.repaint()
}

/**
 * Receive a sum of figures weight for specified player
 * @param {String} player - key of player {left | right}
 * @returns {Number}
 */
GameDelegate.prototype.getPlayerWeights = function (player) {
    return this.players[player].figures.reduce((a, b) => a + b.weight, 0)
}

/**
 * Maximum not included, minimum included
 * @param {Number} min
 * @param {Number} max
 * @returns {number}
 */
// TODO: Move to separated module
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


export {GameDelegate}

