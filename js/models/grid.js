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

export default Grid
