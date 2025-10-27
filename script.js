document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('.app-container');
    const screens = document.querySelectorAll('.screen');
    const menuButtons = document.querySelectorAll('.menu-button');
    const backButtons = document.querySelectorAll('.back-button');
    const startAppButton = document.getElementById('start-app-button');

    // --- Efecto de Nieve ---
    const snowContainer = document.getElementById('snow-container');
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snow');
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'; // entre 2 y 5 segundos
        snowflake.style.opacity = Math.random();
        snowflake.style.width = Math.random() * 5 + 2 + 'px'; // entre 2 y 7px
        snowflake.style.height = snowflake.style.width;
        snowContainer.appendChild(snowflake);

        // Eliminar después de que caiga para no saturar el DOM
        snowflake.addEventListener('animationiteration', () => {
            snowflake.remove();
            createSnowflake(); // Crea uno nuevo
        });
    }

    // Crear algunas partículas de nieve inicialmente
    for (let i = 0; i < 50; i++) {
        createSnowflake();
    }
    // Y luego seguir creando algunas más dinámicamente
    setInterval(createSnowflake, 500); // Crea una nueva cada 500ms

    // --- Función para cambiar de pantalla ---
    function showScreen(id) {
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        // Limpiar mensajes y estados al cambiar de pantalla
        document.querySelectorAll('.result-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('error', 'special');
        });
        document.querySelectorAll('.action-button.active').forEach(btn => btn.classList.remove('active'));
    }

    // --- Pantalla de Bienvenida ---
    startAppButton.addEventListener('click', () => {
        showScreen('main-menu');
    });

    // --- Navegación del Menú ---
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreenId = button.dataset.target + '-screen';
            showScreen(targetScreenId);
        });
    });

    // --- Botones de Volver al Menú ---
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen(button.dataset.target);
        });
    });

    // --- Lógica para "Listas" y "Comidas" (similar) ---
    const selections = {}; // Objeto para guardar las selecciones de listas y comidas

    document.querySelectorAll('.option-group .action-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const group = e.target.closest('.option-group');
            const type = e.target.dataset.list || e.target.dataset.meal; // Puede ser 'list' o 'meal'
            const action = e.target.classList.contains('confirm') ? 'confirm' : 'reject';

            // Eliminar 'active' de otros botones en el mismo grupo
            group.querySelectorAll('.action-button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            selections[type] = action;
        });
    });

    // Enviar resultados de Listas
    document.getElementById('send-lists-results').addEventListener('click', () => {
        let confirmations = 0;
        if (selections.manana === 'confirm') confirmations++;
        if (selections.tarde === 'confirm') confirmations++;
        if (selections.noche === 'confirm') confirmations++;

        const resultDisplay = document.getElementById('lists-result');
        resultDisplay.classList.remove('error', 'special'); // Limpiar clases previas

        let message = '';
        if (confirmations === 1) {
            message = "Bien, te debes esforzar para completar las demás listas. Sigue así.";
            resultDisplay.classList.add('error');
        } else if (confirmations === 2) {
            message = "¡Bien hecho! Te estas portando bien, continua así. 😊";
        } else if (confirmations === 3) {
            message = "¡¡EXCELENTE!! Eres una niña muy buena, hoy día lo haz hecho maravilloso. ❤";
            resultDisplay.classList.add('special');
            // Efecto de celebración
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            message = "Aún no has confirmado ninguna lista. ¡Ánimo!";
            resultDisplay.classList.add('error');
        }
        resultDisplay.textContent = message;
    });

    // Enviar resultados de Comidas
    document.getElementById('send-meals-results').addEventListener('click', () => {
        let confirmations = 0;
        if (selections.desayuno === 'confirm') confirmations++;
        if (selections.almuerzo === 'confirm') confirmations++;
        if (selections.cena === 'confirm') confirmations++;

        const resultDisplay = document.getElementById('meals-result');
        resultDisplay.classList.remove('error', 'special'); // Limpiar clases previas

        let message = '';
        if (confirmations === 1) {
            message = "Ow, ¿Cómo es eso posible? Pórtese bien y a la próxima coma mejor. ¡Tu puedes! No olvides tu promesa. 🌹";
            resultDisplay.classList.add('error');
        } else if (confirmations === 2) {
            message = "Bieen, no bajes de 2 comidas. Eres muy valiosa, cuídate e intenta comer más, cabrita.";
        } else if (confirmations === 3) {
            message = "¡MUY BIEEN! Eso si que es cuidarse. Me alegra mucho que te alimentes bien. Continúa y no olvides lo importante que eres 💖";
            resultDisplay.classList.add('special');
            // Efecto de celebración
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.7 },
                colors: ['#ffc107', '#ff85a2', '#a0d2eb']
            });
        } else {
            message = "Aún no has confirmado ninguna comida. ¡Recuerda alimentarte bien!";
            resultDisplay.classList.add('error');
        }
        resultDisplay.textContent = message;
    });

    // --- Lógica para "Quehaceres/Tareas" ---
    const taskYesButton = document.getElementById('task-yes');
    const taskNoButton = document.getElementById('task-no');
    const taskConfirmationDiv = document.getElementById('task-confirmation');
    const taskSureYesButton = document.getElementById('task-sure-yes');
    const taskSureNoButton = document.getElementById('task-sure-no');
    const taskResultDisplay = document.getElementById('task-result');

    taskYesButton.addEventListener('click', () => {
        taskYesButton.classList.add('active');
        taskNoButton.classList.remove('active');
        taskConfirmationDiv.classList.remove('hidden');
        taskResultDisplay.textContent = ''; // Limpiar mensaje anterior
        taskResultDisplay.classList.remove('error', 'special');
    });

    taskNoButton.addEventListener('click', () => {
        taskNoButton.classList.add('active');
        taskYesButton.classList.remove('active');
        taskConfirmationDiv.classList.add('hidden'); // Ocultar segunda pregunta si responde 'No'
        taskSureYesButton.classList.remove('active');
        taskSureNoButton.classList.remove('active');

        taskResultDisplay.textContent = "Hmm, muy mal, a la próxima hágalas. Se que el estrés o flojera a veces gana, pero, hay que ser responsables, tortuguita";
        taskResultDisplay.classList.add('error');
    });

    taskSureYesButton.addEventListener('click', () => {
        taskSureYesButton.classList.add('active');
        taskSureNoButton.classList.remove('active');
        taskResultDisplay.classList.remove('error'); // Quitar posible error previo

        taskResultDisplay.textContent = "Que buena niña y estudiante que eres 💌🌼 Continua así de genial";
        taskResultDisplay.classList.add('special');
        // Efecto de celebración
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.8 },
            colors: ['#ffd700', '#f8d210', '#90ee90']
        });
    });

    taskSureNoButton.addEventListener('click', () => {
        taskSureNoButton.classList.add('active');
        taskSureYesButton.classList.remove('active');
        taskResultDisplay.classList.remove('special');

        taskResultDisplay.textContent = "Hmm, pongase las pilas, así luego podrá divertirse lo que quiera. Fuerzas. 🦾";
        taskResultDisplay.classList.add('error');
    });


    // --- Lógica para "Promesas" ---
    const promiseButtons = document.querySelectorAll('#promesas-screen .action-button.big');
    const promiseResultDisplay = document.getElementById('promise-result');

    promiseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            promiseButtons.forEach(btn => btn.classList.remove('active')); // Desactivar todos
            e.target.classList.add('active'); // Activar el clickeado

            const promiseType = e.target.dataset.promise;
            promiseResultDisplay.classList.remove('error', 'special'); // Limpiar clases previas
            let message = '';

            switch (promiseType) {
                case 'emociones':
                    message = "Bien, cuidar de las emociones es muy importante, pero, no descuides tu salud. Tu eres más importante que nadie en el mundo, mereces la salud mental tanto físico. Continua así y espero lo logres. Yo confío en ti. 🌻";
                    break;
                case 'salud':
                    message = "Maravilloso, tu cuerpo necesita de buenos cuidados para así tener energías para completar las tareas cotidianas y quizá aventuras emocionantes. Sin embargo, tampoco te olvides de tus emociones, después de todo, el primer paso para despertar es estar dispuesta a sentir todas las sorpresas de hoy. Sigue así, se que podrás con todo. 🍀";
                    break;
                case 'ninguno':
                    message = "Ow, esas no son buenas noticias. Debes cuidarte más, cumple tu promesa por mi, por lo que te enseñé, lo que pasamos y quienes te aman hoy en día. Eres fuerte y no olvides que esta bien querer descansar un poco, no lo ignores y luego de descansar un poco, sigue. Se que lo lograrás, ma puce 🌷";
                    promiseResultDisplay.classList.add('error');
                    break;
                case 'todo':
                    message = "¡¡MUY BIEEN, MARIPOSITA!! 🎁🎇 Lo estas haciendo EXCELENTE, quiero que sigas así. Cuidándote podrás logras mucho y aunque a veces te desanimas, recuerda que lo importante no necesariamente es como comienza el día sino como tu lo terminas. El mes tiene 30 días, no todo será malo siempre. Estoy orgulloso de lo que haz logrado, sigue de la misma manera y come bien para tus energías, niña buena. 🎀";
                    promiseResultDisplay.classList.add('special');
                    // Efecto de celebración
                    confetti({
                        particleCount: 200,
                        spread: 120,
                        origin: { y: 0.9 },
                        colors: ['#ff69b4', '#9370db', '#87ceeb']
                    });
                    break;
            }
            promiseResultDisplay.textContent = message;
        });
    });

    // Mostrar la pantalla de bienvenida al cargar
    showScreen('welcome-screen');
});