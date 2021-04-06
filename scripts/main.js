if (document.getElementById("juguetes")) {
    fetchDates()
} else if (document.getElementById("farmacia")) {
    fetchDates()
}else if (document.getElementById("carro")) {
    fetchDates()
}

async function fetchDates() {
    try {
        var respuesta = await fetch("https://apipetshop.herokuapp.com/api/articulos")
        var data = await respuesta.json()

        myProgram(data)
    } catch (error) {

    }
}

var option = {
    animation: true,
    delay: 8000,
}

function notificacion(texto,clase) {

    var toastHtmlElement = document.getElementById("liveToast")
    toastHtmlElement.className = `${clase}`

    toastHtmlElement.innerHTML = ""

    toastHtmlElement.innerHTML += `
    <div class="toast-header">
    <strong class="me-auto">FRANCO PET-SHOP</strong>
    </div>
    <div class="toast-body" style="color: black;">
    <span id="tostada" style="color: white;">${texto}</span>
    </div>
    `
    var toastElement = new bootstrap.Toast(toastHtmlElement,option)

    toastElement.show()
}

var carritoDeCompras = 0

if (localStorage.getItem("cart")) {

    carritoDeCompras = parseInt(localStorage.getItem("cart")) 
}

function calculos(numero) {

    document.getElementById("cart").innerHTML = `Carrito(${numero})`
    document.getElementById("cartDos").innerHTML = `Carrito(${numero})`
    localStorage.setItem("cart", JSON.stringify(numero))
}

calculos(carritoDeCompras) 

function formulario() {
    const cat = document.getElementById("cat")
    const form = document.getElementById("formulario")
    const alerta = document.getElementById("alert")
    const gif = document.getElementById("gif")

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        if (alerta.className == "desaparecer") {

            gif.className = "aparecer"
            cat.className = "desaparecer"
        }

        setTimeout(() => {
            gif.className = "desaparecer"
            alerta.className = "aparecer"
        }, 3500)

        setTimeout(() => {

            document.getElementById("formulario").reset()
            cat.className = "aparecer"
            alerta.className = "desaparecer"

        }, 5000)

    })
}

if (document.getElementById("contacto")) {
    formulario()
}

function myProgram(data) {

    const tienda = document.getElementById("tienda")

    const articulos = data.response

    let repetidos = [...articulos]

    repetidos.forEach((rep) => {
        rep["valor"] = true
        rep["cantidad"] = 0
        rep["contadorInterno"] = 0
    })

    var juguetes = repetidos.filter((juguete) => juguete.tipo == "Juguete")
    var medicamentos = repetidos.filter((medicamento) => medicamento.tipo == "Medicamento")

    if (localStorage.getItem("respuestaApi")) {

        repetidos = JSON.parse(localStorage.getItem("respuestaApi")) 
    }

    var total = 0

    if (localStorage.getItem("total")) {

        total = parseInt(localStorage.getItem("total")) 
    }

    function DibujarArticulos(array, tienda, stock, clase) {

        array.forEach(articulo => {

            var tarjeta = document.createElement("div")
            tarjeta.className = "card"

            tarjeta.innerHTML = `
                <div style="margin-bottom: 1em;">
                <img src="${articulo.imagen}" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                <div style="text-align: center;color: black;margin-bottom: 1em;border-bottom: 1px solid;height: 12vh;">
                <h5 class="card-title p">${articulo.nombre}</h5>
                </div>
                <span class="d-inline-block" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="${articulo.descripcion}">
                <button style="margin-left: 25px" class="btn btn-primary" type="button" disabled>información del producto</button>
                </span>
                </div>
                <div class="list-group list-group-flush">
                <li class="list-group-item precio">Precio: $${articulo.precio}</li>
                <li class="${clase}">${articulo.stock} ${stock}</li>
                </div>
                <div class="card-body">

                <form id="${articulo._id}" class="row gy-2 gx-3 align-items-center" style="padding: 0; margin: 0;">
                    <div class="col-auto">
                    <button onclick="notificacion()" type="submit" class="btn btn-primary">Añadir al carrito</button>
                    </div>
                    <div class="col-4">
                    <label class="visually-hidden" for="autoSizingInput">Name</label>
                    <input id="A${articulo._id}" onlclick="pruebita()" type="number" min="1" max="100" class="form-control input" value="1">
                    </div>
                </form>

                </div>
            `
            tienda.appendChild(tarjeta)

            document.getElementById(articulo._id).addEventListener("submit", function (event) {

                event.preventDefault()

           /*      let formInput = document.getElementById("A" + articulo._id).value

                if (formInput !== 0) {

                    contadorUno = contadorUno + parseFloat(formInput)
                    contador = contador + parseFloat(formInput)
                } */

                /* document.getElementById("cart").innerHTML = `Carrito(${contadorUno})`
                document.getElementById("cartDos").innerHTML = `Carrito(${contadorUno})` */

                let boton = event.target.id

                repetidos.forEach((articulo) => {
                    if (articulo._id === boton) {
                        if (articulo.stock === articulo.contadorInterno) {
                            notificacion(`Upss solo quedan ${articulo.stock} unidades`,"error")
                        }else{
                            articulo.valor = false
                            articulo.cantidad = articulo.cantidad + 1
                            articulo.contadorInterno = articulo.contadorInterno + 1 
                            carritoDeCompras ++
                            total = total + articulo.precio
                            notificacion(`has agregado ${articulo.contadorInterno} elemento/s al carrito`,"default")
                        }  
                    }
                })

                calculos(carritoDeCompras)
                totalCalculos(total)
                dibujarTabla()
                localStorage.setItem("respuestaApi", JSON.stringify(repetidos)) 

            })
            

        })

    }

    var juguetesSinStock = []
    var juguetesConStock = []

    juguetes.map((juguete) => {
        if (juguete.stock > 5) {
            juguetesConStock.push(juguete)
        }
        if (juguete.stock <= 5) {
            juguetesSinStock.push(juguete)
        }
    })

    var medicamentosSinStock = []
    var medicamentosConStock = []

    medicamentos.map((medicamento) => {
        if (medicamento.stock > 5) {
            medicamentosConStock.push(medicamento)
        }
        if (medicamento.stock <= 5) {
            medicamentosSinStock.push(medicamento)
        }
    })

    if (document.getElementById("juguetes")) {
        DibujarArticulos(juguetesSinStock, tienda, "Ultima/s unidades!!!", "group-dos")
        DibujarArticulos(juguetesConStock, tienda, "Unidades", "group")
    } else if (document.getElementById("farmacia")) {
        DibujarArticulos(medicamentosSinStock, tienda, "Ultima/s unidades!!!", "group-dos")
        DibujarArticulos(medicamentosConStock, tienda, "Unidades", "group")
    }

    // Carrito -----------------------------------------------------------------------

    dibujarTabla()

    function dibujarTabla(numero) {
        const tabla = document.getElementById("productos")

        var carroDeCompras = repetidos.filter((elemento) => elemento.valor === false)

        if (carroDeCompras.length === 0) {

            tabla.innerHTML = `<p id="texto" class="art algo">No hay articulos disponibles</p>`
        }else{

            tabla.innerHTML = ""

            carroDeCompras.forEach(articulo => {

                var art = document.createElement("div")
                art.className = "art"

                art.innerHTML =
                `
                <div><img class="imagen-tabla" src="${articulo.imagen}"/></div>
                <p id="P${articulo._id}">$${articulo.precio * articulo.cantidad}</p>
                <p id="X${articulo._id}">x${articulo.cantidad}</p>
                <div>
                <button class ="botonSumaResta" id="S${articulo._id}">+</button>
                <span id=T${articulo._id}>${articulo.cantidad}</span>
                <button class ="botonSumaResta" id="R${articulo._id}">-</button>
                </div>
                <div><button id="${articulo._id}" class="btn-close close" aria-label="Close"></button></div>
                `

                tabla.appendChild(art)

                document.getElementById("S" + articulo._id).addEventListener("click", function (event) {

                    let botonSuma = event.target.id

                    carroDeCompras.forEach((articulo) => {
                        if (("S" + articulo._id) == botonSuma) {  
                            if (articulo.stock === articulo.contadorInterno) {
                                notificacion(`Upss solo quedan ${articulo.stock} unidades`,"error")
                            }else{
                                articulo.cantidad = articulo.cantidad + 1
                                articulo.contadorInterno = articulo.contadorInterno + 1
                                total = total + articulo.precio
                                carritoDeCompras ++

                                document.getElementById("T" + articulo._id).innerHTML = `${articulo.contadorInterno}`  
                                document.getElementById("X" + articulo._id).innerHTML = `x${articulo.contadorInterno}`
                                document.getElementById("P" + articulo._id).innerHTML = `$${articulo.precio * articulo.contadorInterno}`
                            }
                        }
                    })
            
                    totalCalculos(total)
                    calculos(carritoDeCompras)
                    localStorage.setItem("respuestaApi", JSON.stringify(repetidos))
                }) 

                document.getElementById("R" + articulo._id).addEventListener("click", function (event) {
                    
                    let botonResta = event.target.id

                    repetidos.forEach((articulo) => {
                        if (("R" + articulo._id) == botonResta) {    
                            if (articulo.contadorInterno > 1) {
                                articulo.cantidad = articulo.cantidad - 1
                                articulo.contadorInterno = articulo.contadorInterno - 1     
                                total = total - articulo.precio
                                carritoDeCompras --

                                document.getElementById("T" + articulo._id).innerHTML = `${articulo.contadorInterno}`  
                                document.getElementById("X" + articulo._id).innerHTML = `x${articulo.contadorInterno}`
                                document.getElementById("P" + articulo._id).innerHTML = `$${articulo.precio * articulo.contadorInterno}`  
                            }
                        }
                    })

                    totalCalculos(total)
                    calculos(carritoDeCompras)
                    localStorage.setItem("respuestaApi", JSON.stringify(repetidos))
                })

                document.getElementById(articulo._id).addEventListener("click", function (event) {

                    let botonCierre = event.target.id

                    repetidos.forEach((articulo) => {

                        if (articulo._id == botonCierre) {
                            articulo.valor = true    
                            articulo.cantidad = 0
                            carritoDeCompras = carritoDeCompras - articulo.contadorInterno
                            total = total - (articulo.precio * articulo.contadorInterno) 
                            articulo.contadorInterno = 0  
                        }
                    })

                    totalCalculos(total)
                    calculos(carritoDeCompras)
                    dibujarTabla()
                    localStorage.setItem("respuestaApi", JSON.stringify(repetidos))
                })

            })
        }
    }

    function totalCalculos(numero) {  
        document.getElementById("total").innerHTML=`$${numero}`
        localStorage.setItem("total", JSON.stringify(numero))
    }

    totalCalculos(total) 

    //ver mas

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    //search

    var search = document.getElementById("search")

    function filtrarNombres(nombres) {
        let filtrarNombres = articulos.filter((articulo) => articulo.nombre == nombres)
        return filtrarNombres
    }

    search.addEventListener("submit", (event) => {
        event.preventDefault();
        var searchValue = document.getElementById("searchValue").value
        tienda.innerHTML = ""

        if (searchValue) {
            var articulosFiltrados = filtrarNombres(searchValue)

            DibujarArticulos(articulosFiltrados, tienda, "Unidades", "group")
        } else {
            location.reload()
        }
    })
}