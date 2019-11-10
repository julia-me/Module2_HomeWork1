const pizzasContainer = document.getElementById("pizzaCart");
const infoContainer = document.querySelector(".cart__info");
const goToNextPage = document.querySelector(".cart__next-btn");
const goToMainPage = document.querySelector(".cart__back-btn");
const cartClear = document.querySelector(".cart__clear");
let countInfo = document.querySelector(".cart__total-amount");




//получем массивы из localStorage
let productsArr = JSON.parse(localStorage.getItem("productsArr"))
  ? JSON.parse(localStorage.getItem("productsArr"))
  : [];
let newPizzaList = JSON.parse(localStorage.getItem("newPizzaList"))
  ? JSON.parse(localStorage.getItem("newPizzaList"))
  : [];

// отказ в  переходe на страницу заказа
function notWorkingNextBtn() {
  if (productsArr.length <= 0) {
    goToNextPage.classList.toggle("not-active-btn");
  }
}
notWorkingNextBtn();

// price/ count / discount info for localStorage
const importantInfo = {
  price: 0,
  totalAmount: "",
  discont: false
};

//счетчик на корзине
let countNumber = document.querySelector(".header-basket-count");
function cartCount() {
  let count = 0;
  productsArr.map(product => {
    count += product.count;
  });
  if (count == 0) {
    countNumber.innerText = "";
  } else {
    countNumber.innerText = count;
  }
}
cartCount();

const createPizza = function(pizzaObj) {
  const pizzaElement = document.createElement("div");
  pizzaElement.classList.add("pizza-item-cart");
  pizzaElement.id = pizzaObj.id;

  const h1Element = document.createElement("h1");
  h1Element.classList.add("pizza-item-cart-title");
  h1Element.innerText = ` ${pizzaObj.name}`;
  pizzaElement.append(h1Element);

  const pElement = document.createElement("p");
  pElement.classList.add("pizza-item-cart-price");
  pElement.innerText = pizzaObj.price + "грн.";
  pizzaElement.append(pElement);

  const btnElement = document.createElement("button");
  btnElement.innerText = "удалить";
  btnElement.classList.add("pizza-item-cart-remove");
  btnElement.dataset.id = pizzaObj.id;

  btnElement.onclick = function() {
    const index = productsArr.findIndex(
      pizza => pizza.id == btnElement.dataset.id
    );
    productsArr.splice(index, 1);
    localStorage.setItem("productsArr", JSON.stringify(productsArr));
    renderPizza();
    cartCount();
    if (productsArr.length === 0) {
      goToNextPage.classList.toggle("not-active-btn");
    }
  };

  pizzaElement.append(btnElement);

  const btnRemove = document.createElement("button");
  btnRemove.classList.add("pizza-item-amount-remove");
  btnRemove.onclick = function() {
    const index = productsArr.findIndex(product => product.id === pizzaObj.id);
    productsArr[index].count =
      productsArr[index].count == 0 ? 0 : --productsArr[index].count;
    localStorage.setItem("productsArr", JSON.stringify(productsArr));
    renderPizza();
  };
  pizzaElement.append(btnRemove);

  const totalCountElement = document.createElement("p");
  totalCountElement.classList.add("pizza-item-cart-count");
  totalCountElement.innerText = ` ${pizzaObj.count} шт.`;
  pizzaElement.append(totalCountElement);

  const btnAdd = document.createElement("button");
  btnAdd.classList.add("pizza-item-amount-add");
  btnAdd.onclick = function() {
    const index = productsArr.findIndex(product => product.id === pizzaObj.id);
    productsArr[index].count += 1;
    localStorage.setItem("productsArr", JSON.stringify(productsArr));
    renderPizza();
  };
  pizzaElement.append(btnAdd);

  const totalPriceElement = document.createElement("p");
  totalPriceElement.classList.add("pizza-item-cart-total-price");
  totalPriceElement.innerText = `Итого: ${pizzaObj.price *
    pizzaObj.count} грн.`;
  pizzaElement.append(totalPriceElement);
  pizzasContainer.append(pizzaElement);
};

const renderPizza = () => {
  pizzasContainer.innerHTML = "";
  let modifiedPizzaAr = productsArr.map(product => {
    let pizza = newPizzaList.find(pizza => pizza.id === product.id);
    return { ...pizza, count: product.count };
  });

  let totalCount = 0;
  let totalPrice = 0;

  modifiedPizzaAr.forEach(pizza => {
    totalPrice += pizza.price * pizza.count;
    totalCount += pizza.count;
    createPizza(pizza);
    cartCount();
  });

  infoContainer.innerHTML = ` 
                              <p class="cart__total-amount" data-count="${totalCount}"> Итого выбранно пицц: ${totalCount}  шт.</p>
                              <p class="cart__total-price" data-price="${totalPrice}">Итого к оплате: ${totalPrice} грн.</p>
                              <div class="promo">
                              <input type="text" class="promo-code" id="promoCode" placeholder="введите промокод и получите скидку 15%">
                              <button class="use-promo-code"> использовать промокод </button>
                              </div>
                              `;
  importantInfo.price = +document.querySelector(".cart__total-price").dataset
    .price;
  importantInfo.totalAmount = +document.querySelector(".cart__total-amount")
    .dataset.count;

  const promoText = document.getElementById("promoCode");
  const promoBtn = document.querySelector(".use-promo-code");
  const totalPriceText = document.querySelector(".cart__total-price");

  let discont = 0.85;
  promoBtn.addEventListener("click", () => {
    if (
      (promoText.value.toLowerCase() == "anton" &&
        importantInfo.discont === false) ||
      importantInfo.discont == discont
    ) {
      promoText.readOnly = "readOnly";
      promoBtn.classList.toggle("not-active-btn");
      promoBtn.disabled = true;
      promoBtn.innerText = "промокод верный";

      totalPriceText.innerText = `Итого к оплате: ${Math.ceil(
        totalPrice * discont
      )} грн.`;
      totalPriceText.dataset.price = Math.ceil(totalPrice * discont);

      importantInfo.discont = discont;
      importantInfo.price = Math.ceil(importantInfo.price * discont);
      localStorage.setItem("importantInfo", JSON.stringify(importantInfo));
    } else {
      alert("promocode ne vernyi");
    }
  });
};

renderPizza();

// возврат на главную страницу
goToMainPage.addEventListener("click", function() {
  window.open("index.html", "_self");
});


// на следующую страницу
goToNextPage.addEventListener("click", function() {
  let count = 0;
  productsArr.map(product => {
    count += product.count;
  });
  if (productsArr.length > 0 && count > 0) {
    localStorage.setItem("importantInfo", JSON.stringify(importantInfo));
    window.open("delivery.html", "_self");
  }
});

//очистка страницы
cartClear.addEventListener("click", function() {
  productsArr = [];
  localStorage.setItem("productsArr", JSON.stringify(productsArr));
  renderPizza();
  cartCount();
});
