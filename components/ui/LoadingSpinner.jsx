import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: ${props => props.size || '20px'};
  height: ${props => props.size || '20px'};
`;

const Spinner = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid ${props => props.color || '#f3f3f3'};
  border-top: 2px solid ${props => props.activeColor || '#3498db'};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner = ({ size, color, activeColor, className }) => {
  return (
    <SpinnerContainer size={size} className={className}>
      <Spinner color={color} activeColor={activeColor} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
