[demo](https://zvakanaka.github.io/redux-web-component)  
Use Redux to manage web components
# Usage
Place whatever child components you'd like inside the `redux-master` component
```html
<redux-master src="./data.json">
  <view-json no-scroll id="json"></view-json>
  <table-of-data id="table"></table-of-data>
</redux-master>
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
