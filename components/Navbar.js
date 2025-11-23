"use client"
import { useState, useEffect } from "react"
import { useId } from "react"
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Avatars from "./Avatar"
import { useAuth } from "@/context/AuthContext"
import { useTranslation } from "react-i18next"
import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Component() {
  const id = useId()
  const { user } = useAuth()
  const { t } = useTranslation("common");
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searching, setSearching] = useState(false)
  const [productes, setProductes] = useState([])

  const navigationLinks = [
    { href: "/ProductsPage", label: t('header.nav.products') },
    { href: "#", label: t('header.nav.categories') },
    { href: "#", label: t('header.nav.deals') },
  ]

  useEffect(() => {
    handleFetchProducts()
  }, [productes.length]);

  useEffect(() => {
    fetch("https://agrikart.onrender.com/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (query === "") {
      setFilteredProducts([]);
    } else {
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [query, products]);

  const handleFetchProducts = () => {
    fetch("https://agrikart.onrender.com/cartProducts", { method: "GET" })
      .then(res => res.json())
      .then(data => setProductes(data))
      .catch(err => console.log(err))
  }

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setSearching(false)
    }, 500);
  }

  return (
    <header className="border-b-1  fixed w-full z-50 ">
      <div className="flex h-16 px-4 md:px-6 items-center justify-between gap-4 bg-yellow-50">
        <div className="flex flex-1 items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem
                    className="w-full"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <div
                      role="separator"
                      aria-orientation="horizontal"
                      className="bg-border -mx-1 my-1 h-px"
                    ></div>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink href="/Profile" className="py-1.5">
                      <Avatars name={user?.name} Image={user?.image} />
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem className="w-full">
                    <Button
                      asChild
                      size="sm"
                      className="mt-0.5 w-full text-left text-sm"
                    >
                      <span className="flex items-baseline gap-2">
                        {t('header.cartButton')}
                        <span className="text-primary-foreground/60 text-xs">
                          {productes.length}
                        </span>
                      </span>
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex flex-1 items-center gap-6 max-md:justify-between">
            <Link href="/DashBoard" className="text-primary hover:text-primary/90">
              <Image src="/logo.png" alt={t('header.logoAltText')} className="h-20 w-20" width={80} height={80} />
            </Link>
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <div className="relative" onFocus={() => { setSearching(true) }} onBlur={handleBlur} onChange={handleSearch}>
              <Input
                id={id}
                className="peer h-8 ps-8 pe-2"
                placeholder={t('header.searchPlaceholder')}
                type="search"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 max-md:hidden">
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <Link href="/Profile"><Avatars name={user?.name} Image={user?.image} /></Link>
          </Button>
          <Button asChild size="sm" className="text-sm">
            <Link href="/Cart">
              <span className="flex items-baseline gap-2">
                {t('header.cartButton')}
                <span className="text-primary-foreground/60 text-xs">{productes.length}</span>
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <section className={`h-fit w-fit bg-white rounded-lg ml-80 ${searching ? "block" : "hidden"}`}>
        {
          filteredProducts.map((product) => (
            <div className="flex p-2 border-b-1" key={product._id}>
              <Image src={product.image_link} alt={product.name} className="h-12 w-12 p-1" width={48} height={48} />
              <section className="">
                <p className="text-md font-bold">{product.name}</p>
                <p>{product.price}</p>
              </section>
            </div>
          ))
        }
      </section>
    </header>
  )
}