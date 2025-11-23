"use client"
import React, { useEffect, useState } from 'react'
import Carousel from '@/reactbits/Carousel'
import Card from '@/reactbits/TitledCard'
import Link from 'next/link'
import Weather from '@/features/Weather'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const SkeletonCard = () => (
    <div className="border rounded-lg p-4 h-full bg-white animate-pulse">
        <div className="w-full h-40 bg-gray-200 rounded-md mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="mt-3 h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
);

const ProductShelf = ({ title, products, loading }) => (
    <div className='w-full py-2 md:py-4'>
        <u><h1 className='text-xl md:text-2xl font-bold px-4 md:px-6 lg:px-8'>{title}</h1></u>
        <div className="overflow-x-auto py-4 no-scrollbar">
            <div className="grid grid-flow-col auto-cols-max gap-4 md:gap-8 px-4 md:px-6 lg:px-8">
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-52 sm:w-60 md:w-64 flex-shrink-0">
                            <SkeletonCard />
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <div key={product._id} className="w-52 sm:w-60 md:w-64 flex-shrink-0">
                            <Card
                                id={product._id}
                                image={product.Image}
                                name={product.name}
                                price={(product.price - (product.price / 10)).toFixed(2)}
                                size={product.sizes[0]}
                                Originalprice={product.price}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);

const Page = () => {
    const { t } = useTranslation("common");

    const categories = [
        { title: t('categories.fertilizers'), original: "Fertilizers", image: "https://media.bighaat.com/wsfbanners/964f7226-86be-46b4-8272-6c0218ae4137.webp?w=1920&q=80" },
        { title: t('categories.pesticides'), original: "Pesticides", image: "https://cdn.shopify.com/s/files/1/0722/2059/files/janatha-carbon-maxx-file-16230.jpg?v=1737453817&width=640" },
        { title: t('categories.fungicides'), original: "Fungicides", image: "https://media.bighaat.com/wsfbanners/1a84ddfb-9749-4fe0-a114-9311cf6f26ed.webp?w=1920&q=80" },
        { title: t('categories.insecticides'), original: "Insecticides", image: "https://media.bighaat.com/wsfbanners/4db986c5-1a19-45a2-b7c4-cc49ead9d4cc.webp?w=1920&q=80" },
        { title: t('categories.herbicides'), original: "Herbicides", image: "https://media.bighaat.com/wsfbanners/6244f631-cce9-464e-ba8b-88468638f3a6.webp?w=1920&q=80" },
        { title: t('categories.plantGrowthRegulators'), original: "Plant Growth Regulators", image: "https://media.bighaat.com/wsfbanners/8ee79225-b7ca-484c-93a9-b430ea80cb4a.webp?w=1920&q=80" },
        { title: t('categories.farmingTools'), original: "Farming Tools", image: "https://media.bighaat.com/wsfbanners/ebe93efb-46da-4da3-a8e3-f4de95b9c215.webp?w=1920&q=80" },
    ];

    const [FeaturedProducts, setFeaturedProducts] = useState([]);
    const [TrendingProducts, setTrendingProducts] = useState([]);
    const [LatestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const requests = [
                    fetch("https://agrikart.onrender.com/featured", { credentials: 'include' }),
                    fetch("https://agrikart.onrender.com/trending", { credentials: 'include' }),
                    fetch("https://agrikart.onrender.com/latest", { credentials: 'include' })
                ];
                const responses = await Promise.all(requests);
                for (const res of responses) {
                    if (!res.ok) {
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                }
                const [featuredData, trendingData, latestData] = await Promise.all(
                    responses.map(res => res.json())
                );
                setFeaturedProducts(featuredData);
                setTrendingProducts(trendingData);
                setLatestProducts(latestData);
            } catch (error) {
                console.error("An error occurred while fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    return (
        <div className='w-full h-full text-black overflow-hidden'>
            <div className='h-20'></div>

            <section className='w-full flex justify-start items-center p-2  sm:justify-around gap-4 sm:gap-6 md:gap-10 overflow-x-auto no-scrollbar'>
                {categories.map((category, key) => (
                    <Link href={{ pathname: "/ProductsPage", query: { category: category.original } }} key={key} className="flex flex-col items-center flex-shrink-0 w-20 text-center">
                        <Image src={`${category.image}`} className='w-12 h-12 sm:w-16 sm:h-16 object-cover mask-blend-multiply border rounded-full' alt={category.title} width={64} height={64} />
                        <h1 className='text-xs sm:text-sm mt-1'>{category.title}</h1>
                    </Link>
                ))}
            </section>

            <div className='w-full h-full my-4'>
                <Carousel />
            </div>

            <Weather />

            <ProductShelf title={t('productShelf.featured')} products={FeaturedProducts} loading={loading} />

            <hr className="border-gray-300" />
            
            <ProductShelf title={t('productShelf.latest')} products={LatestProducts} loading={loading} />

            <hr className="border-gray-300" />
            
            <ProductShelf title={t('productShelf.trending')} products={TrendingProducts} loading={loading} />
            
            <style>{`
                body { background-color: #F3E9D2 !important; }
            `}</style>
        </div>
    )
}

export default Page;