import { useState } from "react";
import "./css/FilterBar.css";

import {
  FiFilter,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function FilterBar({ subcategories = [], activeSubcategory = null, sortOption = "Recommend", onSelectSubcategory, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false);

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

        <button className="filter-btn">
          <FiFilter />
          Filter
        </button>

        <button className="arrow-btn">
          <FiChevronLeft />
        </button>

        <div className="category-scroll">
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

        <button className="arrow-btn">
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