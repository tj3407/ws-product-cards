var productList = {};
var addedProducts = [];
var storageOption = localStorage.getItem("storageOption") ? (localStorage.getItem("storageOption") === "localStorage" ? localStorage : sessionStorage) : localStorage;

$.getJSON("./metadata/products.json", function(data) {
    productList = data;
    showProducts(productList.groups, productList.name);
});

$(document).ready(function() {
    // Check if storage option is set in localStorage - use localStorage as default to store products added to cart
    var option = localStorage.getItem("storageOption");
    if (!option) {
        localStorage.setItem("storageOption", "localStorage");
    } else {
        document.getElementById(option).setAttribute("checked", true);
    }

    var itemsInStorage = JSON.parse(storageOption.getItem("addedItems"));
    if (itemsInStorage) {
        addedProducts.push(...itemsInStorage)
        setItemsInCart();
    };
})

/**
 * 
 * @param {Array} products 
 * @param {String} category - Optional
 * 
 * Method to render the products from the products Array. Will also show the category name if defined
 */
function showProducts(products, category) {
    if (category) {
        var $category = document.createElement("p");
        $category.innerText = category;
        document.getElementById("products").prepend($category);
    }

    $(".row").html(products.map(item => {
            return cards(item);
        })
    )
    addClickHandlers("buy");
};

/**
 * 
 * @param {Object} product 
 * 
 * Returns a node element of a product card
 */
function cards(product) {
    var {flags, hero, id, images, links, messages, name, price, reviews, swatches, thumbnail} = product;
    var $col = document.createElement("div");
    $col.setAttribute("class", "col-xs-4");

    var $cardDiv = document.createElement("div");
    $cardDiv.setAttribute("class", "card");
    $cardDiv.setAttribute("id", "product-item");

    var imageSlider = renderImageCarousel(images, id);

    var $cardBody = document.createElement("div");
    $cardBody.setAttribute("class", "card-body");

    var $cardText = document.createElement("p");
    $cardText.setAttribute("class", "card-text");

    var productPrice = renderPrice(price);

    var $buyButton = document.createElement("button");
    $buyButton.setAttribute("class", "btn btn-dark btn-sm buy-button");
    $buyButton.setAttribute("type", "button");
    $buyButton.setAttribute("id", `button-${id}`);
    $buyButton.setAttribute("data-toggle", "modal");
    $buyButton.setAttribute("data-target", "#confirmModal");
    $buyButton.innerText = "Buy";

    $cardText.innerHTML = name;
    $cardBody.append($cardText);
    $cardBody.append(productPrice);
    $cardBody.append($buyButton);
    $cardDiv.append(imageSlider);
    $cardDiv.append($cardBody);
    $col.append($cardDiv)

    return $col;
}

/**
 * 
 * @param {Array} images - array of images for a particular product
 * @param {String} id - unique id of a product
 * 
 * Returns a node element for the image portion of product card
 */
function renderImageCarousel(images, id) {
    var $carousel = document.createElement("div");
    $carousel.setAttribute("class", "carousel slide");
    $carousel.setAttribute("id", id);
    $carousel.setAttribute("data-ride", "carousel");

    var $carouselInner = document.createElement("div")
    $carouselInner.setAttribute("class", "carousel-inner");

    var $prev = renderCarouselControl("prev", id);
    var $next = renderCarouselControl("next", id);

    images.map((image, i) => {
        var $carouselItem = document.createElement("div")
        $carouselItem.setAttribute("class", "carousel-item");
        if (i === 0) {
            $carouselItem.setAttribute("class", "carousel-item active");
        }

        var $img = document.createElement("img")
        $img.setAttribute("class", "d-block w-100");
        $img.setAttribute("src", image.href);
        $img.setAttribute("alt", `slide ${i}`);
        $carouselItem.appendChild($img);
        $carouselInner.appendChild($carouselItem);
    })

    $carousel.append($carouselInner);
    $carousel.append($prev);
    $carousel.append($next);

    return $carousel;
}

/**
 * 
 * @param {String} dir - direction of arrow
 * @param {String} id - unique id of a product
 * 
 * Returns a node element of the image carousel arrow
 */
function renderCarouselControl(dir, id) {
    var $control = document.createElement("a");
    $control.setAttribute("class", `carousel-control-${dir}`);
    $control.setAttribute("href", `#${id}`);
    $control.setAttribute("data-slide", dir);
    $control.setAttribute("role", "button");

    var $icon = document.createElement("span")
    $icon.setAttribute("class", `carousel-control-${dir}-icon`);
    $icon.setAttribute("aria-hidden", "true");

    var $sr = document.createElement("span")
    $sr.setAttribute("class", "sr-only");
    
    $control.append($icon);
    $control.append($sr);

    return $control;
}

/**
 * 
 * @param {Object} price 
 * 
 * Return a node element of a product price
 */
function renderPrice(price) {
    var {regular, selling} = price;
    var $price = document.createElement("span");
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    $price.append(formatter.format(regular));
    $price.setAttribute("class", "font-weight-bold d-block price");

    return $price;
}

/**
 * Add event listeners on buy and remove buttons for click
 */
function addClickHandlers(action) {
    var buttons = document.getElementsByClassName(`${action}-button`);
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", (e) => handleClick(e, action))
    }
}

/**
 * 
 * @param {Event} e 
 * 
 * Click handler for buy button
 */
function handleClick(e, action) {
    var id = e.target.id.split("button-")[1];
    var product = productList.groups.find(item => item.id === id);

    switch (action) {
        case "buy":
            addedProducts.push(product.id);
            break;
            
        case "remove":
            var index = addedProducts.indexOf(id);
            addedProducts.splice(index, 1);
            break;
        
        default:
            break;
    }
                
    storageOption.setItem("addedItems", JSON.stringify(addedProducts));
    setItemsInCart();

    if (action === "remove") {
        showCheckoutPage();
    }
}

/**
 * Set the number of items in the Checkout link in header
 */
function setItemsInCart() {
    var itemsInCart = document.querySelector("#checkout-badge");
    var items = JSON.parse(storageOption.getItem("addedItems"));
    itemsInCart.innerText = items && items.length || 0;
}

document.getElementById("checkout").addEventListener("click", function() {
    showCheckoutPage();
})

/**
 * Render the checkout page
 */
function showCheckoutPage() {
    var list = JSON.parse(storageOption.getItem("addedItems")) || [];
    var productsAddedToCart = {};
    list.map(item => {
        if (!item) return;
        if (!productsAddedToCart[item]) {
            productsAddedToCart[item] = 1;
        } else {
            productsAddedToCart[item]++;
        }
    })

    $(".container").html(renderCartItems(list));
    addClickHandlers("remove");
}

/**
 * 
 * @param {Array} products - list of product ids
 * Render the products for the checkout page by mapping through the products Array
 */
function renderCartItems(products) {
    var productItems = products.map(item => productList.groups.find(product => product.id === item));
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    var html = `<div class="row mb-4">
                    <div class="col">
                        <a href="/ws-product-cards"><- Continue Shopping</a>
                    </div>
                </div>
                ${productItems.map(product => {
                    return (
                        `<div class="row checkout-list">
                            <div class="col">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-6 col-md-3">
                                                <img src=${product.thumbnail.href}>
                                            </div>
                                            <div class="col-6 col-md-3 text-left">
                                                <p class="d-inline-flex">${product.name}</p>
                                            </div>
                                            <div class="col-6 col-md-3 text-left">
                                                <p class="d-inline-flex">${formatter.format(product.price.regular)}</p>
                                            </div>
                                            <div class="col-6 col-md-3 text-right">
                                                <button class="btn btn-dark btn-sm remove-button" id="button-${product.id}">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    )
                })}
            `
  return html;
}

/**
 * Add click event listener for radio option to select between localStorage and sessionStorage
 * at the bottom of the Main Products page.
 * 
 * Whenever an option is selected, cart items are cleared from both the application and browser storage
 */
var storageOptions = document.getElementsByTagName("input")
for (let i = 0; i < storageOptions.length; i++) {
    storageOptions[i].addEventListener("click", function(e) {
        switch (e.target.value) {
            case "sessionStorage":
                sessionStorage.setItem("addedItems", localStorage.getItem("addedItems"));
                localStorage.removeItem("addedItems");
                storageOption = sessionStorage;
                break;
        
            default:
                localStorage.setItem("addedItems", sessionStorage.getItem("addedItems"));
                sessionStorage.removeItem("addedItems");
                storageOption = localStorage;
                break;
        }
        localStorage.setItem("storageOption", e.target.value);
        setItemsInCart();
    })
}

/**
 * TODO: Confirm buy modal
 */
function showConfirmAddToCart() {
    var $modal = document.createElement("div");
    var $modalDialog = document.createElement("div");
    var $modalContent = document.createElement("div");
    var $modalHeader = document.createElement("div");
    var $modalBody = document.createElement("div");
    var $modalFooter = document.createElement("div");
    var $modalTitle = document.createElement("h5");
    var $closeButton = document.createElement("button");

    $modal.setAttribute("class", "modal fade");
    $modal.setAttribute("tabindex", "-1");
    $modal.setAttribute("role", "dialog");
    $modal.setAttribute("aria-labelledby", "confirmBuy");
    $modal.setAttribute("aria-hidden", "true");
    $modal.setAttribute("id", "confirmModal");

    $modalDialog.setAttribute("class", "modal-dialog modal-dialog-centered");
    $modalDialog.setAttribute("role", "document");

    $modalContent.setAttribute("class", "modal-content");

    $modalHeader.setAttribute("class", "modal-header");

    $modalBody.setAttribute("class", "modal-body");
    $modalBody.innerText = "Item successfully added to cart."

    $modalFooter.setAttribute("class", "modal-footer");

    $modalTitle.setAttribute("class", "modal-title");
    $modalTitle.innerText = "Thank you!";
    $modalHeader.append($modalTitle);

    $closeButton.setAttribute("class", "btn btn-dark");
    $closeButton.setAttribute("type", "button");
    $closeButton.setAttribute("data-dismiss", "modal");
    $closeButton.innerText = "Close";
    $modalFooter.append($closeButton);

    $modal.append($modalDialog);
    $modal.append($modalContent);
    $modal.append($modalHeader);
    $modal.append($modalBody);
    $modal.append($modalFooter);

    $(".row").append($modal);
}