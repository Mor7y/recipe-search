import React from "react";

// functions of Main component

export function searchInput(
  e,
  input,
  setSelectedOption,
  setToggleUrlUpd,
  toggleUrlUpd
) {
  const querry = e.target.value;
  
  setSelectedOption((prevOption) => {
    return { ...prevOption, [input]: querry };
  });
  setToggleUrlUpd(!toggleUrlUpd);

 
}

export function toggleOptions(showOptions, setShowOptions) {
  const filterOptions = document.querySelector(".filter-wraper");
  setShowOptions(!showOptions);

  if (showOptions) {
    filterOptions.classList.remove("hide");
    filterOptions.classList.add("show");
  } else {
    filterOptions.classList.add("hide");
  }

}

export function chooseCategory(e, setCategory) {
  const categoryName = e.target.innerText;

  setCategory(categoryName);
}

export function pickOption(e, category, setPickedOption, setSelectedOption) {
  const element = e.target;
  if (element.classList.contains("picked")) return;
  setPickedOption((prevOption) => {
    return [...prevOption, element.innerText];
  });
  setSelectedOption((prevOption) => {
    return {
      ...prevOption,
      [category]: {
        ...prevOption[category],
        [element.innerText]: {
          [element.innerText]: element.innerText,
          isPicked: true,
        },
      },
    };
  });
}

export function clearAllOptions(setSelectedOption, setPickedOption) {
  setSelectedOption((prevState) => {
    return { ...prevState, Alergies: {}, Diet: {}, Cuisine: {} };
  });
  setPickedOption([]);
}

export function clearOption(e, setPickedOption, setSelectedOption) {
  const option = e.target.innerText;
  setPickedOption((prevState) => {
    const updatedState = prevState.filter((item) => item !== option);
    return updatedState;
  });

  setSelectedOption((prevOption) => {
    const state = { ...prevOption };

    let found = false;

    for (let category in state) {
      if (state[category].hasOwnProperty(option)) {
        found = true;
        return {
          ...prevOption,
          [category]: {
            ...prevOption[category],
            [option]: {
              [option]: option,
              isPicked: false,
            },
          },
        };
      }
    }
    if (!found) {
      return { ...prevOption };
    }
  });
}

export function passCalories(setPickedOption, selectedOption) {
  const caloriesOption = `${selectedOption.Calories}kcal`;

  setPickedOption((prevState) => {
    const regeX = /kcal/;
    const newState = [...prevState];

    if (!newState.some((item) => regeX.test(item))) {
      return [...newState, caloriesOption];
    }

    return newState.map((item, index) => {
      if (regeX.test(item)) {
        return ([...prevState][index] = caloriesOption);
      } else {
        return item;
      }
    });
  });
}
