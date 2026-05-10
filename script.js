/**
 * --- LÓGICA DE NAVEGACIÓN ---
 * Maneja la visibilidad de las secciones del proyecto mediante clases CSS.
 */
document.querySelectorAll('.titulo-proyecto').forEach(titulo => {
    titulo.addEventListener('click', () => {
        const target = titulo.getAttribute('data-target');
        const box = document.getElementById(target);
        const isVisible = !box.classList.contains('oculto');
        
        // Oculta todas las secciones antes de mostrar la seleccionada
        document.querySelectorAll('.proyecto').forEach(p => p.classList.add('oculto'));
        
        // Si la sección no estaba visible, la muestra (efecto toggle)
        if (!isVisible) box.classList.remove('oculto');
    });
});

/**
 * 1. CONTADOR
 * Funcionalidad básica de incremento/decremento con persistencia en LocalStorage.
 */
const dispCont = document.getElementById('display-contador');
let cont = parseInt(localStorage.getItem('cont')) || 0;

const updCont = () => {
    dispCont.textContent = cont;
    // Gestión dinámica de clases según el valor numérico
    dispCont.className = cont > 0 ? 'positivo' : (cont < 0 ? 'negativo' : 'neutro');
    localStorage.setItem('cont', cont);
};

document.getElementById('btn-aumentar').onclick = () => { cont++; updCont(); };
document.getElementById('btn-disminuir').onclick = () => { cont--; updCont(); };
document.getElementById('btn-reset').onclick = () => { cont = 0; updCont(); };
updCont(); // Inicialización de estado

/**
 * 2. LISTA DE TAREAS (ToDo List)
 * Permite agregar, tachar y eliminar tareas usando un array de objetos.
 */
const inTarea = document.getElementById('input-tarea');
const listT = document.getElementById('lista-tareas');
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

const renderT = () => {
    // Genera el HTML dinámicamente. Nota: Se usan funciones globales para los eventos onclick.
    listT.innerHTML = tareas.map((t, i) => `
        <li>
            <span style="${t.c ? 'text-decoration:line-through' : ''}" onclick="togT(${i})">${t.x}</span> 
            <button onclick="delT(${i})">X</button>
        </li>`).join('');
    localStorage.setItem('tareas', JSON.stringify(tareas));
};

document.getElementById('btn-agregar-tarea').onclick = () => { 
    if(inTarea.value.trim()){ 
        tareas.push({x: inTarea.value, c: false}); // x: texto, c: completado
        inTarea.value = ''; 
        renderT(); 
    }
};

// Funciones globales para que el HTML generado pueda acceder a ellas
window.togT = (i) => { tareas[i].c = !tareas[i].c; renderT(); }; // Alternar estado completado
window.delT = (i) => { tareas.splice(i, 1); renderT(); };         // Eliminar tarea por índice
renderT();

/**
 * 3. JUEGO: ADIVINA EL NÚMERO
 * Compara la entrada del usuario con un número aleatorio entre 1 y 100.
 */
let secret = Math.floor(Math.random() * 100) + 1; 
let tryCount = 0; 

document.getElementById('btn-comprobar').onclick = () => {
    const v = parseInt(document.getElementById('input-adivinar').value);
    tryCount++; 
    document.getElementById('intentos-adivinar').textContent = `Intentos: ${tryCount}`;
    
    const p = document.getElementById('pista-adivinar');
    if(v === secret) p.textContent = "¡Correcto!";
    else p.textContent = v < secret ? "Muy bajo" : "Muy alto";
};

document.getElementById('btn-nuevo-juego').onclick = () => { 
    secret = Math.floor(Math.random() * 100) + 1; 
    tryCount = 0; 
    document.getElementById('pista-adivinar').textContent = ""; 
    document.getElementById('intentos-adivinar').textContent = "Intentos: 0";
};

/**
 * 4. CALCULADORA
 * Construye una expresión aritmética como string y la evalúa.
 */
const dispCalc = document.getElementById('display-calculadora'); 
let exp = "";

// Agrega números u operadores a la expresión actual
document.querySelectorAll('.btn-num, .btn-op').forEach(b => {
    b.onclick = () => { 
        exp += b.textContent; 
        dispCalc.textContent = exp; 
    };
});

document.getElementById('btn-igual').onclick = () => { 
    try { 
        // Validación manual básica para evitar división por cero antes de evaluar
        if(exp.includes('/0')) throw 1; 
        exp = eval(exp).toString(); 
        dispCalc.textContent = exp; 
    } catch { 
        dispCalc.textContent = "Error"; 
        exp = ""; 
    }
};

document.getElementById('btn-clear').onclick = () => { exp = ""; dispCalc.textContent = "0"; };

/**
 * 5. GENERADOR DE COLORES
 * Crea un color aleatorio en formato HEX y permite copiarlo al portapapeles.
 */
document.getElementById('btn-generar-color').onclick = () => {
    const c = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    document.body.style.backgroundColor = c;
    document.getElementById('hex-color').textContent = c;
};

document.getElementById('btn-copiar-color').onclick = () => { 
    navigator.clipboard.writeText(document.getElementById('hex-color').textContent); 
};

/**
 * 6. TEMPORIZADOR (Timer)
 * Cuenta regresiva basada en segundos con control de intervalos.
 */
let tInterval; 
let tSegs = 0;
const dispT = document.getElementById('display-timer');

const updT = () => {
    let m = Math.floor(tSegs / 60); 
    let s = tSegs % 60;
    // Formatea a MM:SS asegurando dos dígitos
    dispT.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

document.getElementById('btn-start-timer').onclick = () => {
    if(!tInterval) { // Evita múltiples intervalos si se presiona varias veces
        if(tSegs === 0) {
            tSegs = (parseInt(document.getElementById('min-timer').value) || 0) * 60 + 
                    (parseInt(document.getElementById('sec-timer').value) || 0);
        }
        tInterval = setInterval(() => {
            if(tSegs <= 0) { 
                clearInterval(tInterval); 
                tInterval = null; 
                alert("¡Tiempo terminado!"); 
            } else { 
                tSegs--; 
                updT(); 
            }
        }, 1000);
    }
};

document.getElementById('btn-pause-timer').onclick = () => { clearInterval(tInterval); tInterval = null; };
document.getElementById('btn-reset-timer').onclick = () => { 
    clearInterval(tInterval); 
    tInterval = null; 
    tSegs = 0; 
    updT(); 
};

/**
 * 7. GENERADOR DE CONTRASEÑAS
 * Construye una cadena aleatoria basada en los caracteres seleccionados por el usuario.
 */
document.getElementById('btn-gen-pass').onclick = () => {
    let abc = "abcdefghijklmnopqrstuvwxyz";
    if(document.getElementById('c-mayus').checked) abc += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if(document.getElementById('c-nums').checked) abc += "0123456789";
    if(document.getElementById('c-syms').checked) abc += "!@#$%^&*()";
    
    let p = ""; 
    const l = document.getElementById('input-long').value;
    for(let i = 0; i < l; i++) {
        p += abc.charAt(Math.floor(Math.random() * abc.length));
    }
    document.getElementById('result-pass').textContent = p;
};

// Actualiza el indicador visual de longitud mientras se mueve el slider
document.getElementById('input-long').oninput = (e) => document.getElementById('val-long').textContent = e.target.value;

/**
 * 8. MODO OSCURO
 * Alterna una clase en el body para cambiar estilos CSS y guarda la preferencia.
 */
const togD = document.getElementById('toggle-dark');
if(localStorage.getItem('dark') === '1') document.body.classList.add('dark-mode');

togD.onclick = () => { 
    document.body.classList.toggle('dark-mode'); 
    localStorage.setItem('dark', document.body.classList.contains('dark-mode') ? '1' : '0'); 
};

/**
 * 9. JUEGO PIEDRA, PAPEL O TIJERAS
 * Lógica de comparación de resultados y sistema de puntuación simple.
 */
let uPts = 0, pPts = 0;
document.querySelectorAll('.btn-juego').forEach(b => {
    b.onclick = () => {
        const options = ['piedra', 'papel', 'tijeras'];
        const pc = options[Math.floor(Math.random() * 3)];
        const user = b.dataset.eleccion;
        let res = "";

        if(user === pc) res = "Empate";
        else if((user === 'piedra' && pc === 'tijeras') || 
                (user === 'papel' && pc === 'piedra') || 
                (user === 'tijeras' && pc === 'papel')) { 
            res = "Ganaste"; uPts++; 
        } else { 
            res = "Perdiste"; pPts++; 
        }

        document.getElementById('res-juego').textContent = `PC eligió ${pc}. ${res}`;
        document.getElementById('pts-user').textContent = uPts;
        document.getElementById('pts-pc').textContent = pPts;
    };
});

/**
 * 10. GALERÍA CON FILTROS Y BÚSQUEDA
 * Renderiza imágenes basadas en una categoría o una coincidencia de texto (search).
 */
const imgs = [
    {u:'https://picsum.photos/id/237/200', c:'animales', d:'perro'},
    {u:'https://picsum.photos/id/1012/200', c:'animales', d:'perro'},
    {u:'https://picsum.photos/id/1074/200', c:'animales', d:'leon gato felino'},
    {u:'https://picsum.photos/id/1/200', c:'tec', d:'laptop'},
    {u:'https://picsum.photos/id/2/200', c:'tec', d:'codigo'},
    {u:'https://picsum.photos/id/3/200', c:'tec', d:'teclado tecnologia'},
    {u:'https://picsum.photos/id/10/200', c:'nat', d:'bosque'},
    {u:'https://picsum.photos/id/15/200', c:'nat', d:'cascada'},
    {u:'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.dnvn1z0kVmeXkwt96JBfowHaEJ%3Fpid%3DApi&f=1&ipt=97e229520d5aee17976ab96a5f051ad66bce2e512a36a9a56887129fca449e24&ipo=images', c:'nat', d:'isla oceano naturaleza'},
];

const loadG = (f = 'todas', s = '') => {
    const grid = document.getElementById('grid-gal'); 
    grid.innerHTML = "";
    
    // Filtrado por categoría (f) y por descripción (s)
    imgs.filter(i => (f === 'todas' || i.c === f) && i.d.includes(s.toLowerCase()))
        .forEach(i => {
            const img = document.createElement('img'); 
            img.src = i.u;
            // Al hacer clic, abre la imagen en un modal
            img.onclick = () => { 
                document.getElementById('img-full').src = i.u; 
                document.getElementById('modal-img').classList.remove('oculto'); 
            };
            grid.appendChild(img);
        });
};

// Eventos de filtro por botones de categoría
document.querySelectorAll('.btn-f').forEach(b => b.onclick = () => loadG(b.dataset.f));

// Evento de búsqueda por texto en tiempo real
document.getElementById('busc-gal').oninput = (e) => loadG('todas', e.target.value);

document.getElementById('close-modal').onclick = () => document.getElementById('modal-img').classList.add('oculto');

// Carga inicial de la galería
loadG();