<script setup lang="ts">

interface BlockState{
  x: number
  y: number
  revealed: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}

const WIDTH = 5
const HEIGHT = 5

const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH },
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
    ),
  ),
)

let mineGenerated = false

const dev = false

function onClick(e: MouseEvent, block: BlockState) {
  if (!mineGenerated) {
    generatorMines(block)
    updateNumbers()

    mineGenerated = true
  }
  block.revealed = true
  if (block.mine)
    alert('BOOOM!')
  expendZero(block)
}

function onRightClick(block: BlockState) {
  if (block.revealed)
    return
  block.flagged = !block.flagged
}

function generatorMines(initial: BlockState) {
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

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block)
    .forEach((s) => {
      if (!s.revealed) {
        s.revealed = true
        expendZero(s)
      }
    })
}

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

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]

function updateNumbers() {
  state.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return
      getSiblings(block)
        .forEach((b) => {
          if (b.mine)
            block.adjacentMines += 1
        })
    })
  })
}
function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined

    return state[y2][x2]
  }).filter(Boolean) as BlockState[]
}

function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'

  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray/20'

  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}

function checkGameStatus() {
  const blocks = state.flat()
  if (blocks.every(block => block.revealed || (block.flagged && block.mine))) {
    if (blocks.some(block => block.flagged && !block.mine))
      alert('You Cheat')
    else
      alert('You Win!!')
  }
}

watchEffect(checkGameStatus)

</script>

<template>
  <div>
    Minesweeper
    <div p5>
      <div
        v-for="row,y in state"
        :key="y"
        flex="~"
        items-center
        justify-center
      >
        <button
          v-for="item,x in row"
          :key="x"
          flex="~"
          items-center
          justify-center
          w-10
          h-10
          m="0.5"
          border="1 gray-400/10"
          :class="getBlockClass(item)"
          @click="onClick($event,item)"
          @contextmenu.prevent="onRightClick(item)"
        >
          <template v-if="item.flagged">
            <div i-mdi-flag text-red />
          </template>
          <template v-else-if="item.revealed || dev">
            <div v-if="item.mine" i-mdi:mine>
              x
            </div>
            <div v-else>
              {{ item.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
