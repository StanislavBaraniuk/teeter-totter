/**
 * Create new Stick
 * @class
 */
class CanvasSwingStick {
    /**
     *
     * @param {CanvasRenderingContext2D} ctx - Context for painting.
     * @param {Number} xC - Center of Stick by X-axis
     * @param {Number} yC - Center of Stick by Y-axis
     * @param {Number} width - Stick's width
     * @param {Number} height - Stick's height
     * @param {String} color - Stick's background color
     */
    constructor(ctx, xC, yC, width, height, color) {
        Object.defineProperties(this, {
            ctx: { value: ctx },
            angle: { value: 0, writable: true },
            points: {
                value: this.getPoints(xC, yC, width, height, 0),
                writable: true
            },
            width: { value: width, writable: true },
            height: { value: height, writable: true },
            color: { value: color },
            path2D: { value: null, writable: true }
        })
    }

    /**
     * Paint stick in canvas with specified angle
     * @param {Number} angle - Tilt angle of stick
     */
    paint(angle= this.angle ) {
        this.points = this.getPoints(this.points.center.x, this.points.center.y, this.width, this.height, angle)
        this.path2D = new Path2D()
        this.path2D.moveTo(this.points.topLeft.x, this.points.topLeft.y)
        this.path2D.lineTo(this.points.topRight.x, this.points.topRight.y)
        this.path2D.lineTo(this.points.bottomRight.x, this.points.bottomRight.y)
        this.path2D.lineTo(this.points.bottomLeft.x, this.points.bottomLeft.y)
        this.ctx.fillStyle = this.color;
        this.ctx.fill(this.path2D);
        this.angle = angle
    }

    /**
     * Generate and return immutable stick points
     * @param {Number} xC - Center of pallet by X-axis
     * @param {Number} yC - Center of pallet by Y-axis
     * @param {Number} w - physical weight of figure
     * @param {Number} h - physical height of figure
     * @param {Number} a - Tilt angle of stick
     * @returns {Readonly<{bottomLeft: {x: {Number}, y: {Number}}, bottomRight: {x: {Number}, y: {Number}}, topLeft: {x: {Number}, y: {Number}}, center: {x: {Number}, y: {Number}}, topRight: {x: {Number}, y: {Number}}}>}
     */
    getPoints(xC, yC, w, h, a) {
        a = a * Math.PI/180

        const rotate = (x, y) => {
            let s = Math.sin(a);
            let c = Math.cos(a);
            x -= xC;
            y -= yC;
            let xNew = x * c - y * s;
            let yNew = x * s + y * c;
            x = xNew + xC;
            y = yNew + yC;
            return { x, y }
        }

        return Object.freeze({
            topLeft: rotate(xC - w/2,yC - h/2),
            topRight: rotate(xC + w/2,yC - h/2 ),
            bottomLeft: rotate(xC - w/2,yC + h/2 ),
            bottomRight: rotate(xC + w/2, yC + h/2 ),
            center: {x: xC, y: yC }
        })
    }

    changeDimensions(
        width,
        height,
        xC = this.points.center.x,
        yC = this.points.center.y,
        a = this.angle,
    ) {
        this.width = width
        this.height = height
        this.points = this.getPoints(xC, yC, width, height, 0)
    }
}

export {CanvasSwingStick}