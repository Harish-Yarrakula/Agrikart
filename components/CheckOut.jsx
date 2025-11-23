"use client"
import React, { useState } from 'react';
import styled from 'styled-components';
import Radio from './ui/Radio';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { Button as LoadingButton } from './ui/ButtonWithLoading';

const CheckOutWithLoading = (props) => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = React.useState([])
  const TotalPrice = (parseInt(props.price) + parseInt(props.shipping) + (props.price * 0.24) - parseInt(props.discount)).toFixed(0);

  const Order = {
    user: user.id,
    items: products.map(product => ({
      product: product.productId,
      image: product.image,
      name: product.name,
      quantity: product.quantity,
      size: product.size,
      price: product.price
    })),
    totalAmount: TotalPrice.toString(),
    shippingAddress: "221B Baker Street, W1U 8ED London, United Kingdom",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  }

  React.useEffect(() => {
    handleFetchProducts()
  }, [products.length]);

  const handleFetchProducts = () => {
    fetch("https://agrikart.onrender.com/cartProducts", { method: "GET" })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err))
  }

  const handleCheckout = async () => {
    if (products.length === 0) {
      addToast({ title: 'Your cart is empty. Please add items to your cart before checking out.', type: 'error' });
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      console.log(Order)
      const response = await fetch("https://agrikart.onrender.com/CheckOut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Order)
      });

      const data = await response.json();

      if (response.ok) {
        addToast({ title: data.message, type: 'success' });
        window.location.href = `/OrderConfirmation/${data.orderId}`;
      } else {
        throw new Error(data.message || 'Checkout failed');
      }
    } catch (err) {
      console.log(err);
      addToast({ title: "Order checkout unsuccessful. " + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <StyledWrapper>
      <div className="w-full">
        <div className="card cart">
          <label className="title">CHECKOUT</label>
          <div className="steps">
            <div className="step">
              <div>
                <span>SHIPPING</span>
                <p>221B Baker Street, W1U 8ED</p>
                <p>London, United Kingdom,</p>
              </div>
              <hr />
              <div>
                <span>PAYMENT METHOD</span>
                <Radio Name={"Cash On Delivery"} />
                <p>Cash On Delivery</p>
              </div>
              <hr />
              <div className="payments">
                <span>PAYMENT</span>
                <div className="details">
                  <span>Subtotal:</span>
                  <span>₹{props.price}</span>
                  <span>Shipping:</span>
                  <span>₹{props.shipping}</span>
                  <span>Tax:</span>
                  <span>₹{props.price * 0.24}</span>
                  <span>Discount:</span>
                  <span>₹{-props.discount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card checkout">
          <div className="footer">
            <label className="price">₹{TotalPrice}</label>
            <LoadingButton
              className="checkout-btn"
              onClick={handleCheckout}
              loading={loading}
            >
              {loading ? 'Processing...' : 'Checkout'}
            </LoadingButton>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Body */
  .container {
    display: grid;
    grid-template-columns: auto;
    gap: 0px;
  }

  hr {
    height: 1px;
    background-color: #E5C7C5;
    border: none;
  }

  .card {
    width: 600px;
    background: #F4E2DE;
    box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  }

  .title {
    width: 100%;
    height: 40px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #E5C7C5;
    font-weight: 700;
    font-size: 11px;
    color: #000000;
  }

  /* Cart */
  .cart {
    border-radius: 19px 19px 0px 0px;
  }

  .cart .steps {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .cart .steps .step {
    display: grid;
    gap: 10px;
  }

  .cart .steps .step span {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 8px;
    display: block;
  }

  .cart .steps .step p {
    font-size: 11px;
    font-weight: 600;
    color: #000000;
  }

  /* Checkout */
  .payments .details {
    display: grid;
    grid-template-columns: 10fr 1fr;
    padding: 0px;
    gap: 5px;
  }

  .payments .details span:nth-child(odd) {
    font-size: 12px;
    font-weight: 600;
    color: #000000;
    margin: auto auto auto 0;
  }

  .payments .details span:nth-child(even) {
    font-size: 13px;
    font-weight: 600;
    color: #000000;
    margin: auto 0 auto auto;
  }

  .checkout .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 10px 20px;
    background-color: #ECC2C0;
  }

  .price {
    position: relative;
    font-size: 22px;
    color: #2B2B2F;
    font-weight: 900;
  }

  .checkout .checkout-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 36px;
    background: #F3D2C9;
    box-shadow: 0px 0.5px 0.5px #E5C7C5, 0px 1px 0.5px rgba(239, 239, 239, 0.5);
    border-radius: 7px;
    border: 1px solid #ECC2C0;
    color: #000000;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
    cursor: pointer;
  }

  .checkout .checkout-btn:hover:not(:disabled) {
    background: #E8B8B0;
  }

  .checkout .checkout-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }`;

export default CheckOutWithLoading;

/* Responsive styles */
const media = {
  mobile: '@media (max-width: 600px)',
  tablet: '@media (max-width: 900px)',
};

StyledWrapper.defaultProps = {
  theme: {},
};

StyledWrapper.componentStyle.rules.push(`
  ${media.mobile} {
    .card {
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    .cart .steps {
      padding: 10px;
    }
    .checkout .footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 10px;
    }
    .checkout .checkout-btn {
      width: 100%;
      min-width: 0;
    }
    .title {
      font-size: 13px;
      padding-left: 10px;
      height: 32px;
    }
    .cart .steps .step span,
    .cart .steps .step p,
    .payments .details span {
      font-size: 12px;
    }
  }
  ${media.tablet} {
    .card {
      width: 100%;
      min-width: 0;
    }
  }
`);
