import type { Ref } from 'vue'
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

interface GameState{
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play'|'lost'|'won'
}

export default class GamePlay {
  WIDTH = 5
  HEIGHT = 5
  // mineGenerated = false

  state = ref() as Ref<GameState>
  // gameState = ref<'play'|'won'|'lost'> ('play')

  constructor(public width: number, public height: number) {
    this.reset()
    // this.updateNumbers(this.board)
    // watchEffect(this.checkGameStatus)
  }

  reset() {
    this.state.value = {
      mineGenerated: false,
      gameState: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width },
          (_, x): BlockState => ({
            x,
            y,
            adjacentMines: 0,
            revealed: false,
          }),
        ),
      ),
    }
  }

  get board() {
    return this.state.value?.board
  }

  onClick(block: BlockState) {
    if (this.state.value.gameState !== 'play')
      return

    if (!this.state.value.mineGenerated) {
      this.generatorMines(this.board, block)
      this.updateNumbers(this.board)

      this.state.value.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      this.state.value.gameState = 'lost'
      this.showAllMines()
    }
    this.expendZero(block)
  }

  onRightClick(block: BlockState) {
    if (this.state.value.gameState !== 'play')
      return
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

  showAllMines() {
    this.board.flat().forEach((i) => {
      i.revealed = true
    })
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.board[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  checkGameStatus() {
    const blocks = this.board.flat()
    if (blocks.every(block => block.revealed || (block.flagged && block.mine))) {
      if (blocks.some(block => block.flagged && !block.mine)) {
        this.showAllMines()
        alert('You Cheat')
      }
      else { alert('You Win!!') }
    }
  }
}
