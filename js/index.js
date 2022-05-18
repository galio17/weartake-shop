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
            const newCartProduct = data.find(product => product.id == event.composedPath()[2].id);
    
            cartProducts.push(newCartProduct);
    
        }
        else if(clickedButton('remove-cart-button')) {
            const indexToRemove = cartProducts.findIndex(product => product.id == event.composedPath()[2].id)
    
            cartProducts.splice(indexToRemove, 1);
        }

        loadProductList(cartProducts, cart, `
            <div class="no-products">
                <h2>Carrinho vázio</h2>
                <p>Adicione itens</p>
            </div>
        `);

        let priceTotal = 0;
        cartProducts.forEach(product => priceTotal += product.value);

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
    else if(clickedButton('navegation-button')) {
        const filterProducts = data.filter(product => product.tag.includes(event.target.innerHTML));
        const navegationButtons = document.querySelectorAll('.navegation-button');
        
        navegationButtons.forEach(button => {
            button.parentElement.classList.remove('filter-category');
        });
        
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
    else if(clickedButton('search-button')) {
        const searchInput = document.querySelector('.search-input');
        
        if(searchInput.value) {
            const regEx = new RegExp(searchInput.value, 'i');
            const filterProducts = data.filter(product => regEx.test(product.tag.toString()+product.nameItem));

            loadProductList(filterProducts, showcase, `
            <div class="no-products">
            <h2>Não há produtos para a pesquisa "${searchInput.value}"</h2>
            </div>
            `)
            
            searchInput.value = '';
        } else {
            loadProductList(data, showcase);
        }
    }
});