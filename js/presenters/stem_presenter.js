class StemPresenter {
    constructor(stem) {
        this.stem = stem
        this.name = `stem-${this.stem.length}-${this.stem.angle}`
    }

    present({x0, y0, tiltAngle}) {
        const effectiveAngle = (tiltAngle - this.stem.angle - 90) * Math.PI / 180
        const points = [
            x0,
            y0,
            x0 + this.stem.length * Math.cos(effectiveAngle),
            y0 + this.stem.length * Math.sin(effectiveAngle)
        ]

        return new Konva.Line({
            points,
            stroke: 'black',
            strokeWidth: 40,
            opacity: 0.2,
            lineCap: 'round',
            id: this.name,
        })
    }
}

export default StemPresenter
