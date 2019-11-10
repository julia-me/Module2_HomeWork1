const productsArr = JSON.parse(localStorage.getItem("productsArr"))
  ? JSON.parse(localStorage.getItem("productsArr"))
  : [];
const importantInfo = JSON.parse(localStorage.getItem("importantInfo"))
  ? JSON.parse(localStorage.getItem("importantInfo"))
  : [];
const deliverySelect = document.getElementById("deliverySelect");
const deliveryCity = document.getElementById("city");
const deliveryStreet = document.getElementById("street");
const deliveryBuilding = document.getElementById("building");
const deliveryApartment = document.getElementById("apartment");
const orderReady = document.getElementById("orderReady");
let deliveryInfo = {
  productsArr,
  id: new Date().getTime() * Math.ceil(Math.random() * 10),
  typeOfDelivery: "Новая почта",
  city: "",
  street: "",
  building: "",
  apartment: ""
};

deliverySelect.addEventListener("change", e => {
  deliveryInfo.typeOfDelivery = e.target.value;
});

deliveryCity.addEventListener("input", e => {
  deliveryInfo.city = e.target.value;
});

deliveryStreet.addEventListener("input", e => {
  deliveryInfo.street = e.target.value;
});

deliveryBuilding.addEventListener("input", e => {
  deliveryInfo.building = e.target.value;
});

deliveryApartment.addEventListener("input", e => {
  deliveryInfo.apartment = e.target.value;
});

orderReady.addEventListener("click", () => {
  localStorage.setItem("deliveryInfo", JSON.stringify(deliveryInfo));
  window.open("customer.html", "_self");
});
