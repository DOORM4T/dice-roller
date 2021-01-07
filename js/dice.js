//
// NUM DICE TO ROLL
//
const numDiceInput = document.getElementById("num-dice-input")
numDiceInput.addEventListener("click", () => {
  /* highlight the input field upon click  */
  numDiceInput.select()
})

const MIN_DICE = 1
numDiceInput.addEventListener("change", () => {
  /* update state for custom #sides */
  let numDice = Number(numDiceInput.value)

  if (numDice < MIN_DICE) {
    /* enforce minimum #dice */
    numDice = MIN_DICE
    numDiceInput.value = String(MIN_DICE)
  }

  store.dispatch(setNumDice(numDice))
})

//
// SELECT A DIE
//
const dieSelectors = document.querySelectorAll(".die-selector")

dieSelectors.forEach((selector) => {
  selector.addEventListener("click", () => {
    /* get #sides associated with the die selection button */
    const sides = Number(selector.dataset["dieSides"])

    /* stop if no sides */
    if (!sides) return

    store.dispatch(setDieSides(sides))

    /* highlight the selection button */
    highlightSelector(selector)
  })
})

//
// CUSTOM DIE BUTTON
//
const customDie = document.getElementById("custom-die")
const customDieInput = customDie.querySelector("#custom-die-input")

/* highlight the custom die option and input when the input is clicked */
customDie.addEventListener("click", () => {
  customDieInput.select() /* select all text when the input is clicked  */
  highlightSelector(customDie)
})

const MIN_SIDES = 2
customDieInput.addEventListener("change", () => {
  /* set the data-die-sides attribute of the custom die button upon input change */
  let sides = Number(customDieInput.value)

  /* stop if invalid # sides */
  if (sides < MIN_SIDES) {
    sides = MIN_SIDES
    customDieInput.value = String(MIN_SIDES)
  }

  /* trigger selector code after setting custom #sides to update state */
  customDie.setAttribute("data-die-sides", sides)
  customDie.click()
  customDieInput.blur()
})

//TODO:Refactor buttons to separate folder

//
// ROLL BUTTON
//
const rollButton = document.getElementById("roll-button")
rollButton.addEventListener("click", rollNewDice)

function rollNewDice() {
  /* roll dice, clearing prior results */
  const { numSides, modifier } = store.getState()
  store.dispatch(clearResults())
  store.dispatch(clearPreviousSums())

  /* add non-zero modifier */
  let modifierString = ""
  let modifierBonus = modifier.bonus /* absolute value of the bonus */
  if (modifier.bonus !== 0) {
    const sign = modifier.bonus > 0 ? "+" : "-"
    const absBonus = Math.abs(modifier.bonus)
    modifierString = ` ${sign} ${absBonus} [${modifier.name}]`
  }

  const rolls = rollDice()
  const sum = getSum(rolls)
  const resultString =
    modifierBonus !== 0
      ? `${
          sum + modifierBonus
        }<br> = <span style="color:#AAA">${sum}${modifierString}</span>`
      : String(sum)
  addItem(rolls, numSides, resultString)
}

//
// ADD BUTTON
//
const addButton = document.getElementById("add-button")
/* roll an additional die, adding the result to the existing results */
addButton.addEventListener("click", addDice)

function addDice() {
  const { results, numSides } = store.getState()

  /* add previous roll to list of previous sums */
  const previousSum = getSum(results)
  store.dispatch(addPreviousSum(previousSum))
  store.dispatch(clearResults())

  /* get updated list of previous sums */
  const { previousSums } = store.getState()
  previousSums.reverse()

  /* roll new dice */
  const addRollResults = rollDice()
  const addRollSum = getSum(addRollResults)

  /* add to the total of the previous sums */
  const result = getSum(previousSums) + addRollSum

  /* string to show the roll results */
  const sumString = `${result}<br> = ${addRollSum} + <span style="color:#AAA">${previousSums.join(
    " + ",
  )}</span>`
  addItem(addRollResults, numSides, sumString)
}

//
// CLEAR BUTTON
//
const clearButton = document.getElementById("clear-button")

/* clear roll results */
clearButton.addEventListener("click", () => {
  /* clear all history in state */
  store.dispatch(clearResults())
  store.dispatch(clearPreviousSums())

  /* clear Results history HTML element */
  clearItems()
})

//
// HELPER FUNCTIONS
//

const allSelectors = [...dieSelectors, customDie]
/**
 * Highlight and focus on the selected die selector button
 * @param {HTMLButtonElement} dieSelector
 */
function highlightSelector(dieSelector) {
  allSelectors.forEach((selector) => {
    selector.classList.add("btn-outline-dark")
    selector.classList.remove("btn-dark")
    selector.classList.remove("text-light")
  })
  dieSelector.classList.add("btn-dark")
  dieSelector.classList.add("text-light")
}

/**
 * Roll dice based on #die sides and #dice to roll
 * @returns array of roll results
 */
function rollDice() {
  const { numDice, numSides } = store.getState()

  for (let i = 0; i < numDice; i++) {
    /* roll a die */
    result = chance.natural({ min: 1, max: numSides })

    /* add roll result to results state */
    store.dispatch(addResult(result))

    /* play sounds for up to 10 dice */
    if (i < 10) playRandomSound()
  }

  return store.getState().results
}

/**
 * @param values array of dice roll results
 * @returns sum of values
 */
function getSum(values) {
  /* sum of the results array state */
  return values.reduce((prev, next) => prev + next, 0)
}

//
// GUI INITIALIZATION FROM SAVED STATE
//
initializeFromState(store.getState())

/**
 * InitializeGUI appearances based on state
 * @param {{numDice: 1, numSides: 20, results: [], previousSums: []}} state
 */
function initializeFromState(state) {
  /* initialize #dice input */
  const numDiceInput = document.getElementById("num-dice-input")
  numDiceInput.value = state.numDice

  /* initialize selected die selector */
  let dieSelector = document.querySelector(
    `[data-die-sides="${state.numSides}"]`,
  )

  if (!dieSelector) {
    dieSelector = document.getElementById("custom-die")
    dieSelector.setAttribute("data-die-sides", state.numSides)

    const customDieInput = document.getElementById("custom-die-input")
    customDieInput.value = state.numSides
  }

  dieSelector.click()
}
