(function() {
  'use strict';
  customElements.define('redux-master', class extends HTMLElement {
    connectedCallback() {
      let reducers = [];
      const defaultState = {};
      function reducer(state, action) {
        let self = this;
        let newState = null;
        reducers.forEach(function(r) {
          if (action.type === r.action) {
            console.log('REDUCING!!!', r.action, 'action', action);
            newState = r.func(state, action, self);
          }
        });
        console.log(newState);
        return (newState || state);
      }
      this.reducers = reducers;
      /* global Redux */
      this.store = Redux.createStore(reducer.bind(this), defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
      Array.from(this.children).forEach(function (child) {
        customElements.whenDefined(child.localName).then(() => {
          //TODO: wait until these are all done and fire event 'allDefined'
        });
      });
    } //event listeners
    addReducer(func, action) {
      let reducer = { action: action, func: func };
      this.reducers.push(reducer);
    }
    addView(func) { //these get called after reducer
      func(this.store.getState());
      this.store.subscribe(() => {
        func(this.store.getState());
      });
    }
  });
}());
