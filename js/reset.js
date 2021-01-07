const resetButton = document.getElementById("reset-button")

resetButton.addEventListener("click", () => {
  store.dispatch(resetState())
  clearItems()

  initializeFromState(store.getState())
})
