"use client"
import React from 'react'
import Dock from '@/reactbits/Dock';
import {VscAccount} from "react-icons/vsc";
import { FaMicrophone } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';



const Options = () => {

  const {logout}=useAuth();
  const { addToast } = useNotification();
    const items = [
  { icon: <FaMicrophone size={18} />, label: 'Talk With AI', onClick: ()=> addToast({ title: 'AI will be available soon.', type: 'info' })},
    { icon: <TbTruckDelivery size={20} />, label: 'Orders', onClick: () => window.location.href = '/Orders' },
    { icon: <VscAccount size={18} />, label: 'Profile', onClick: () => window.location.href = '/Profile' },
  { icon: <RiLogoutBoxRLine size={18} />, label: 'Logout', onClick: ()=> logout() },
    ];


    return (
      <div>
          <Dock 
    items={items}
    panelHeight={68}
    baseItemSize={50}
    magnification={70}
  />
      </div>
    )
  }
  
  export default Options
  