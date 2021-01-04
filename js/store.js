/* load initial state from a default object or from local storage */
const STATE_KEY = "STATE"
const localStorageState = JSON.parse(localStorage.getItem(STATE_KEY))
const defaultState = {
  numDice: 1,
  numSides: 20,
  results: [],
  previousSums: [],
  modifier: {
    name: "",
    bonus: 0,
  },
  modifierEntries: [],
}
const initialState = localStorageState || defaultState

//
// ACTION CONSTANTS
//
const SET_NUM_DICE = "SET_NUM_DICE"
const SET_DIE_SIDES = "SET_DIE_SIDES"

const ADD_RESULT = "ADD_RESULT"
const ADD_PREVIOUS_SUM = "ADD_PREVIOUS_SUM"

const CLEAR_RESULTS = "CLEAR_RESULTS"
const CLEAR_PREVIOUS_SUMS = "CLEAR_PREVIOUS_SUMS"

const SET_MODIFIER = "SET_MODIFIER"
const SET_MODIFIER_ENTRIES = "SET_MODIFIER_ENTRIES"

//
// STORE
//
const store = Redux.createStore(stateReducer)

store.subscribe(() => {
  console.log(store.getState())

  const state = JSON.stringify(store.getState())
  localStorage.setItem(STATE_KEY, state)
})

//
// REDUCER
//
function stateReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_NUM_DICE:
      return { ...state, numDice: payload.dice }
    case SET_DIE_SIDES:
      return { ...state, numSides: payload.sides }
    case ADD_RESULT:
      return { ...state, results: state.results.concat(payload.result) }
    case ADD_PREVIOUS_SUM:
      return {
        ...state,
        previousSums: state.previousSums.concat(payload.result),
      }
    case CLEAR_RESULTS:
      return {
        ...state,
        results: [],
      }
    case CLEAR_PREVIOUS_SUMS:
      return {
        ...state,
        previousSums: [],
      }
    case SET_MODIFIER:
      return {
        ...state,
        modifier: payload.modifier,
      }
    case SET_MODIFIER_ENTRIES:
      return {
        ...state,
        modifierEntries: payload.modifierEntries,
      }
    default:
      return state
  }
}

//
// ACTION CREATORS
//
function setNumDice(dice) {
  return {
    type: SET_NUM_DICE,
    payload: {
      dice,
    },
  }
}

function setDieSides(sides) {
  return {
    type: SET_DIE_SIDES,
    payload: {
      sides,
    },
  }
}

function addResult(result) {
  return {
    type: ADD_RESULT,
    payload: {
      result,
    },
  }
}

function addPreviousSum(result) {
  return {
    type: ADD_PREVIOUS_SUM,
    payload: {
      result,
    },
  }
}

function clearResults() {
  return {
    type: CLEAR_RESULTS,
    payload: null,
  }
}

function clearPreviousSums() {
  return {
    type: CLEAR_PREVIOUS_SUMS,
    payload: null,
  }
}

function setModifier(modifier) {
  return {
    type: SET_MODIFIER,
    payload: { modifier },
  }
}

function setModifierEntries(modifierEntries) {
  return {
    type: SET_MODIFIER_ENTRIES,
    payload: { modifierEntries },
  }
}
