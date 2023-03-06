import React, { useEffect, useState } from "react";
import "../styles/main.css";
import Options from "./Filters";
import Recipes from "./Recipes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  toggleOptions,
  chooseCategory,
  pickOption,
  clearAllOptions,
  clearOption,
  searchInput,
  passCalories,
} from "../utils/myFunctions";

export default function Main() {
  const [showOptions, setShowOptions] = useState(true);
  const [pickedOption, setPickedOption] = useState([]);
  const [category, setCategory] = useState("Alergies");
  const [selectedOption, setSelectedOption] = useState({
    Alergies: {},
    Diet: {},
    Cuisine: {},
    Querry: "",
    Calories: "",
  });
  const [url, setUrl] = useState();
  const [toggleUrlUpd, setToggleUrlUpd] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const app_key = process.env.REACT_APP_API_KEY;
  const app_id = process.env.REACT_APP_APP_ID;

  function handleToggleOptions() {
    toggleOptions(showOptions, setShowOptions);
  }

  function handleChooseCategory(e) {
    chooseCategory(e, setCategory);
  }

  function handleSearchInput(e, input) {
    searchInput(e, input, setSelectedOption, setToggleUrlUpd, toggleUrlUpd);
  }

  function handlePickOption(e) {
    pickOption(e, category, setPickedOption, setSelectedOption);
  }

  function handleClearAllOptions() {
    clearAllOptions(setSelectedOption, setPickedOption);
  }

  function handleClearOption(e) {
    clearOption(e, setPickedOption, setSelectedOption, selectedOption);
  }

  function handlePassCalories() {
    passCalories(setPickedOption, selectedOption);
  }

  useEffect(() => {
    setToggleUrlUpd((toggleUrlUpd) => !toggleUrlUpd);
  }, [pickedOption]);
  useEffect(() => {
    const API = `&app_key=${app_key}`;
    const APP_ID = `&app_id=${app_id}`;

    const alergies = Object.keys(selectedOption.Alergies);
    const diet = Object.keys(selectedOption.Diet);
    const cuisine = Object.keys(selectedOption.Cuisine);

    function setOptions(obj, tag) {
      return obj.length === 0
        ? ""
        : obj
            .map((item) => {
              if (pickedOption.includes(item)) {
                return `&${tag}=${item.toLowerCase()}`;
              } else {
                return "";
              }
            })
            .join("");
    }

    let kcals = null;
    for (let i = 0; i < pickedOption.length; i++) {
      if (pickedOption.length === 0) return;
      if (pickedOption[i].includes("kcal")) {
        kcals = +pickedOption[i].replace("kcal", "");
        break;
      }
    }

    const alergyOptions = setOptions(alergies, "health");
    const dietOptions = setOptions(diet, "diet");
    const cuisineOptions = setOptions(cuisine, "cuisineType");
    const querry = `&q=${selectedOption.Querry}`;
    const calories = kcals !== null ? `&calories=${kcals}` : "";

    const urlOptions = `${querry}${APP_ID}${API}${dietOptions}${alergyOptions}${cuisineOptions}${calories}`;
    setUrl(`https://api.edamam.com/api/recipes/v2?type=public&${urlOptions}`);
  }, [
    toggleUrlUpd,
    app_id,
    app_key,
    pickedOption,
    selectedOption.Alergies,
    selectedOption.Cuisine,
    selectedOption.Diet,
    selectedOption.Querry,
  ]);

  const optionChoosed = !pickedOption
    ? null
    : pickedOption.map((option) => {
        return (
          <p className="picked-option" key={option} onClick={handleClearOption}>
            {option}{" "}
            <FontAwesomeIcon
              onClick={(e) => {
                e.stopPropagation();
                e.currentTarget.closest("p").click();
              }}
              className="picked-option-icon"
              icon="fa-solid fa-plus"
            />
          </p>
        );
      });

  return (
    <main>
      <section className="search-container">
        <h1>Find a Recipe</h1>
        <div className="finder">
          <button
            onClick={() => {
              setTriggerFetch(!triggerFetch);
            }}
            className="search-btn"
          >
            <FontAwesomeIcon
              className="icon"
              onClick={(e) => {
                e.stopPropagation();
                e.currentTarget.closest("button").click();
              }}
              icon="fa-solid fa-magnifying-glass"
            />
          </button>
          <input
            onKeyDown={(e) => {
              e.key === "Enter" && setTriggerFetch(!triggerFetch);
            }}
            onChange={(e) => {
              handleSearchInput(e, "Querry");
            }}
            className="search-input"
            type="search"
            value={selectedOption.Querry}
            placeholder="Search (ex: chicken)"
          ></input>
          <button onClick={handleToggleOptions} className="filters-btn">
            {showOptions ? (
              <FontAwesomeIcon
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.closest("button").click();
                }}
                icon="fa-solid fa-filter"
              />
            ) : (
              <FontAwesomeIcon
                className="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.closest("button").click();
                }}
                icon="fa-solid fa-x"
              />
            )}{" "}
          </button>
        </div>
        <div className="filter-container">
          <div className="filter-wraper">
            <div className="filter-category">
              <div onClick={handleChooseCategory}>Alergies</div>
              <div onClick={handleChooseCategory}>Diet</div>
              <div onClick={handleChooseCategory}>Cuisine</div>
              <div onClick={handleChooseCategory}>Calories</div>
            </div>
            <Options
              handleClick={handlePickOption}
              handleChange={handleSearchInput}
              passCalories={handlePassCalories}
              category={category}
              isShown={selectedOption}
              inputValue={selectedOption.Calories}
            />

            <div className="selected-options"> {optionChoosed}</div>
            <button className="clear-btn" onClick={handleClearAllOptions}>
              Clear All
            </button>
          </div>
        </div>
      </section>
      <section id="recipes">
        <div className="recipies-container">
          <Recipes url={url} startFetch={triggerFetch} />
        </div>
      </section>
    </main>
  );
}
