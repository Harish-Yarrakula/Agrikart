"use client";
import Link from "next/link";
import React from "react";
import Image from 'next/image';
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

const Page = () => {
    const [order, setOrder] = React.useState(null);
    const { orderId } = useParams();
    const { t } = useTranslation("common");

    React.useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:5000/OrderDetails/${orderId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order");
                }
                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order:", error);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (!order) {
        return <div>{t('orderConfirmation.loading')}</div>;
    }

    const originalPrice = Number(order.totalAmount) + Number(order.totalAmount) * 0.25;

    return (
        <div className="min-h-screen w-full text-black bg-gray-100 py-10">
            <div className="bg-white mx-auto md:w-10/12 rounded-lg shadow-lg space-y-6 p-6">
                <h1 className="text-3xl font-bold border-b pb-4">{t('orderConfirmation.title')}</h1>
                <div className="flex flex-col justify-start items-center text-center space-y-4">
                    <Image src="/success.gif" alt={t('orderConfirmation.success.altText')} className="h-48 w-48" width={192} height={192} />
                    <p className="font-semibold text-2xl">{t('orderConfirmation.success.thankYou')}</p>
                    <p className="font-medium text-lg">
                        {t('orderConfirmation.success.orderIdLabel')} <span className="font-bold text-gray-700">{order._id}</span>
                    </p>
                    <p className="text-md text-gray-600">
                        {t('orderConfirmation.success.deliveryEstimate')}
                    </p>
                </div>

                <section className="border-t pt-6">
                    <p className="font-semibold text-xl mb-4">{t('orderConfirmation.details.title')}</p>
                    <div className="pl-4">
                        <p className="font-semibold text-lg mb-2">{t('orderConfirmation.details.itemsLabel')}</p>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2 pr-4">{t('orderConfirmation.details.table.name')}</th>
                                    <th className="py-2 pr-4">{t('orderConfirmation.details.table.quantity')}</th>
                                    <th className="py-2 pr-4">{t('orderConfirmation.details.table.size')}</th>
                                    <th className="py-2 pr-4">{t('orderConfirmation.details.table.price')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items && order.items.map((item) => (
                                    <tr key={item._id} className="border-b">
                                        <td className="py-2 pr-4">{item.product}</td>
                                        <td className="py-2 pr-4">{item.quantity}</td>
                                        <td className="py-2 pr-4">{item.size}</td>
                                        <td className="py-2 pr-4">₹{item.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="p-4 text-right font-semibold text-xl">
                            {t('orderConfirmation.details.totalAmountLabel')}{" "}
                            <strike className="text-gray-500 font-normal">
                                ₹{originalPrice.toFixed(2)}
                            </strike>{" "}
                            <span className="font-bold text-2xl text-green-600">
                                ₹{Number(order.totalAmount).toFixed(2)}
                            </span>
                        </p>
                    </div>
                </section>

                <section className="flex justify-center items-center space-x-4 pt-6 border-t">
                    <Link href="/Orders" className="border-2 p-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        {t('orderConfirmation.buttons.trackOrder')}
                    </Link>
                    <Link href="/DashBoard" className="border-2 p-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
                        {t('orderConfirmation.buttons.goHome')}
                    </Link>
                </section>

                <p className="text-center text-sm text-gray-500 pt-4">
                    {t('orderConfirmation.footer.supportText')}{" "}
                    <a href="tel:+911234567890" className="text-blue-500 underline">
                        +91 12345 67890
                    </a>.
                </p>
            </div>
        </div>
    );
};

export default Page;