let selectedDieSides = 20
let results = []

const sumLabel = document.getElementById("rolls-sum")
const dieSelectors = document.querySelectorAll(".die-selector")
const customDie = document.getElementById("custom-die")
const customDieSidesInput = customDie.querySelector("input")
const allSelectors = [...dieSelectors, customDie]

/* preset dice */
dieSelectors.forEach((selector) => {
  selector.addEventListener("click", () => {
    const sides = Number(selector.dataset["dieSides"])
    if (!sides) return
    selectedDieSides = sides
    highlightSelector(selector)
  })
})

/* custom die */
customDie.addEventListener("click", () => {
  highlightSelector(customDie)
  const sides = Number(customDieSidesInput.value)
  customDieSidesInput.select()
  selectedDieSides = 0
  if (!sides) return
  selectedDieSides = sides
})
customDieSidesInput.addEventListener("keypress", () => {
  const sides = Number(customDieSidesInput.value)
  if (!sides) return
  selectedDieSides = sides
  highlightSelector(customDie)
})
customDieSidesInput.addEventListener("click", () => {
  customDieSidesInput.select() /* select all text when the input is clicked  */
  highlightSelector(customDie)
})

/* action buttons */
const rollButton = document.getElementById("roll-button")
const addButton = document.getElementById("add-button")
const clearButton = document.getElementById("clear-button")

rollButton.addEventListener("click", () => {
  results = []
  result = dX(selectedDieSides)
  /* stop upon invalid roll */
  if (result <= 0) return

  results.push(result)
  sumLabel.textContent = getSum(results)
  playRandomSound()
})

addButton.addEventListener("click", () => {
  result = dX(selectedDieSides)
  /* stop upon invalid roll */
  if (result <= 0) return

  results.push(result)
  const breakdown = results.join(" + ")
  const resultText = `${breakdown} = ${getSum(results)}`
  sumLabel.textContent = resultText
  sumLabel.scrollTo({ top: sumLabel.scrollHeight })
  playRandomSound()
})

clearButton.addEventListener("click", () => {
  results = []
  sumLabel.textContent = 0
})

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
 * @returns sum of an array of numbers
 * @param {number[]} numbers
 */
function getSum(numbers) {
  return numbers.reduce((prev, next) => prev + next, 0)
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
  console.log(dieSelector)
}
