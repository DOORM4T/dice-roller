const initialState = {
  numDice: 1,
  numSides: 20,
  results: [],
  previousSums: [],
}

//
// ACTION CONSTANTS
//
const SET_NUM_DICE = "SET_NUM_DICE"
const SET_DIE_SIDES = "SET_DIE_SIDES"

const ADD_RESULT = "ADD_RESULT"
const ADD_PREVIOUS_SUM = "ADD_PREVIOUS_SUM"

const CLEAR_RESULTS = "CLEAR_RESULTS"
const CLEAR_PREVIOUS_SUMS = "CLEAR_PREVIOUS_SUMS"

//
// STORE
//
const store = Redux.createStore(stateReducer)

store.subscribe(() => {
  console.log(store.getState())
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

// store.dispatch(setDieSides(6))
// store.dispatch(addResult(24))
// store.dispatch(addResult(25))
// store.dispatch(addPreviousSum(1))
// store.dispatch(addPreviousSum(2))
// store.dispatch(addPreviousSum(3))
