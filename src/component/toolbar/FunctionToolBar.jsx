import React, { useState, useEffect, useCallback, memo } from 'react';
import { FaSearchPlus } from 'react-icons/fa';

import { useDispatch } from '../context/DispatchContext';
import { SET_SELECTED_TOOL } from '../reducer/Actions';
import { useChartData } from '../context/ChartContext';
import ToolTip from '../elements/ToolTip/ToolTip';
import { ToggleButton, ToggleButtonGroup } from '../elements/toggle';

import { options } from './ToolTypes';

const styles = {
  icon: {
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '18px 18px',
  },
};

const FunctionToolBar = ({ defaultValue }) => {
  const [option, setOption] = useState();
  const [selectedSpectrumInfo, setSelectedSpectrumInfo] = useState();

  const dispatch = useDispatch();
  const handleChangeOption = useCallback(
    (selectedTool) => dispatch({ type: SET_SELECTED_TOOL, selectedTool }),
    [dispatch],
  );

  const { activeSpectrum, data } = useChartData();

  const handleChange = useCallback(
    (selectedOption) => {
      // if (selectedOption != null) {
      setOption(selectedOption);
      handleChangeOption(selectedOption);
      // }
    },
    [handleChangeOption],
  );

  // const handleAutoPeakPicking = useCallback(() => {
  //   dispatch({ type: AUTO_PEAK_PICKING });
  // }, [dispatch]);

  const handleOnKeyPressed = useCallback(
    (e) => {
      if (e.key === 'z') {
        setOption(options.zoom.id);
        handleChangeOption(options.zoom.id);
      } else if (e.key === 'p') {
        setOption(options.peakPicking.id);
        handleChangeOption(options.peakPicking.id);
      } else if (e.key === 'i') {
        setOption(options.integral.id);
        handleChangeOption(options.integral.id);
      }
    },
    [handleChangeOption],
  );

  useEffect(() => {
    setOption(defaultValue);
    document.addEventListener('keydown', handleOnKeyPressed, false);
    return () => {
      document.removeEventListener('keydown', handleOnKeyPressed, false);
    };
  }, [defaultValue, handleOnKeyPressed]);

  useEffect(() => {
    if (data && activeSpectrum) {
      const { info } = data.find((d) => d.id === activeSpectrum.id);
      setSelectedSpectrumInfo(info);
    } else {
      setSelectedSpectrumInfo({ isComplex: false, isFid: false });
    }
  }, [activeSpectrum, data]);

  return (
    <>
      <ToggleButtonGroup value={option} onChange={handleChange}>
        <ToggleButton key={options.zoom.id} value={options.zoom.id}>
          <ToolTip
            title={`${options.zoom.label} ( Press z )`}
            popupPlacement="right"
            offset={{ x: 10, y: 0 }}
          >
            <FaSearchPlus />
          </ToolTip>
        </ToggleButton>

        {selectedSpectrumInfo && !selectedSpectrumInfo.isFid && (
          <ToggleButton
            key={options.peakPicking.id}
            value={options.peakPicking.id}
            disabled={!activeSpectrum}
            className="ci-icon-nmr-peak-picking"
            style={styles.icon}
          >
            <ToolTip
              title={`${options.peakPicking.label} ( Press p )`}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
            />
          </ToggleButton>
        )}

        {selectedSpectrumInfo && !selectedSpectrumInfo.isFid && (
          <ToggleButton
            key={options.integral.id}
            value={options.integral.id}
            disabled={!activeSpectrum}
            className="ci-icon-nmr-integrate"
            style={styles.icon}
          >
            <ToolTip
              title={`${options.integral.label} ( Press i )`}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
            />
          </ToggleButton>
        )}
        {selectedSpectrumInfo && !selectedSpectrumInfo.isFid && (
          <ToggleButton
            key={options.autoPeaksPicking.id}
            value={options.autoPeaksPicking.id}
            className="ci-icon-nmr-range-picking"
            style={styles.icon}
          >
            <ToolTip
              title={options.autoPeaksPicking.label}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
            />
          </ToggleButton>
        )}

        {selectedSpectrumInfo && !selectedSpectrumInfo.isFid && (
          <ToggleButton
            key={options.autoRangesPicking.id}
            value={options.autoRangesPicking.id}
            className="ci-icon-nmr-range-picking"
            style={styles.icon}
          >
            <ToolTip
              title={options.autoRangesPicking.label}
              popupPlacement="right"
              offset={{ x: 10, y: 0 }}
            />
          </ToggleButton>
        )}
      </ToggleButtonGroup>
    </>
  );
};

export default memo(FunctionToolBar);

FunctionToolBar.defaultProps = {
  defaultValue: options.zoom.id,
};
