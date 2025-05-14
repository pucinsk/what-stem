import { Controller } from "stimulus.js"
import Stem from "../models/stem.js"
import { degreesToRadians } from "../utils.js"

function StemCalculations(stem, headTubeAngle) {
    const effectiveAngle = degreesToRadians(Number(headTubeAngle) + stem.angle)

    return {
        reach: stem.length * Math.sin(degreesToRadians(stem.angle)),
        stack: stem.length * Math.cos(degreesToRadians(stem.angle)),
        effectiveReach: stem.length * Math.sin(effectiveAngle),
        effectiveStack: stem.length * Math.cos(effectiveAngle),
    }
}

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
        Stem.all().forEach(stem => {
            this.draw(stem);
            this.#addCard(stem)
        })
    }

    remove(e) {
        e.preventDefault()
        const card = e.target.closest(".card")
        const stem = new Stem({ length: card.dataset.stemLength, angle: card.dataset.stemAngle })
        Stem.remove(stem)
        card.remove()
        this.group.findOne(`#${stem.presenter.name}`).remove()
    }

    drawAll() {
        this.group.destroyChildren()
        Stem.all().forEach((stem, i) => {
            this.draw(stem);
        })
    }

    updateCalc() {
        Stem.all().forEach((stem) => {
            const {effectiveReach, effectiveStack} = StemCalculations(stem, this.headTubeAngleTarget.value)

            const card = document.getElementById(stem.presenter.name)
            card.getElementsByClassName("e-reach").item(0).innerText = effectiveReach.toFixed(2)
            card.getElementsByClassName("e-stack").item(0).innerText = effectiveStack.toFixed(2)

        })
    }

    draw(stem) {
        const tiltAngle = this.headTubeAngleTarget.value
        const y0 = stage.height() / 2;
        const x0 = y0 / Math.tan(tiltAngle * Math.PI / 180)
        const shape = stem.presenter.present({ x0, y0, tiltAngle })
        this.group.add(shape)
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

    #addCard(stem) {
        const { length, angle } = stem
        const {reach, stack, effectiveReach, effectiveStack} = StemCalculations(stem, this.headTubeAngleTarget.value)
        const cardHTML = `
            <div class="card" style="min-width: 18rem;" data-stem-length="${length}" data-stem-angle="${angle}" id="${stem.presenter.name}">
                <div class="card-body">
                <h5 class="card-title">${stem.presenter.name}</h5>
                <p class="card-text">Length ${length}mm | Angle ${angle}°</p>
                <p class="card-text">Reach ${reach.toFixed(2)}mm | Stack ${stack.toFixed(2)}mm</p>
                <p class="card-text">Effective Reach <span class="e-reach">${effectiveReach.toFixed(2)}</span>mm | Stack <span class="e-stack">${effectiveStack.toFixed(2)}</span>mm</p>
                <button data-action="stems#remove" class="btn btn-danger">Remove</a>
                </div>
            </div>
        `
        this.stemFormCardTarget.insertAdjacentHTML("beforebegin", cardHTML)
    }
}

export default StemsController
