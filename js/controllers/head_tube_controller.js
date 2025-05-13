import { Controller } from "stimulus.js"
import HeadTube from "../models/headtube.js"

class HeadTubeController extends Controller {
    static targets = ["angle"]

    layer = new Konva.Layer({ name: 'HeadTube' })

    connect() {
        stage.add(this.layer)
        this.draw()
    }

    draw() {
        const headtube = new HeadTube({ angle: this.angleTarget.value })
        this.layer.destroyChildren()
        headtube.draw(this.layer, stage)
    }
 }

 export default HeadTubeController
