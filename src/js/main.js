//document.createElement('header');
//document.createElement('main');
//document.createElement('footer');

$(document).ready(function(){
    new mlPushMenu( document.getElementById( 'mp-menu' ), document.getElementById( 'trigger' ) );

    $('input, textarea').placeholder();
    var width = $(window).width();
    if (width <= 736){
        $('.contact, .feedback, .phone, .navFlex, .liMain').remove();
    }
    if (width <= 414){
        $('.textMain .insulation').remove();
        $('.lorem h2').after('<div class="insulation"></div>');
    }
});

function validateSquare(event) {
    var square  = event.value,
        integer = parseInt(square);

    if (square && !integer) {
        alert('Укажите только цифры!');
        event.setCustomValidity('Укажите только цифры!');
        return;
    } else {
        calc();
    }
    event.setCustomValidity("");
}

function calc() {
    var typeInsulation  = document.getElementById("typeInsulation"),
        square          = document.getElementById("square"),
        widthInsulation = document.getElementById("widthInsulation"),
        priceds2        = document.getElementById("priced2"),
        priceds3        = document.getElementById("priced3"),
        totalAmount     = document.getElementById("totalAmount"),
        priceAmount     = 0,
        price2          = 0,
        price3          = 0;

    switch (parseInt(typeInsulation.options[typeInsulation.selectedIndex].value)) {
        case 250:
            price2 = 250;
            price3 = 250;
            break;
        case 50:
            price2 = 50;
            price3 = 150;
            break;
        case 500:
            price2 = 500;
            price3 = 600;
            break;
        case 300:
            price2 = 300;
            price3 = 400;
            break;
        default:
            price2 = 0;
            price3 = 0;
    }

    switch (parseInt(widthInsulation.options[widthInsulation.selectedIndex].value)) {
        case 28:
            price3 *= 1.3;
            break;
        case 32:
            price3 *= 6;
            break;
        case 36:
            price3 *= 3;
            break;
        case 40:
            price3 *= 5;
            break;
        case 44:
            price3 *= 4;
            break;
        default:
            price3 *= 0;
    }

    if (parseInt(square.value)) {
        priceAmount = price3 * parseInt(square.value);
    }

    priceds2.innerHTML = price2;
    priceds3.innerHTML = price3;
    totalAmount.innerHTML = priceAmount;
}
