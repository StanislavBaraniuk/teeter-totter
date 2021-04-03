/**
 * Create new Canvas "physic" calculator :)
 * @constructor
 */
function MathModel() {
    Object.defineProperties(this, {
        lengthMatrix: { value: [], writable: true },
        weightMatrix: { value: [],  writable: true  },
        tiltAngle: { value: 0,  writable: true }
    })
}

/**
 * Break the stick into pieces
 * @param {Number} leftXPoint - left x of stick
 * @param {Number} rightXPoint - right x of stick
 * @param {Number} length - count of pieces
 */
MathModel.prototype.createLengthMatrix = function (leftXPoint, rightXPoint, length) {
    const matrix = []
    const pxLength = rightXPoint - leftXPoint
    const pxToM = pxLength/length
    for (let i = leftXPoint; i < rightXPoint - 1; i+=pxToM) {
        matrix.push([toFixed(i), toFixed(i+pxToM)])
    }
    this.lengthMatrix = matrix
    this.weightMatrix = Array.from({length: matrix.length}, () => 0)
}

/**
 * Add weight to stick pieces
 * @param {Number} leftXPoint - left x of player's figure
 * @param rightXPoint - right x of player's figure
 * @param weight - weight of player's figure
 */
MathModel.prototype.addWeight = function (leftXPoint, rightXPoint, weight) {
    let objectLength = rightXPoint - leftXPoint

    const lastI = this.lengthMatrix.length-1

    let points = this.lengthMatrix[0];

    try {
        if (leftXPoint < this.lengthMatrix[0][0]) {
            this.weightMatrix[0] += weight * ((points[0] - leftXPoint) / objectLength)
        }

        points = this.lengthMatrix[lastI];
        if (rightXPoint > points[1]) {
            this.weightMatrix[lastI] += weight * ((rightXPoint - points[1]) / objectLength)
        }
    } catch (_) {}

    for (let i = 0; i < this.lengthMatrix.length; i++) {
        let weightOnCurrentSegment = 0;
        const points = this.lengthMatrix[i];
        if (leftXPoint <= points[0] && rightXPoint >= points[1]) {
            weightOnCurrentSegment += weight * ((points[1] - points[0]) / objectLength);
        } else if (between(leftXPoint, points[0], points[1])) {
            const distanceToRight = points[1] - leftXPoint
            weightOnCurrentSegment += weight * (distanceToRight / objectLength);
        } else if (between(rightXPoint, points[0], points[1])) {
            const distanceToLeft = rightXPoint - points[0]
            weightOnCurrentSegment += weight * (distanceToLeft / objectLength);
        }
        this.weightMatrix[i] += toFixed(weightOnCurrentSegment)
    }
}

MathModel.prototype.updateTiltAngle = function () {
    const leftWeight = this.weightMatrix.slice(0, this.weightMatrix.length/2)
        .reverse().map((weight, i) => toFixed(weight * (0.2 * (i + 1))))

    const rightWeight = this.weightMatrix.slice(this.weightMatrix.length/2, this.weightMatrix.length)
        .map((weight, i) => toFixed(weight * (0.2 * (i + 1))))

    const leftWeightSum = leftWeight.reduce((a, b) => a + b, 0)
    const rightWeightSum = rightWeight.reduce((a, b) => a + b, 0)

    let percent = 0

    if (leftWeightSum !== 0 && rightWeightSum !== 0) {
        percent = leftWeightSum > rightWeightSum ?
            ((leftWeightSum - rightWeightSum) / leftWeightSum * 100) * -1 :
            ((rightWeightSum - leftWeightSum)  / rightWeightSum * 100)
    }

    this.tiltAngle += 45 * (percent/100)
}

MathModel.prototype.reset = function () {
    this.lengthMatrix = [];
    this.weightMatrix = [];
    this.tiltAngle = 0
}

function between(x, min, max) {
    return x > min && x < max;
}

function toFixed(number, count = 2) {
    return parseFloat(number.toFixed(count))
}

export default MathModel