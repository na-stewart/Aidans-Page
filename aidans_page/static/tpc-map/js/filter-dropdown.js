const filterClauses = [];
const filterDropdowns = [];

function getAllAvailableValuesFromKey(key, jsonArr) {
  const uniqueValues = jsonArr.reduce((values, value) => {
    if (value.hasOwnProperty(key)) {
      const keyValue = value[key];
      if (Array.isArray(keyValue)) {
        keyValue.forEach((item) => values.add(item));
      } else {
        values.add(keyValue);
      }
    }
    return values;
  }, new Set());
  return ["All", ...uniqueValues];
}

function createFilters(objArray, includedKeys) {
  var filtersContainer = document.getElementById("filters-container");
  includedKeys.forEach((key) => {
    const availableValues = getAllAvailableValuesFromKey(key, objArray);
    filtersContainer.appendChild(createFilterDropdown(key, availableValues));
  });

  filterDropdowns.forEach((dropdown, index) => {
    dropdown.addEventListener("change", () => {
      const selectedValues = filterDropdowns.map((dropdown) => dropdown.value);
      fillVenuesMap(
        objArray.filter((obj) =>
          selectedValues.every((value, index) => filterClauses[index](obj, value))
        )
      );
    });
  });
}

function createFilterDropdown(key, availableValues) {
  filterClauses.push((obj, selectedValue) => {
    if (Array.isArray(obj[key]))
      return obj[key].includes(selectedValue) || selectedValue == "All";
    else
      return obj[key] == selectedValue || selectedValue == "All";
  });
  const dropDownName = `${key}-dropdown`;
  const span = document.createElement("span");
  span.style.display = "inline-block";
  span.style.marginRight = "5px";
  span.style.marginBottom = "5px";
  const label = document.createElement("label");
  label.setAttribute("for", dropDownName);
  label.textContent = `${key.charAt(0).toUpperCase() + key.toLowerCase().slice(1)}: `
  const select = document.createElement("select");
  select.setAttribute("name", dropDownName);
  select.setAttribute("id", dropDownName);
  availableValues.forEach(value => {
    var option = document.createElement("option");
    option.setAttribute("value", value);
    option.textContent = value;
    select.appendChild(option);
  });
  filterDropdowns.push(select)
  span.appendChild(label);
  span.appendChild(select);
  return span;
}
