/**
 * Create a new CanvasSwingPallet - use as down part of swing
 * @param {CanvasRenderingContext2D} ctx - Context for painting.
 * @param {Number} xC - Center of pallet by X-axis
 * @param {Number} yC - Center of pallet by Y-axis
 * @param {Number} width - Pallet's width
 * @param {Number} height - Pallet's height
 * @param {String} color - Pallet's bgc color
 * @constructor
 */
function CanvasSwingPallet(ctx, xC, yC, width, height, color) {
    Object.defineProperties(this, {
        ctx: { value: ctx },
        points: { value: CanvasSwingPallet.getPoints(xC,yC,width,height), writable: true },
        color: { value: color }
    })
}

/**
 * Repaint the pallet
 * @function
 */
CanvasSwingPallet.prototype.paint = function () {
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[1].x, this.points[1].y)
    this.ctx.lineTo(this.points[2].x,this.points[2].y);
    this.ctx.lineTo(this.points[3].x, this.points[3].y);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
}

CanvasSwingPallet.prototype.changeDimensions = function (
    width,
    height,
    xC = this.points.center.x,
    yC = this.points.center.y
) {
    this.width = width
    this.height = height
    this.points = CanvasSwingPallet.getPoints(xC, yC, width, height)
}

CanvasSwingPallet.getPoints = function (xC, yC, w, h) {
    return Object.freeze({
        1: {x: xC, y: yC - h / 2},
        2: {x: xC + w / 2, y: yC + h / 2},
        3: {x: xC - w / 2, y: yC + h / 2},
        center: {x: xC, y: yC}
    })
}


export {CanvasSwingPallet}