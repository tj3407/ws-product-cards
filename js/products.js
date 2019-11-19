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

function cards(product) {
    var {flags, hero, id, images, links, messages, name, price, reviews, swatches, thumbnail} = product;
    var $col = $("<div>", {"class": "col-xs-4"});
    var $cardDiv = $("<div>", {"class": "card"});
    var $img = $("<img>", {"class": "card-img-top", "src": `${images[0].href}`});
    var $cardBody = $("<div>", {"class": "card-body"});
    var $cardText = $("<p>", {"class": "card-text"});

    $cardText.append(name);
    $cardBody.append($cardText);
    $cardDiv.append($img);
    $cardDiv.append($cardBody);
    $col.append($cardDiv)

    return $col;
}