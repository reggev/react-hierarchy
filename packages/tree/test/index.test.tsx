import React, { useRef, useCallback, Ref } from 'react'
import {
  render as RTLRender,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  getByTestId,
  queryByTestId
} from '@testing-library/react'
import Hierarchy, { HierarchyProps } from '../src/index'
import Card from './fixtures/Card'
import defaultData from './fixtures/data'
import '@testing-library/jest-dom'
import { RefProps } from '../src/View'

const TestApp = ({
  data,
  overrides
}: {
  overrides?: Partial<HierarchyProps<any>>
  data: Array<any>
}) => {
  const hierarchyRef = useRef<RefProps>()
  const onCollapse = useCallback(() => {
    if (hierarchyRef.current) {
      // @ts-ignore
      hierarchyRef.current.collapseAll()
    }
  }, [hierarchyRef])

  const zoomExtends = useCallback(() => {
    // @ts-ignore
    if (hierarchyRef.current) hierarchyRef.current.zoomExtends()
  }, [hierarchyRef])
  return (
    <>
      <button data-testid='collapse-all-button' onClick={onCollapse}>
        collapse all
      </button>
      <button data-testid='zoom-extends-button' onClick={zoomExtends}>
        zoom extends
      </button>
      <Hierarchy
        data={data}
        Component={Card}
        nodeIdField='id'
        parentIdField='parentId'
        height={1000}
        width={1000}
        maxInitialDepth={Infinity}
        ref={hierarchyRef as Ref<any>}
        {...overrides}
      />
    </>
  )
}

function render({
  overrides = {},
  data = defaultData
}: { overrides?: Partial<HierarchyProps<any>>; data?: Array<any> } = {}) {
  const queries = RTLRender(<TestApp data={data} overrides={overrides} />)
  function selectAllNodes() {
    return queries.getAllByTestId(/card-\d+$/)
  }

  function getNode(id: string) {
    const root = queries.getByTestId(`card-${id}`)
    const expandButton = queryByTestId(root, `card-${id}-collapse-button`)
    const payload = getByTestId(root, `card-${id}-payload`)
    const header = getByTestId(root, `card-${id}-header`)
    return { root, expandButton, payload, header }
  }

  function getNodeParentGroup(id: string) {
    return queries.getByTestId(`group-${id}`)
  }

  const nodes = selectAllNodes()
  const collapseAllButton = queries.getByTestId('collapse-all-button')
  const zoomExtendsButton = queries.getByTestId('zoom-extends-button')
  return {
    queries,
    nodes,
    selectAllNodes,
    collapseAllButton,
    zoomExtendsButton,
    getNode,
    getNodeParentGroup
  }
}

describe('hierarchy', () => {
  const rootId = '1'
  test('render all the elements', () => {
    const { nodes } = render()
    expect(nodes.length).toEqual(defaultData.length)
  })

  test('render the root element at the center of the canvas', () => {
    const { getNodeParentGroup, getNode } = render({
      overrides: { maxInitialDepth: 0 }
    })

    const { root: rootNode } = getNode(rootId)
    expect(rootNode.getAttribute('data-testid')).toEqual('card-1')

    const parentGroup = getNodeParentGroup(rootId)
    expect(parentGroup.getAttribute('transform')).toEqual('translate(0,0)')
  })

  test('ensure a node has a payload and shows an expand button', () => {
    const { getNode } = render({ overrides: { maxInitialDepth: 0 } })
    const { expandButton, payload, header } = getNode(rootId)
    const node = defaultData.find((item) => item.id === rootId)
    expect(payload).toHaveTextContent(node?.rank.toString() ?? 'no-content')
    expect(expandButton).toBeInTheDocument()
    expect(header).toHaveTextContent(node?.name ?? 'no-header')
  })

  test('should not show expand button', () => {
    const leafNodeId = '14'
    const { getNode } = render()
    const { expandButton, payload, header } = getNode(leafNodeId)
    const node = defaultData.find((item) => item.id === leafNodeId)
    expect(payload).toHaveTextContent(node?.rank.toString() ?? 'no-content')
    expect(header).toHaveTextContent(node?.name ?? 'no-header')
    expect(expandButton).toBeNull()
  })

  test('render only the first layer of child nodes', () => {
    const relevantNodes = defaultData.filter(
      (item) => item.parentId === rootId || item.id === rootId
    )

    const relevantNodesExpectedTestIds = relevantNodes.map(
      ({ id }) => `card-${id}`
    )

    const { nodes } = render({ overrides: { maxInitialDepth: 1 } })

    const testIdsSet = new Set(
      nodes.map((node) => node.getAttribute('data-testid'))
    )

    expect(testIdsSet.size).toEqual(relevantNodes.length)

    relevantNodesExpectedTestIds.forEach((expectedTestId) => {
      expect(testIdsSet.has(expectedTestId)).toBeTruthy()
    })
  })

  test('collapse all nodes', async () => {
    const { nodes, collapseAllButton, selectAllNodes, queries } = render()
    expect(nodes).toHaveLength(14)

    fireEvent.click(collapseAllButton)

    await waitForElementToBeRemoved(queries.getByTestId(`card-2`))

    const updatedNodes = selectAllNodes()
    expect(updatedNodes).toHaveLength(1)
  })

  test('expand and collapse a card', async () => {
    const { getNode, queries } = render({
      overrides: { maxInitialDepth: 0 }
    })

    const { expandButton } = getNode(rootId)
    expect(expandButton).toBeInTheDocument()
    if (!expandButton) return

    fireEvent.click(expandButton)

    const expectedNodes = defaultData.filter(
      (item) => item.parentId === rootId || item.id === rootId
    )

    const sampleNode = expectedNodes.find((node) => node.id !== rootId)
    if (!sampleNode) {
      throw new Error('could not find a sample node')
    }

    await waitFor(() =>
      expect(queries.getByTestId(`card-${sampleNode.id}`)).toBeInTheDocument()
    )
  })
  test('collapse a card and all its descendants', async () => {
    const { getNode, selectAllNodes, queries } = render({
      overrides: { maxInitialDepth: Infinity }
    })

    const leafId = '14'

    const { root: leafNode } = getNode(leafId)
    expect(leafNode).toBeInTheDocument()

    const sampleNode = defaultData.find((node) => node.id !== rootId)
    if (!sampleNode) {
      throw new Error('could not find a sample node')
    }
    const sampleNodeTestId = `card-${sampleNode.id}`
    expect(queries.getByTestId(sampleNodeTestId)).toBeInTheDocument()

    const { expandButton } = getNode(rootId)

    if (!expandButton) {
      throw new Error('no expand button found')
    }

    fireEvent.click(expandButton)

    await waitForElementToBeRemoved(() =>
      queries.queryByTestId(sampleNodeTestId)
    )

    expect(leafNode).not.toBeInTheDocument()
    expect(selectAllNodes()).toHaveLength(1)
  })
})
