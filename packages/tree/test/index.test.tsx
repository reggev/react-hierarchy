import React from 'react'
import { render as RTLRender } from '@testing-library/react'
import Hierarchy from '../src/index'
import Card from './fixtures/Card'
import defaultData from './fixtures/data'
import '@testing-library/jest-dom'

function render(data = defaultData, rootId = '1') {
  const queries = RTLRender(
    <div
      data-testId='hierarchy-container'
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <Hierarchy
        data={data}
        Component={Card}
        nodeIdField='id'
        parentIdField='parentId'
      />
    </div>
  )

  return {
    queries
  }
}
describe('hierarchy', () => {
  test('render all the elements', async () => {
    const { queries } = render()
    queries.debug()
    const rootContainer = queries.getByTestId('hierarchy-container')
    expect(rootContainer).toBeInTheDocument()
  })
})
