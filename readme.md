# redux-master
[Documentation and Demo](https://zvakanaka.github.io/redux-master)  
Use Redux to manage web components
## Usage
Place some child components inside
```html
<redux-master src="https://example.com/data.json">
  <view-json id="json"></view-json>
  <table-of-data id="table"></table-of-data>
</redux-master>
```
Add a reducer
```js
reduxMaster.addReducer(function (store, action, self) {
  return { headings: action.headings, rows: action.rows };
}, 'SET_DATA');
```
Dispatch to the store
```js
reduxMaster.store.dispatch({ type: 'SET_DATA', headings: headings, rows: rows });
```
Subscribe a function to whenever a reducer is called
```js
reduxMaster.addView((s) => {
  reduxMaster.children.table.data = { headings: s.headings, rows: s.rows };
});
```
