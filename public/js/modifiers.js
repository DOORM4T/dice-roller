// TODO: manage modifiers state with Redux
// TODO: refactor to pure functions
let modifierState = JSON.parse(localStorage.getItem("modifierState")) || []

const modifierRows = document.querySelectorAll(".modifier-row")

const OPTION_LENGTH_CUT_OFF = 30
const DEFAULT_MODIFIER_VALUE = "[+0] No Modifier"
const modifiersDataList = document.getElementById("modifiers-list")
const modifiersSelect = document.getElementById("modifiers-select")

/* DYNAMICALLY ADD A MODIFIER ROW */
const modifierRowsSection = document.getElementById("modifier-rows")
const addModifierButton = document.getElementById("add-modifier-button")
addModifierButton.addEventListener("click", () => {
  addRow()
})

if (modifierState.length === 0) {
  /* table is empty; add a default row */
  addRow()
} else {
  /* render the table from existing row data */
  modifierState.forEach((row) => {
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
  rowElement.innerHTML = `<td contenteditable>${name}</td><td><input type="number" value=${modifier}></td><td><button class="btn btn-outline-danger">&#10008;</button></td>`
  modifierRowsSection.insertBefore(
    rowElement,
    modifierRowsSection.childNodes[0],
  )
  updateDataListOptions()

  const rowContent = row || { name, modifier }

  if (!isFromStorage) {
    /* add the value to state & add to local storage */
    modifierState.push(rowContent)
    console.log(rowContent)
    storeLocally()
  }

  /* handle name field change */
  const modifierDiv = rowElement.children[0]
  modifierDiv.addEventListener("keyup", () => {
    rowContent.name = modifierDiv.textContent.trim()

    console.log(rowContent)
    updateDataListOptions()
    storeLocally()
  })

  /* handle modifier field change */
  const modifierInput = rowElement.children[1]
  modifierInput.addEventListener("keyup", (e) => {
    rowContent.modifier = +e.target.value

    updateDataListOptions()
    storeLocally()
  })

  /* handle delete button click */
  const deleteButton = rowElement.children[2]
  deleteButton.addEventListener("click", () => {
    // const doDelete = confirm(`Delete [${rowContent.name}] modifier?`)
    // if (!doDelete) return

    modifierState = modifierState.filter((_, i) => i !== index)
    rowElement.remove()

    updateDataListOptions()
    storeLocally()
  })
}

function storeLocally() {
  const data = JSON.stringify(modifierState)
  localStorage.setItem("modifierState", data)
}

//
// MODIFIERS DATA LIST
//
function updateDataListOptions() {
  modifiersSelect.value = DEFAULT_MODIFIER_VALUE
  modifiersDataList.innerHTML = ""

  const defaultOption = document.createElement("option")
  defaultOption.value = DEFAULT_MODIFIER_VALUE
  modifiersDataList.appendChild(defaultOption)

  const modifierOptions = modifierState.map(({ name, modifier }) => {
    const modifierString = modifier < 0 ? `${modifier}` : `+${modifier}`
    const optionName = `[${modifierString}] ${name}`
    const lengthLimitedName =
      optionName.substring(0, OPTION_LENGTH_CUT_OFF) +
      (optionName.length >= OPTION_LENGTH_CUT_OFF ? "..." : "")

    const optionEl = document.createElement("option")
    optionEl.value = lengthLimitedName

    return optionEl
  })

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
  modifiersSelect.blur()
})

/* set the selected modifier back to the previous modifier if no new modifer was selected*/
modifiersSelect.addEventListener("blur", () => {
  if (!modifiersSelect.value) modifiersSelect.value = previousModifier
})
