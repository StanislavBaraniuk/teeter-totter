import {CanvasBasicFigure} from "./CanvasBasicFigure";

/**
 * Create new figure - Triangle
 * @class CanvasFigureTriangle
 */
class CanvasFigureTriangle extends CanvasBasicFigure {
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
        this.ctx.moveTo(this.points.center.x, this.points.topLeft.y)
        this.ctx.lineTo(this.points.bottomRight.x, this.points.bottomRight.y);
        this.ctx.lineTo(this.points.bottomLeft.x, this.points.bottomLeft.y);
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

export {CanvasFigureTriangle}