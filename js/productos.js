const file = '../data/productos-mifarmaciaencasa.json'
const contenedorProductos = document.getElementById('container-productos') 

class Producto { 
    constructor(imagen, nombre, precio, id){
        this.imagen = imagen;
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.cantidad = 1; 
        this.subtotal = 0; 
    }

    obtenerTotal(){ 
        this.subtotal = this.precio * this.cantidad;
    }
}

cargarProductos();

async function cargarProductos(){ 
    const productos = await cargarPeticion(file) 
    recorrerArray(productos)
}

async function cargarPeticion(datos){
    try { 
        const response = await fetch(datos) 
        
        if (!response.ok){
            throw new Error(`Error en la peticion: ${response.status} ${response.statusText}`)
        }

        const data = await response.json() 

        return data;
    } catch (error){
        console.error(error)
    }
}

function recorrerArray(arregloProductos){
    arregloProductos.forEach((producto) => { 
        const divCard = document.createElement('div') 
        divCard.classList.add('card') 
        divCard.innerHTML += `
        <img src="./assets/img/${producto.img}" alt="${producto.nombre}">
        <h4>${producto.nombre}</h4>
        <p><strong>$ ${producto.precio}</strong></p>
        <a id=${producto.id} class="boton agregar-carrito" href="#">Agregar</a>
        `

        contenedorProductos.appendChild(divCard) 
    })
}


