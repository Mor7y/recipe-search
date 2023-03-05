import React from "react";
import "../styles/filters.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Options(props) {
  const { isShown } = props;
  const { category } = props;
  const { inputValue } = props;
  const alergies = [
    "Celery-free",
    "Crustacean-free",
    "Egg-free",
    "Fish-free",
    "Gluten-free",
    "Lupine-free",
    "Mustard-free",
    "Peanut-free",
    "Sesame-free",
    "Shellfish-free",
    "Soy-free",
    "Tree-Nut-free",
    "Wheat-free",
  ];
  const diets = [
    "Balanced",
    "High-Fiber",
    "High-Protein",
    "Low-Carb",
    "Low-Fat",
    "Low-Sodium",
  ];

  const cuisine = [
    "American",
    "Asian",
    "British",
    "Caribbean",
    "Central Europe",
    "Chinese",
    "Eastern Europe",
    "French",
    "Indian",
    "Italian",
    "Japanese",
    "Mediterranean",
    "Mexican",
    "Middle Eastern",
    "Nordic",
    "South American",
    "South East Asian",
  ];

  function renderCategory(options, name, props) {
    return options.map((text) => {
      const isPicked = isShown[name][text]
        ? isShown[name][text].isPicked
        : false;

      return (
        <p
          key={text}
          className={isPicked ? "option picked" : "option"}
          onClick={props.handleClick}
        >
          {" "}
          <FontAwesomeIcon
            onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.closest("p").click();
            }}
            className="option-icon"
            icon="fa-solid fa-plus"
          />
          {text}
        </p>
      );
    });
  }

  const alergiesOption = renderCategory(alergies, category, props);
  const dietOption = renderCategory(diets, category, props);
  const cuisineOptions = renderCategory(cuisine, category, props);

  return (
    <div className="options-container">
      {category === "Alergies" && (
        <div className="category-options">{alergiesOption}</div>
      )}
      {category === "Diet" && (
        <div className="category-options">{dietOption}</div>
      )}
      {category === "Cuisine" && (
        <div className="category-options">{cuisineOptions}</div>
      )}
      {category === "Calories" && (
        <div className="category-options">
          <div className="calories-input">
            <input
              onKeyDown={(e) => {
                e.key === "Enter" && props.passCalories();
              }}
              onChange={(e) => {
                props.handleChange(e, "Calories");
              }}
              type="number"
              value={inputValue}
            />
            <FontAwesomeIcon
              onClick={props.passCalories}
              className="calories-icon"
              icon="fa-solid fa-plus"
            />
          </div>
        </div>
      )}
    </div>
  );
}
