<script setup lang="ts">
import func from 'vue-temp/vue-editor-bridge'

interface BlockState{
  x: number
  y: number
  revealed?: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines?: number
}

const WIDTH = 10
const HEIGHT = 10

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

function onClick(block: BlockState) {
  block.revealed = true
  if (block.mine)
    alert('BOOOM!')
}

function generatorMines() {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.3
  }
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
      directions.forEach(([dx, dy]) => {
        const x2 = x + dx
        const y2 = y + dy
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
          return

        if (state[y2][x2].mine)
          block.adjacentMines += 1
      })
    })
  })
}

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray/10'

  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}

generatorMines()
updateNumbers()

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
          hover="bg-gray/10"
          m="0.5"
          border="1 gray-400/10"
          :class="getBlockClass(item)"
          @click="onClick(item)"
        >
          <template v-if="item.revealed">
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
