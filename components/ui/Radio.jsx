import React from 'react';
import styled from 'styled-components';

const Radio = ({Name}) => {
  return (
    <StyledWrapper>
      <div className="radio-inputs">
        <label>
          <input defaultChecked className="radio-input" type="radio" name="engine" />
          <span className="radio-tile">
            <span className="radio-icon">
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="7" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="4" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.15"/>
                <rect x="14" y="11" width="6" height="2" rx="1" fill="currentColor" opacity="0.15"/>
                <path d="M6 17v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 13h2M8 11h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            </span>
            <span className="radio-label">{Name}</span>
          </span>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .radio-inputs {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 350px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .radio-inputs > * {
    margin: 6px;
  }

  .radio-input:checked + .radio-tile {
    border-color: #2260ff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    color: #2260ff;
  }

  .radio-input:checked + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
    background-color: #2260ff;
    border-color: #2260ff;
  }

  .radio-input:checked + .radio-tile .radio-icon svg {
    fill: #2260ff;
  }

  .radio-input:checked + .radio-tile .radio-label {
    color: #2260ff;
  }

  .radio-input:focus + .radio-tile {
    border-color: #2260ff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1), 0 0 0 4px #b5c9fc;
  }

  .radio-input:focus + .radio-tile:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    min-height: 80px;
    border-radius: 0.5rem;
    border: 2px solid #b5bfd9;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    transition: 0.15s ease;
    cursor: pointer;
    position: relative;
  }

  .radio-tile:before {
    content: "";
    position: absolute;
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    border: 2px solid #b5bfd9;
    background-color: #fff;
    border-radius: 50%;
    top: 0.25rem;
    left: 0.25rem;
    opacity: 0;
    transform: scale(0);
    transition: 0.25s ease;
  }

  .radio-tile:hover {
    border-color: #2260ff;
  }

  .radio-tile:hover:before {
    transform: scale(1);
    opacity: 1;
  }

  .radio-icon svg {
    margin: 8px 0 0 20px;
    width: 1.5rem;
    height: 1.5rem;
    fill: #494949;
  }

  .radio-label {
    color: #707070;
    transition: 0.375s ease;
    text-align: center;
    font-size: 13px;
  }

  .radio-input {
    clip: rect(0 0 0 0);
    -webkit-clip-path: inset(100%);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }`;

export default Radio;
