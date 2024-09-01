const apiKey = '6cc7cd2ac59a2c34c96c40a0';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurrency = fromCurr.value === "VEF" ? "USD" : fromCurr.value;
    const toCurrency = toCurr.value === "VEF" ? "USD" : toCurr.value;

    let URL = `${BASE_URL}/${fromCurrency}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        let data = await response.json();
        let rate = data.conversion_rates[toCurrency];
        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error(error);
        msg.innerText = 'Error fetching exchange rates.';
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    if (countryCode) {
        let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
        let img = element.parentElement.querySelector("img");
        img.src = newSrc;
    } else {
        element.parentElement.querySelector("img").src = "";
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});