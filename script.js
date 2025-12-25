// CURSOR
window.addEventListener("mousemove", (e) => {
    gsap.to(".cursor", { x: e.clientX, y: e.clientY });
    gsap.to(".cursor-follow", {
        x: e.clientX, y: e.clientY,
        duration: 1.5, ease: "power3.out"
    });
})
// END CURSOR

/* TEXT ANIMATION (CUANDO SE REFRESCA LA PÁGINA) */
document.documentElement.style.setProperty('--animate-duration', '2s');
/* END TEXT ANIMATION (CUANDO SE REFRESCA LA PÁGINA) */

// REEMPLAZANDO EL scroll-behavior: smooth;
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
            history.pushState(null, null, targetId);
        }
    });
});
// FIN REEMPLAZANDO EL scroll-behavior: smooth; 

/* PREOLOADER LINE ANIMATION */
const preloader = document.querySelector("[data-preloader]");

window.addEventListener("DOMContentLoaded", function () {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});
/* END PREOLOADER LINE ANIMATION */

// Fondo negro cuando salga un 20% del home section y que al refresar se mantenga negro
function verificarScroll() {
    const triggerPoint = homeSection.offsetTop + homeSection.offsetHeight * 0.2;
    if (window.scrollY > triggerPoint - header.offsetHeight) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('load', verificarScroll);
window.addEventListener('scroll', verificarScroll);
// Final Fondo negro cuando salga un 20% del home section y que al refresar se mantenga negro

// BUTTON MENU RESPONSIVE 
// Get necessary elements
const header = document.querySelector('header.nav');
const homeSection = document.querySelector('.showcase');
const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");
const navigationItems = document.querySelector(".navigation-items");

// Toggle menu
menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active");
});

// Close on overlay click
navigation.addEventListener("click", (e) => {
    if (e.target === navigation) {
        menuBtn.classList.remove("active");
        navigation.classList.remove("active");
    }
});

// Close on link click
document.querySelectorAll(".navigation-items a").forEach(link => {
    link.addEventListener("click", () => {
        menuBtn.classList.remove("active");
        navigation.classList.remove("active");
    });
});
// END BUTTON MENU RESPONSIVE

// SCROLL SPY / MENU ACTIVO SEGÚN SECCIÓN VISTA
// 1. Aquí definimos manualmente los IDs que tienes en tu navbar para asegurar que los encuentre
const sectionIds = ['#inicio', '#servicios', '#proyectos', '#habilidades', '#contacto'];

// Convertimos esa lista de strings en elementos del DOM reales
const sections = sectionIds.map(id => document.querySelector(id)).filter(item => item !== null);

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        // Altura y posición
        const sectionHeight = current.offsetHeight;
        // Ajustamos el offset para que el cambio sea visualmente agradable
        const sectionTop = current.offsetTop - 150; 
        
        // Obtenemos el ID (sin el #)
        const sectionId = current.getAttribute('id');
        
        // Seleccionamos el link del menú correspondiente
        const sectionLinks = document.querySelectorAll(`header a[href="#${sectionId}"]`);

        sectionLinks.forEach(link => {
            // Lógica de activación
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });
}
window.addEventListener('scroll', scrollActive);
window.addEventListener('load', scrollActive);
// FINAL DEL SCROLL SPY / MENU ACTIVO SEGÚN SECCIÓN VISTA

/*  SERVICES SECTION BUTTONS*/
var titles = document.querySelectorAll('.service_Title');
var service_descriptions = document.querySelectorAll('.service_description');
var icons = document.querySelectorAll('.ri-add-fill');
var Headings = document.querySelectorAll('.service_Title h2');

titles.forEach((title, index) => {
    title.addEventListener('click', () => {
        var isActive = service_descriptions[index].classList.contains('ActiveDes');

        service_descriptions.forEach((desc) => {
            desc.classList.remove('ActiveDes')
        });
        icons.forEach((icon) => {
            icon.classList.remove('ri-close-line');
        });
        Headings.forEach((Heading) => {
            Heading.classList.remove('ActiveHeading');
        });
        if (!isActive) {
            service_descriptions[index].classList.add('ActiveDes');
            icons[index].classList.toggle('ri-close-line');
            Headings[index].classList.toggle('ActiveHeading');
        }
    });
});
/* END SERVICES SECTION BUTTONS*/

//LLAMAR A GSAP
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);

// PROYECTS SECTION
// ADD LOADING ANIMATION IN PROYECTS
gsap.from(".controls", { x: "20px", opacity: 0, duration: 1 }, 1.3);
gsap.from(".arrows", { opacity: 0, duration: 1 }, 1.3);
gsap.from(".header-wrp .socials, .header-wrp .arrowDown", { x: "-20px", opacity: 0, duration: 1 }, 1.3);

document.body.classList.remove("loading");

// Select an Image
var imageView = false; //whether image is open 
var currentOpenImagen;
var slide = 1; //curret slide
var pauseSlider = false;
var progress = 0; //Slider progress in seconds

function init() {
    let imgs = document.querySelectorAll(".header-wrp img");
    imgs.forEach((i) => {
        i.addEventListener("mouseenter", () => {
            if (imageView) return;
            imgs.forEach((f) => {
                if (f == i) return;
                gsap.to(f, { opacity: .3 });
            });
            //pause Slider on image Hover
            pauseSlider = true;
        });
        i.addEventListener("mouseleave", () => {
            if (imageView) return;
            imgs.forEach((f) => {
                gsap.to(f, { opacity: 1 });
            });
            //resume slider on mouseleave
            pauseSlider = false;
        });
        i.addEventListener("click", selectImage);
    });
}
window.onload = init; 

//Timeline for image click
var tli = gsap.timeline();

function selectImage(img) {

    // do not interrump animations
    if (tli.isActive()) {
        return;
    }

    //close image if open
    if (imageView) {
        closeImage(img);
        return;
    }
    currentOpenImagen = img;
    img.target.parentNode.classList.add("crossCursor");
    tli = gsap.timeline();

    let imgs = document.querySelectorAll(".slide"
        + slide + " .img");

    imgs.forEach((f) => {
        if (f == img.target.parentNode) return;
        tli.to(f, { opacity: 0 }, 0);
    });

    // set image open state o true
    imageView = true;

    //hide the slide headlines
    tli.to(".slide" + slide + " h2", { opacity: 0 }, 0);

    // if not the centered image (i1), transform to center
    if (!img.target.parentNode.classList.contains("i1"))
        tli.to(img.target.parentNode, {
            x: "-50%", y: "-50%"
        }, 0);

    // resize image to full screen
    tli.to(img.target.parentNode, {
        width: "80vw",
        height: "80vh", opacity: 1, ease: "power3.out",
        duration: 1
    }, .5);

    // --- LOGICA DEL BOTÓN ---
    // 1. Obtener URL del atributo data-url
    const imageUrl = img.target.parentNode.dataset.url;

    // 2. Crear o recuperar el enlace en document.body
    let imageLink = document.querySelector(".image-link");
    if (!imageLink) {
        imageLink = document.createElement("a");
        imageLink.className = "image-link";
        imageLink.setAttribute("target", "_blank");
        imageLink.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(imageLink);
    }

    // 3. VERIFICAR SI HAY URL REAL
    // Si existe url y no está vacía, mostramos el botón. Si no, lo ocultamos.
    if (imageUrl && imageUrl.trim() !== "") {
        imageLink.href = imageUrl;
        imageLink.innerHTML = 'VER SITIO <i class="fa-solid fa-arrow-up-right"></i>';
        
        // Añadimos una clase para saber que este botón está activo
        imageLink.classList.add("has-url");

        // Mostrar el enlace con animación
        tli.to(imageLink, { opacity: 1, pointerEvents: "all" }, .8);
    } else {
        // Si no hay URL, nos aseguramos de que esté oculto y desactivado
        imageLink.classList.remove("has-url");
        imageLink.href = "#"; // reset
        gsap.to(imageLink, { opacity: 0, pointerEvents: "none", duration: 0.1 });
    }
    // --- FIN LOGICA DEL BOTÓN ---

    //hide cursor
    gsap.to(".c", { opacity: 0 });
}

function closeImage(img) {
    tli.reverse();

    imageView = false;

    // hide the cross cursor
    img.target.parentNode.classList.remove("crossCursor");

    // hide the image link
    let imageLink = document.querySelector(".image-link");
    if (imageLink) {
        imageLink.classList.remove("active");
        imageLink.classList.remove("has-url"); // Limpiamos el estado
        gsap.to(imageLink, { opacity: 0, pointerEvents: "none", duration: 0.3 });
    }

    // unhide follow cursor
    gsap.to(".c", { opacity: 1 });
}


// SLIDE ANIMATION
var tl1 = gsap.timeline({ paused: false });
var ease = CustomEase.create("custom", "M0,0 C0.246,0.41 0.22,0.315 0.359,0.606 0.427,0.748 0.571,0.989 1,1 ");

tl1.from(".slide1 .i1 img", {
    y: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .7);
tl1.from(".slide1 .i2 img", {
    x: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .2);
tl1.from(".slide1 .i3 img", {
    y: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .5);
tl1.from(".slide1 .i4 img", {
    y: "-110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .4);
tl1.from(".slide1 .i5 img", {
    y: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .5);
tl1.from(".slide1 .i6 img", {
    x: "-110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .9);

//title
tl1.fromTo(".slide1 .title1", {
    y: '40%', opacity: 0, duration: 1, ease: 'power3.out'
}, {
    y: '0%', opacity: 1
}, .9);
tl1.fromTo(".slide1 .title2", {
    y: '40%', opacity: 0, duration: 1, ease: 'power3.out'
}, {
    y: '0%', opacity: 1
}, 1.1);


//SECOND SLIDE ANIMATION
var tl2 = gsap.timeline({ paused: true });

tl2.from(".slide2 .i1 img", {
    y: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .7);
tl2.from(".slide2 .i2 img", {
    x: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .2);
tl2.from(".slide2 .i3 img", {
    y: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .5);
tl2.from(".slide2 .i4 img", {
    y: "-110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .4);
tl2.from(".slide2 .i5 img", {
    y: "110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .5);
tl2.from(".slide2 .i6 img", {
    x: "-110%", opacity: 0,
    ease: ease, duration: 1, scaleY: .5
}, .9);

//title
tl2.fromTo(".slide2 .title1", {
    y: '40%', opacity: 0, duration: 1, ease: 'power3.out'
}, {
    y: '0%', opacity: 1
}, .9);
tl2.fromTo(".slide2 .title2", {
    y: '40%', opacity: 0, duration: 1, ease: 'power3.out'
}, {
    y: '0%', opacity: 1
}, 1.1);


//CHANGE SLIDE TO NEW ID/
function changeSlide(id) {
    //close image view if still open
    if (imageView) {
        closeImage(currentOpenImagen);
    }
    //Reverse the show animation from the current slide
    window["tl" + slide].reverse(1);
    //paly new animation
    window["tl" + id].restart();
    //remove active state from any slide
    let slides = document.querySelectorAll("header");
    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    let newSlide = document.querySelector(".slide" + id);
    newSlide.classList.add("active");

    // update slide id
    slide = id
    //reset control to inactive
    let controls = document.querySelectorAll(".controls ul li");
    controls.forEach((f) => {
        f.classList.remove("active");
    })
    //set new active
    controls[id - 1].classList.add("active");

    //reset progress to 0 on manual slide change 
    progress = 0;
    //unpause slider
    pauseSlider = false;
}

//add clicks events to right controls
var controls = document.querySelectorAll(".controls ul li");
for (let i = 0; i < controls.length; i++) {
    controls[i].addEventListener("click", () => {
        changeSlide(i + 1);
    });
}

// Progress Bar
function startProgressBar() {
    setInterval(() => {
        //if slider is paused, skip interval
        if (pauseSlider) return;

        progress += .1;

        if (progress >= 8) {
            changeSlide((slide % 2) + 1);
            progress = 0;
        }
        gsap.to(".slideProgress",
            { scaleX: progress / 8, duration: .3 });
    }, 100);
}
startProgressBar();

//change slide by arrows click
let prevArrow = document.querySelector(".arrows .fa-chevron-left"); // Botón anterior
let nextArrow = document.querySelector(".arrows .fa-chevron-right"); // Botón siguiente
prevArrow.addEventListener("click", () => {
    let delta = slide == 1 ? 2 : slide - 1;
    changeSlide(delta);
});
nextArrow.addEventListener("click", () => {
    changeSlide((slide % 2) + 1);
});

// Detectar si estamos en la sección de proyectos  
// (Para mostrar/ocultar el botón "Ver sitio")
window.addEventListener('scroll', () => {
    const proyectsSection = document.querySelector(".header-wrp");
    const imageLink = document.querySelector(".image-link");

    // MODIFICADO: Solo ejecutamos si el enlace existe Y tiene una URL válida (clase has-url)
    if (!imageLink || !imageView || !imageLink.classList.contains("has-url")) return; 

    const sectionTop = proyectsSection.offsetTop;
    const sectionHeight = proyectsSection.offsetHeight;
    const sectionBottom = sectionTop + sectionHeight;
    const scrollPosition = window.scrollY;

    // Calcular los límites con 35% arriba y 10% abajo (Botón Ver sitio)
    const topLimit = sectionTop - (sectionHeight * 0.35);
    const bottomLimit = sectionBottom + (sectionHeight * -0.90);

    // Si estamos dentro de los límites
    if (scrollPosition > topLimit && scrollPosition < bottomLimit) {
        // Mostrar el botón si estamos en el rango permitido
        if (imageLink.style.display !== "flex") {
            gsap.to(imageLink, { opacity: 1, pointerEvents: "all", duration: 0.3 });
            imageLink.style.display = "flex";
        }
    } else {
        // Ocultar el botón si estamos fuera del rango
        gsap.to(imageLink, { opacity: 0, pointerEvents: "none", duration: 0.3 });
        imageLink.style.display = "none";
    }
});
// END PROYECTS SECTION

// SKILLS SECTION
window.addEventListener('load', () => {
    var gridElements = document.querySelectorAll(".grid .grid-el");

    gridElements.forEach((el) => {
        // Asegurar que las imágenes sean visibles inicialmente
        gsap.set(el.querySelector('.img-wrp img'), {
            autoAlpha: 1,
            scale: 1,
        });
        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'center center',
                scrub: 1,
            }
        })
            .from(el.querySelector('.row'), {
                y: 100,
                opacity: 0,
                duration: 2
            })
            .from(el.querySelector('.img-wrp img'), {
                scale: 1.5,
                opacity: 0,
                duration: 2
            }, 0);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    
    // VERIFICACIÓN
    if (typeof Matter === 'undefined') {
        console.error("Error: Matter.js no está cargado.");
        return;
    }

    const sectionsData = [
        { id: 'box-frontend', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind', 'Sass', 'Bootstrap', 'GSAP', 'TypeScript', 'Next.js'] },
        { id: 'box-backend', tags: ['Node.js', 'Python', 'SQL', 'MongoDB', 'Express', 'API Rest', 'NoSQL', 'Django', 'Flask', 'PostgreSQL', 'TypeScript', 'PHP', 'Next.js', 'Docker', 'ML XGBoost', 'IA'] },
        { id: 'box-mobile', tags: ['React Native', 'Flutter', 'SQLite', 'Dart', 'Expo', 'TypeScript', 'Hive', 'Sanity'] },
        { id: 'box-desktop', tags: ['Electron', 'Python', 'Rust', 'Go'] }
    ];

    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Body = Matter.Body;

    function initPhysicsSection(containerId, tagsList) {
        const container = document.getElementById(containerId);
        if (!container) return; 

        // 1. CONFIGURACIÓN DEL MOTOR
        // enableSleeping: true es VITAL. Hace que cuando las fichas caigan, dejen de consumir CPU.
        const engine = Engine.create({
            enableSleeping: true 
        });
        const world = engine.world;
        
        // Optimizaciones: Menos iteraciones = Menos carga de CPU inicial
        engine.positionIterations = 4;
        engine.velocityIterations = 4;

        let width = container.offsetWidth;
        let height = container.offsetHeight;

        // 2. PAREDES
        const wallThickness = 100; 
        const wallHeight = height * 5; 

        const ground = Bodies.rectangle(width / 2, height + wallThickness/2, width * 3, wallThickness, { isStatic: true, render: { visible: false } });
        const leftWall = Bodies.rectangle(0 - wallThickness/2, -height, wallThickness, wallHeight, { isStatic: true, render: { visible: false } });
        const rightWall = Bodies.rectangle(width + wallThickness/2, -height, wallThickness, wallHeight, { isStatic: true, render: { visible: false } });

        Composite.add(world, [ground, leftWall, rightWall]);

        // 3. GENERAR ETIQUETAS
        const domBodies = []; 

        tagsList.forEach((tagName, index) => {
            const tagEl = document.createElement('div');
            tagEl.classList.add('physics-tag');
            tagEl.textContent = tagName;
            container.appendChild(tagEl);

            const w = tagEl.offsetWidth;
            const h = tagEl.offsetHeight;
            const startX = Math.random() * (width - 100) + 50; 
            const startY = -(index * 120) - 100; 

            const body = Bodies.rectangle(startX, startY, w, h, {
                chamfer: { radius: 10 }, 
                restitution: 0.5, 
                friction: 0.005,
                density: 0.04,
                frictionAir: 0.01, 
                // sleepThreshold bajo para que se "duerman" rápido una vez toquen el suelo
                sleepThreshold: 15 
            });

            Composite.add(world, body);
            domBodies.push({ body, element: tagEl, w, h });
        });

        // 4. MOUSE
        const mouse = Mouse.create(container);
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(world, mouseConstraint);

        // 5. ARRANCAR
        const runner = Runner.create();
        Runner.run(runner, engine);

        // 6. BUCLE VISUAL
        Matter.Events.on(engine, 'afterUpdate', function() {
            for (let i = 0; i < domBodies.length; i++) {
                const pair = domBodies[i];
                const body = pair.body;

                // SI ESTÁ DORMIDO (QUIETO), NO HACEMOS NADA (RENDIMIENTO AL MÁXIMO)
                if (body.isSleeping) continue;

                const { x, y } = body.position;
                
                // Red de seguridad
                if (y > height + 200) {
                    Body.setPosition(body, { x: Math.random() * (width - 100) + 50, y: -200 });
                    Body.setVelocity(body, { x: 0, y: 0 });
                }

                pair.element.style.transform = `translate3d(${x - pair.w/2}px, ${y - pair.h/2}px, 0) rotate(${body.angle}rad)`;
            }
        });

        // 7. RESPONSIVE
        window.addEventListener('resize', () => {
            width = container.offsetWidth;
            height = container.offsetHeight;
            Body.setPosition(ground, { x: width / 2, y: height + wallThickness/2 });
            Body.setPosition(rightWall, { x: width + wallThickness/2, y: -height });
            
            // Opcional: Despertar fichas al redimensionar para que se reacomoden
            domBodies.forEach(b => Matter.Sleeping.set(b.body, false));
        });
    }

    // --- INICIALIZACIÓN INMEDIATA ---
    // Ya no usamos IntersectionObserver.
    // Iniciamos la física apenas carga la página para que el trabajo pesado
    // ocurra al inicio y no durante el scroll.
    
    sectionsData.forEach(section => {
        initPhysicsSection(section.id, section.tags);
    });

});

// END SKILLS SECTION

// CONTACT SCROLL EFFECT
var scrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#habilidades .grid .grid-el:last-child',
        start: 'top+=100 top',
        end: '+=300',
        scrub: 1,
    }
});
//move grid upwards and hide
scrollTl.to("#habilidades .grid", { y: '-20%', opacity: 0 }, 0);
//add fade in and pull row
scrollTl.from(".contact-grid", { y: '20%', opacity: 0 }, .3);
scrollTl.from(".contact-grid .row",
    { y: '-100%', opacity: 0 }, .3);
// END CONTACT SCROLL EFFECT

// AÑO ACTUALIZADO DEL FOOTER
document.getElementById("year").textContent = new Date().getFullYear();
// FIN DEL AÑO ACTUALIZADO DEL FOOTER