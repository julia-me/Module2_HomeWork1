const customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
const newPizzaList = JSON.parse(localStorage.getItem("newPizzaList"));
const importantInfo = JSON.parse(localStorage.getItem("importantInfo"));
let productsArr = customerInfo.deliveryInfo.productsArr;
const orderContent = document.querySelector(".contacts");
const pizzasContainer = document.querySelector(".pizzas");
const infoContainer = document.querySelector(".total-info");
const orderMessage = document.querySelector(".order-message");
orderMessage.innerText = `В течении 5 минут наш оператор наберет Вас по номеру  ${customerInfo.phone}, чтобы уточнить заказ`;

orderContent.innerHTML = `                   
        <p> Номер вашего заказа:  <b> ${customerInfo.deliveryInfo.id} </b> </p>
        <p> Имя Фамилия: <b>  ${customerInfo.name} ${customerInfo.surname} </b> </p>
        <p> Номер телефона: <b>  ${customerInfo.phone}</b> </p>
        <p> Эмейл: <b>  ${customerInfo.email} </b> </p>
        <p> Адрес доставки: <b>  ${customerInfo.deliveryInfo.city}, ${customerInfo.deliveryInfo.street}, дом ${customerInfo.deliveryInfo.building},  кв. ${customerInfo.deliveryInfo.apartment} </b>  </p>
        <p> Тип доставки: <b> ${customerInfo.deliveryInfo.typeOfDelivery} </b> </p>`;

const createPizza = function(pizzaObj) {
  const pizzaElement = document.createElement("div");
  pizzaElement.classList.add("chosen-pizza");

  function imgLink() {
    if (pizzaObj.isNew) {
      return pizzaObj.img;
    } else {
      return `img/${pizzaObj.img}`;
    }
  }

  const imgElement = document.createElement("img");
  imgElement.src = imgLink();
  pizzaElement.append(imgElement);

  const h1Element = document.createElement("h1");
  h1Element.innerText = `Пицца: ${pizzaObj.name}`;
  pizzaElement.append(h1Element);

  const pElement = document.createElement("p");
  pElement.innerText = ` Цена: ${pizzaObj.price} грн.`;
  pizzaElement.append(pElement);

  const totalCountElement = document.createElement("p");
  totalCountElement.innerText = `Количество: ${pizzaObj.count} шт.`;
  pizzaElement.append(totalCountElement);

  pizzasContainer.append(pizzaElement);
};

const renderPizza = () => {
  pizzasContainer.innerHTML = "";
  let modifiedPizzaAr = productsArr.map(product => {
    let pizza = newPizzaList.find(pizza => pizza.id === product.id);
    return { ...pizza, count: product.count };
  });

  modifiedPizzaAr.forEach(pizza => {
    if (pizza.count > 0) {
      createPizza(pizza);
    }
  });

  infoContainer.innerHTML = ` 
                                <p class="cart__total-amount"> Итого выбранно пицц: ${
                                  importantInfo.totalAmount
                                }  шт.</p>
                                <p class="cart__total-price">Итого к оплате: ${
                                  importantInfo.price
                                } грн.</p>
                                <p class="cart__total-price"> ${discount()} </p>`;
};

function discount() {
  if (importantInfo.discont === false) {
    return "скидки нет";
  } else {
    return "Скидка: " + Math.floor((1 - importantInfo.discont) * 100) + " %";
  }
}

renderPizza();

const goMainPage = document.getElementById("goMainPage");
goMainPage.addEventListener("click", () => {
  productsArr = [];
  localStorage.setItem("productsArr", JSON.stringify(productsArr));
  window.open("index.html", "_self");
});
