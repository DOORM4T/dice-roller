const sfx = document.getElementById("sfx")
const sources = Array.from(sfx.querySelectorAll("source"))
const soundSources = sources.map((source) => source.src)
const muteSoundCheckbox = document.getElementById("mute-sound")
const muteIcon = document.getElementById("mute-icon")
const soundIcon = document.getElementById("sound-icon")

muteSoundCheckbox.addEventListener("click", () => {
  const isMuted = Boolean(muteSoundCheckbox.checked)
  if (isMuted) {
    muteIcon.classList.add("d-inline")
    muteIcon.classList.remove("d-none")
    soundIcon.classList.add("d-none")
    soundIcon.classList.remove("d-inline")
  } else {
    playRandomSound()
    muteIcon.classList.remove("d-inline")
    muteIcon.classList.add("d-none")
    soundIcon.classList.remove("d-none")
    soundIcon.classList.add("d-inline")
  }
})

/**
 * Play a random sound
 */
function playRandomSound() {
  // STOP if sound is muted
  const isMuted = Boolean(muteSoundCheckbox.checked)
  if (isMuted) return
  const index = chance.natural({ min: 0, max: soundSources.length - 1 })
  new Audio(soundSources[index]).play()
}
