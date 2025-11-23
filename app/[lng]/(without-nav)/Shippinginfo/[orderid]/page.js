"use client"
import React from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const ShippingInfo = () => {
    const { orderid } = useParams();
    const { t } = useTranslation("common");
    const [data, setData] = React.useState(null);
    const [error, setError] = React.useState(null);

    const allStatuses = [
        { key: 'Order Placed', name: t('shippingInfo.status.placed.name'), description: t('shippingInfo.status.placed.description') },
        { key: 'Processing', name: t('shippingInfo.status.processing.name'), description: t('shippingInfo.status.processing.description') },
        { key: 'Shipped', name: t('shippingInfo.status.shipped.name'), description: t('shippingInfo.status.shipped.description') },
        { key: 'Out for Delivery', name: t('shippingInfo.status.outForDelivery.name'), description: t('shippingInfo.status.outForDelivery.description') },
        { key: 'Delivered', name: t('shippingInfo.status.delivered.name'), description: t('shippingInfo.status.delivered.description') },
    ];

    React.useEffect(() => {
        if (!orderid) return;

        fetch(`https://agrikart.onrender.com/OrderDetails/${orderid}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
                setError(error.message);
            });
    }, [orderid]);

    if (error) {
        return (
            <section className="py-24">
                <div className="w-full max-w-7xl px-4 mx-auto text-center">
                    <p className="text-red-500">{t('shippingInfo.error')}</p>
                </div>
            </section>
        );
    }

    if (!data) {
        return (
            <section className="py-24">
                <div className="w-full max-w-7xl px-4 mx-auto text-center">
                    <p className="text-gray-500">{t('shippingInfo.loading')}</p>
                </div>
            </section>
        );
    }

    const currentStatusIndex = allStatuses.findIndex(s => s.key === data.currentStatus);

    const getStatusDate = (statusKey) => {
        const historyEntry = data.trackingHistory.find(h => h.status === statusKey);
        return historyEntry ? new Date(historyEntry.date).toLocaleString() : '';
    };

    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <section className="bg-gray-50 py-16 md:py-24">
            <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3">
                        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{t('shippingInfo.title')}</h2>
                                    <p className="text-gray-500">
                                        {t('shippingInfo.orderPrefix')} <span className="font-semibold text-indigo-600">#{data._id}</span>
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                                    <p className="text-lg font-semibold text-gray-700">{t('shippingInfo.expectedArrivalLabel')}</p>
                                    <p className="text-gray-500">{data.expectedArrival ? new Date(data.expectedArrival).toLocaleDateString() : t('shippingInfo.notAvailable')}</p>
                                </div>
                            </div>

                            <div>
                                <ol className="relative border-l border-gray-200">
                                    {allStatuses.map((status, index) => {
                                        const isCompleted = index < currentStatusIndex;
                                        const isCurrent = index === currentStatusIndex;
                                        const isPending = index > currentStatusIndex;

                                        return (
                                            <li key={status.key} className="mb-10 ml-6 last:mb-0">
                                                <span
                                                    className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-8 ring-white
                                                        ${isCompleted ? 'bg-indigo-600' : ''}
                                                        ${isCurrent ? 'bg-indigo-100' : ''}
                                                        ${isPending ? 'bg-gray-200' : ''}
                                                    `}
                                                >
                                                    {isCompleted ? (
                                                        <CheckIcon className="w-4 h-4 text-white" />
                                                    ) : (
                                                        <span className={`w-3 h-3 rounded-full ${isCurrent ? 'bg-indigo-600' : 'bg-gray-400'}`}></span>
                                                    )}
                                                </span>
                                                <div className="ml-4">
                                                    <h3 className={`font-semibold ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>{status.name}</h3>
                                                    <p className={`text-sm ${isPending ? 'text-gray-400' : 'text-gray-500'}`}>{status.description}</p>
                                                    {getStatusDate(status.key) && (
                                                        <time className="block text-xs font-normal leading-none text-gray-400 mt-1">{getStatusDate(status.key)}</time>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-1/3">
                        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-md flex flex-col gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('shippingInfo.summary.title')}</h3>
                                <div className="space-y-3">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <Image src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" width={64} height={64} />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                    <p className="text-sm text-gray-500">{item.quantity} x ₹{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-gray-800">₹{(item.quantity * item.price).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500">{t('shippingInfo.summary.subtotal')}</p>
                                        <p className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500">{t('shippingInfo.summary.shipping')}</p>
                                        <p className="font-semibold text-gray-800">₹{subtotal > 1000 ? 0 : 100}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-bold text-gray-900">{t('shippingInfo.summary.total')}</p>
                                        <p className="text-xl font-bold text-gray-900">₹{(subtotal + (subtotal > 1000 ? 0 : 100)).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {data.shippingAddress && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('shippingInfo.address.title')}</h3>
                                    <div className="text-gray-600 space-y-1">
                                        <p className="font-semibold">{data.shippingAddress}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShippingInfo;