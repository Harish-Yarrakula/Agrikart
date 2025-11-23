"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { FaCamera } from "react-icons/fa";
import Avatars from '@/components/Avatar';
import { useTranslation } from 'react-i18next';
import { Button as LoadingButton } from '@/components/ui/ButtonWithLoading';

const Page = () => {
    const { user } = useAuth();
    const { addToast } = useNotification();
    const { t } = useTranslation("common");


    const orders = [
        { id: 'ORD-2025-001', date: '2025-08-12', total: '₹12,500', status: 'Delivered' },
        { id: 'ORD-2025-002', date: '2025-08-14', total: '₹7,000', status: 'Shipped' },
        { id: 'ORD-2025-003', date: '2025-08-16', total: '₹17,450', status: 'Processing' },
    ];

    const [form, setForm] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                phone: user.mobile || '',
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                zip: user.address?.zip || ''
            });
            setImagePreview(user.profilePic || user.image);
        }
    }, [user]);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        if(user) {
            setForm({
                name: user.name, phone: user.mobile
            });
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Profile Data:', form);
        console.log('New image is ready for upload.');
    setIsEditing(false);
    addToast({ title: t('profilePage.alert.updateSuccess'), type: 'success' });
    };
    if (!user) {
        return <div>{t('profilePage.loading')}</div>;
    }

    return (
        <div className='min-h-screen w-full bg-gray-100 p-4 sm:p-6 lg:p-8 text-gray-800'>
            <div className='h-24'></div>
            <div className='max-w-5xl mx-auto'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900'>{t('profilePage.title')}</h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className='bg-white p-6 sm:p-8 rounded-xl shadow-lg'>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center md:items-start">
                                <h2 className="text-xl font-semibold mb-4">{t('profilePage.form.pictureLabel')}</h2>
                                <div className="relative">
                                    <div className='w-32 h-32 object-cover rounded-full shadow-md'><Avatars name={user.name} Image={user.image} /></div>
                                    <label htmlFor="profilePicInput" className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                                        <FaCamera className="w-5 h-5 text-white" />
                                        <input id="profilePicInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('profilePage.form.fullNameLabel')}</label>
                                    <input type="text" id="name" name="name" value={form.name || ''} onChange={handleChange} readOnly={!isEditing} className={`mt-1 input-style ${!isEditing && 'input-disabled'}`} />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">{t('profilePage.form.phoneLabel')}</label>
                                    <input type="text" id="phone" name="phone" value={form.phone || ''} onChange={handleChange} readOnly={!isEditing} className={'mt-1 input-style input-disabled'} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">{t('profilePage.form.streetLabel')}</label>
                                    <input type="text" id="street" name="street" value={form.street || ''} onChange={handleChange} readOnly={!isEditing} className={`mt-1 input-style ${!isEditing && 'input-disabled'}`} />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">{t('profilePage.form.cityLabel')}</label>
                                    <input type="text" id="city" name="city" value={form.city || ''} onChange={handleChange} readOnly={!isEditing} className={`mt-1 input-style ${!isEditing && 'input-disabled'}`} />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">{t('profilePage.form.stateLabel')}</label>
                                    <input type="text" id="state" name="state" value={form.state || ''} onChange={handleChange} readOnly={!isEditing} className={`mt-1 input-style ${!isEditing && 'input-disabled'}`} />
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">{t('profilePage.form.zipLabel')}</label>
                                    <input type="text" id="zip" name="zip" value={form.zip || ''} onChange={handleChange} readOnly={!isEditing} className={`mt-1 input-style ${!isEditing && 'input-disabled'}`} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                            {isEditing ? (
                                <>
                                    <LoadingButton type="button" onClick={handleCancel} className='bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all'>{t('profilePage.buttons.cancel')}</LoadingButton>
                                    <LoadingButton type="submit" className='bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all'>{t('profilePage.buttons.save')}</LoadingButton>
                                </>
                            ) : (
                                <LoadingButton type="button" onClick={handleEdit} className='bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all'>{t('profilePage.buttons.edit')}</LoadingButton>
                            )}
                        </div>
                    </div>
                </form>

                <div className="mt-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>{t('profilePage.orders.title')}</h2>
                    <div className='space-y-4'>
                        {orders.length > 0 ? orders.map(order => (
                            <div key={order.id} className='flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg gap-3'>
                                <div>
                                    <p className='font-bold text-indigo-600'>{order.id}</p>
                                    <p className='text-sm text-gray-500'>{t('profilePage.orders.datePrefix')} {order.date}</p>
                                </div>
                                <div className='text-left sm:text-right'>
                                    <p className='font-semibold text-lg'>{order.total}</p>
                                    <p className={`text-sm font-medium px-2 py-1 rounded-full inline-block ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {t(`profilePage.orders.status.${order.status.toLowerCase()}`)}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <p>{t('profilePage.orders.noOrders')}</p>
                        )}
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .input-style {
                    display: block;
                    width: 100%;
                    border-radius: 0.5rem;
                    border: 1px solid #D1D5DB;
                    padding: 0.5rem 0.75rem;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-style:focus {
                    border-color: #4F46E5;
                    box-shadow: 0 0 0 2px #C7D2FE;
                    outline: none;
                }
                .input-disabled {
                    background-color: #F3F4F6;
                    color: #6B7280;
                    cursor: not-allowed;
                    border-color: #E5E7EB;
                }
            `}</style>
        </div>
    );
};

export default Page;