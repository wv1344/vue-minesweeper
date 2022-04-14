import type { BlockState } from '~/type'

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

export default class GamePlay {
  WIDTH = 5
  HEIGHT = 5
  mineGenerated = false

  state = ref<BlockState[][]>([])

  constructor(public width: number, public height: number) {
    this.reset()
    // watchEffect(this.checkGameStatus)
  }

  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
        }),
      ),
    )
  }

  onClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.generatorMines(this.state.value, block)
      this.updateNumbers(this.state.value)

      this.mineGenerated = true
    }
    block.revealed = true
    if (block.mine)
      alert('BOOOM!')
    this.expendZero(block)
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
  }

  generatorMines(state: BlockState[][], initial: BlockState) {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) < 1)
          continue
        if (Math.abs(initial.y - block.y) < 1)
          continue
        block.mine = Math.random() < 0.2
      }
    }
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return
    this.getSiblings(block)
      .forEach((s) => {
        if (!s.revealed) {
          s.revealed = true
          this.expendZero(s)
        }
      })
  }

  updateNumbers(state: BlockState[][]) {
    state.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block)
          .forEach((b) => {
            if (b.mine)
              block.adjacentMines += 1
          })
      })
    })
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.state.value[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  checkGameStatus() {
    const blocks = this.state.value.flat()
    if (blocks.every(block => block.revealed || (block.flagged && block.mine))) {
      if (blocks.some(block => block.flagged && !block.mine))
        alert('You Cheat')
      else
        alert('You Win!!')
    }
  }
}
