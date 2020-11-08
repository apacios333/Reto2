// -------- VARIABLES ---------------------------------------------------------------

//array de los productos en la tienda
let objeto_productos = [
    { id: "Batido", precio: 1 },
    { id: "Donut", precio: 2 },
    { id: "Fresa", precio: 3 },
    { id: "Helado", precio: 4 },
    { id: "Leche", precio: 5 },
    { id: "Manzana", precio: 6 },
    { id: "Naranja", precio: 7 },
    { id: "Pan", precio: 8 },
    { id: "Pizza", precio: 9 },
    { id: "Platano", precio: 10 },
    { id: "Snack", precio: 11 },
    { id: "Vino", precio: 12 },
    { id: "Zumo", precio: 13 }
]


//array de los productos comprados (carrito_array elementos únicos; lista_compra elementos con unidades de cada uno)
let carrito_array = [];

let lista_compra = [];


// -------- DRAG & DROP ---------------------------------------------------------------

//Recoger elemento arrastrable//
function dragstart(ev) {
    tienda = ev.target.parentNode; //guardamos el nodo padre del elemento_origen
    ev.dataTransfer.setData("text", ev.target.id); //guardamos datos del elemento
}

//Mientras se arrastra:
function dragover(ev) {
    ev.preventDefault(); //quitar comportamiento por defecto del HTML.
}

//Al soltar el elemento arrastrado en el carrito función de drop
function drop(ev) {
    ev.stopPropagation(); //impedir otras acciones 
    ev.preventDefault(); //quitar comportamiento por defecto del HTML
    let data = ev.dataTransfer.getData("text"); //recogemos datos del elemento
    producto = ev.target.appendChild(document.getElementById(data)); //obtenemos el elemento arrastrado en el carrito drop

    //1. Poner el producto "dropeado" de nuevo en tienda: se añade producto a tienda en la misma posición que estaba, con lo que los hijos de tienda no varían su posición.

    //guardamos posición del producto de "objeto_productos"
    let index = objeto_productos.findIndex(i => i.id === producto.id);

    //último objeto en "objeto_productos" 
    let ultimo = objeto_productos[objeto_productos.length - 1];

    // Si el producto es el ultimo de "objeto_productos" entonces se pone producto al final en tienda. En caso contrario, guardamos el nodo anterior al del producto e insertamos el producto en tienda en su posición.
    if (producto.id == ultimo.id) tienda.appendChild(producto);
    else {
        let node_after_id = objeto_productos[index + 1].id;
        let node_after = document.getElementById(node_after_id);
        tienda.insertBefore(producto, node_after);
    }

    //2. Clonar el producto. El clon se añade a carrito
    copia = producto.cloneNode(true); //creamos una copia del elemento arrastrado.
    copia.setAttribute("draggable", "false"); //impedimos que el nuevo elemento pueda volver a arrastrarse en el carrito
    ev.target.appendChild(copia); //colocamos la copia en el receptor de soltado (carrito)

    //3. Añadir productos al carrito_array
    anadir_elemento_carrito_array();

    //4. Cálculos
    calculo_unidades();
    calculo_sum_total();
}


// -------- FUNCIONES ---------------------------------------------------------------

// Añadir productos al carrito_array
function anadir_elemento_carrito_array() {
    for (let obj_producto of objeto_productos) {
        if (obj_producto.id == producto.id) carrito_array.push(obj_producto);
    }
}

// Unidades compradas y precio-unidades de cada elemento
function calculo_unidades() {

    // Limpiar UlLista para que sobreescriba en cada activación de la función
    let UlLista = document.getElementById("lista");
    UlLista.innerHTML = "";

    // Lista de elementos comprados
    let elemento = {};
    lista_compra = carrito_array.filter(el => elemento[el.id] ? false : elemento[el.id] = true);

    // Unidades de cada elemento y precio de elemento por unidades
    lista_compra.forEach((el_lista) => {
        let unidades = carrito_array.reduce((n, el_carrito) => {
            if (el_carrito.id == el_lista.id) n += 1;
            n;
            return n;
        }, 0)
        precio_u = el_lista.precio * unidades;

        // Añadimos al DOM la lista de elementos comprados 
        let l = document.createElement("li");
        l.innerHTML = el_lista.id + " (" + el_lista.precio + " €) " + " x " + unidades + " unidades" + " = " + precio_u + " € ";
        let boton_borrar_el = document.createElement('button');
        boton_borrar_el.innerText = "Eliminar";
        boton_borrar_el.setAttribute("class", "btn btn-danger m-2");
        boton_borrar_el.setAttribute("id_boton", el_lista.id); //marcamos el botón con el id del elemento correspondiente
        boton_borrar_el.addEventListener("click", borrarelemento);
        l.appendChild(boton_borrar_el);
        UlLista.appendChild(l);
    })
}

// Suma total
function calculo_sum_total() {
    let sum_total = 0;
    sum_total = carrito_array.reduce((acc, el_carrito) => acc + el_carrito.precio, 0);
    let total = document.getElementById("total");
    total.innerHTML = "TOTAL: " + sum_total + " €";
}

// Borrar elemento
function borrarelemento() {

    // Quitamos objeto del carrito_array
    let id_boton_borrar_el = this.getAttribute("id_boton"); //con this hacer referencia al propietario de la función que la está invocando, boton_borrar_el
    let carrito_new = []; // creeamos un "nuevo" carrito con los elementos no eliminados
    for (let elemento of carrito_array) {
        if (id_boton_borrar_el != elemento.id) carrito_new.push(elemento);
        // Quitamos el objeto del div drop
        else {
            let Divcarrito = document.getElementById("carrito");
            for (i = 0; i < Divcarrito.childNodes.length; i++) {
                let elemento_li = Divcarrito.childNodes[i];
                if (id_boton_borrar_el == elemento_li.id) elemento_li.parentNode.removeChild(elemento_li);
            }
        }
    }
    carrito_array = carrito_new;
    //calculamos unidades y total de nuevo
    calculo_unidades();
    calculo_sum_total();
}

// Borrar todo
function borrar() {
    carrito_array = [];
    let Divcarrito = document.getElementById("carrito");
    Divcarrito.innerHTML = "";
    let UlLista = document.getElementById("lista");
    UlLista.innerHTML = "";
    //calculamos unidades y total de nuevo
    calculo_sum_total();
    calculo_unidades();
}