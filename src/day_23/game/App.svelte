<script>
  import createStore from "./store";

  const part2 = true;

  const inputPart1 = `
#############
#...........#
###D#B#A#C###
  #C#A#D#B#
  #########`;

  const inputPart2 = `
#############
#...........#
###D#B#A#C###
  #D#C#B#A#
  #D#B#A#C#
  #C#A#D#B#
  #########`;

  const store = createStore(part2 ? inputPart2 : inputPart1);
  const key = (r, c) => `${r},${c}`;
  const viewBox = `0 0 ${$store.grid[0].length * 100} ${$store.grid.length * 100}`
</script>

<main>
  <div class="status">
    <p class="grow">Cost: {$store.cost}</p>
    <p>Best: {$store.best}</p>
    <button on:click={store.complete}>Complete</button>
    <button on:click={store.reset}>Reset</button>
    <button on:click={store.wipe}>Wipe Best Score</button>
  </div>
  <svg xmlns="http://www.w3.org/2000/svg" {viewBox}>
    {#each $store.grid as _, r}
      {#each $store.grid[r] as state, c}
        <g on:click={() => store.select(r, c)}>
          <rect
            x={5 + c * 100}
            y={5 + r * 100}
            width="90"
            height="90"
            fill={`var(--${state})`}
            stroke="#111"
            stroke-width="5"
            class:selected={$store.selected === key(r, c)}
          />
          {#if !["E", "W", "S"].includes(state)}
            <text
              class="text"
              text-anchor="middle"
              dominant-baseline="middle"
              x={50 + c * 100}
              y={55 + r * 100}
            >
              {state}
            </text>
          {/if}
        </g>
      {/each}
    {/each}
  </svg>
</main>

<style>
  :root {
    --W: #212121;
    --S: #424242;
    --A: #ffbf00;
    --B: #cd7f32;
    --C: #8a4300;
    --D: #c5a289;
    --E: #212121;
  }

  main {
    width: 100%;
    max-width: 90%;
    display: flex;
    flex-direction: column;
  }

  svg {
    width: 100%;
  }

  .selected {
    stroke: white;
  }

  .text {
    font-family: monospace;
    font-size: 60px;
    font-weight: 700;
    opacity: 0.6;
    user-select: none;
  }

  .status {
    display: flex;
    width: 100%;
    margin-bottom: 1rem;
    gap: 10px;
  }

  .grow {
    flex-grow: 1;
  }
  
  button {
    color: #fff;
    background-color: #424242;
    border: 1px solid black;
    cursor: pointer;
  }
</style>
