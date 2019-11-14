import React, { useState, useEffect, useCallback, memo } from 'react';

import { useDispatch } from '../context/DispatchContext';
import { TOGGLE_REAL_IMAGINARY_VISIBILITY } from '../reducer/Actions';
import { useChartData } from '../context/ChartContext';
import ToolTip from '../elements/ToolTip/ToolTip';

const styles = {
  button: {
    backgroundColor: 'transparent',
    border: 'none',
    width: '35px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const ViewButton = ({ defaultValue = true }) => {
  const [option, setOption] = useState();
  const [isDisabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const { data, activeSpectrum } = useChartData();

  const handleShowSpectrumTypeChang = useCallback(
    () =>
      dispatch({
        type: TOGGLE_REAL_IMAGINARY_VISIBILITY,
        isRealSpectrumVisible: !option,
      }),
    [dispatch, option],
  );

  const handleChange = useCallback(() => {
    setOption(!option);
    handleShowSpectrumTypeChang();
  }, [option, handleShowSpectrumTypeChang]);

  useEffect(() => {
    setOption(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const sData =
      data && activeSpectrum && data.find((d) => d.id === activeSpectrum.id);

    if (sData) {
      if (activeSpectrum == null || sData === -1) {
        setDisabled(true);
        setOption(defaultValue);
      } else {
        setOption(sData.isRealSpectrumVisible);
        setDisabled(!sData.info.isComplex);
      }
    }
  }, [activeSpectrum, data, defaultValue]);

  return activeSpectrum ? (
    <button
      style={styles.button}
      type="button"
      disabled={isDisabled}
      onClick={handleChange}
    >
      <ToolTip
        title={option ? 'Real Spectrum' : 'Imaginary Spectrum'}
        popupPlacement="right"
      >
        {option ? 'Re' : 'Im'}
      </ToolTip>
    </button>
  ) : null;
};

export default memo(ViewButton);

ViewButton.defaultProps = {
  defaultValue: true,
};
