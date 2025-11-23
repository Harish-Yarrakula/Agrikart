"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from '@/context/AuthContext.js';
import { useNotification } from '@/context/NotificationContext';
import { Button as LoadingButton } from '@/components/ui/ButtonWithLoading';


const Card = ({ image, name, price, Originalprice, id ,size}) => {
    
const {user}=useAuth();
const { addToast } = useNotification();

const [adding, setAdding] = useState(false);

const handleAdd = async (product) => {
    if (adding) return;
    setAdding(true);
    if (!user || !user.id) {
        addToast({ title: 'Please login to add items to cart', type: 'error' });
        setAdding(false);
        return;
    }
    try {
        const cartItem = {
            productId: id,
            userId: user.id,
            name: name,
            image: image,
            price: price,
            size: size,
            quantity: 1,
        };
        const res = await fetch("http://localhost:5000/cartProducts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartItem),
        });
        const data = await res.json();
        if (res.ok) {
            addToast({ title: `${name} is Added`, type: 'success' });
        } else {
            throw new Error(data.message || 'Failed to add to cart');
        }
    } catch (err) {
        console.log("Error adding to cart:", err);
        addToast({ title: 'Failed to add item to cart. Please try again.', type: 'error' });
    } finally {
        setAdding(false);
    }
}

    return(
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} className="border rounded-lg p-4 flex flex-col h-full bg-white hover:shadow-xl transition-shadow duration-300">
                <Link href={`/ProductsPage/${id}`}>
                    <Image src={image} alt={name} className="w-full h-40 object-cover rounded-md mb-3" width={400} height={240} />
                </Link>
        <div className="flex-grow">
            <h3 className="font-semibold text-gray-800 text-sm leading-snug">{name}</h3>
        </div>
        <div className="mt-3 flex w-full justify-between">
            <section>
            <p className="text-lg font-bold text-gray-900">₹{price}</p>
            <p className="text-xs text-gray-500 line-through">was ₹{Originalprice}</p>
            </section>
                        <div>
                        <LoadingButton
                            className='text-black rounded-full bg-green-200 p-3 border-1 hover:bg-green-400'
                            loading={adding}
                            onClick={() => handleAdd()}
                            aria-label={`Add ${name} to cart`}
                        >
                            <FaShoppingCart />
                        </LoadingButton>
                        </div>
        </div>
    </motion.div>)
};

export default Card;