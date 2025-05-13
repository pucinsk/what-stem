import { Controller } from "stimulus.js"
import Stem from "../models/stem.js"

class StemsController extends Controller {
    static targets = [
        "length",
        "angle",
        "headTubeAngle",
        "stemFormCard"
    ]

    layer = new Konva.Layer({ name: 'stems' })
    group = new Konva.Group({ name: 'stems' })

    connect() {
        this.layer.add(this.group)
        stage.add(this.layer)
        Stem.all().forEach((stem, i) => {
            this.draw(stem);
            this.#addCard(stem, i)
        })
    }

    remove(e) {
        e.preventDefault()
        const card = e.target.closest(".card")
        const stem = new Stem({length: card.dataset.stemLength, angle: card.dataset.stemAngle})
        Stem.remove(stem)
        card.remove()
        this.group.findOne(`#${stem.shapeName()}`).remove()
    }

    drawAll() {
        this.group.destroyChildren()
        Stem.all().forEach((stem, i) => {
            this.draw(stem);
        })
    }

    draw(stem) {
        this.group.add(stem.shape(stage, this.headTubeAngleTarget.value))
    }

    #addCard(stem, i) {
        const { length, angle, reach,
            stack,
            effectiveReach,
            effectiveStack } = stem
        const cardHTML = `
            <div class="card" style="min-width: 18rem;" data-stem-length="${length}" data-stem-angle="${angle}">
                <div class="card-body">
                <h5 class="card-title">Stem ${i + 1}</h5>
                <p class="card-text">Length ${length}mm | Angle ${angle}°</p>
                <p class="card-text">Reach ${reach}mm | Stack ${stack}mm</p>
                <p class="card-text">Effective Reach ${effectiveReach}mm | Stack ${effectiveStack}mm</p>
                <button data-action="stems#remove" class="btn btn-danger">Remove</a>
                </div>
            </div>
        `
        this.stemFormCardTarget.insertAdjacentHTML("beforebegin", cardHTML)
    }

    add(e) {
        e.preventDefault()
        const stem = new Stem({ length: this.lengthTarget.value, angle: this.angleTarget.value })
        if (Stem.all().some(s => s.isEqual(stem))) {
            alert("Stem like this already have been added")
            return
        }
        this.draw(stem)
        this.#addCard(stem, Stem.all().length - 1)
        Stem.add(stem)
        e.target.reset()
    }
}

export default StemsController
