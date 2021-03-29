if (document.getElementById("Juguetes") || document.getElementById("farmacia")) {
    fetchDates()
}else{
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
    animation : true,
    delay : 1000,
}

function notificacion() { 

    var toastHtmlElement = document.getElementById("liveToast")

    var toastElement = new bootstrap.Toast(toastHtmlElement , option)

    toastElement.show()

    /* document.getElementById("texto-producto").innerHTML = ""  */
}


function myProgram(data) {

    function formulario() {
        const cat = document.getElementById("cat")
        const form = document.getElementById("formulario")
        const alerta = document.getElementById("alert")

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (alerta.className == "desaparecer") {
                alerta.className = "aparecer" 
                cat.className = "desaparecer"  
            }

            setTimeout(() => {
                alerta.className = "desaparecer"
                cat.className = "aparecer"
            },5000)
        }) 
    } 

    if (document.getElementById("contacto")) {
        formulario()
    }

    const tienda = document.getElementById("tienda")

    const articulos = data.response

    var juguetes = articulos.filter((juguete) => juguete.tipo == "Juguete" )
    var medicamentos = articulos.filter((medicamento) => medicamento.tipo == "Medicamento" )

    function DibujarArticulos(array,tienda,stock,clase) {
        array.forEach(articulo => {

            var tarjeta = document.createElement("div")
            tarjeta.className = "card"

            tarjeta.innerHTML =`
                <div style="margin-bottom: 1em;">
                <img style="" src="${articulo.imagen}" class="card-img-top" alt="...">
                </div>
                <div class="card-body">
                <div style="text-align: center;color: black;margin-bottom: 1em;border-bottom: 1px solid;height: 12vh;">
                <h5 class="card-title p">${articulo.nombre}</h5>
                </div>
                <div style="text-align: center;height: 50vh;">
                <p class="card-text">${articulo.descripcion}</p>
                </div>
                </div>
                <ul class="list-group list-group-flush">
                <li class="list-group-item">${articulo.tipo}</li>
                <li class="list-group-item precio">Precio: $${articulo.precio}</li>
                <li class="${clase}">${articulo.stock} ${stock}</li>
                </ul>
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
                    
                    document.getElementById("cart").innerHTML = `Carrito(${contadorUno})`
            
                } 

                let boton = event.target.id

                let filtrarArticulo = articulos.filter((articulo) => articulo._id == boton)

                dibujarTabla(filtrarArticulo,contador)

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
        DibujarArticulos(juguetesSinStock ,tienda,"Ultimas unidades!!!","group-dos")
        DibujarArticulos(juguetesConStock,tienda,"Stock","group")
    }else if (document.getElementById("farmacia")) {
        DibujarArticulos(medicamentosSinStock ,tienda,"Ultimas unidades!!!","group-dos")
        DibujarArticulos(medicamentosConStock,tienda,"Stock","group")
    } 

    // Carrito -----------------------------------------------------------------------

    const tabla = document.getElementById("productos")

    function dibujarTabla(array,numero) {


        array.forEach(articulo => {
            var art= document.createElement("tr")
            art.className = "art"
            
            art.innerHTML =
            `<tr>
                <td><img class="imagen-tabla" src="${articulo.imagen}"/></td>
                <td>${articulo.nombre}</td>
                <td>$${articulo.precio  * numero}</td>
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

    var contadorUno = 0

    //notificacion

 /*    function prueba(params) {

        if (contadorUno === 0) {

            document.getElementById("texto-producto").innerHTML = `<p id="texto" class="art">No hay articulos</p>`
            

        }

    } */

}