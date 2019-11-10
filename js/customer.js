const deliveryInfo = JSON.parse(localStorage.getItem("deliveryInfo"))
  ? JSON.parse(localStorage.getItem("deliveryInfo"))
  : [];
const customerName = document.getElementById("name");
const customerSurame = document.getElementById("surname");
const customerPhone = document.getElementById("phone");
const customerEmail = document.getElementById("email");
const createOrder = document.getElementById("createOrder");
let customerInfo = {
  deliveryInfo,
  name: "",
  surname: "",
  phone: "",
  email: ""
};

customerName.addEventListener("input", function(e) {
  customerInfo.name = e.target.value;
});

customerSurame.addEventListener("input", function(e) {
  customerInfo.surname = e.target.value;
});

customerPhone.addEventListener("input", function(e) {
  customerInfo.phone = e.target.value;
});

customerEmail.addEventListener("input", function(e) {
  customerInfo.email = e.target.value;
});

createOrder.addEventListener("click", function(e) {
  localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
  window.open("finishedorder.html", "_self");
});
