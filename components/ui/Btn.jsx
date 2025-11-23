"use client"
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import LoadingSpinner from './LoadingSpinner';
import { Button as BaseButton } from './ButtonWithLoading';

const Button = (props) => {
  const [loading, setLoading] = useState(false);
  const {user}=useAuth();
  const { addToast } = useNotification();

    const handleAdd=async (producte)=>{
      if (!producte || loading) return;

      setLoading(true);
      try {
        console.log(producte);
        console.log(user);
        const cartItem={
            productId: producte._id,
            userId:user.id,
            name:producte.name,
            image:producte.Image,
            price:props.price,
            size:props.size,
            quantity:1,
        }
        const response = await fetch("http://localhost:5000/cartProducts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cartItem)
        });

        const data = await response.json();

    if (response.ok) {
      addToast({ title: `${producte.name} is Added`, type: 'success' });
      window.location.href='/Cart';
    } else {
      throw new Error(data.message || 'Failed to add to cart');
    }
      } catch(err) {
        console.log("Error adding to cart:", err);
        addToast({ title: "Failed to add item to cart. Please try again.", type: 'error' });
      } finally {
        setLoading(false);
      }
    }

  return (
    <StyledWrapper>
      <BaseButton
        className="button"
        onClick={() => handleAdd(props.product)}
        loading={loading}
        disabled={loading}
      >
        <div className="bgContainer">
          <span>{props.name}</span>
          <span>{props.name}</span>
        </div>
        <div className="arrowContainer">
          {loading ? (
            <LoadingSpinner size="20px" color="black" activeColor="white" />
          ) : (
            <svg width={25} height={25} viewBox="0 0 45 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.7678 20.7678C44.7441 19.7915 44.7441 18.2085 43.7678 17.2322L27.8579 1.32233C26.8816 0.34602 25.2986 0.34602 24.3223 1.32233C23.346 2.29864 23.346 3.88155 24.3223 4.85786L38.4645 19L24.3223 33.1421C23.346 34.1184 23.346 35.7014 24.3223 36.6777C25.2986 37.654 26.8816 37.654 27.8579 36.6777L43.7678 20.7678ZM0 21.5L42 21.5V16.5L0 16.5L0 21.5Z" fill="black" />
            </svg>
          )}
        </div>
      </BaseButton>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.5em ;
    background-color: yellow;
    cursor: pointer;
    box-shadow: 4px 6px 0px black;
    border: 4px solid;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
    z-index: 100;
    transition: box-shadow 250ms, transform 250ms, filter 50ms;
  }
  button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 3px 0px black;
  }
  button:active {
    filter: saturate(0.75);
  }
  button::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: pink;
    z-index: -1;
    transform: translateX(-100%);
    transition: transform 250ms;
  }
  button:hover::after {
    transform: translateX(0);
  }
  .bgContainer {
    position: relative;
    display: flex;
    justify-content: start;
    align-items: center;
    overflow: hidden;
    max-width: 50%; /* adjust this if the button text is not proper */
    font-size: 1em;
    font-weight: 800;
    gap:0.5rem
  }
  .bgContainer span {
    position: relative;
    transform: translateX(-100%);
    transition: all 250ms;
  }
  .button:hover .bgContainer > span {
    transform: translateX(90%);
  }
  .arrowContainer {
    padding: 0.5em;
    margin-inline-end: 0.5em;
    border: 4px solid;
    border-radius: 50%;
    background-color: pink;
    position: relative;
    overflow: hidden;
    transition: transform 250ms, background-color 250ms;
    z-index: 100;
  }
  .arrowContainer::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: yellow;
    transform: translateX(-100%);
    z-index: -1;
    transition: transform 250ms ease-in-out;
  }
  button:hover .arrowContainer::after {
    transform: translateX(0);
  }
  button:hover .arrowContainer {
    transform: translateX(5px);
  }
  button:active .arrowContainer {
    transform: translateX(8px);
  }
  .arrowContainer svg {
    vertical-align: middle;
  }`;

export default Button;
