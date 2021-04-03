import {CanvasBasicFigure} from "./CanvasBasicFigure";

/**
 * Create new figure - Rectangle
 * @class CanvasFigureRectangle
 */
class CanvasFigureRectangle extends CanvasBasicFigure {
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
        this.ctx.rect(this.points.topLeft.x, this.points.topLeft.y, this.size, this.size);
        this.ctx.fillStyle = this.color;
        this.ctx.fill()
        this.insertWeightText()
    }

    setOrigin(xC, yC) {
        super.setOrigin(xC, yC);
    }

    savePosition(x, y) {
        super.savePosition(x, y);
    }
}

export {CanvasFigureRectangle}