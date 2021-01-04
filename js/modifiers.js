/* DOM Elements */
const modifierRows = document.querySelectorAll(".modifier-row")

const OPTION_LENGTH_CUT_OFF = 30
const DEFAULT_MODIFIER_NAME = "No Modifier"
const DEFAULT_MODIFIER_BONUS = 0
const DEFAULT_MODIFIER_OPTION = `[+${DEFAULT_MODIFIER_BONUS}] ${DEFAULT_MODIFIER_NAME}`
const modifiersDataList = document.getElementById("modifiers-list")
const modifiersSelect = document.getElementById("modifiers-select")
const modifierRowsSection = document.getElementById("modifier-rows")
const addModifierButton = document.getElementById("add-modifier-button")
const tableContainer = document.getElementById("table-container")

/* set initial state from local storage or a default empty array */
const localStorageEntries = JSON.parse(localStorage.getItem(STATE_KEY))
  .modifierEntries
let modifierEntries = localStorageEntries || []

/* update global state store */
store.dispatch(setModifierEntries(modifierEntries))
store.dispatch(
  setModifier({ name: DEFAULT_MODIFIER_NAME, bonus: DEFAULT_MODIFIER_BONUS }),
)

/* Add New Modifier */
addModifierButton.addEventListener("click", () => {
  addRow()
  tableContainer.scrollTo({ top: 0 })
})

/* Initialization */
if (modifierEntries.length === 0) {
  /* table is empty; add a default row */
  addRow()
} else {
  /* render the table from existing row data */
  const rows = store.getState().modifierEntries || []
  rows.forEach((row) => {
    addRow(true, row)
  })
}

/**
 * Add a row element to the modifiers table
 * @param {boolean} isFromStorage
 * @param {{name:string, modifier:number}} row
 */
function addRow(isFromStorage = false, row) {
  const index = modifierRowsSection.children.length

  let name = (row && row.name) || `New Modifier`
  let modifier = (row && row.modifier) || 0

  /* create the row element */
  const rowElement = document.createElement("tr")
  rowElement.classList.add("modifier-row")
  rowElement.innerHTML = `<td><input type="text" class="modifier-name" value="${name}"></td><td><input class="modifier-input" type="number" value="${modifier}"></td><td><button class="delete-modifier-button btn btn-outline-danger">&#10008;</button></td>`
  modifierRowsSection.insertBefore(
    rowElement,
    modifierRowsSection.childNodes[0],
  )

  updateDataListOptions()
  const rowContent = row || { name, modifier }

  if (!isFromStorage) {
    /* add the value to state & add to local storage */
    modifierEntries.push(rowContent)
    store.dispatch(setModifierEntries(modifierEntries))
  }

  /* handle name field change */
  const modifierNameInput = rowElement.querySelector(".modifier-name")
  modifierNameInput.select()

  modifierNameInput.addEventListener("change", () => {
    rowContent.name = modifierNameInput.value

    updateDataListOptions()
    store.dispatch(setModifierEntries(modifierEntries))
  })

  modifierNameInput.addEventListener("focus", () => {
    modifierNameInput.select()
  })

  /* handle modifier field change */
  const modifierInput = rowElement.querySelector(".modifier-input")
  modifierInput.addEventListener("change", (e) => {
    rowContent.modifier = +e.target.value

    updateDataListOptions()
    store.dispatch(setModifierEntries(modifierEntries))
  })

  modifierInput.addEventListener("focus", () => {
    modifierInput.select()
  })

  /* handle delete button click */
  const deleteButton = rowElement.querySelector(".delete-modifier-button")
  deleteButton.addEventListener("click", () => {
    // const doDelete = confirm(`Delete [${rowContent.name}] modifier?`)
    // if (!doDelete) return

    modifierEntries = modifierEntries.filter((_, i) => i !== index)
    rowElement.remove()

    updateDataListOptions()
    store.dispatch(setModifierEntries(modifierEntries))
  })
}

//
// MODIFIERS DATA LIST
//
/* populates the data list with options based modifiers state */
function updateDataListOptions() {
  /* initial No-Modifier option */
  modifiersSelect.value = DEFAULT_MODIFIER_OPTION
  modifiersDataList.innerHTML = ""

  const defaultOption = document.createElement("option")
  defaultOption.value = DEFAULT_MODIFIER_OPTION
  modifiersDataList.appendChild(defaultOption)

  /* generate options based on modifier entries state */
  const modifierOptions = modifierEntries.map(({ name, modifier }) => {
    const modifierString = modifier < 0 ? `${modifier}` : `+${modifier}`
    const optionName = `[${modifierString}] ${name}`
    const lengthLimitedName =
      optionName.substring(0, OPTION_LENGTH_CUT_OFF) +
      (optionName.length >= OPTION_LENGTH_CUT_OFF ? "..." : "")

    const optionEl = document.createElement("option")
    optionEl.value = lengthLimitedName

    return optionEl
  })

  /* sort options alphabetically */
  const alphaSortedOptions = modifierOptions.sort((a, b) => {
    const aString = a.value.substring(a.value.indexOf("["), a.value.length)
    const bString = b.value.substring(b.value.indexOf("["), b.value.length)

    if (aString < bString) return -1
    if (bString < aString) return 1
    return 0
  })

  alphaSortedOptions.forEach((option) => {
    modifiersDataList.appendChild(option)
  })
}

//
// MODIFIER SELECTOR
//
/* clear the select to view all possible modifier options */
let previousModifier
modifiersSelect.addEventListener("focus", () => {
  previousModifier = modifiersSelect.value
  modifiersSelect.value = ""
})

modifiersSelect.addEventListener("change", () => {
  /* extract modifier details from the selected option name  */
  const optionName = modifiersSelect.value

  /* bonus number */
  const afterLeftBracketIndex = optionName.indexOf("[") + 1
  const rightBracketIndex = optionName.indexOf("]")
  const bonus = Number(
    optionName.slice(afterLeftBracketIndex, rightBracketIndex),
  )
  console.log(bonus)

  /* modifier name */
  const name = optionName.slice(rightBracketIndex + 1, optionName.length).trim()
  console.log(name)

  store.dispatch(setModifier({ name, bonus }))
  modifiersSelect.blur()
})

/* set the selected modifier back to the previous modifier if no new modifer was selected*/
modifiersSelect.addEventListener("blur", () => {
  if (!modifiersSelect.value) modifiersSelect.value = previousModifier
})
