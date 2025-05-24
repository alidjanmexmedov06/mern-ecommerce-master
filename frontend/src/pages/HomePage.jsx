import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/къси панталони", name: "Къси панталони", imageUrl: "/къси панталони.jpg" },
	{ href: "/тениски", name: "Тениски", imageUrl: "/тениски.jpg" },
	{ href: "/обувки", name: "Обувки", imageUrl: "/обувки.jpg" },
	{ href: "/раници", name: "Раници", imageUrl: "/bag.jpg" },
	{ href: "/фитнес аксесоари", name: "Фитнес аксесоари", imageUrl: "/fitness.jpg" },
	{ href: "/спортни часовници", name: "Спортни часовници", imageUrl: "/clocks.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		
			<div className="z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-16 pb-16">
				<h1 className='text-center text-5xl sm:text-5xl font-bold text-emerald-400 mb-4'>
					Добре дошли в нашия сайт
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
				    Открийте най-новите модни тенденции за сезона!
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		
	);
};
export default HomePage;