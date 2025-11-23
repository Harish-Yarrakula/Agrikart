import React from 'react';
import styled, { keyframes } from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: ${props => props.minHeight || '200px'};
  padding: ${props => props.padding || '2rem'};
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const Message = styled.p`
  margin-top: 1rem;
  color: ${props => props.color || '#666'};
  font-size: ${props => props.fontSize || '1rem'};
  text-align: center;
`;

const PageLoader = ({
  loading = true,
  message = 'Loading...',
  spinnerSize = '32px',
  minHeight = '200px',
  padding = '2rem',
  messageColor = '#666',
  messageFontSize = '1rem',
  children
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <Container minHeight={minHeight} padding={padding}>
      <LoadingSpinner
        size={spinnerSize}
        color="#666"
        activeColor="#3498db"
      />
      <Message
        color={messageColor}
        fontSize={messageFontSize}
      >
        {message}
      </Message>
    </Container>
  );
};

export default PageLoader;
