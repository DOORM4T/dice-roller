let selectedDieSides = 20
let results = []
let previousResults = []
let numToRoll = 1
let numTimes = 1

const dieSelectors = document.querySelectorAll(".die-selector")
const customDie = document.getElementById("custom-die")
const customDieSidesInput = customDie.querySelector("input")
const allSelectors = [...dieSelectors, customDie]
const numDieInput = document.getElementById("num-die-input")
const numTimesInput = document.getElementById("num-times-input")

/* NUM DIE INPUT */
numDieInput.addEventListener("click", () => {
  numDieInput.select()
})
numDieInput.addEventListener("change", () => {
  const num = Number(numDieInput.value)
  numToRoll = num
})

/* NUM TIMES INPUT */
numTimesInput.addEventListener("click", () => {
  numTimesInput.select()
})
numTimesInput.addEventListener("change", () => {
  const num = Number(numTimesInput.value)
  numTimes = num
})

/* PRESENT DICE BUTTONS */
dieSelectors.forEach((selector) => {
  selector.addEventListener("click", () => {
    const sides = Number(selector.dataset["dieSides"])
    if (!sides) return
    selectedDieSides = sides
    highlightSelector(selector)
  })
})

/* CUSTOM DIE BUTTON */
/* select the custom die option upon button click */
customDie.addEventListener("click", () => {
  highlightSelector(customDie)
  const sides = Number(customDieSidesInput.value)
  console.log(sides)
  selectedDieSides = 0
  if (!sides) return
  selectedDieSides = sides
})

/* highlight the custom die option button and the input when the input is clicked */
customDieSidesInput.addEventListener("change", () => {
  const sides = Number(customDieSidesInput.value)
  if (!sides) return
  selectedDieSides = sides
  highlightSelector(customDie)
})

/* highlight the custom die option and input when the input is clicked */
customDieSidesInput.addEventListener("click", () => {
  customDieSidesInput.select() /* select all text when the input is clicked  */
  highlightSelector(customDie)
})

/* ACTION BUTTONS */
const rollButton = document.getElementById("roll-button")
const addButton = document.getElementById("add-button")
const clearButton = document.getElementById("clear-button")

/* roll a dice, clearing prior results */
rollButton.addEventListener("click", () => {
  for (let rollNum = 0; rollNum < numTimes; rollNum++) {
    results = []
    previousResults = []
    rollDie()
    addItem(results, getSum(results), selectedDieSides)
  }
})

/* roll an additional die, adding the result to the existing results */
addButton.addEventListener("click", () => {
  const previousSum = getSum(results)
  previousResults.push(previousSum)
  results = []
  for (let rollNum = 0; rollNum < numTimes; rollNum++) {
    rollDie()
  }
  const newSum = getSum(previousResults) + getSum(results)
  const sumString = `${previousResults.join(" + ")} + ${getSum(
    results,
  )} = ${newSum}`
  addItem(results, sumString, selectedDieSides)
})

/* clear roll results */
clearButton.addEventListener("click", () => {
  results = []
  previousResults = []
  clearItems()
})

/* FUNCTIONS */
/**
 * Rolls a die with some number of sides
 * @param {number} sides number of sides on the die
 * @returns die roll outcome
 */
function dX(sides) {
  if (!sides) {
    console.error("Invalid die. Did you enter a valid number of sides?")
    return 0
  }
  result = chance.natural({ min: 1, max: sides })
  return result
}

/**
 * @returns sum of results
 */
function getSum(results) {
  return results.reduce((prev, next) => prev + next, 0)
}

/**
 * Highlight and focus on the selected die selector button
 * @param {HTMLButtonElement} dieSelector
 */
function highlightSelector(dieSelector) {
  allSelectors.forEach((selector) => {
    selector.classList.add("btn-outline-dark")
    selector.classList.add("shadow-sm")
    selector.classList.remove("btn-dark")
    selector.classList.remove("shadow-lg")
    selector.classList.remove("text-light")
  })
  dieSelector.classList.add("btn-dark")
  dieSelector.classList.add("shadow-lg")
  dieSelector.classList.add("text-light")
}

/**
 * Roll dice based on dice rolling parameters
 */
function rollDie() {
  for (let i = 0; i < numToRoll; i++) {
    result = dX(selectedDieSides)
    /* stop upon invalid roll */
    if (result <= 0) return

    results.push(result)
    if (i < 10) playRandomSound()
  }
}
