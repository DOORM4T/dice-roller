const resetButton = document.getElementById("reset-button")

resetButton.addEventListener("click", () => {
  store.dispatch(resetState())
  const doReload = confirm(
    "This will restore the default settings and delete all of your modifiers. Continue?",
  )
  if (doReload) window.location.reload()
})
