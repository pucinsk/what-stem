import { Controller } from "stimulus.js"
import Grid from "../models/grid.js"

class GridController extends Controller {
    static targets = ["container"]

    layer = new Konva.Layer({ name: 'Grid' })
    grid = Grid.newFromStage({ stage, cellSize: 10 })

    connect() {
        stage.add(this.layer)
        this.draw()
    }

    resize() {
        if (Math.abs(stage.width() - this.containerTarget.offsetWidth) > 10) {
            stage.width(this.containerTarget.offsetWidth)
            this.layer.destroyChildren()
            this.grid = Grid.newFromStage({ stage, cellSize: 10 })
            this.draw()
        }
    }

    draw() {
        this.grid.draw(this.layer)
    }
 }

 export default GridController
