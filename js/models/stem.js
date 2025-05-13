class Stem {
  constructor({ length, angle }) {
    this.length = Number(length)
    this.angle = Number(angle)
  }

  static all() {
    return !!localStorage.getItem("stems")
    ? JSON.parse(localStorage.getItem("stems"))
        .map(({ length, angle }) => new Stem({ length, angle }))
    : []
  }

  static add(stem) {
    localStorage.setItem("stems", JSON.stringify([stem, ...this.all()].map(stem => stem.toParams())))
  }

  static remove(stem) {
    const stems = this.all()
    const stemIdx = stems.findIndex(s => s.isEqual(stem))
    console.log(stemIdx)
    if (!isNaN(stemIdx)) {
      stems.splice(stemIdx, 1)
      localStorage.setItem("stems", JSON.stringify(stems.map(stem => stem.toParams())))
    }
  }

  toParams() {
    return { length: this.length, angle: this.angle }
  }

  shape(stage, headtubeAngle) {
    const offsetY = stage.height() / 2;
    const offsetX = offsetY / Math.tan(headtubeAngle * Math.PI / 180)
    const points = this.#linePoints(
      offsetX,
      offsetY,
      headtubeAngle - this.angle - 90)

    return new Konva.Line({
      points,
      stroke: 'black',
      strokeWidth: 40,
      opacity: 0.2,
      lineCap: 'round',
      id: this.shapeName(),
    })
  }

  shapeName() {
    return `stem-${this.length}-${this.angle}`
  }
  reach = 123
  stack = 123
  effectiveReach = 123
  effectiveStack = 123


  #linePoints(x1, y1, lineAngle) {
    const angle = lineAngle * Math.PI / 180;
    const x2 = x1 + this.length * Math.cos(angle);
    const y2 = y1 + this.length * Math.sin(angle);
    return [x1, y1, x2, y2]
  }

  isEqual(stem) {
      return this.length === stem.length && this.angle === stem.angle;
  };
}

export default Stem;
