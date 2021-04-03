import {CanvasBasicFigure} from "./CanvasBasicFigure";

/**
 * Create new figure - Circle
 * @class CanvasFigureCircle
 */
class CanvasFigureCircle extends CanvasBasicFigure {
    /**
     * CanvasBasicFigure constructor
     * @param {CanvasRenderingContext2D} ctx - Context for painting.
     * @param {Number} xC - Center of pallet by X-axis
     * @param {Number} yC - Center of pallet by Y-axis
     * @param {Number} weight - physical weight of figure
     * @param {String} color - Figure's background color
     */
    constructor(ctx, xC, yC, weight, color) {
        super(...arguments);
    }

    paint() {
        this.ctx.beginPath();
        this.ctx.arc(this.points.center.x, this.points.center.y, this.size/2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.insertWeightText()
    }

    setOrigin(xC, yC) {
        super.setOrigin(xC, yC);
    }

    savePosition(x, y) {
        super.savePosition(x, y);
    }
}

export {CanvasFigureCircle}