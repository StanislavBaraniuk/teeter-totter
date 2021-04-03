import {CanvasSwingStick} from "../Canvas/CanvasSwingStick";
import {CanvasSwingPallet} from "../Canvas/CanvasSwingPallet";
import {CanvasFigureTriangle} from "../Canvas/CanvasFigures/CanvasFigureTriangle";
import {randomColorHEX} from "../helpers/colors";
import {CanvasFigureRectangle} from "../Canvas/CanvasFigures/CanvasFigureRectangle";
import {CanvasFigureCircle} from "../Canvas/CanvasFigures/CanvasFigureCircle";
import MathModel from "./MathModel";

/**
 * Create new CanvasDelegate
 * @param {CanvasRenderingContext2D} ctx - canvas context for painting
 * @param {Number} width - canvas width
 * @param {Number} height - canvas height
 * @constructor
 */
function CanvasDelegate(ctx, width, height) {
    Object.defineProperties(this, {
        /** @readonly */
        ctx: {value: ctx},
        dimensions: {
            value: Object.defineProperties({}, {
                width: {value: width, writable: true},
                height: {value: height, writable: true}
            }),
        },
        figures: { value: [], writable: true },
        /** @readonly */
        mathModel: {value: new MathModel()},
        /** @readonly */
        config: {
            value: Object.freeze({
                fpsInterval: 1000 / 60,
                figureXOffset: 0
            })
        },
        figureXOffset: {value: 0, writable: true},
        shouldRepaint: {value: true, writable: true},
        shouldCalculate: {value: true, writable: true},
        calculatingCallback: { value: () => {}, writable: true }
    })
}

/** For initialization of functional for work with canvas objects */
CanvasDelegate.prototype.initCanvas = function () {
    const w = this.dimensions.width
    const h = this.dimensions.height

    this.ctx.canvas.width = w
    this.ctx.canvas.height = h

    /** Init swing just after canvas initialization */
    if (!CanvasDelegate.prototype.initSwing) CanvasDelegate.prototype.initSwing = function () {
        const {
            stickW,
            stickH,
            palletS,
            palletX,
            palletY,
            stickX,
            stickY
        } = CanvasDelegate.getSwingGenerationData(this.dimensions.width, this.dimensions.height)

        const stickValue = new CanvasSwingStick(
            this.ctx,
            stickX,
            stickY,
            stickW,
            stickH,
            'black'
        )

        Object.defineProperties(this, {
            /** @readonly */
            stick: {
                value: stickValue
            },
            /** @readonly */
            pallet: {
                value: new CanvasSwingPallet(
                    this.ctx,
                    palletX,
                    palletY,
                    palletS,
                    palletS,
                    'black'
                )
            }
        })

        // Create segments vector from swing's stick
        this.mathModel.createLengthMatrix(this.stick.points.topLeft.x, this.stick.points.topRight.x, 10)
    }

    /**
     * Init repaint method just after canvas initialization
     * Could be rewrite for change repainting algorithm
     * Repainting should be specified here - another functions should carry out objects positions calculation only
     */
    if (!CanvasDelegate.prototype.repaint) CanvasDelegate.prototype.repaint = function () {
        this.ctx.clearRect(
            this.ctx.canvas.width / 2 * -1,
            this.ctx.canvas.height / 2 * -1,
            this.ctx.canvas.width * 2,
            this.ctx.canvas.height * 2
        )

        // swing's stick rotation start
        const signFinishAngle = Math.sign(this.mathModel.tiltAngle)
        const signStartAngle = Math.sign(this.stick.angle)

        if (this.stick.angle * signStartAngle < this.mathModel.tiltAngle * signFinishAngle) {
            this.stick.paint(this.stick.angle + signFinishAngle * 0.1 + this.mathModel.tiltAngle*0.035)
        } else {
            this.stick.paint(this.mathModel.tiltAngle)
        }
        // swing's stick rotation end
        // recalculate figures points in depends of stick tilt angle
        this.recalculateFiguresCollisions(this.stick.angle)

        this.pallet.paint();

        this.figures.map(figure => {
            figure?.paint()
        })
    }

    /** Method that should be called for app rendering */
    if (!CanvasDelegate.prototype.startRepainting) CanvasDelegate.prototype.startRepainting = function () {
        this.allowRepaint(true)
        setTimeout(() => {
            if (this.shouldRepaint) {
                requestAnimationFrame(() => this.startRepainting());
                this.repaint()
            }
        }, this.config.fpsInterval);
    }
}

CanvasDelegate.prototype.recalculateStick = function () {
    this.mathModel.updateTiltAngle()
}

CanvasDelegate.prototype.setDimensions = function (width, height) {
    this.dimensions.width = width
    this.dimensions.height = height
}

/**
 * Add new player figure
 * @return {CanvasFigureRectangle|CanvasFigureCircle|CanvasFigureTriangle}
 */
CanvasDelegate.prototype.createFigure = function (xC, yC) {
    const figure = CanvasDelegate.getRandomFigure(this.ctx)
    figure.setOrigin(xC, yC)
    figure.index = this.figures.push(figure) - 1
    return figure
}

/**
 * Figures randomizer
 * @param {CanvasRenderingContext2D} ctx
 * @return {CanvasFigureRectangle|CanvasFigureCircle|CanvasFigureTriangle}
 */
CanvasDelegate.getRandomFigure = function (ctx) {
    const weight = getRandomInt(1, 10)
    const randomType = getRandomInt(1, 4)
    switch (randomType) {
        case 1:
            return new CanvasFigureTriangle(ctx, 0, 0, weight, randomColorHEX())
        case 2:
            return new CanvasFigureRectangle(ctx, 0, 0, weight, randomColorHEX())
        case 3:
            return new CanvasFigureCircle(ctx, 0, 0, weight, randomColorHEX())
        default:
            return new CanvasFigureRectangle(ctx, 0, 0, weight, randomColorHEX())
    }
}


/**
 * Player's figure moving calculation while it is active on screen
 * @param figureIndex
 * @param accelerator - accelerator of figure speed
 * @return {Promise<CanvasFigureRectangle|CanvasFigureCircle|CanvasFigureTriangle>}
 */
CanvasDelegate.prototype.dropFigure = function (figureIndex, accelerator) {
    return new Promise((resolve) => {
        const figure = this.figures[figureIndex]
        figure.moving = true

        const getFinishPoint = (lX, rX, y) => {
            do {
                ++y
            } while (!this.checkCollisions(lX, rX, y))
            return y
        }

        const calculation = (currentY, finishY, acceleration) => {
            setTimeout(function () {
                if (!this.shouldCalculate) {
                    this.calculatingCallback = () => calculation(currentY, finishY, acceleration)
                    return false
                }
                figure.setOrigin(figure.points.center.x + this.figureXOffset, currentY - figure.size - 18)
                this.figureXOffset = this.config.figureXOffset
                if (currentY > finishY) {
                    this.mathModel.addWeight(figure.points.topLeft.x, figure.points.topRight.x, figure.weight)
                    figure.moving = false
                    figure.savePosition(figure.points.center.x, this.stick.points.center.y - this.stick.height / 2 - figure.size / 2)
                    resolve(figure)
                } else calculation(currentY + acceleration, finishY, acceleration + acceleration * 0.03 * accelerator)
            }.bind(this), this.config.fpsInterval)
        }

        const lX = figure.points.bottomLeft.x
        const rX = figure.points.bottomRight.x
        const bY = figure.points.bottomRight.y

        setTimeout(() => calculation(bY, getFinishPoint(lX, rX, bY), 0.1), this.config.fpsInterval)
    })
}

/**
 * After player's figures will delivered at stick their positions will recalculated here
 * @param {Number} angle - stick tilt angle
 */
CanvasDelegate.prototype.recalculateFiguresCollisions = function (angle) {
    this.figures.map(figure => {
        if (figure.moving) return false

        const stickX = this.stick.points.center.x
        const stickY = this.stick.points.center.y
        const stickA = angle * Math.PI / 180

        const figureX = figure.savedPosition.x
        const figureY = figure.savedPosition.y

        figure.setOrigin(...CanvasDelegate.rotatePoint(figureX, figureY, stickX, stickY, stickA))
    })
}

/**
 * Rotate point by point
 * @param {Number} x - pont x
 * @param {Number} y - point y
 * @param {Number} xC - 'by point' x
 * @param {Number} yC - 'by point' y
 * @param {Number} a - radians
 * @return {(number|*)[]}
 */
// TODO: move to math model
CanvasDelegate.rotatePoint = function (x, y, xC, yC, a) {
    return [
        xC + (x - xC) * Math.cos(a) - (y - yC) * Math.sin(a),
        yC + (y - yC) * Math.cos(a) + (x - xC) * Math.sin(a)
    ]
}

/**
 * Check is line on stick or out of screen
 * @param {Number} lX - extreme left x of line
 * @param {Number} rX - extreme right x of line
 * @param {Number} bY - y
 * @return {boolean}
 */
CanvasDelegate.prototype.checkCollisions = function (lX, rX, bY) {
    let isCollision = false
    if (!this.stick.path2D) return false
    for (let x = lX; x <= rX; x++) {
        if (this.ctx.isPointInPath(this.stick.path2D, x, bY) || bY > this.ctx.canvas.height) {
            isCollision = true
            break
        }
    }
    return isCollision
}

CanvasDelegate.prototype.stop = function () {
    this.reset()
    setTimeout(() => this.pauseAll(), this.config.fpsInterval)
}

CanvasDelegate.prototype.pauseAll = function () {
    this.disableRepaint()
    this.disableCalculations()
}

CanvasDelegate.prototype.resumeAll = function () {
    this.startRepainting()
    this.allowCalculations()
    this.calculatingCallback()
}

CanvasDelegate.prototype.reset = function () {
    this.mathModel.reset()
    this.figures = []
    this.calculatingCallback = () => {}
    this.mathModel.createLengthMatrix(this.stick.points.topLeft.x, this.stick.points.topRight.x, 10)
}

CanvasDelegate.prototype.allowRepaint = function () {
    this.shouldRepaint = true
}

CanvasDelegate.prototype.disableRepaint = function () {
    this.shouldRepaint = false
}

CanvasDelegate.prototype.allowCalculations = function () {
    this.shouldCalculate = true
}

CanvasDelegate.prototype.disableCalculations = function () {
    this.shouldCalculate = false
}

/**
 * Recalculate figures positions (ex: after resizing)
 * @param {Number} oW - old width of screen
 * @param {Number} oH - old height of screen
 * @param {Number} nW - new width of screen
 * @param {Number} nH - new height of screen
 */
CanvasDelegate.prototype.addOffsetForAllFigures = function (oW, oH, nW, nH) {
    this.figures.map(figure => {
        if (figure.moving) {
            const newX = nW * figure.points.center.x / oW
            const newY = nH * figure.points.center.y / oH
            figure.setOrigin(newX, newY)
        } else {
            const newSX = nW * figure.savedPosition.x / oW
            figure.savePosition(newSX, this.stick.points.center.y - this.stick.height / 2 - figure.size / 2)
        }
    })
}

CanvasDelegate.getSwingGenerationData = function (canvasWidth, canvasHeight) {
    const stickW = canvasWidth * 0.6
    const stickH = stickW * 0.02
    const palletS = stickW * 0.15
    const stickX = canvasWidth / 2
    const stickY = canvasHeight - stickH - palletS
    const palletX = stickX
    const palletY = stickY + stickH / 2 + palletS / 2
    return {stickW, stickH, palletS, stickX, stickY, palletX, palletY}
}

/**
 * Maximum not included, minimum included
 * @param {Number} min
 * @param {Number} max
 * @returns {number} - random number
 */
// TODO: Move to separated module
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


export {CanvasDelegate}