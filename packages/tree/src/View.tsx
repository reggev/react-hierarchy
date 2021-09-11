import React, {
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  useEffect,
  LegacyRef
} from 'react'
import { ReactSVGPanZoom, TOOL_AUTO, Value } from 'react-svg-pan-zoom'

type Props = {
  onMount?: () => void
  dx: number
  dy: number
  height: number
  width: number
  children: JSX.Element | JSX.Element[]
}

export type RefProps = {
  fitSelection: (x: number, y: number, width: number, height: number) => void
}

function Viewer(props: Props, ref: React.Ref<RefProps>) {
  const [state, setState] = useState({
    tool: TOOL_AUTO,
    value: {} as Value,
    didFirstRender: false
  })

  const svgRef = useRef<ReactSVGPanZoom>()

  useEffect(() => {
    if (!state.didFirstRender && svgRef.current && props.onMount) {
      props.onMount()
      setState((s) => ({ ...s, didFirstRender: true }))
    }
  }, [svgRef, props, state])

  const changeTool = useCallback(
    (nextTool) => setState((state) => ({ ...state, tool: nextTool })),
    [setState]
  )

  const changeValue = useCallback(
    (nextValue) => setState((state) => ({ ...state, value: nextValue })),
    [setState]
  )

  const fitSelection = useCallback(
    (x: number, y: number, width: number, height: number) => {
      if (!svgRef.current) return
      svgRef.current.fitSelection(x, y, width, height)
    },
    [svgRef]
  )

  useImperativeHandle(
    ref,
    (): RefProps => ({
      fitSelection
    })
  )

  return (
    <ReactSVGPanZoom
      width={props.width}
      height={props.height}
      detectAutoPan={false}
      customToolbar={() => null}
      background='white'
      preventPanOutside={false}
      ref={svgRef as LegacyRef<ReactSVGPanZoom>}
      tool='auto'
      customMiniature={() => null}
      onChangeTool={(tool) => changeTool(tool)}
      value={state.value}
      onChangeValue={(value) => changeValue(value)}
      disableDoubleClickZoomWithToolAuto
    >
      <svg width={props.width} height={props.height}>
        {props.children}
      </svg>
    </ReactSVGPanZoom>
  )
}

export default React.forwardRef<any, Props>(Viewer)
