 'use client'
import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { Button as LoadingButton } from '@/components/ui/ButtonWithLoading';
import { useParams } from 'next/navigation';
import Card from '@/reactbits/TitledCard';
import Button from '@/components/ui/Btn';
import { set } from 'mongoose';
import { useTranslation } from 'react-i18next';

const StarIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const StarRating = ({ rating, reviewCount }) => {
    const { t } = useTranslation("common");
    const totalStars = 5;
    const filledStars = Math.round(rating || 0);
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, i) => (
                <StarIcon key={i} className={`w-5 h-5 ${i < filledStars ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="ml-2 text-sm text-gray-600">
                {reviewCount > 0 ? `${rating.toFixed(1)} (${reviewCount} ${t('productDetails.reviews.label')})` : t('productDetails.reviews.none')}
            </span>
        </div>
    );
};

const FormattedDescription = ({ text }) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => {
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
            return (
                <p key={index} className="font-bold my-2">
                    {paragraph.substring(2, paragraph.length - 2)}
                </p>
            );
        }
        return (
            <p key={index} className="mb-2">
                {paragraph}
            </p>
        );
    });
};

const Page = () => {
    const { t } = useTranslation("common");
    const params = useParams();
    const productid = params.productid;

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (!productid) return;
        
        setLoading(true);
        fetch(`http://localhost:5000/product/${productid}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setProduct(data);
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }
            })
            .catch(error => {
                console.error("Error fetching product:", error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [productid]);
    
    useEffect(() => {
        if (product) {
            fetch(`http://localhost:5000/products/category?category=${encodeURIComponent(product.category)}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    setSimilarProducts(data);
                })
                .catch(error => {
                    console.error("Error fetching similar products:", error);
                });
        }
    }, [product]);

    const averageRating = useMemo(() => {
        if (!product || !product.review || product.review.length === 0) return 0;
        const total = product.review.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return total / product.review.length;
    }, [product]);

    const pricing = useMemo(() => {
        if (!product) return {};
        const basePrice = product.price;
        let discountPercent = 0.5;
        
        if (product.deal === 'featured' || product.deal === 'trending') {
            discountPercent = 0.15;
        }

        const discountedPrice = basePrice * (1 - discountPercent);
        const savings = basePrice - discountedPrice;
        
        return {
            hasDiscount: discountPercent > 0,
            displayPrice: discountedPrice.toFixed(2),
            originalPrice: basePrice.toFixed(2),
            savings: savings.toFixed(2),
            savingsPercent: (discountPercent * 100).toFixed(0),
        };
    }, [product]);

    const faqs = [
        { q: t('productDetails.faq.returnPolicy.question'), a: t('productDetails.faq.returnPolicy.answer') },
        { q: t('productDetails.faq.safety.question'), a: t('productDetails.faq.safety.answer') },
        { q: t('productDetails.faq.storage.question'), a: t('productDetails.faq.storage.answer') },
    ];
    
    if (loading) return <ProductSkeleton />;
    if (error) return <div className="container mx-auto text-center py-20 text-red-500">{t('productDetails.errorPrefix')} {error}</div>;
    if (!product) return <div className="container mx-auto text-center py-20">{t('productDetails.notFound')}</div>;
    
    return (
        <div className='w-full text-gray-800 pb-20 bg-white'>
            <div className='h-24'></div>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-10'>
                    <section>
                        <Image src={product.Image} alt={`Image of ${product.name}`} className='object-cover w-full h-full rounded-lg shadow-lg aspect-square' width={640} height={640} />
                    </section>
                    
                    <section className='flex flex-col gap-4'>
                        <h1 className='text-3xl lg:text-4xl font-bold tracking-tight'>{product.name}</h1>
                        <div className='flex items-center gap-4'>
                            <StarRating rating={averageRating} reviewCount={product.review.length} />
                            <span className="px-3 py-1 text-sm rounded-full font-semibold bg-green-100 text-green-800">
                                {t('productDetails.availability.inStock')}
                            </span>
                        </div>

                        <div>
                            {(() => {
                                const parseSize = (sizeStr) => {
                                    const match = sizeStr.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
                                    if (!match) return { value: 1, unit: "" };
                                    return { value: parseFloat(match[1]), unit: match[2].toLowerCase() };
                                };

                                const base = parseSize(product.sizes[0]);
                                const selected = parseSize(selectedSize);

                                const unitMap = {
                                    ml: { to: "ml", factor: 1 },
                                    l: { to: "ml", factor: 1000 },
                                    g: { to: "g", factor: 1 },
                                    kg: { to: "g", factor: 1000 },
                                };

                                let baseAmount = base.value;
                                let selectedAmount = selected.value;
                                if (unitMap[base.unit] && unitMap[selected.unit] && unitMap[base.unit].to === unitMap[selected.unit].to) {
                                    baseAmount = base.value * unitMap[base.unit].factor;
                                    selectedAmount = selected.value * unitMap[selected.unit].factor;
                                }

                                const pricePerUnit = parseFloat(pricing.displayPrice) / baseAmount;
                                const selectedPrice = (pricePerUnit * selectedAmount).toFixed(2);

                                return (
                                    <>
                                        <p className='text-3xl font-semibold text-gray-900'>₹{selectedPrice}</p>
                                        {pricing.hasDiscount && (
                                            <div className='flex items-center gap-2 text-sm'>
                                                <p className='text-gray-500'>{t('productDetails.pricing.listPriceLabel')} <del>₹{(parseFloat(pricing.originalPrice) / baseAmount * selectedAmount).toFixed(2)}</del></p>
                                                <p className='font-semibold text-green-600'>{t('productDetails.pricing.savingsText', { savings: (parseFloat(pricing.savings) / baseAmount * selectedAmount).toFixed(2), savingsPercent: pricing.savingsPercent })}</p>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-900">{t('productDetails.sizeLabel')}</h3>
                            <div className="mt-2 flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <LoadingButton
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-md font-semibold transition-colors duration-200
                                            ${selectedSize === size 
                                                ? 'bg-blue-600 text-white border-blue-700' 
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                                        `}
                                        size="sm"
                                    >
                                        {size}
                                    </LoadingButton>
                                ))}
                            </div>
                        </div>
                        
                        <div className='mt-6 flex flex-col sm:flex-row gap-3'>
                            <Button name={t('productDetails.buttons.buyNow')} product={product} size={selectedSize} price={
                                (() => {
                                    const parseSize = (sizeStr) => {
                                        const match = sizeStr.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);
                                        if (!match) return { value: 1, unit: "" };
                                        return { value: parseFloat(match[1]), unit: match[2].toLowerCase() };
                                    };
                                    const base = parseSize(product.sizes[0]);
                                    const selected = parseSize(selectedSize);
                                    const unitMap = {
                                        ml: { to: "ml", factor: 1 },
                                        l: { to: "ml", factor: 1000 },
                                        g: { to: "g", factor: 1 },
                                        kg: { to: "g", factor: 1000 },
                                    };
                                    let baseAmount = base.value;
                                    let selectedAmount = selected.value;
                                    if (unitMap[base.unit] && unitMap[selected.unit] && unitMap[base.unit].to === unitMap[selected.unit].to) {
                                        baseAmount = base.value * unitMap[base.unit].factor;
                                        selectedAmount = selected.value * unitMap[selected.unit].factor;
                                    }
                                    const pricePerUnit = parseFloat(pricing.displayPrice) / baseAmount;
                                    return (pricePerUnit * selectedAmount).toFixed(2);
                                })()
                            } />
                        </div>
                    </section>
                </div>

                <div className="space-y-12 mt-12">
                    <section>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t('productDetails.description.title')}</h2>
                        <div className="text-gray-600 leading-relaxed prose">
                            <FormattedDescription text={product.description} />
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t('productDetails.similarProducts.title')}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {similarProducts.map(item => (
                                <Card
                                    key={item._id}
                                    id={item._id}
                                    image={item.image_link}
                                    name={item.name}
                                    price={(item.price - (item.price / 5.0)).toFixed(2)}
                                    size={item.sizes[0]}
                                    Originalprice={item.price.toFixed(2)}
                                />
                            ))}
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t('productDetails.customerReviews.title')}</h2>
                        <div className="space-y-6">
                            {product.review && product.review.length > 0 ? (
                                product.review.map((review, index) => (
                                    <div key={index} className="border-b pb-4">
                                        <div className="flex items-center mb-1">
                                            <StarRating rating={review.rating} reviewCount={0} />
                                            <p className="ml-4 font-bold">{review.author}</p>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">{t('productDetails.customerReviews.none')}</p>
                            )}
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t('productDetails.faq.title')}</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border rounded-lg">
                                    <LoadingButton
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex justify-between items-center p-4 text-left font-semibold"
                                    >
                                        {faq.q}
                                        <span className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>▼</span>
                                    </LoadingButton>
                                    {openFaq === index && (
                                        <div className="px-4 pb-4 text-gray-600">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
};

const ProductSkeleton = () => (
    <div className='w-full text-gray-800 pb-20 animate-pulse'>
        <div className='h-24'></div>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-10'>
                <div className='bg-gray-300 rounded-lg aspect-square'></div>
                <div className='flex flex-col gap-5 pt-4'>
                    <div className="h-10 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="mt-4 flex gap-3">
                        <div className="h-10 bg-gray-300 rounded w-20"></div>
                        <div className="h-10 bg-gray-300 rounded w-20"></div>
                        <div className="h-10 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <div className="h-12 bg-gray-300 rounded flex-grow"></div>
                        <div className="h-12 bg-gray-300 rounded flex-grow"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Page;