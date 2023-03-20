import React, { useEffect, useState } from "react";
import "../styles/recipes.css";

export default function Recipes({startFetch,url}) {
  const [recipes, setRecipes] = useState([]);
  const [macros, setMacros] = useState([]);
  const [fetching, setFetching] = useState(false)

  useEffect(()=>{
    setFetching(true)
  },[startFetch])

  useEffect(() => {
    const notFound = document.querySelector(".notFound");
    notFound.style.opacity = "0";

    if(fetching){
    async function fetchRecipes() {
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data.hits) && data.hits.length === 0) {
        notFound.style.opacity = "1";
      } else {
        notFound.style.opacity = "0";
      }
      setRecipes(
        data.hits.map((recipe) => {
          return recipe.recipe;
        })
      );
    }
    try {
      fetchRecipes();
    } catch (err) {
      console.log(err);
    }
  }
  setFetching(false)

    return () => {};
  }, [fetching, url]);

  useEffect(() => {
    setMacros(
      recipes.map((item) => {
        const proteinvalue = +item.totalNutrients.PROCNT.quantity;
        const fatValue = +item.totalNutrients.FAT.quantity;
        const carbsValue = +item.totalNutrients.CHOCDF.quantity;
        const fiberValue = +item.totalNutrients.FIBTG.quantity;
        const total = proteinvalue + fatValue + carbsValue + fiberValue;
        return {
          protein: ((proteinvalue / total) * 100).toFixed(0),
          fat: ((fatValue / total) * 100).toFixed(0),
          carbs: ((carbsValue / total) * 100).toFixed(0),
          fiber: ((fiberValue / total) * 150).toFixed(0),
        };
      })
    );
  }, [recipes]);

  const recipe = recipes.map((item, index) => {
    const generateId = Math.random().toString(36).substring(2, 15);
    const servingSize = 450;
    return (
      <div key={generateId} className="recipe-card">
        <div className="card-top">
          <div className="img">
            <img src={item.image} alt="recipe" />
          </div>
          <div className="recipe-details">
            <h3 className="recipe-title">{item.label}</h3>
            <h5 className="cuisine-type">
              <span>Cuisine: </span>
              {item.cuisineType[0].charAt(0).toUpperCase() +
                item.cuisineType[0].slice(1)}
            </h5>
            <p className="health-label">
              <span> Health label:</span> {item.healthLabels.join(" • ")}
            </p>
          </div>
        </div>
        <div className="card-bottom">
          <div className="servings-wraper">
            <div className="servings-section">
              <p>1</p>
              <p> serving({servingSize}g)</p>
              <h4>
                {((item.calories / item.totalWeight) * servingSize).toFixed()}
                kcal
              </h4>
            </div>
          </div>
          <div className="macro-container">
            <div className="macro-wraper">
              <p>
                <span className="protein-dot">•</span> PROTEIN
              </p>
              <p className="macro-quantity">
                {(
                  (item.totalNutrients.PROCNT.quantity / item.totalWeight) *
                  servingSize
                ).toFixed()}{" "}
                g
              </p>

              <div
                className="protein-bar"
                style={{ width: `${macros[index]?.protein}%` }}
              >
                {" "}
              </div>
            </div>
            <div className="macro-wraper">
              <p>
                <span className="fat-dot">•</span> FAT
              </p>
              <p className="macro-quantity">
                {(
                  (item.totalNutrients.FAT.quantity / item.totalWeight) *
                  servingSize
                ).toFixed()}{" "}
                g
              </p>
              <div
                className="fat-bar"
                style={{ width: `${macros[index]?.fat}%` }}
              >
                {" "}
              </div>
            </div>
            <div className="macro-wraper">
              <p>
                <span className="carb-dot">•</span> CARB
              </p>
              <p className="macro-quantity ">
                {(
                  (item.totalNutrients.CHOCDF.quantity / item.totalWeight) *
                  servingSize
                ).toFixed()}{" "}
                g
              </p>
              <div
                className="carb-bar"
                style={{ width: `${macros[index]?.carbs}%` }}
              >
                {" "}
              </div>
            </div>
            <div className="macro-wraper">
              <p>
                <span className="fiber-dot">•</span> FIBER
              </p>
              <p className="macro-quantity ">
                {(
                  (item.totalNutrients.FIBTG.quantity / item.totalWeight) *
                  servingSize
                ).toFixed()}{" "}
                g
              </p>
              <div
                className="fiber-bar"
                style={{ width: `${macros[index]?.fiber}%` }}
              >
                {" "}
              </div>
            </div>
          </div>
          <div className="see-recipe">
            <a href={item.url} target="blank">
              See Recipe
            </a>
          </div>
        </div>
      </div>
    );
  });

  return (
    <section className="recipes-container">
      <h1 className="notFound">Recipes Not Found</h1>
      {recipe}
    </section>
  );
}
