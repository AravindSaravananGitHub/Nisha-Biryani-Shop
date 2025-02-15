const buttons = document.querySelectorAll(".btn-filter");
const boxes = document.querySelectorAll(".items");
const search = document.getElementById("food-search");
const cartLogo = document.querySelector(".cart-logo-box");
const cartSlide = document.querySelector(".cart");
const cartClose = document.getElementById("cart-close");

// Cart open & close
cartLogo.addEventListener("click", () => {
  cartSlide.classList.add("cart-active");
});
cartClose.addEventListener("click", () => {
  cartSlide.classList.remove("cart-active");
});

// Search Food
search.addEventListener("keyup", (e) => {
  const searchText = e.target.value.toLowerCase().trim();
  boxes.forEach((box) => {
    const data = box.dataset.item;
    if (data.includes(searchText)) {
      box.style.display = "flex";
    } else {
      box.style.display = "none";
    }
  });
  buttons.forEach((btn) => {
    btn.classList.remove("filter-active");
  });
  buttons[0].classList.add("filter-active");
});

// Filter button
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    setFilterButton(e);
  });
});

function setFilterButton(e) {
  buttons.forEach((btn) => {
    btn.classList.remove("filter-active");
  });
  e.target.classList.add("filter-active");
  const filterName = e.target.dataset.filter;

  boxes.forEach((box) => {
    const filteredItem = box.dataset.item;
    if (filterName == "all") {
      box.style.display = "flex";
    } else {
      if (filteredItem.includes(filterName)) {
        box.style.display = "flex";
      } else {
        box.style.display = "none";
      }
    }
  });
}

// Add and Remove from cart

let cart = [];
const cartIcon = document.querySelectorAll(".cart-logo");

// Add date to Local Storage
function saveCartToLocalstorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Load data in Local Storage
function loadCartFromLocalstorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  } else {
    console.log("No data stored in localstorage");
  }
}

// Update cart quantity in logo
function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  const totalQuantity = calculateTotalQuantity();
  const orderForm = document.getElementById("order-form");
  cartCountElement.textContent = totalQuantity;

  totalQuantity
    ? (orderForm.style.display = "block")
    : (orderForm.style.display = "none");
}

// add to cart
function addToCart(productId, productName, productPrice, productImage) {
  const existingProduct = cart.find((item) => item.id == productId);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      Name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  }
  renderCart();
  updateCartCount();
  saveCartToLocalstorage();
}

// Remove cart
function removeFromCart(productId) {
  productId = String(productId);
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
  updateCartCount();
  saveCartToLocalstorage();
}

// Update Quantity
function updateQuantity(productId, newQuantity) {
  productId = Number(productId);
  const product = cart.find((item) => Number(item.id) === productId);
  if (product) {
    product.quantity = newQuantity;
    if (product.quantity <= 0) {
      removeFromCart(productId);
    } else {
      renderCart();
      updateCartCount();
      saveCartToLocalstorage();
    }
  }
}

// To calculate total Quantity
function calculateTotalQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// To calculate total Price
function calculateTotalPrice() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Display cart
function renderCart() {
  const cartContainer = document.querySelector(".cart-content");
  cartContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
            <img src="${item.image}" class="cart-img" width="70px">
                <div class="cart-detail">
                  <h2 class="cart-product-title">${item.Name}</h2>
                  <span class="cart-price">₹ : ${item.price}</span>
                  <div class="cart-quantity">
                    <button id="decrement" onclick="updateQuantity(${item.id},${
      item.quantity - 1
    })">-</button>
                    <span class="number">${item.quantity}</span>
                    <button id="increment" onclick="updateQuantity(${item.id},${
      item.quantity + 1
    })">+</button>
                  </div>
                </div>
                <i class="fa-solid fa-trash-can cart-remove" onclick="removeFromCart(${
                  item.id
                })"></i>
        `;
    cartContainer.appendChild(cartBox);
  });

  const TotalCartPriceElement = document.getElementById("totalOrderPrice");
  const totalCartPrice = calculateTotalPrice();
  TotalCartPriceElement.textContent = totalCartPrice;
}

cartIcon.forEach((button) => {
  button.addEventListener("click", () => {
    const productCard = button.closest(".items");
    const productId = productCard.getAttribute("data-id");
    const productName = productCard.querySelector(".item-name").innerHTML;
    const productPrice = productCard
      .querySelector(".item-prize")
      .innerHTML.replace("₹ : ", "");
    const productImage = productCard.querySelector("img").src;

    addToCart(productId, productName, productPrice, productImage);
  });
});

// Send the order message through Email

const orderForm = document.getElementById("order-form");

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const customerName = document.getElementById("customer-name").value;
  const tableNumber = document.getElementById("table-number").value;
  const order = cart.map((product) => ({
    name: product.Name,
    quantity: product.quantity,
  }));

  const customOrderMessage = order
    .map((item) => `${item.name} x ${item.quantity}`)
    .join(", ");

  emailjs
    .send("service_x02djnh", "template_q64i978", {
      message: customOrderMessage,
      name: customerName,
      number: tableNumber,
    })
    .then(
      function (response) {
        alert("Your Order placed Successfully...!");
        orderForm.reset();
        cart = [];
        renderCart();
        updateCartCount();
        saveCartToLocalstorage();
      },
      function (error) {
        alert("Failed to Place Order. Try again!");
        orderForm.reset();
      }
    );
});

loadCartFromLocalstorage();

renderCart();
updateCartCount();
