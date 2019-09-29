const modal = document.getElementById('myModal');
var addPizza = document.getElementsByClassName('add-pizza'); // maybe dont need this
let countNumber = document.querySelector('.header-basket-count')

let productsArr = []
if(localStorage.getItem('productsArr')){
  productsArr = JSON.parse(localStorage.getItem('productsArr'))
}

let newPizzaList = pizzaList
if(localStorage.getItem('newPizzaList')){
  newPizzaList = JSON.parse(localStorage.getItem('newPizzaList'))
}

// отрисовываем пиццу на сайте
const createPizza = function(pizzaObj) {
  pizzaObj.number = 1
  const pizzaElement = document.createElement('div')
  pizzaElement.classList.add('pizza');
  pizzaElement.classList.add('btnModal');
  pizzaElement.id = pizzaObj.id

  //modal window for each pizza
  pizzaElement.onclick = function(){
            let conposition = pizzaObj.composition.join(', ')
            document.getElementById("modalContent").innerHTML = `
            <div class="modal-container">
            <button class="modal-close"> &times; </button>
            <div class="modal-container-img">
            <img src="img/${pizzaObj.img}" alt="" class="modal-img">
            </div>
            <div class="modal-container-text">
            <h2 class="modal-name">${pizzaObj.name}</h2>
            <p class="modal-composition"> Ингридиенты: ${conposition}</p>
            <h3 class="modal-price"> Цена пиццы: ${pizzaObj.price} гривен</h3>
            </div>
            </div> `
  modal.classList.toggle('active')
  modalClose()
  }

  const imgElement = document.createElement('img');
  imgElement.src= `img/${pizzaObj.img}`;
  imgElement.classList.add('pizza-img')
  pizzaElement.append(imgElement);

  const h1Element = document.createElement('h1');
  h1Element.innerText = `Пицца ${pizzaObj.name}`
  h1Element.classList.add('pizza-name')
  pizzaElement.append(h1Element);

  const spanCompElement = document.createElement('span');
  spanCompElement.classList.add('pizza-composition')
  let compositionString = pizzaObj.composition.join(', ')
  let composition = compositionString.replace(compositionString[0], compositionString[0].toUpperCase());
  spanCompElement.innerText = composition
  pizzaElement.appendChild(spanCompElement);

  const pElement = document.createElement('p');
  pElement.classList.add('pizza-price')
  pElement.innerText = pizzaObj.price + '.-'
  pizzaElement.append(pElement);

  const spanElement = document.createElement('span');
  spanElement.classList.add('pizza-caloricity')
  spanElement.innerText = 'Каллорийность: ' + pizzaObj.caloricity + ' cal.'
  pizzaElement.append(spanElement);

  const btnElement = document.createElement('button');
  btnElement.classList.add('add-pizza')
  btnElement.id = pizzaObj.id
  pizzaElement.append(btnElement)

  btnElement.onclick = function(e) {
    e.stopImmediatePropagation()
    const index = productsArr.findIndex(prod => prod.id == pizzaObj.id)
    if(!productsArr.length ||  index == -1){
      productsArr.push({
        id: pizzaObj.id,
        count: 1,
      })
    } else {
      productsArr[index].count += 1;
    }
    localStorage.setItem('productsArr', JSON.stringify(productsArr));
    cartCount()

  }

  pizzasContainer.append(pizzaElement)
}

const renderPizza = arrofPizzas => {
  pizzasContainer.innerHTML ='';
  arrofPizzas.forEach(pizza=> {
    createPizza(pizza)
  })
}
renderPizza(newPizzaList);


// modal window close
const modalClose = function() {
  const closeBtn = document.querySelector('.modal-close')
  closeBtn.addEventListener('click', function(){
    modal.classList.toggle('active')
  })
}


// search by composition and name 

function searchPizza (){
  input.addEventListener('input', function(event) {
      let value = event.target.value.toLowerCase().replace(' ', '')
      const findedPizzas = newPizzaList.filter(pizza => {
       return pizza.name.replace(' ', '').toLowerCase().includes(value) ||
       !!pizza.composition.find(compos => compos.toLowerCase().includes(value)) || 
       pizza.price.toString().includes(value) || pizza.caloricity.toString().includes(value)
      });
      renderPizza(findedPizzas);
      filterPizza(findedPizzas)
  })
}
searchPizza()


// ценовой фильтр 
const select = document.getElementById('select');

const priceUp = function(arr) {
  let upArr =[...arr]
    return upArr.sort((a,b) => {
    if(a.price>b.price) return 1;
    if(a.price<b.price) return -1;
    if(a.price==b.price) return 0;
  })
}

const priceDown = function(arr) {
    let downArr =[...arr]
    return downArr.sort((a,b) => {
    if(a.price>b.price) return -1;
    if(a.price<b.price) return 1;
    if(a.price==b.price) return 0;
  })
}

function filterPizza (arr) {
  select.addEventListener('change', function(event){
    if (event.target.value === 'noSort') {
      renderPizza(arr);
    }
    if (event.target.value === 'up') {
      renderPizza(priceUp(arr));
    }
    if (event.target.value === 'down') {
      renderPizza(priceDown(arr));
    }
  })
}
filterPizza(newPizzaList)


// переход в корзину
const btnBasket = document.querySelector('.header-basket-link');

btnBasket.addEventListener('click' , function(){
  localStorage.setItem('newPizzaList', JSON.stringify(newPizzaList));
  window.open('cart.html', '_self')
})



// sorting by price values
const sortingPriceFilter = document.getElementsByClassName('sorting-price-filter')[0];
let sortingPriceFilterArr = [...newPizzaList]
function sortingPriceFilterFunc(){
  sortingPriceFilter.onclick = function(){
    sortingPriceFilterArr = newPizzaList.filter(pizza => {
      if(pizza.price >= document.getElementById('minPrice').value && pizza.price <= document.getElementById('maxPrice').value){
        return pizza
      }
    })
    sortingCaloricityFilterFunc()
    renderPizza(sortingPriceFilterArr);
    filterPizza(sortingPriceFilterArr);
  }
}
sortingPriceFilterFunc()

// sorting by caloricity value 
const sortingCaloricityFilter = document.getElementsByClassName('sorting-caloricity-filter')[0];

function sortingCaloricityFilterFunc(){
  sortingCaloricityFilter.onclick = function(){
    sortingPriceFilterArr = newPizzaList.filter(pizza => {
      if(pizza.caloricity >= document.getElementById('minCal').value && pizza.caloricity <= document.getElementById('maxCal').value){
        return pizza
      }
    })
    sortingPriceFilterFunc()
    renderPizza(sortingPriceFilterArr);
    filterPizza(sortingPriceFilterArr);
  }
}
sortingCaloricityFilterFunc()


// create  new pizza

//открытие и закрытие поля с чекбоксами
let generatePizzaBtn = document.getElementsByClassName('generate-pizza-btn')[0];
let generatePizzaContent = document.getElementsByClassName('generate-pizza-content')[0];
let closeGeneratePizzaBtn = document.getElementsByClassName('close-generate-pizza-btn')[0];

generatePizzaBtn.onclick = function(){
  generatePizzaContent.style.display = "block";
}
closeGeneratePizzaBtn.onclick = function(){
  generatePizzaContent.style.display = "none";
}


// рисуем поле с чекбоксами
const ingredientList = document.getElementsByClassName('ingredient-list')[0];

const createCheckboxes = function(compositionObj){
  const ingredientListItem = document.createElement('div')
  ingredientListItem.classList.add('ingredient-list-item');

  const labelName = document.createElement('label');
  // labelName.for = `${compositionObj.name}`
  labelName.setAttribute('for', `${compositionObj.id}`)
  labelName.innerText = `${compositionObj.name} `
  ingredientListItem.append(labelName);

  const checkbox= document.createElement('input');
  checkbox.type = 'checkbox'
  checkbox.name = `${compositionObj.name}`
  checkbox.id = `${compositionObj.id}`;
  checkbox.className = `checkbox-pizza`;
  checkbox.dataset.caloricity = `${compositionObj.caloricity}` ;
  checkbox.dataset.price = `${compositionObj.price}`;
  ingredientListItem.append(checkbox);

  const pPrice = document.createElement('p');
  pPrice.innerText = `Цена: ${compositionObj.caloricity}`;
  ingredientListItem.append(pPrice);

  ingredientList.append(ingredientListItem)
}

const renderComposition = arrOfComposition=> {
  ingredientList.innerHTML ='';
  arrOfComposition.forEach(composition=> {
    createCheckboxes(composition)
  })
}
renderComposition(compositionList)


// создаем новую пиццу 
let arrOfCreadedPizzaId = [];
let createdPizzaBtn = document.getElementsByClassName('created-pizza-btn')[0];
let checkboxesBtn = document.getElementsByClassName('checkbox-pizza');
let createdPizzaBtnArr = Array.from(checkboxesBtn);

createdPizzaBtn.onclick = function() {
  createdPizzaBtnArr.forEach(oneCheckboxBtn => {
    if (oneCheckboxBtn.checked != false){
      compositionList.forEach(comp => {
        if(oneCheckboxBtn.id == comp.id){
          arrOfCreadedPizzaId.push(comp.id)
        }
      })
  }
  oneCheckboxBtn.checked = false;
  })
  new Pizza(arrOfCreadedPizzaId)
  renderPizza(newPizzaList);
  arrOfCreadedPizzaId = []
}

// конструктор  новой пиццы  
function Pizza ([...compositionIds]){
  this.id = newPizzaList.length+1
  this.img = 'random.png';
  this.name = `Креативная-${this.id}`;
  // для перебора компонентов
  function getComposition([...compositionIds]){
      let newCompositionArr =[];
      for( let value of compositionList) {
          for (let values of compositionIds) {
              if(value.id == values) {
                  newCompositionArr.push(value.name)
              }
          }
      }
      return newCompositionArr 
  }
  this.composition = getComposition([...compositionIds]);
  // для поиска каллорий по id
  function getCallorycity ([...compositionIds]) {
      let caloricityArr = 0 ;
      for( let value of compositionList){
          for(let values of compositionIds){
              if (value.id == values)
              caloricityArr += +value.caloricity
          }
      }
      return caloricityArr 
  }
  this.caloricity = +getCallorycity([...compositionIds]) + 1000;
  // для поиска цены по id
  function getPrice([...compositionIds]) {
      let priceArr =[];
      for( let value of compositionList){
          for(values of compositionIds){
              if (value.id == values)
              priceArr.push(value.price)
          }
      }
      function getSumm() {
          let sum = 0;
          for ( let value of priceArr){
            sum += value
          } 
         return sum
        }
      return getSumm()
  }
  this.price =  getPrice([...compositionIds]) + 100;
  if(this.composition.length > 0){
    newPizzaList.unshift(this)
  }
  if(this.composition.length == 0){
    alert('Вам следуюет выбрать ингридиенты для пиццы.')
  }
}

//счетчик на корзине

function cartCount(){
  let count = 0;
  productsArr.map(product=> {
    count += product.count;
  })
  if(count == 0){
    countNumber.innerText = '';
  }
  else{
    countNumber.innerText = count;
  }
}
cartCount()

