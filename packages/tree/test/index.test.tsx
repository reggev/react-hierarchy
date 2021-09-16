import React from 'react'
import { render as RTLRender } from '@testing-library/react'
import Hierarchy, { HierarchyProps } from '../src/index'
import Card from './fixtures/Card'
import defaultData from './fixtures/data'
import '@testing-library/jest-dom'

async function render({
  overrides = {},
  data = defaultData
}: { overrides?: Partial<HierarchyProps<any>>; data?: Array<any> } = {}) {
  const queries = RTLRender(
    <Hierarchy
      data={data}
      Component={Card}
      nodeIdField='id'
      parentIdField='parentId'
      height={1000}
      width={1000}
      maxInitialDepth={Infinity}
      {...overrides}
    />
  )
  const nodes = queries.getAllByTestId(/card-\d+$/)
  return {
    queries,
    nodes
  }
}
describe('hierarchy', () => {
  test('render all the elements', async () => {
    const { nodes } = await render()
    expect(nodes.length).toEqual(defaultData.length)
  })
})
