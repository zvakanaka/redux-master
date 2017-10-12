/*
 * This is a proxy component that uses a redux-master component to manage contents
 * The contents of this component are contained in the shadow DOM of this component
 */
(function() {
  'use strict';
  customElements.define('component-container', class extends HTMLElement {
    constructor() {
      super(); //always
      this.attachShadow({mode: 'open'});
    }
    connectedCallback() {
      this.shadowRoot.innerHTML = `
        <redux-master id="master" src="${this.getAttribute('src')}">
          <h2>Data</h2>
          <label for="input">JSON URL:</label>
          <input type="text" id="input" value="${this.getAttribute('src')}">
          <button type="button" id="button">Get data</button>
          <label for="checkbox">Prepend to Table</label>
          <input type="checkbox" id="checkbox" checked="true">
          <h2>Response</h2>
          <view-json id="json">"Loading: ${this.getAttribute('src')}" </view-json>
          <h2>Table</h2>
          <table-of-data id="table"></table-of-data>
        </redux-master>
        `;
      let reduxMaster = this.shadowRoot.children.master;

      reduxMaster.addReducer(function (store, action) { // called whenever 'SET_DATA' is dispatched
        // attempt to dynamically get headings + rows out of a variety object structures
        let headings;
        let rows;
        if (typeof action.data === 'string') {
          headings = [''];
          rows = [[action.data]];
        } else {
          headings = (typeof action.data.length === 'undefined') ? Object.keys(action.data) : Object.keys(action.data[0]);
          rows = (typeof action.data.length === 'undefined') ? [Object.values(action.data)] : action.data.map(row => Object.values(row));
        }
        let isPrependChecked = reduxMaster.children.checkbox.checked;
        return { headings: headings, rows: rows, data: action.data, prepend: isPrependChecked };
      }, 'SET_DATA');

      reduxMaster.addView((store) => { // subscribe to whenever a reducer is called
        // puts the last json response in the json viewer component
        reduxMaster.children.json.innerHTML = JSON.stringify(store.data);
      });

      reduxMaster.addView((store) => { // subscribe to whenever a reducer is called
        // this view takes data from the store and puts it into the table component
        if (!store.prepend || !reduxMaster.children.table.data.hasOwnProperty('rows')) { // don't prepend
          reduxMaster.children.table.data = { headings: store.headings, rows: store.rows };
        } else { // prepend
          reduxMaster.children.table.data = { headings: store.headings, rows: [...store.rows, ...reduxMaster.children.table.data.rows] };
        }
      });

      function fetchDataThenDispatch(url) {
        fetch(url, { method: 'GET', mode: 'cors'})
        .then(res => res.json())
        .then(data => {
          reduxMaster.store.dispatch({ type: 'SET_DATA', data: data });
        });
      }

      fetchDataThenDispatch(reduxMaster.getAttribute('src'));// get initial data

      reduxMaster.children.button.addEventListener('click', function () {
        fetchDataThenDispatch(reduxMaster.children.input.value);
      });
    } //event listeners
    disconnectedCallback() {} //event cleanup
  });
}());
