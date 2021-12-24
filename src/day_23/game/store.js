import { writable } from "svelte/store";
import clone from "clone";

const costs = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

function processInput(input) {
  const lines = input.trim().replace(/#/g, "W").replace(/\./g, "S").split("\n");
  const grid = [];

  for (let r = 0; r < lines.length; r++) {
    const row = [];
    for (let c = 0; c < lines[0].length; c++) {
      if (lines[r][c] && lines[r][c] !== " ") {
        row.push(lines[r][c]);
      } else {
        row.push("E");
      }
    }
    grid.push(row);
  }

  return {
    grid,
    cost: 0,
    selected: null,
    action: "idle",
    best: localStorage.getItem("best-score") || null,
  };
}

function createStore(input) {
  const initialState = processInput(input);
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,

    select: (row, col) => {
      update((_state) => {
        const state = clone(_state);

        if (state.action === "idle") {
          if (!["W", "E", "S"].includes(state.grid[row][col])) {
            state.selected = `${row},${col}`;
            state.action = "selected";
          }
        } else if (state.action === "selected") {
          if (state.grid[row][col] === "S") {
            const [_r, _c] = state.selected.split(",").map(Number);
            const type = state.grid[_r][_c];

            state.grid[row][col] = type;
            state.grid[_r][_c] = "S";
            state.selected = null;
            state.action = "idle";
            state.cost +=
              costs[type] *
              (Math.abs(row - 1) + Math.abs(_r - 1) + Math.abs(_c - col));
          } else if (!["W", "E", "S"].includes(state.grid[row][col])) {
            state.selected = `${row},${col}`;
            state.action = "selected";
          }
        }

        return state;
      });
    },

    complete: () => {
      update((state) => {
        if (!state.best || state.cost < state.best) {
          localStorage.setItem("best-score", state.cost);
        }

        return {
          ...clone(initialState),
          best: Math.min(state.cost, state.best || Infinity),
        };
      });
    },

    reset: () => {
      set(processInput(input));
    },

    wipe: () => {
      update(() => {
        localStorage.removeItem("best-score");
        return { ...clone(initialState), best: null };
      });
    },
  };
}

export default createStore;
