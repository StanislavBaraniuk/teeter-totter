import {invertHex} from "../../helpers/colors";
import weightsToSize from "../../Canvas/CanvasFigures/weightsToSize";

/**
 * Abstract CanvasBasicFigure - base for canvas figures
 * @class CanvasBasicFigure
 */
class CanvasBasicFigure {
    /**
     * CanvasBasicFigure constructor
     * @param {CanvasRenderingContext2D} ctx - Context for painting.
     * @param {Number} xC - Center of pallet by X-axis
     * @param {Number} yC - Center of pallet by Y-axis
     * @param {Number} weight - physical weight of figure
     * @param {String} color - Figure's background color
     */
    constructor(ctx, xC, yC, weight, color) {
        if (this.constructor === CanvasBasicFigure) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        Object.defineProperties(this, {
            ctx: { value: ctx },
            weight: { value: weight },
            size: { value: weightsToSize[weight] },
            points: { value: CanvasBasicFigure.getPoints(xC, yC, weight), writable: true },
            color: { value: color },
            savedPosition: { value: Object.preventExtensions({x: xC, y: yC}) }
        })
    }

    /**
     * Function for figure painting
     */
    paint() {}

    /**
     * Recalculate points
     */
    setOrigin(xC, yC) {
        this.points = CanvasBasicFigure.getPoints( xC, yC, this.weight);
    }

    savePosition(x, y) {
        this.savedPosition.x = x
        this.savedPosition.y = y
    }

    static getPoints(xC, yC, w) {
        const figureRadius = weightsToSize[w]/2
        return Object.freeze({
            topLeft: { x: xC - figureRadius, y: yC - figureRadius },
            topRight: { x: xC + figureRadius, y: yC - figureRadius },
            bottomLeft: { x: xC - figureRadius, y: yC + figureRadius },
            bottomRight: { x: xC + figureRadius, y: yC + figureRadius },
            center: {x: xC, y: yC}
        })
    }

    /**
     * Insert to figure text with it weight
     */
    insertWeightText() {
        this.ctx.font = '15px Arial';
        this.ctx.fillStyle = invertHex(this.color);
        const fontIncrement = this.weight?.toString().length > 1 ? 10 : 5
        this.ctx.fillText(this.weight?.toString(), this.points.center.x-fontIncrement, this.points.center.y+fontIncrement);
    }
}

export {CanvasBasicFigure};