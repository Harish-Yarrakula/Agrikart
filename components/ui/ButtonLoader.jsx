import React from 'react';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const ButtonLoaderContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: inherit;
  z-index: 10;
`;

const ButtonLoader = ({
  children,
  loading = false,
  spinnerSize = '16px',
  spinnerColor = '#666',
  spinnerActiveColor = '#3498db',
  disabled = false,
  className,
  ...props
}) => {
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <ButtonLoaderContainer className={className}>
      <button
        {...props}
        onClick={handleClick}
        disabled={loading || disabled}
        style={{
          position: 'relative',
          pointerEvents: loading || disabled ? 'none' : 'auto',
          opacity: loading || disabled ? 0.6 : 1,
          ...props.style
        }}
      >
        {children}
      </button>
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner
            size={spinnerSize}
            color={spinnerColor}
            activeColor={spinnerActiveColor}
          />
        </LoadingOverlay>
      )}
    </ButtonLoaderContainer>
  );
};

export default ButtonLoader;
