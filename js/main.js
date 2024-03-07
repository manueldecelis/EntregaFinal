
const modal = document.getElementById('ventana-modal')

const carrito = document.getElementById('carrito')
const totalCarrito = document.getElementById('total')
const btnCerrar = document.getElementsByClassName('close')[0]
const contenedorCarrito = document.querySelector('.modal-body')
const contenedorProductosCarrito = document.querySelector('.contenedor-carrito')
const vaciarCarrito = document.querySelector('#vaciar-carrito')

const iconMenu = document.getElementById('icon-menu')
const cantidadProductos = document.querySelector('.count-productos')
const finalizarCompra = document.querySelector('#finalizar-compra')

const inputFiltrar = document.querySelector('#input-filtro')
const btnFiltro = document.querySelector('#filtro')

let carritoCompras = [] 

const Toast = Swal.mixin({ 
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    width: 300,
    color: 'whitesmoke',
    timer: 1000,
    timerProgressBar: true,
})

cargarEventos(); 

function cargarEventos(){
    iconMenu.addEventListener('click', showMenu) 

    document.addEventListener('DOMContentLoaded', ()=>{        
        cargarCarritoLocalStorage();
        mostrarProductosCarrito();
    });
    
    
    contenedorProductos.addEventListener('click', agregarProducto); 
    contenedorCarrito.addEventListener('click', eliminarProducto);

    finalizarCompra.addEventListener('click', compraFinalizada);
    vaciarCarrito.addEventListener('click', limpiarCarrito);
    btnFiltro.addEventListener('click', filtrarProductos);

    carrito.onclick = function(){ 
        modal.style.display = 'block';
    };

    btnCerrar.onclick = function(){ 
        ocultarModal();
    };
    
    window.onclick = function(event){ 
        if (event.target == modal){ 
            ocultarModal();
        }
    };

}

function ocultarModal(){ 
    modal.style.display = 'none';
}

function cargarCarritoLocalStorage(){
    carritoCompras = JSON.parse(localStorage.getItem('productosLS')) || []; 
}

function eliminarProducto(e){
    if (e.target.classList.contains('eliminar-producto')){ 
        const productoId = parseInt(e.target.getAttribute('id')); 
        carritoCompras = carritoCompras.filter((producto) => producto.id !== productoId); 
        
        guardarProductosLocalStorage();        
        mostrarProductosCarrito();
    }
}

function agregarProducto(e){ 
    e.preventDefault(); 

    if (e.target.classList.contains('agregar-carrito')){ 
        const productoAgregado = e.target.parentElement; 
        
        leerDatosProducto(productoAgregado);
    }
}

function leerDatosProducto(producto){ 
    let imagen, nombre, precio, id; 
    
    imagen = producto.querySelector('img').src; 
    nombre = producto.querySelector('h4').textContent; 
    precio = Number(producto.querySelector('p').textContent.replace('$','')); 
    id = parseInt(producto.querySelector('a').getAttribute('id')); 

    
    const datosProducto = new Producto(imagen, nombre, precio, id);
    datosProducto.obtenerTotal(); 

    agregarAlCarrito(datosProducto);
}

function agregarAlCarrito(productoAgregar){ 

    const existeEnCarrito = carritoCompras.some((producto) => producto.id === productoAgregar.id); 

    if (existeEnCarrito){ 
        
        const productos = carritoCompras.map((producto) => { 
            if (producto.id === productoAgregar.id){ 
                producto.cantidad++;
                producto.subtotal = producto.precio * producto.cantidad;

                
                return producto;
            }else{
                
                return producto;
            }
        });

        carritoCompras = productos; 
    }else{
        carritoCompras.push(productoAgregar);
    }
    
    guardarProductosLocalStorage();    
    mostrarProductosCarrito();
}

function mostrarProductosCarrito(){ 
    limpiarHTML(); 

    carritoCompras.forEach((producto) => { 
        const { imagen, nombre, precio, cantidad, subtotal, id } = producto; 
        
        const div = document.createElement('div'); 
        div.classList.add('contenedor-producto'); 
        div.innerHTML = `
            <img src="${imagen}" width="100">
            <p><strong>${nombre}</strong></p>
            <p><strong>${precio}</strong></p>
            <p><strong>${cantidad}</strong></p>
            <p><strong>$ ${subtotal}</strong></p>
            <a href="#" class="eliminar-producto" id="${id}"> X </a>
        `; 

        contenedorCarrito.appendChild(div); 
    });

    mostrarCantidadProductos();
    calcularTotal();
}

function mostrarCantidadProductos(){ 
    let contarProductos; 
    
    if (carritoCompras.length > 0){ 
        contenedorProductosCarrito.style.display = 'flex';
        contenedorProductosCarrito.style.alignItems = 'center';
        cantidadProductos.style.display = 'flex';
        contarProductos = carritoCompras.reduce((cantidad, producto) => cantidad + producto.cantidad, 0); 
        cantidadProductos.innerText = `${contarProductos}`;
    }else{ 
        contenedorProductosCarrito.style.display = 'block';
        cantidadProductos.style.display = 'none';
    }
}

function calcularTotal(){ 
    let total = carritoCompras.reduce((sumatotal, producto) => sumatotal + producto.subtotal, 0);
    totalCarrito.innerHTML = `Total a Pagar: $ ${total}`; 
}

function limpiarHTML(){ 
    while (contenedorCarrito.firstChild){ 
        contenedorCarrito.removeChild(contenedorCarrito.firstChild); 
    }
}

function guardarProductosLocalStorage(){
    localStorage.setItem('productosLS', JSON.stringify(carritoCompras));
}

function showMenu(){ 
    let navbar = document.getElementById('barra-navegacion')
    
    if (navbar.className === 'barra-navegacion'){
        navbar.className += ' responsive';
    }else{
        navbar.className = 'barra-navegacion'
    }
}

function compraFinalizada(){
    Swal.fire({
        icon: 'success',
        title: 'Compra Realizada',
        text: 'Compra confirmada con exito!',
        timerProgressBar: true,
        timer: 5000,
    })

    eliminarCarritoLS()
    cargarCarritoLocalStorage()
    mostrarProductosCarrito()
    ocultarModal()
}

function eliminarCarritoLS(){
    localStorage.removeItem('productosLS')
}

function limpiarCarrito(){   

    Swal.fire({
        title: 'Limpiar Carrito',
        text: '¿Confirma que desea vaciar el carrito de compras?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
    }).then((btnResponse) => { 
        if (btnResponse.isConfirmed) {
            Swal.fire({
                title: 'Limpiando carrito...',
                icon: 'success',
                text: 'Su carrito de compras fue vaciado con exito.',
                timerProgressBar: true,
                timer: 5000,
            })
            eliminarCarritoLS()
            cargarCarritoLocalStorage()
            mostrarProductosCarrito()
            ocultarModal()
        }else{
            Swal.fire({
                title: 'Operación Cancelada',
                icon: 'info',
                text: 'La operación de vaciado del carrito fue cancelada.',
                timerProgressBar: true,
                timer: 5000,
            })
        }
    })
}


async function filtrarProductos(){
    const productos = await cargarPeticion(file)
    let productosFiltrados, filtro

    filtro = inputFiltrar.value.toLowerCase()
    
    productosFiltrados = productos.filter((producto) => producto.nombre.toLowerCase().includes(filtro))

    if (productosFiltrados.length > 0){
        limpiarContenedorProductos()
        recorrerArray(productosFiltrados)
    }else{        
        Swal.fire({
            icon: 'error',
            title: 'Filtrando productos',
            text: `No se encontraron productos con el filtro: ${filtro}`,
            timerProgressBar: true,
            timer: 10000,
        })
        limpiarContenedorProductos()
        recorrerArray(productos);        
    }
}

function limpiarContenedorProductos(){
    while(contenedorProductos.firstChild){ 
        contenedorProductos.removeChild(contenedorProductos.firstChild)
    }
}
