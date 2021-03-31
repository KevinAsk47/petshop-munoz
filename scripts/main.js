if (document.getElementById("juguetes")) {
    fetchDates()
} else if (document.getElementById("farmacia")) {
    fetchDates()
}

async function fetchDates() {
    try {
        var respuesta = await fetch("https://apipetshop.herokuapp.com/api/articulos")
        var data = await respuesta.json()

        myProgram(data)
    } catch (error) {
        miProgram([])
    }
}

var option = {
    animation: true,
    delay: 1000,
}

function notificacion() {

    var toastHtmlElement = document.getElementById("liveToast")

    var toastElement = new bootstrap.Toast(toastHtmlElement, option)

    toastElement.show()
}

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

    var juguetes = articulos.filter((juguete) => juguete.tipo == "Juguete")
    var medicamentos = articulos.filter((medicamento) => medicamento.tipo == "Medicamento")

    var contadorUno = 0

    let repetidos = [...articulos]

    repetidos.forEach((rep) => {
        rep["valor"] = true
    })

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
                    <input id="A${articulo._id}" type="number" min="1" max="100" class="form-control input" value="1">
                    </div>
                </form>

                </div>
            `
            tienda.appendChild(tarjeta)

            var contador = 0

            document.getElementById(articulo._id).addEventListener("submit", function (event) {

                event.preventDefault()

                let formInput = document.getElementById("A" + articulo._id).value

                if (formInput !== 0) {

                    contadorUno = contadorUno + parseFloat(formInput)
                    contador = contador + parseFloat(formInput)
                }

                let boton = event.target.id

                /* let filtrarArticulo = repetidos.filter((articulo) => articulo._id == boton) */

                repetidos.forEach((articulo) => {
                    if (articulo._id == boton) {
                        articulo.valor = false
                        return articulo
                    }
                })
                console.log(articulo)

                dibujarTabla(contador)

                document.getElementById("cart").innerHTML = `Carrito(${contadorUno})`

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

    const tabla = document.getElementById("productos")

    var carroDeCompras = repetidos.filter((elemento) => elemento.valor === false)

    function dibujarTabla(numero) {

        if (carroDeCompras.length === 0) {

            tabla.innerHTML = `<p id="texto" class="art algo">No hay articulos disponibles</p>`
        } else {

            carroDeCompras.forEach(articulo => {

                console.log("que pasa acaa")
                var art = document.createElement("tr")
                art.className = "art"

                /* tabla.innerHTML = "" */

                art.innerHTML =
                    `<tr>
                <td><img class="imagen-tabla" src="${articulo.imagen}"/></td>
                <td>${articulo.nombre}</td>
                <td>$${articulo.precio * numero}</td>
                <td>x${numero}</td>
                <td><button id="${articulo._id}" type="button" class="btn-close close" aria-label="Close"></button></td>
            </tr>`

                tabla.appendChild(art)

                var contadorDos = contadorUno

                document.getElementById(articulo._id).addEventListener("click", function (event) {

                    this.parentElement.parentElement.remove()

                    if (contadorDos > 0) {
                        contadorDos = contadorUno - contadorDos

                        document.getElementById("cart").innerHTML = `Carrito(${contadorDos})`
                    }

                })

            })
        }
    }

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