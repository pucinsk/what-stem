import StemPresenter from "../presenters/stem_presenter.js"

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
    if (!isNaN(stemIdx)) {
      stems.splice(stemIdx, 1)
      localStorage.setItem("stems", JSON.stringify(stems.map(stem => stem.toParams())))
    }
  }

  get presenter() {
    if (!this._presenter) {
      this._presenter = new StemPresenter(this)
    }
    return this._presenter
  }

  toParams() {
    return { length: this.length, angle: this.angle }
  }

  reach = 123
  stack = 123
  effectiveReach = 123
  effectiveStack = 123

  isEqual(stem) {
      return this.length === stem.length && this.angle === stem.angle;
  };
}

export default Stem;
