var productList = {};

$.getJSON("../metadata/products.json", function(data) {
    productList = data;
    showProducts();
});

function showProducts() {
    $(".row").append(productList.groups.map(item => {
            console.log(item);
            return cards(item);
        })
    )
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

    var imageSlider = renderImageCarousel(images, id);

    var $cardBody = document.createElement("div");
    $cardBody.setAttribute("class", "card-body");

    var $cardText = document.createElement("p");
    $cardText.setAttribute("class", "card-text");

    var productPrice = renderPrice(price);

    $cardText.innerHTML = name;
    $cardText.append(productPrice);
    $cardBody.append($cardText);
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