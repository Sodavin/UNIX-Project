import { useState, useRef } from "react";
import "./css/FilterBar.css";

import {
  FiFilter,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function FilterBar({ subcategories = [], activeSubcategory = null, activeFilter = "all", sortOption = "Recommend", onSelectSubcategory, onSelectFilter, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const categoryScrollRef = useRef(null);

  const scrollCategoryRow = (direction) => {
    const row = categoryScrollRef.current;
    if (!row) return;
    const scrollAmount = Math.round(row.clientWidth * 0.6);
    row.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "bestsellers", label: "Bestsellers" },
    { id: "discount", label: "Discount" },
    { id: "newarrival", label: "New Arrival" },
    { id: "under10", label: "Under $10" },
  ];

  const defaultSubcategories = [
    "Shirts",
    "T-Shirts",
    "Pants",
    "Hoodies",
    "Suits",
    "Sportwears"
  ];
  const categories = subcategories.length ? subcategories : defaultSubcategories;

  return (
    <div className="filter-wrapper">

      {/* LEFT SIDE */}

      <div className="filter-left">

        <h3>Clothing</h3>

        <div className="filter-type-scroll">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              className={"category-btn filter-option" + (activeFilter === option.id ? " active" : "")}
              type="button"
              onClick={() => onSelectFilter && onSelectFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button className="filter-btn">
          <FiFilter />
          Filter
        </button>

        <button className="arrow-btn" type="button" onClick={() => scrollCategoryRow("left")}> 
          <FiChevronLeft />
        </button>

        <div className="category-scroll" ref={categoryScrollRef}>
          <button
            className={"category-btn" + (activeSubcategory === null ? " active" : "")}
            type="button"
            onClick={() => onSelectSubcategory && onSelectSubcategory(null)}
          >
            All
          </button>
          {categories.map((item, index) => (
            <button
              className={"category-btn" + (activeSubcategory === item ? " active" : "")}
              key={index}
              type="button"
              onClick={() => onSelectSubcategory && onSelectSubcategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="arrow-btn" type="button" onClick={() => scrollCategoryRow("right") }>
          <FiChevronRight />
        </button>

      </div>

      {/* RIGHT SIDE */}

      <div className="filter-right">
        <div className="sort-select" onMouseLeave={() => setIsOpen(false)}>
          <button className="sort-btn" type="button" onClick={() => setIsOpen((open) => !open)}>
            Sort by: {sortOption}
          </button>

          <div className={`sort-dropdown ${isOpen ? "open" : ""}`}>
            {[
              "Recommend",
              "Price high to low",
              "Price low to high"
            ].map((option) => (
              <button
                key={option}
                type="button"
                className={`sort-option${sortOption === option ? " active" : ""}`}
                onClick={() => {
                  if (onSortChange) onSortChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default FilterBar;