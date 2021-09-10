import React, {
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
// @ts-ignore
import { ReactSVGPanZoom, TOOL_AUTO, INITIAL_VALUE } from 'react-svg-pan-zoom'

const Viewer = React.forwardRef(
  /** @param {{
   *  onMount?: ()=>void,
   *  dx: number,
   *  dy: number,
   *  height: number,
   *  width: number,
   *  children: any,
   * }} props */
  (props, ref) => {
    const [state, setState] = useState({
      tool: TOOL_AUTO,
      value: INITIAL_VALUE,
      didFirstRender: false
    })
    const svgRef = useRef()

    useEffect(() => {
      if (!state.didFirstRender && svgRef.current && props.onMount) {
        props.onMount()
        setState((s) => ({ ...s, didFirstRender: true }))
      }
    }, [svgRef, props, state])

    const changeTool = useCallback(
      (nextTool) => {
        setState((state) => ({ ...state, tool: nextTool }))
      },
      [setState]
    )

    const changeValue = useCallback(
      (nextValue) => {
        setState((state) => ({ ...state, value: nextValue }))
      },
      [setState]
    )

    const fitSelection = useCallback(
      (x, y, width, height) => {
        if (!svgRef.current) return
        // @ts-ignore
        svgRef.current.fitSelection(x, y, width, height)
      },
      [svgRef]
    )

    useImperativeHandle(ref, () => ({
      fitSelection
    }))

    return (
      <ReactSVGPanZoom
        width={props.width}
        height={props.height}
        detectAutoPan={false}
        customToolbar={() => null}
        background='white'
        preventPanOutside={false}
        ref={svgRef}
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
)

Viewer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  dx: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  onMount: PropTypes.func
}

Viewer.defaultProps = {
  onMount: undefined
}

export default Viewer
