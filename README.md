# react-hierarchy

> A native React hierarchy chart

[![NPM](https://img.shields.io/npm/v/react-hierarchy.svg)](https://www.npmjs.com/package/react-hierarchy) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-hierarchy
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'react-hierarchy'
import 'react-hierarchy/dist/index.css'

const rawData = [
  { rank: 1, customId: '1', parentId: '', name: 'Eve' },
  { rank: 2, customId: '2', parentId: '1', name: 'Cain' },
  { rank: 3, customId: '3', parentId: '2', name: 'po' },
  { rank: 4, customId: '4', parentId: '2', name: 'jim' },
  { rank: 1, customId: '5', parentId: '2', name: 'kelly' },
  { rank: 0, customId: '6', parentId: '1', name: 'Seth' },
  { rank: 1, customId: '7', parentId: '6', name: 'Enos' },
  { rank: 5, customId: '8', parentId: '6', name: 'Noam' },
  { rank: 2, customId: '9', parentId: '6', name: 'joe' },
  { rank: 1, customId: '10', parentId: '6', name: 'peggy' },
  { rank: 3, customId: '11', parentId: '1', name: 'Abel' },
  { rank: 4, customId: '12', parentId: '1', name: 'Awan' },
  { rank: 2, customId: '13', parentId: '12', name: 'Enoch' },
  { rank: 1, customId: '14', parentId: '1', name: 'Azura' }
]

const App = () => {
  const [data, setData] = useState(rawData)
  const handleClick = useCallback(
    (id) => {
      setData((state) => {
        const tmp = state
          .map((item) =>
            item.name === id ? { ...item, rank: item.rank + 1 } : item
          )
          .filter((item) => item.rank <= 5)
        const parents = new Set(tmp.map((item) => item.name))
        return tmp.filter((item) => parents.has(item.parent) || !item.parent)
      })
    },
    [setData]
  )

  return (
    <div className='App'>
      <Hierarchy
        data={data} // a collection of objects
        onClick={handleClick}
        Component={Card} // you can find an example card in the example directory
        nodeIdField='customId' // defaults to "id"
        parentIdField='parentId' // defaults to "parentId"
      />
    </div>
  )
}
```

## License

MIT © [reggev](https://github.com/reggev)
