"use client"
import React from 'react'
import Image from 'next/image'
import Checkout from '@/components/CheckOut'
import { Button as LoadingButton } from '@/components/ui/ButtonWithLoading';
import { useTranslation } from "react-i18next";

const Page = () => {
  
  const { t } = useTranslation("common");
	const [products,setProducts]=React.useState([])
	const [loadingStates, setLoadingStates] = React.useState({});

  React.useEffect(()=>{
    handleFetchProducts()
  },[products.length]);

  const handleFetchProducts=()=>{
    fetch("https://agrikart.onrender.com/cartProducts",{method:"GET"})
    .then(res=>res.json())
    .then(data=>setProducts(data))
    .catch(err=>console.log(err))
  }
	const handleUpdateQuantity= async (id, Quantity) =>{
		if(Quantity<1) return;
		const loadingKey = `quantity-${id}`;
		setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
		try {
			const response = await fetch(`https://agrikart.onrender.com/cartProducts/${id}`,{
				method:"PATCH",
				headers:{"Content-Type":"application/json"},
				body:JSON.stringify({quantity:Quantity})
			});
			const updatedProduct = await response.json();
			if (response.ok) {
				setProducts(products.map(product=>product._id===updatedProduct._id ? {...product,quantity:updatedProduct.quantity} : product))
			} else {
				throw new Error(updatedProduct.message || 'Failed to update quantity');
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
		}
	}
	const handleRemoveItem= async (id) =>{
		const loadingKey = `remove-${id}`;
		setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
		try {
			const response = await fetch(`https://agrikart.onrender.com/cartProducts/${id}`,{
				method:"DELETE"
			});
			const deletedProduct = await response.json();
			if (response.ok) {
				setProducts(products.filter(product=>product._id!==deletedProduct._id))
			} else {
				throw new Error(deletedProduct.message || 'Failed to remove item');
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
		}
	}

  const TotalPrice= products.reduce((acc, item) => acc + item.price * item.quantity, 0)+products.reduce((acc, item) => acc + item.price * item.quantity, 0)* 0.18;

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className='h-24 w-full'></div>
      <h1 className="text-3xl font-bold text-center mb-6 w-10/13">{t('cart.title')}</h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-gray-600 mb-2">{t('cart.emptyMessage')}</p>
					<Image
						src="https://dummyimage.com/600x400/000/fff&text=Empty+Cart"
						alt={t('cart.emptyAltText')}
						className="w-full max-w-md mb-4"
						width={600}
						height={400}
					/>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-full lg:w-4/5">
            <div className="flex flex-col gap-4">
              {products.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-4 flex w-full"
                >
								 {item.image && (
								 	 <Image
								 	 	src={item.image}
								 	 	alt={item.name}
								 	 	className="w-full h-48 object-cover rounded mb-3"
								 	 	width={384}
								 	 	height={192}
								 	 />
								 )}
                  <div className='flex flex-col gap-4'>
                  <h4 className="text-lg font-semibold mb-2">{item.name}</h4>
                  <p className="mb-1">{t('cart.item.priceLabel')} <span className="font-medium">₹{item.price*item.quantity}</span></p>
                  <p className="mb-1">{t('cart.item.sizeLabel')} <span className="font-medium">{item.size}</span></p>
                  <div className="flex items-center mb-2">
                    <span className="mr-2">{t('cart.item.quantityLabel')}</span>
									 <LoadingButton
										 onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
										 className="bg-gray-200 px-2 rounded-l hover:bg-gray-300"
										 loading={loadingStates[`quantity-${item._id}`]}
										 size="sm"
									 >
										 -
									 </LoadingButton>
                    <span className="px-3">{item.quantity}</span>
									 <LoadingButton
										 onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
										 className="bg-gray-200 px-2 rounded-r hover:bg-gray-300"
										 loading={loadingStates[`quantity-${item._id}`]}
										 size="sm"
									 >
										 +
									 </LoadingButton>
                  </div>
								 <LoadingButton
									 onClick={() => handleRemoveItem(item._id)}
									 className="mt-auto px-3 py-1"
									 loading={loadingStates[`remove-${item._id}`]}
									 variant="destructive"
									 size="sm"
								 >
									 {t('cart.item.removeButton')}
								 </LoadingButton>
                  </div>
                </div>
              ))}
            </div>   
              <div className='mx-auto w-full flex justify-center mt-8'>
                <Checkout
                  price={TotalPrice.toFixed(0)}
                  discount={products.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.1}
                  shipping={TotalPrice > 1000 ? 0 : 100}
                />
              </div>
          </div>
        </div>
      )}


      <div className="flex flex-col items-center justify-center mt-8">
        <p className="text-gray-500">{t('cart.browsePrompt')}</p>
      </div>
    </div>
  )
}

export default Page