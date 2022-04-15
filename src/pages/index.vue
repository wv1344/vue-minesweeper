<script setup lang="ts">

// import type { BlockState } from '~/type'
import { toggleDev } from '~/composables'
import MineBlock from '~/components/mineBlock.vue'

import GamePlay from '~/composables/logic'

const play = new GamePlay(12, 12)

useStorage('vuesweeper-state', play.state)

const state = computed(() => play.board)

// const WIDTH = 5
// const HEIGHT = 5

// const state = ref<BlockState[][]>([])

// function reset() {
//   state.value = Array.from({ length: HEIGHT }, (_, y) =>
//     Array.from({ length: WIDTH },
//       (_, x): BlockState => ({
//         x,
//         y,
//         adjacentMines: 0,
//         revealed: false,
//       }),
//     ),
//   )
// }

// let mineGenerated = false

// function onClick(block: BlockState) {
//   if (!mineGenerated) {
//     generatorMines(state.value, block)
//     updateNumbers(state.value)

//     mineGenerated = true
//   }
//   block.revealed = true
//   if (block.mine)
//     alert('BOOOM!')
//   expendZero(block)
// }

// function onRightClick(block: BlockState) {
//   if (block.revealed)
//     return
//   block.flagged = !block.flagged
// }

// function generatorMines(state: BlockState[][], initial: BlockState) {
//   for (const row of state) {
//     for (const block of row) {
//       if (Math.abs(initial.x - block.x) < 1)
//         continue
//       if (Math.abs(initial.y - block.y) < 1)
//         continue
//       block.mine = Math.random() < 0.2
//     }
//   }
// }

// function expendZero(block: BlockState) {
//   if (block.adjacentMines)
//     return
//   getSiblings(block)
//     .forEach((s) => {
//       if (!s.revealed) {
//         s.revealed = true
//         expendZero(s)
//       }
//     })
// }

// const directions = [
//   [1, 1],
//   [1, 0],
//   [1, -1],
//   [0, -1],
//   [-1, -1],
//   [-1, 0],
//   [-1, 1],
//   [0, 1],
// ]

// function updateNumbers(state: BlockState[][]) {
//   state.forEach((row, y) => {
//     row.forEach((block, x) => {
//       if (block.mine)
//         return
//       getSiblings(block)
//         .forEach((b) => {
//           if (b.mine)
//             block.adjacentMines += 1
//         })
//     })
//   })
// }
// function getSiblings(block: BlockState) {
//   return directions.map(([dx, dy]) => {
//     const x2 = block.x + dx
//     const y2 = block.y + dy
//     if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
//       return undefined

//     return state.value[y2][x2]
//   }).filter(Boolean) as BlockState[]
// }

// function checkGameStatus() {
//   const blocks = state.value.flat()
//   if (blocks.every(block => block.revealed || (block.flagged && block.mine))) {
//     if (blocks.some(block => block.flagged && !block.mine))
//       alert('You Cheat')
//     else
//       alert('You Win!!')
//   }
// }

// reset()
// watchEffect(checkGameStatus)
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
        <MineBlock
          v-for="block,x in row" :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
      <div flex="~" mt-5 justify-center>
        <button
          btn
          @click="toggleDev"
        >
          {{ isDev ? 'DEV':"NORMAL" }}
        </button>
        <button btn ml-3 @click="play.reset()">
          RESET
        </button>
      </div>
    </div>
  </div>
</template>
