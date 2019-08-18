import React, { Component, Fragment } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import CrossLinePointer from './CrossLinePointer';
import {dispatchContext } from '../context/DispatchContext';

import { SET_X_DOMAIN,SET_Y_DOMAIN } from '../reducer/Actions';

class BrushTool extends Component {

  
  constructor(props) {
    super(props);
    const { width, height, margin } = this.props;
    // this.width = width;
    // this.height = height;
    // this.margin = margin;
    // this.data = data;
    // this.domain = domain;
    // this.originDomain = originDomain;

    this.brush = d3
      .brushX()
      .extent([[0, 0], [width - margin.right, height - margin.bottom]]);

    this.zoom = d3
      .zoom()
      .scaleExtent([-Infinity, Infinity])
      .translateExtent([[0, 0], [width - margin.right, height - margin.bottom]])
      .extent([[0, 0], [width - margin.right, height - margin.bottom]]);
  }

 

  brushEnd = () => {
    // if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

    if (!d3.event.selection) {
      return;
    }

    const [x1, x2] = d3.event.selection;
    // const scale = d3.scaleLinear(this.domain.x, [
    //   this.width - this.margin.right,
    //   this.margin.left
    // ]);
    const { getScale,mode } = this.props;
    const scale = getScale().x;

    const range = (mode ==="RTL")?[scale.invert(x2), scale.invert(x1)]: [scale.invert(x1), scale.invert(x2)];
    d3.select(this.refs.brush).call(this.brush.move, null); // This remove the grey brush area as soon as the selection has been done
    
     const dispatch = this.context;
    //  console.log(useContext(dispatchContext))
    dispatch({ type: SET_X_DOMAIN, xDomain:range });
    // dispatchContext({ type: SET_X_DOMAIN, xDomain:range });
    // this.props.onXAxisDomainUpdate(range);
  };

  zoomed = () => {
    // if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    let t = d3.event.transform;
    const { height, margin, originDomain, domain } = this.props;

    // const { getScale } = this.props;
    // const scale = getScale().y;
    const scale = d3.scaleLinear(originDomain.y, [
      height - margin.bottom,
      margin.top,
    ]);

    const v_domain = t.rescaleY(scale).domain();
    
    const dispatch = this.context;
    dispatch({ type: SET_Y_DOMAIN, yDomain:[domain.y[0], v_domain[1]] });

    // this.props.onYAxisDomainUpdate([domain.y[0], v_domain[1]]);
  };

  reset = (e) => {
    const { originDomain } = this.props;
    const dispatch = this.context;
    dispatch({ type: SET_X_DOMAIN, xDomain: originDomain.x });
    dispatch({ type: SET_Y_DOMAIN, yDomain: originDomain.y });
// this.props.onDomainReset(originDomain);
    
  };

  componentDidMount() {
    const { isActive,width, height, margin } = this.props;
    this.brush.extent([
      [margin.left, margin.top],
      [width - margin.right, height - margin.bottom],
    ]);

    this.zoom
      .translateExtent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    d3.select(this.refs.brush)
      .selectAll('*')
      .remove();

    if (isActive) {
      d3.select(this.refs.brush)
        .call(this.brush)
        .call(this.zoom)
        .on('dblclick.zoom', null);
      this.brush.on('end', this.brushEnd);
      this.zoom.on('zoom', this.zoomed);

    } else {
      this.brush.on('end', null);
      this.zoom.on('zoom', null);

    }
  }

  componentDidUpdate(prevProps, prevState) {}

  render() {
    const { isActive, width, height, margin, position } = this.props;

    return (
      <Fragment>
        <CrossLinePointer
          position={position}
          margin={margin}
          width={width}
          height={height}
        />
        <g
          className={isActive ? 'brush-container brush ' : 'brush-container'}
          onDoubleClick={this.reset}
          ref="brush"
        />
      </Fragment>
    );
  }
}
BrushTool.contextType = dispatchContext;
export default BrushTool;

BrushTool.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  margin: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  domain: PropTypes.object.isRequired,
  originDomain: PropTypes.object.isRequired,
  onXAxisDomainUpdate: PropTypes.func,
  onYAxisDomainUpdate: PropTypes.func,
  onDomainReset: PropTypes.func,
  getScale: PropTypes.func.isRequired,
};

// BrushTool.defaultProps = {
//   onXAxisDomainUpdate: () => {
//     return [];
//   },
//   onYAxisDomainUpdate: () => {
//     return [];
//   },
//   onDomainReset: () => {
//     return [];
//   },
// };
