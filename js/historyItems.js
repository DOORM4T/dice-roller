const historyItemTemplate = document.getElementById("history-item-template")
  .innerHTML
const diceIconTemplate = document.getElementById("dice-icon-template").innerHTML

const rollsHistory = document.getElementById("rolls-history-list")
const non20validSides = [4, 6, 8, 10, 12, 100]
const diceImg = "<img src='./assets/dice/d20-empty.svg' width=48></img>"
const itemClassnames =
  "history-item d-flex flex-row border-light border-bottom py-2"

/**
 * Adds an item to the results list
 * @param {number[]} values array of dice results
 * @param {number} sum sum of all dice results
 */
function addItem(values, sum, sides = 20) {
  const icons = values
    .map((value) => {
      let template = diceIconTemplate.replace("$value", value)
      let img = diceImg
      if (non20validSides.includes(sides)) {
        img = diceImg.replace("20", sides)
      }
      template = template.replace("$src", img)
      return template
    })
    .join("")
  let item = historyItemTemplate
  if (sides) item = item.replace("$sum", sum)
  item = item.replace("$icons", icons)

  /* insert item at the top of the history list */
  let liItem = document.createElement("LI")
  const itemHTML = item.substring(item.indexOf(">") + 1, item.lastIndexOf("<"))
  liItem.innerHTML = itemHTML
  liItem.setAttribute("class", itemClassnames)
  rollsHistory.insertBefore(liItem, rollsHistory.childNodes[0])
  rollsHistory.scrollTo({ top: 0 })
}

/**
 * Clears all items from the results list
 */
function clearItems() {
  rollsHistory.innerHTML = ""
}
