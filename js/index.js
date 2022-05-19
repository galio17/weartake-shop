function createProductCard(product, target) {
    const productCard = document.createElement('li')
    const productInfo = document.createElement('section');
    const productButton = document.createElement('button');

    productCard.classList.add('product-card');
    productCard.id = product.id;
    productInfo.classList.add('product-info');
    productButton.classList.add('product-button');

    productCard.appendChild(productInfo);
    target.insertAdjacentElement('beforeend', productCard);

    productInfo.insertAdjacentHTML('beforebegin', `
        <img class="product-image" src="${product.img}" alt="${product.nameItem}">
    `);

    productInfo.insertAdjacentHTML('afterbegin', `
        <h3 class="product-title">${product.nameItem}</h3>
    `);

    if(target.parentNode.id === 'showcase') {
        productButton.classList.add('add-cart-button');
        productButton.innerText = product.addCart;
        
        productInfo.insertAdjacentHTML('afterbegin', `
            <h4 class="product-category">${product.tag.join(' ')}</h4>
        `); 
        productInfo.insertAdjacentHTML('beforeend', `
            <p class="product-description">${product.description}</p>
        `);
    }
    else {
        productButton.classList.add('remove-cart-button');
        productButton.innerText = 'Remover Produto';
    }

    productInfo.insertAdjacentHTML('beforeend', `
        <h5 class="product-price">R$ ${product.value}</h5>
        ${productButton.outerHTML} 
    `);
}

function loadProductList(products, target, html) {
    const productList = document.createElement('ul');

    productList.classList.add('product-list');

    target.innerHTML = '';

    if(products.length) {
        target.appendChild(productList);
        products.forEach(product => {
            createProductCard(product, productList);
        })
    }
    else {
        target.innerHTML = (html) ? html : '';
    }
}

function addProductToCart() {
    const newCartProduct = data.find(product => product.id == event.composedPath()[2].id);
    
    cartProducts.push(newCartProduct);
}

function removeProductToCart() {
    const indexToRemove = cartProducts.findIndex(product => product.id == event.composedPath()[2].id)
    
    cartProducts.splice(indexToRemove, 1);
}

function createCart() {
    let priceTotal = 0;

    cartProducts.forEach(product => priceTotal += product.value);

    loadProductList(cartProducts, cart, `
            <div class="no-products">
                <h2>Carrinho vázio</h2>
                <p>Adicione itens</p>
            </div>
    `);

    if(cartProducts.length) {
        cart.insertAdjacentHTML("beforeend", `
            <table class="cart-info">
                <tbody>
                    <tr class="products-quantity">
                        <th>Quantidade:</th>
                        <td>${cartProducts.length}</td>
                    </tr>
                    <tr class="products-price">
                        <th>Total:</th>
                        <td>R$ ${priceTotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }
}

function filterShowcaseByNavegation() {
    const filterProducts = data.filter(product => product.tag.includes(event.target.innerHTML));
    const filterButton = document.querySelector('.filter-category');
    
    if(filterButton) filterButton.classList.remove('filter-category')
    event.composedPath()[1].classList.add('filter-category');

    if(event.target.id !== 'all') {
            loadProductList(filterProducts, showcase, `
            <div class="no-products">
                <h2>Nenhum produto para a categoria ${event.target.innerHTML.toLowerCase()}</h2>
            </div>
            `);
    }
    else {
        loadProductList(data, showcase);
    }
}

function filterShowcaseBySearch() {
    const searchInput = document.querySelector('.search-input');
        
    if(searchInput.value) {
        const filterNavegationButton = document.querySelector('.filter-category');
        const regEx = new RegExp(searchInput.value, 'i');
        const filterProducts = data.filter(product => regEx.test(product.tag.toString()+product.nameItem));

        loadProductList(filterProducts, showcase, `
        <div class="no-products">
        <h2>Não há produtos para a pesquisa "${searchInput.value}"</h2>
        </div>
        `)
        
        filterNavegationButton.classList.remove('filter-category');
        searchInput.value = '';
    } else {
        const buttonAll = document.getElementById('all').parentElement;
        buttonAll.classList.add('filter-category');
        loadProductList(data, showcase);
    }
}

const cartProducts = [];
const showcase = document.getElementById('showcase');
const cart = document.getElementById('cart');
loadProductList(data, showcase, `
    <div class="no-products">
        <h2>Sem produtos no estoque :(</h2>
    </div>
`);

addEventListener('click', event => {
    function clickedButton(className) {
        return event.target.classList.contains(className);
    }
    
    if(clickedButton('product-button')) {
        if(clickedButton('add-cart-button')) {
            addProductToCart();
        }
        else if(clickedButton('remove-cart-button')) {
            removeProductToCart();
        }

        createCart();
    }
    else if(clickedButton('navegation-button')) {
        filterShowcaseByNavegation()
    }
    else if(clickedButton('search-button')) {
        filterShowcaseBySearch();
    }
});