function Player(speed, keyboard, boundLeft, boundRight) {
    Object.defineProperties(this, {
        speed: {value: speed},
        figures: {value: [], writable: true },
        keyboard: { value: keyboard, writable: true },
        bounds: {
            value: Object.seal({
                left: boundLeft,
                right: boundRight
            })
        }
    })
}

export default Player