import React, { useContext, useEffect, useState } from "react";
import { WebContext } from "../context/Webcontext";
import { assets } from "../assets/assets";
import Title from "../components/Title";

const Collection = () => {
  const { products, search, showSearch } = useContext(WebContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((previous) =>
        previous.filter((item) => item !== e.target.value)
      );
    } else {
      setCategory((previous) => [...previous, e.target.value]);
    }
  };
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((previous) =>
        previous.filter((item) => item !== e.target.value)
      );
    } else {
      setSubCategory((previous) => [...previous, e.target.value]);
    }
  };
  const applyFilter = () => {
    let productCopy = [...products]; // Sử dụng mảng thay vì chuỗi

    if (showSearch && search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productCopy = productCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productCopy); // Đảm bảo filterProducts là mảng
  };
  const sortProduct = () => {
    let filteredProductCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(
          filteredProductCopy.sort((a, b) => a.price - b.price)
        );
        break;
      case "high-low":
        setFilterProducts(
          filteredProductCopy.sort((a, b) => b.price - a.price)
        );
        break;
      default:
        applyFilter();
        break;
    }
  };

  // useEffect(() => {
  //   setFilterProducts(products);
  // }, []);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // useEffect(() => {
  //   console.log(category);
  // }, [category]);
  // useEffect(() => {
  //   console.log(subCategory);
  // }, [subCategory]);
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTER
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">LEAGUES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Premier League"}
                onChange={toggleCategory}
              />
              Premier League
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Serie A"}
                onChange={toggleCategory}
              />
              Serie A
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"La Liga"}
                onChange={toggleCategory}
              />
              La Liga
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Bundesliga"}
                onChange={toggleCategory}
              />
              Bundesliga
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Ligue 1"}
                onChange={toggleCategory}
              />
              Ligue 1
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Men"}
                onChange={toggleSubCategory}
              />
              Men
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Women"}
                onChange={toggleSubCategory}
              />
              Women
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Kids"}
                onChange={toggleSubCategory}
              />
              Kids
            </p>
          </div>
        </div>
      </div>
      {/* Right side (Collection) */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* Product sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Map products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              pid={item.pid}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
