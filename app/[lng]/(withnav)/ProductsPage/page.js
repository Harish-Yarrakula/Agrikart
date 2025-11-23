"use client"
import React, { useState, useEffect, useMemo } from "react";
import Card from "@/reactbits/TitledCard";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button as LoadingButton } from '@/components/ui/ButtonWithLoading';

const SkeletonCard = () => (
    <div className="border rounded-lg p-4 h-full bg-white animate-pulse">
        <div className="w-full h-40 bg-gray-200 rounded-md mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="mt-3 h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
);

const Page = () => {
    const { t } = useTranslation("common");
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [selectedPrice, setSelectedPrice] = useState("all");
    const [selectedRating, setSelectedRating] = useState(0);

    const params = useSearchParams();

    useEffect(() => {
        fetch("http://localhost:5000/products", { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                setAllProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const categoryParam = params.get('category');
        if (categoryParam) {
            setSelectedCategories(categoryParam.split(','));
        } else {
            setSelectedCategories([]);
        }
    }, [params]);

    const categories = useMemo(() => {
        if (loading) return [];
        return [...new Set(allProducts.map(p => p.category))];
    }, [allProducts, loading]);

    const filteredProducts = useMemo(() => {
        let products = [...allProducts];

        if (selectedCategories.length > 0) {
            products = products.filter(p => selectedCategories.includes(p.category));
        }

        if (selectedRating > 0) {
            products = products.filter(p => (p.rating || 0) >= selectedRating);
        }

        if (selectedPrice !== "all") {
            const [min, max] = selectedPrice.split('-').map(Number);
            products = products.filter(p => p.price >= min && p.price <= max);
        }

        switch (sortBy) {
            case 'price_asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating_desc':
                products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }

        return products;
    }, [allProducts, selectedCategories, sortBy, selectedRating, selectedPrice]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };
    
    const categoryKeyMap = {
        "Fertilizers": "categories.fertilizers",
        "Pesticides": "categories.pesticides",
        "Fungicides": "categories.fungicides",
        "Insecticides": "categories.insecticides",
        "Herbicides": "categories.herbicides",
        "Plant Growth Regulators": "categories.plantGrowthRegulators",
        "Farming Tools": "categories.farmingTools",
    };

    const FilterPanel = () => (
        <div className="flex flex-col w-full h-full p-4 text-gray-700 bg-white md:bg-transparent">
            <h1 className="text-xl font-bold mb-4">{t('productsPage.filters.title')}</h1>

            <section className="mb-6">
                <h2 className="font-semibold mb-2">{t('productsPage.filters.sortByLabel')}</h2>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="default">{t('productsPage.filters.sort.relevance')}</option>
                    <option value="rating_desc">{t('productsPage.filters.sort.ratingDesc')}</option>
                    <option value="price_asc">{t('productsPage.filters.sort.priceAsc')}</option>
                    <option value="price_desc">{t('productsPage.filters.sort.priceDesc')}</option>
                </select>
            </section>

            <section className="mb-6">
                <h2 className="font-semibold mb-2">{t('productsPage.filters.categoriesLabel')}</h2>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center">
                            <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} className="h-4 w-4 rounded" />
                            <span className="ml-2 capitalize">{t(categoryKeyMap[cat] || cat)}</span>
                        </label>
                    ))}
                </div>
            </section>

            <section className="mb-6">
                <h2 className="font-semibold mb-2">{t('productsPage.filters.priceLabel')}</h2>
                <div className="space-y-2">
                    {["all", "0-500", "500-1000", "1000-2000", "2000-5000"].map(range => (
                        <label key={range} className="flex items-center">
                            <input type="radio" name="price" value={range} checked={selectedPrice === range} onChange={(e) => setSelectedPrice(e.target.value)} />
                            <span className="ml-2">{range === 'all' ? t('productsPage.filters.price.all') : `₹${range}`}</span>
                        </label>
                    ))}
                </div>
            </section>

            <section className="mb-6">
                <h2 className="font-semibold mb-2">{t('productsPage.filters.ratingLabel')}</h2>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map(star => (
                        <label key={4} className="flex items-center">
                            <input type="radio" name="rating" value={star} checked={selectedRating === star} onChange={() => setSelectedRating(star)} />
                            <span className="ml-2">★{star} & up</span>
                        </label>
                    ))}
                </div>
            </section>
            <LoadingButton onClick={() => setSelectedRating(0)} className="text-sm text-blue-600 hover:underline" variant="link" size="sm">{t('productsPage.filters.clearRatingButton')}</LoadingButton>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="h-20 w-full"></div>
            <div className="container mx-auto px-4">
                <div className="flex">
                    <aside className="w-1/4 h-full p-4 border-r border-gray-200 hidden md:block">
                        <FilterPanel />
                    </aside>

                    <main className="flex flex-col w-full md:w-3/4 p-4 md:h-screen md:overflow-y-auto ">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-gray-800 text-2xl font-bold">{t('productsPage.main.title')}</h1>
                            <LoadingButton onClick={() => setIsFilterOpen(true)} className="md:hidden bg-blue-500 text-white px-4 py-2 rounded-md">{t('productsPage.main.mobileFilterButton')}</LoadingButton>
                        </div>

                        {loading ? (
                            <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                            </section>
                        ) : error ? (
                            <div className="text-red-500">{t('productsPage.main.errorPrefix')} {error}</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-10">
                                <h2 className="text-xl font-semibold">{t('productsPage.main.noProductsFound')}</h2>
                                <p className="text-gray-600">{t('productsPage.main.noProductsSuggestion')}</p>
                            </div>
                        ) : (
                            <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map((product) => (
                                    <div key={product._id}>
                                        <Card
                                            id={product._id}
                                            image={product.Image}
                                            name={product.name}
                                            price={(product.price - (product.price / 5.0)).toFixed(2)}
                                            size={product.sizes[0]}
                                            Originalprice={product.price.toFixed(2)}
                                        />
                                    </div>
                                ))}
                            </section>
                        )}
                    </main>
                </div>
            </div>

            {isFilterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsFilterOpen(false)}>
                    <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end p-2">
                            <LoadingButton onClick={() => setIsFilterOpen(false)} className="text-2xl font-bold">&times;</LoadingButton>
                        </div>
                        <FilterPanel />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;