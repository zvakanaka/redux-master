(function() {
  'use strict';
  customElements.define('redux-master', class extends HTMLElement {
    connectedCallback() {
      let reducers = [];
      const defaultState = {};
      function reducer(state, action) {
        let newState = null;
        reducers.forEach(function(r) {
          if (action.type === r.action) {
            newState = r.func(state, action);//reduce!
          }
        });
        return (newState || state);
      }
      this.reducers = reducers;
      /* global Redux */
      this.store = Redux.createStore(reducer.bind(this), defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
    }
    addReducer(func, action) {
      let reducer = { action: action, func: func };
      this.reducers.push(reducer);
    }
    addView(func, immediate=false) { //these get called after reducer
      if (immediate) func(this.store.getState());//call function at addView time
      this.store.subscribe(() => func(this.store.getState()));
    }
  });
}());
