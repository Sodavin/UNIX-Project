import "./css/FilterBar.css";

import {
  FiFilter,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

function FilterBar() {

  const categories = [
    "T-Shirts (702)",
    "New In Bottom (599)",
    "Shirts (315)",
    "Smart Casual (254)",
    "Sportlife (252)"
  ];

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

          {categories.map((item, index) => (
            <button
              className="category-btn"
              key={index}
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

        <button className="sort-btn">
          Sort by: Recommend
        </button>

      </div>

    </div>
  );
}

export default FilterBar;