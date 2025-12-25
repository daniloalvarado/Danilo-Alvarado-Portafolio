// FICHAS INTERACTIVAS (SE ACTIVA LACAÍDA CON EL SCROLL)
document.addEventListener("DOMContentLoaded", () => {
    
    // VERIFICACIÓN: Asegurarnos de que Matter.js está cargado
    if (typeof Matter === 'undefined') {
        console.error("Error: Matter.js no está cargado. Asegúrate de incluir el script CDN.");
        return;
    }

    // Datos de las secciones
    const sectionsData = [
        {
            id: 'box-frontend',
            tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind', 'Sass', 
                'Bootstrap', 'GSAP', 'TypeScript', 'Next.js']
        },
        {
            id: 'box-backend',
            tags: ['Node.js', 'Python', 'SQL', 'MongoDB', 'Express', 'API Rest', 
                'NoSQL', 'Django', 'Flask', 'PostgreSQL', 'TypeScript', 'PHP', 'Next.js', 
                'Docker', 'ML XGBoost', 'IA']
        },
        {
            id: 'box-mobile',
            tags: ['React Native', 'Flutter', 'SQLite', 'Dart', 'Expo', 'TypeScript',
                'Hive', 'Sanity']
        },
        {
            id: 'box-desktop',
            tags: ['Electron', 'Python', 'Rust', 'Go']
        }
    ];

    // --- MÓDULOS DE MATTER.JS ---
    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Body = Matter.Body;

    // --- FUNCIÓN PRINCIPAL DE FÍSICA ---
    function initPhysicsSection(containerId, tagsList) {
        const container = document.getElementById(containerId);
        if (!container) return; 

        // 1. Configuración del Motor
        const engine = Engine.create();
        const world = engine.world;
        
        // Ajustamos la velocidad de la simulación para que se sienta más natural
        engine.timing.timeScale = 1; 

        // 2. Dimensiones
        let width = container.offsetWidth;
        let height = container.offsetHeight;

        // 3. PAREDES
        const wallThickness = 100; // Paredes más gruesas para evitar traspasos
        const wallHeight = height * 5; 

        // Creamos el suelo mucho más ancho que el contenedor para evitar huecos al redimensionar
        const ground = Bodies.rectangle(width / 2, height + wallThickness/2, width * 3, wallThickness, { 
            isStatic: true,
            render: { visible: false }
        });
        
        const leftWall = Bodies.rectangle(0 - wallThickness/2, -height, wallThickness, wallHeight, { 
            isStatic: true,
            render: { visible: false }
        });
        
        const rightWall = Bodies.rectangle(width + wallThickness/2, -height, wallThickness, wallHeight, { 
            isStatic: true,
            render: { visible: false }
        });

        Composite.add(world, [ground, leftWall, rightWall]);

        // 4. GENERAR ETIQUETAS
        const domBodies = []; 

        tagsList.forEach((tagName, index) => {
            const tagEl = document.createElement('div');
            tagEl.classList.add('physics-tag');
            tagEl.textContent = tagName;
            container.appendChild(tagEl);

            // OPTIMIZACIÓN: Leemos las dimensiones UNA VEZ y las guardamos
            // Esto evita leer el DOM en cada frame de animación (Layout Thrashing)
            const w = tagEl.offsetWidth;
            const h = tagEl.offsetHeight;

            const startX = Math.random() * (width - 100) + 50; 
            const startY = -(index * 100) - 100; // Espaciado vertical

            const body = Bodies.rectangle(startX, startY, w, h, {
                chamfer: { radius: h / 2 }, // Radio dinámico basado en altura
                restitution: 0.6,
                friction: 0.005,
                density: 0.04,
                frictionAir: 0.02, // Resistencia al aire para caída más suave
                angle: (Math.random() - 0.5) * 0.5
            });

            Composite.add(world, body);
            
            // Guardamos referencia incluyendo el ancho/alto para no releerlo del DOM
            domBodies.push({ body, element: tagEl, w, h });
        });

        // 5. CONTROL DEL MOUSE
        const mouse = Mouse.create(container);
        
        // Desactivar la captura de scroll del mouse de Matter
        // Esto soluciona la funcionalidad, aunque el warning de consola persista (es normal en Matter)
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
        
        // IMPORTANTE: Liberar eventos touch para permitir scroll en móvil fuera de los objetos
        // (El CSS touch-action: none en el contenedor maneja la prevención dentro)

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(world, mouseConstraint);

        // 6. ARRANCAR
        // Usamos un Runner fijo para mejor estabilidad
        const runner = Runner.create();
        Runner.run(runner, engine);

        // 7. BUCLE VISUAL OPTIMIZADO
        function update() {
            // Usamos un bucle for normal que es ligeramente más rápido que forEach en animación
            for (let i = 0; i < domBodies.length; i++) {
                const pair = domBodies[i];
                const { x, y } = pair.body.position;
                const angle = pair.body.angle;

                // Red de seguridad: si cae muy abajo, respawn
                if (y > height + 200) {
                    Body.setPosition(pair.body, { 
                        x: Math.random() * (width - 100) + 50, 
                        y: -200 
                    });
                    Body.setVelocity(pair.body, { x: 0, y: 0 });
                }

                // Transformación CSS usando las dimensiones cacheadas (pair.w y pair.h)
                // Usamos translate3d para activar aceleración por hardware (GPU)
                pair.element.style.transform = `translate3d(${x - pair.w/2}px, ${y - pair.h/2}px, 0) rotate(${angle}rad)`;
            }
            requestAnimationFrame(update);
        }
        update();

        // 8. RESPONSIVE
        window.addEventListener('resize', () => {
            width = container.offsetWidth;
            height = container.offsetHeight;

            // Reposicionar paredes
            Body.setPosition(ground, { x: width / 2, y: height + wallThickness/2 });
            Body.setPosition(rightWall, { x: width + wallThickness/2, y: -height });
            
            // Nota: No redimensionamos ground/walls físicamente porque los hicimos muy anchos al inicio.
        });
    }

    // --- INICIALIZACIÓN ---
    // Usamos IntersectionObserver para iniciar la física solo cuando la sección sea visible
    // Esto ahorra batería y CPU si el usuario no ha bajado hasta esta sección.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Iniciar solo una vez
                sectionsData.forEach(section => {
                    // Verificamos si ya tiene hijos para no duplicar
                    const container = document.getElementById(section.id);
                    if(container && container.childElementCount === 0) {
                        initPhysicsSection(section.id, section.tags);
                    }
                });
                observer.disconnect(); // Dejar de observar una vez iniciado
            }
        });
    }, { threshold: 0.1 });

    const sectionRef = document.querySelector('.skills-section');
    if (sectionRef) {
        observer.observe(sectionRef);
    } else {
        // Fallback si no encuentra la sección padre
        sectionsData.forEach(section => {
            initPhysicsSection(section.id, section.tags);
        });
    }
});
// FINAL PARA LAS FICHAS INTERACTIVAS