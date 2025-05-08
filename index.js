function handleSubmit(event) {
  event.preventDefault();

  const stemLength = Number(document.getElementById('stemLength').value);
  const stemAngle = Number(document.getElementById('stemAngle').value);
  const headtubeAngle = Number(document.getElementById('headtubeAngle').value);

  const effectiveAngleDeg = stemAngle + headtubeAngle;
  const effectiveAngleRad = (180 - 90 - effectiveAngleDeg) * Math.PI / 180;

  const reach = stemLength * Math.cos(effectiveAngleRad);
  const stack = stemLength * Math.sin(effectiveAngleRad);

  const results = document.getElementById("results");
  results.classList.remove("hidden");

  document.getElementById("stemEffectiveReach").innerText = `Reach: ${reach.toFixed(2)} mm`;
  document.getElementById("stemEffectiveStack").innerText = `Reach: ${stack.toFixed(2)} mm`;
}

function buildStage(container) {
  return new Konva.Stage({
    container,
    height: container.offsetHeight,
    width: container.offsetWidth
  });
}

class Stem {
  constructor({ length, angle }) {
    this.length = length
    this.angle = angle
  }

  draw(layer, stage, headtubeAngle) {
    const offsetY = stage.height() / 2;
    const offsetX = offsetY / Math.tan(headtubeAngle * Math.PI / 180)

    layer.add(
      new Konva.Line({
        stroke: 'green',
        strokeWidth: 3,
        points: this.#linePoints(
          offsetX,
          offsetY,
          headtubeAngle - this.angle - 90)
      })
    )
  }

  #linePoints(x1, y1, lineAngle) {
    const angle = lineAngle * Math.PI / 180;
    const x2 = x1 + this.length * Math.cos(angle);
    const y2 = y1 + this.length * Math.sin(angle);
    return [x1, y1, x2, y2]
  }
}

class HeadTube {
  #angle = 0

  constructor({ angle }) {
    this.#angle = angle
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
        strokeWidth: 3,
        points: [0, 0, stage.height() / Math.tan(this.#angle * Math.PI / 180), stage.height()]
      })
    )
  }
}

class Grid {
  static newFromStage({ stage, cellSize }) {
    return new Grid({
      rows: Math.round(stage.height() / cellSize),
      columns: Math.round(stage.width() / cellSize),
      cellSize,
    })
  }

  constructor({ rows, columns, cellSize }) {
    this.rows = rows
    this.columns = columns
    this.cellSize = cellSize
  }

  draw(layer) {
    [...Array(this.rows)].forEach((_, row) => {
      [...Array(this.columns)].forEach((_, col) => {
        layer.add(
          new Konva.Rect({
            stroke: 'black',
            strokeWidth: 1,
            x: col * this.cellSize,
            y: row * this.cellSize,
            width: this.cellSize,
            height: this.cellSize,
          })
        )
      })
    })
  }
}

window.addEventListener("load", function () {
  stage = buildStage(document.getElementById('container'))
  const gridLayer = new Konva.Layer({ name: 'Grid' })
  stage.add(gridLayer)
  const grid = Grid.newFromStage({ stage, cellSize: 10 })
  const headTubeLayer = new Konva.Layer({ name: 'HeadTube' })
  stage.add(headTubeLayer)
  const headtube = new HeadTube({ angle: this.document.getElementById("headtubeAngle").value })

  grid.draw(gridLayer)
  headtube.draw(headTubeLayer, stage)

  const stemLayer = new Konva.Layer({ name: 'Stem' })
  stage.add(stemLayer)
  const stem = new Stem({ length: 100, angle: 10 })
  stem.draw(stemLayer, stage, headtube.angle)


  this.document.getElementById("headtubeAngle")
    .addEventListener("change", (e) => {
      headtube.angle(e.target.value)
      headTubeLayer.destroyChildren();
      headtube.draw(headTubeLayer, stage)
    })
});
