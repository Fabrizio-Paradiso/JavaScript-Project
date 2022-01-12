/* JavaScript Final Project - Fabrizio Paradiso */

/* DOLLAR API */
const URL_DOLLAR = "https://criptoya.com/api/dolar";

$("#categories").append(
  `<button id="dolarButton" class="btn btn-primary menu__smart-button m-3">Cotización Dolar</button>`
);

$("#dolarButton").click(() => {
  $.get(`${URL_DOLLAR}`, function (res, state) {
    if (state === "success") {
      for (const dollar in res) {
        $("#categories").append(`
        <div class="card col m-3 text-dark text-center">
          <div class="h3">${dollar}</div>
          <div> $${res[dollar]}</div>
          </div>
        `);
      }
    }
  });
});

/* Static JSON Method to get products */

const getJSONproducts = () => {
  let products = [];
  const JSONPATH = "../data/products.json";
  $.ajax({
    type: "GET",
    url: JSONPATH,
    dataType: "json",
    success: function (allData) {
      for (const data of allData) {
        products.push(data);
      }
    },
    async: false,
  });
  return products;
};

let products = getJSONproducts();

/* PAINT CARDS FUNCTIONS */

const cleanCards = () => {
  /* Delete container with ID = Cards */
  $("#cards").html("");

  /* Create that container again, asign its attribute and append to #container-products */
  $("<div></div>", {
    class: "col-md-9 row justify-content-center mx-auto",
    id: "cards",
  }).appendTo($("#container-products"));
};

const paintCards = (products) => {
  cleanCards();
  products.forEach((product) => {
    let element = $("<div>", {
      class: "card shadow card-container scaling-item my-3",
    });
    element.html(`
    <img
      src="${product.pathimg}"
      class="img-responsive"
      alt="${product.brand}"
    />
    <div class="producto card-body my-2 mx-auto text-center mb-2">
      <h5 class="brand">${product.brand}</h5>
      <h6 class="country">${product.country}</h6>
      <h7 class="price">$${product.price}</h7>
      <button href="#" class="btn btn-primary text-center" id="${product.id}">
      Add to cart
      </button>
    </div>
  `);
    $("#cards").append(element);
  });
};

paintCards(products);

/* SEARCH FILTER */

$(document).ready(function () {
  $("#search").keyup(function searchByKeyboard() {
    filterSearch();
  });
});

const filterSearch = () => {
  let filterProducts = products.filter(
    (element) =>
      element.country
        .toLowerCase()
        .includes($("#search").val().toLowerCase()) ||
      element.brand.toLowerCase().includes($("#search").val().toLowerCase())
  );
  paintCards(filterProducts);
};

/* SHOPPING CART */
/* Create empty array and JSON shopping cart*/
let cartArray = [];
let cartJSON = localStorage.cart ? JSON.parse(localStorage.cartJSON) : [];

/* Event for increasing badge and adding product to cart  */
$("#cards").click((e) => {
  increaseCart(e);
});

const addProductToCart = (productID) => {
  let purchasedProduct = products.find((lambda) => lambda.id == productID);
  purchasedProduct.quantity += 1;
  /* Before pushing product into cartArray, it is verified if this product is in the cart already*/
  if (cartArray.filter((e) => e.id === purchasedProduct.id).length == 0) {
    cartArray.push(purchasedProduct);
  }
  refreshShoppingCart();
};

const increaseCart = (e) => {
  if (e.target.classList.contains("btn-primary")) {
    $("#cart_counter").html(parseInt($("#cart_counter").html()) + 1);
    addProductToCart(e.target.id);
  }
};

const updateJSON = () => {
  /* Create a new cartJSON and push all the new products */
  localStorage.clear();
  cartJSON = [];
  cartArray.forEach((product) => {
    cartJSON.push(product);
    localStorage.setItem(product.id, JSON.stringify(product));
  });
};

/* Refresh Shopping Cart Table */
const refreshShoppingCart = () => {
  updateJSON();
  /*  */
  if ($("#shopping__cart").children().length > 0) {
    $("#shopping__cart").empty();
  }
  let totalPrice = 0;
  cartJSON.forEach((product) => {
    totalPrice += product.price * product.quantity;
    var $cartContainer = $("<div></div>", {
      class: "text-white text-center py-3 px-auto row cart-item",
    }).html(`
          <span class="col-2">  
            <img
            src="${product.pathimg}"
            style="width:40px; height:50px;"
            alt="${product.brand}"
            />
          </span>
          <span class="col-2">$${product.price.toFixed(2)}</span>
          <span class="col-2 px-auto">$${(
            product.price * product.quantity
          ).toFixed(2)}</span>
          
          <span class ="col-4">
            <input type="button" id="substrProduct#${
              product.id
            }" class="substrButton mx-2 text-center" value="-">
            <span>${product.quantity}</span>
            <input type="button" id="addProduct#${
              product.id
            }" class="addButton mx-2 text-center" value="+">
          </span>

          <span class="col-2">         
          <input type="button" id="deleteProduct#${
            product.id
          }" class="deleteProduct mx-2" value="X">
          </span>          
          `);
    $("#shopping__cart").append($cartContainer);
  });
  var $totalContainer = $("<div></div>", {
    class: "text-center text-white ",
  }).html(`<h3> TOTAL : $${totalPrice.toFixed(2)}</h3>`);
  $("#shopping__cart").append($totalContainer);
  var $headerContainer = $("<div></div>", {
    class: "text-white text-center py-3 px-auto row",
  }).html(`
    <h4 class="col-2">Producto</h4>
    <h4 class="col-2">Precio</h4>
    <h4 class="col-2">Subtotal</h4>
    <h4 class="col-4">-/+</h4>
    <h4 class="col-2">Eliminar</h4>`);
  $("#shopping__cart").prepend($headerContainer);
  $(document).ready(function () {
    if (totalPrice == 0) {
      $("#shopping__container").hide();
    } else {
      $("#shopping__container").show();
    }
  });
};

/* Clean cartArray, cartJSON and cart counter*/

const cleanCarrito = () => {
  $("#cart_counter").html("0");
  cartArray = [];
  products = getJSONproducts();
  refreshShoppingCart();
};

$("#delete-button").click(cleanCarrito);

/* Add or remove products from shopping cart*/

$("#shopping__cart").click((e) => {
  productShopping(e);
});

const productShopping = (e) => {
  let idArray = e.target.id.split("#");
  let product = products.find((lambda) => lambda.id == idArray[1]);
  if (e.target.classList.contains("addButton")) {
    $("#cart_counter").html(parseInt($("#cart_counter").html()) + 1);
    product.quantity += 1;
  }
  if (e.target.classList.contains("substrButton")) {
    if (product.quantity != 1) {
      $("#cart_counter").html(parseInt($("#cart_counter").html()) - 1);
      product.quantity -= 1;
    }
  }
  if (e.target.classList.contains("deleteProduct")) {
    indexToDelete = cartArray.indexOf(product);
    cartArray.splice(indexToDelete, 1);
    $("#cart_counter").html(
      parseInt($("#cart_counter").html()) - product.quantity
    );
    product.quantity = 0;
  }
  refreshShoppingCart();
};

/* Scroll to bottom shopping cart */
$("#button_cart").click(function () {
  $("html,body").animate(
    {
      scrollTop: $("#shopping__container").offset().top,
    },
    "slow"
  );
});

/* ORDER CARDS */
const orderProducts = (e, prod) => {
  prodFilter = prod;
  if (e.target.id == "MinToMax" || e.target.id == "MaxToMin") {
    prodFilter.sort((a, b) => (a.price > b.price ? 1 : -1));
    if (e.target.id == "MaxToMin") {
      prod.reverse();
    }
  }
  if (e.target.id == "AtoZ" || e.target.id == "ZtoA") {
    prodFilter.sort((a, b) => (a.country > b.country ? 1 : -1));
    if (e.target.id == "ZtoA") {
      prodFilter.reverse();
    }
  }
  if (e.target.id == "bestSellers") {
    prodFilter = getJSONproducts(prodFilter);
  }
  paintCards(prodFilter);
};

$(".dropdown-item").click((e) => orderProducts(e, products));

/* TITLE ANIMATIONS */
let titleDOM = $("<h1>", {
  class:
    "text-center text-white scaling-item banner__products-title my-auto py--2",
  id: "hero-title",
}).html(`Bienvenidos`);

$(".hero-contain").append(titleDOM);

let splitTitle = $("#hero-title").html().split("");
titleDOM.html("");
splitTitle.forEach((letter) => {
  titleDOM.append(`<span class="letterAnimate">${letter}</span>`);
});

let timer = setInterval(animateLetter, 50);
let arraySpanLetters = [];
let char = 0;

$(".letterAnimate").each(function (index, value) {
  arraySpanLetters.push($(this));
});

function animateLetter() {
  arraySpanLetters[char].addClass("fade");
  char++;
  if (char == arraySpanLetters.length) {
    clearInterval(timer);
    timer = null;
    /* Concatenated effects for the beginning */
    $("#hero-title").fadeOut(2000, function () {
      $("#container-products").fadeIn(2000);
      $(".banner__products").fadeIn(2000);
      $(".footer").fadeIn(2000);
    });
  }
}
