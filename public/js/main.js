const API_URL = '/api/items'; 

const formulario = document.getElementById('formulario-gimnasio');
const idInput = document.getElementById('inscripcion-id');
const nombreInput = document.getElementById('nombre_cliente');
const planSelect = document.getElementById('plan_gimnasio');
const montoInput = document.getElementById('monto_pago');
const estadoSelect = document.getElementById('estado');
const btnRegistrar = document.getElementById('btn-registrar');
const contenedorTarjetas = document.getElementById('contenedor-tarjetas');

let todasLasInscripciones = [];

async function cargarInscripciones() {
    try {
        const respuesta = await fetch(API_URL);
        todasLasInscripciones = await respuesta.json();
        
        contenedorTarjetas.innerHTML = '';

        if (todasLasInscripciones.length === 0) {
            contenedorTarjetas.innerHTML = '<p>No hay atletas inscritos en este momento.</p>';
            return;
        }

        todasLasInscripciones.forEach(atleta => {
            const claseEstado = atleta.estado === 'Activo' ? 'estado-activo' : 'estado-inactivo';

            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-atleta';
            tarjeta.innerHTML = `
                <div class="tarjeta-info">
                    <h3>${atleta.nombre_cliente}</h3>
                    <p><strong>Plan:</strong> ${atleta.plan_gimnasio}</p>
                    <p><strong>Monto:</strong> $${atleta.monto_pago.toFixed(2)}</p>
                    <p><strong>Fecha:</strong> ${new Date(atleta.fecha_inscripcion).toLocaleDateString()}</p>
                    <span class="badge ${claseEstado}">${atleta.estado}</span>
                </div>
                <div class="tarjeta-acciones">
                    <button class="btn-editar" onclick="prepararEdicion(${atleta.id})">Editar</button>
                    <button class="btn-eliminar" onclick="eliminarInscripcion(${atleta.id})">Eliminar</button>
                </div>
            `;
            contenedorTarjetas.appendChild(tarjeta);
        });
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('No se pudo conectar con el servidor.');
    }
}

formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const datosFormulario = {
        nombre_cliente: nombreInput.value,
        plan_gimnasio: planSelect.value,
        monto_pago: parseFloat(montoInput.value),
        estado: estadoSelect.value
    };

    const id = idInput.value;
    let url = API_URL;
    let metodo = 'POST';  

    if (id) {
        url = `${API_URL}/${id}`;
        metodo = 'PUT';
    }

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosFormulario)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert(resultado.mensaje);
            formulario.reset(); 
            idInput.value = '';
            btnRegistrar.textContent = 'Registrar Entrada/Plan'; 
            cargarInscripciones(); 
        } else {
            
            alert(`Error: ${resultado.error}`);
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        alert('Ocurrió un error en el servidor.');
    }
});


window.prepararEdicion = function(id) {
    
    const atleta = todasLasInscripciones.find(item => item.id === id);
    if (!atleta) return;

    idInput.value = atleta.id;
    nombreInput.value = atleta.nombre_cliente;
    planSelect.value = atleta.plan_gimnasio;
    montoInput.value = atleta.monto_pago;
    estadoSelect.value = atleta.estado;

    btnRegistrar.textContent = 'Actualizar Membresía';
    nombreInput.focus(); 
};

window.eliminarInscripcion = async function(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta inscripción de la base de datos?')) {
        return; 
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert(resultado.mensaje);
            cargarInscripciones(); 
        } else {
            alert(`Error: ${resultado.error}`);
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('No se pudo completar la eliminación.');
    }
};

document.addEventListener('DOMContentLoaded', cargarInscripciones);