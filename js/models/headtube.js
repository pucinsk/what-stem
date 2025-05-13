class HeadTube {
  #angle = 0

  constructor({ angle }) {
    this.#angle = Number(angle)
  }

  angle(newAngle) {
    if (newAngle) {
      this.#angle = Number(newAngle)
    }
    return this.#angle
  }

  draw(layer, stage) {
    layer.add(
      new Konva.Line({
        stroke: 'red',
        strokeWidth: 50,
        opacity: .5,
        lineCap: 'round',
        points: [0, 0, stage.height() / Math.tan(this.#angle * Math.PI / 180), stage.height()]
      })
    )
  }
}

export default HeadTube
