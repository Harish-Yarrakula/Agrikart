"use client"
import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const Page = () => {
  const [orders, setOrders] = React.useState([]);
  const { user } = useAuth();
  const { t } = useTranslation("common");

  React.useEffect(() => {
    if (user && user.id) {
      const fetchOrders = async () => {
        // Updated API route to fetch orders by user id
        const response = await fetch(`http://localhost:5000/Orders/user/${user.id}`);
        const data = await response.json();
        setOrders(data);
      };
      fetchOrders();
    }
  }, [user]);

  return (
    <div>
      <div className='h-20 bg-gray-50'></div>
      <div className="min-h-screen w-full text-black flex justify-center items-center bg-gray-50 px-2 sm:px-4 py-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md flex flex-col">
          <p className="text-2xl sm:text-3xl font-bold m-2">{t('orders.pageTitle')}</p>
          <section className="flex flex-1 flex-col gap-4 justify-center items-center min-h-[300px] px-2 sm:px-8 w-full">
            {orders.length === 0 ? (
              <div className="text-gray-500 text-lg">{t('orders.emptyMessage')}</div>
            ) : (
              <div className="w-full bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('orders.listTitle')}</h1>
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const statusStyles = {
                        pending: "bg-yellow-100 text-yellow-800",
                        shipped: "bg-blue-100 text-blue-800",
                        delivered: "bg-green-100 text-green-800",
                        default: "bg-gray-100 text-gray-800",
                      };
                      const badgeClass = statusStyles[order.status] || statusStyles.default;
                      const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                      const image = order.items[0]?.image || "https://via.placeholder.com/150";

                      return (
                        <div
                          key={order._id}
                          className="bg-white rounded-lg shadow-md p-4 border border-gray-200 transition-shadow hover:shadow-lg"
                        >
                          <div className="flex justify-between items-center pb-3 border-b mb-4">
                            <div>
                              <p className="text-sm text-gray-500">{t('orders.card.orderIdLabel')}</p>
                              <p className="font-semibold text-gray-800 truncate">
                                #{order._id}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap capitalize ${badgeClass}`}
                            >
                              {t(`orders.status.${(order.status || 'unknown').toLowerCase()}`)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Image
                              src={image}
                              alt={t('orders.card.itemAltText')}
                              className="w-full sm:w-28 h-28 object-cover rounded-md flex-shrink-0"
                              width={112}
                              height={112}
                            />
                            <div className="flex-grow flex flex-col">
                              <div className="flex-grow space-y-2">
                                <div className="flex justify-between items-baseline">
                                  <p className="text-xl font-bold text-gray-900">
                                    ₹{Number(order.totalAmount).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500 text-right whitespace-nowrap">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {t('orders.card.itemCount', { count: totalItems })}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 mt-4 self-end" >
                                <Link className="text-sm font-medium text-gray-600 hover:text-black" href={`/Shippinginfo/${order._id}`}>
                                  {t('orders.card.trackButton')}
                                </Link>
                                <Link
                                  href={`/OrderConfirmation/${order._id}`}
                                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  {t('orders.card.detailsButton')}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Page;