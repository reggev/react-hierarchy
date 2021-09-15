# react-hierarchy

> A native React hierarchy chart
> this project uses d3 for layout, react-spring for animations, react-virtualized-auto-sizer & react-svg-pan-zoom to manage the svg container.

## Install

```bash
npm install --save react-hierarchy
```

## components over configurations

The idea is to provide a component that handles **layout only**, no more giant - yet limited config objects. you provide your own `Card` component, and `Hierarchy` will place it on an `svg` viewport for you.

# viewport

The viewport is an `SVG` tag and is managed by `react-svg-pan-zoom`, it is autoscaled to fit its parent's size using `react-virtualized-auto-sizer` - simply place it inside any HTML element you would like in it'll fit right in.

[![NPM](https://img.shields.io/npm/v/react-hierarchy.svg)](https://www.npmjs.com/package/react-hierarchy) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# passing ref

`Hierarchy` accepts a ref object (see example[#usage]), using this ref you can manipulate the canvas, or the graph itself.
the ref contains 2 methods:

- collapseAll
- zoomExtends

# card props

- `id`, set by your custom id (defaults to `id`)
- `data` - an object which includes all the properties of that data row
- `onClick` - can be used to pass events back to the root
- `onCollapse` - collapse/expand a node
- `showExpand` - a boolean expressing if the node has children
- `isExpanded` - a boolean expressing if the node is expanded

# using typescript

Use the `ComponentProps` generic to construct your `Card` component
Use the `RefProps` object to describe your ref

## usage

```jsx
import React, {useState, useCallback} from "react";
import Hierarchy, {RefProps, ComponentProps} from "react-hierarchy";

type Data = {
  rank: number
  customId: string
  parentId: string | undefined
  name: string
}

const rawData: Data[] = [
  { rank: 1, customId: "1", parentId: "", name: "Eve" },
  { rank: 2, customId: "2", parentId: "1", name: "Cain" },
  { rank: 3, customId: "3", parentId: "2", name: "po" },
  { rank: 4, customId: "4", parentId: "2", name: "jim" },
  { rank: 1, customId: "5", parentId: "2", name: "kelly" },
  { rank: 0, customId: "6", parentId: "1", name: "Seth" },
  { rank: 1, customId: "7", parentId: "6", name: "Enos" },
  { rank: 5, customId: "8", parentId: "6", name: "Noam" },
  { rank: 2, customId: "9", parentId: "6", name: "joe" },
  { rank: 1, customId: "10", parentId: "6", name: "peggy" },
  { rank: 3, customId: "11", parentId: "1", name: "Abel" },
  { rank: 4, customId: "12", parentId: "1", name: "Awan" },
  { rank: 2, customId: "13", parentId: "12", name: "Enoch" },
  { rank: 1, customId: "14", parentId: "1", name: "Azura" },
];


const Card = ({ id, isExpanded, showExpand, data }: ComponentProps<Data>) => {
  const handleCollapse = useCallback(() => {
    onCollapse(id);
  }, [onCollapse, id]);

  return (
    <div data-id={id}>
      <h1>{data.name}</h1>
      {showExpand && (
        <button onCollapse>{isExpanded ? "collapse" : "expand"}</button>
      )}
    </div>
  );
};

const App = () => {
  const hierarchyRef = useRef<RefProps>();
  return (
    <div className="App">
      <Hierarchy
        data={data} // a collection of objects
        Component={Card} // you can find an example card in the example directory
        nodeIdField="customId" // defaults to "id"
        parentIdField="parentId" // defaults to "parentId"
        ref={hierarchyRef as React.Ref<RefProps>}
      />
      <button onClick={hierarchyRef?.current?.collapseAll?.())}>collapse all</button>
    </div>
  );
};
```

## License

MIT © [reggev](https://github.com/reggev)
