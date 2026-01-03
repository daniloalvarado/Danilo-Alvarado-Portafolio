// =================================================================
// 0. CONFIGURACIÓN GLOBAL Y DETECCIÓN
// =================================================================
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isMobile = window.innerWidth < 1024;

gsap.registerPlugin(CustomEase, ScrollTrigger);

// =================================================================
// 1. CURSOR PERSONALIZADO (SOLO PC)
// =================================================================
if (!isTouchDevice) {
    const cursor = document.querySelector(".cursor");
    const cursorFollow = document.querySelector(".cursor-follow");
    
    if (cursor && cursorFollow) {
        window.addEventListener("mousemove", (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(cursorFollow, {
                x: e.clientX, y: e.clientY,
                duration: 1.5, ease: "power3.out"
            });
        });
    }
} else {
    gsap.set(".cursor, .cursor-follow", { display: "none" });
}


// =================================================================
// 2. UTILIDADES GENERALES
// =================================================================
document.documentElement.style.setProperty('--animate-duration', '2s');

const yearSpan = document.getElementById("year");
if(yearSpan) yearSpan.textContent = new Date().getFullYear();

const preloader = document.querySelector("[data-preloader]");
window.addEventListener("DOMContentLoaded", function () {
    if(preloader) preloader.classList.add("loaded");
    document.body.classList.add("loaded");
    document.body.classList.remove("loading");
});

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


// =================================================================
// 3. UI, NAVEGACIÓN Y SCROLL SPY
// =================================================================
const header = document.querySelector('header.nav');
const homeSection = document.querySelector('.showcase');
const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");

if (menuBtn && navigation) {
    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("active");
        navigation.classList.toggle("active");
    });
    navigation.addEventListener("click", (e) => {
        if (e.target === navigation) {
            menuBtn.classList.remove("active");
            navigation.classList.remove("active");
        }
    });
    document.querySelectorAll(".navigation-items a").forEach(link => {
        link.addEventListener("click", () => {
            menuBtn.classList.remove("active");
            navigation.classList.remove("active");
        });
    });
}

// Scroll Optimizado (RequestAnimationFrame)
let lastKnownScrollPosition = 0;
let ticking = false;
const sectionIds = ['#inicio', '#servicios', '#proyectos', '#habilidades', '#contacto'];
const sections = sectionIds.map(id => document.querySelector(id)).filter(item => item !== null);

function updateScrollUI(scrollY) {
    // Fondo Header
    if (homeSection && header) {
        const triggerPoint = homeSection.offsetTop + homeSection.offsetHeight * 0.2;
        if (scrollY > triggerPoint - header.offsetHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    // Scroll Spy
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 150;
        const sectionId = current.getAttribute('id');
        const sectionLink = document.querySelector(`header a[href="#${sectionId}"]`);
        if (sectionLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                sectionLink.classList.add('active');
            } else {
                sectionLink.classList.remove('active');
            }
        }
    });
    // Botón Ver Sitio
    updateProjectButton(scrollY);
}

window.addEventListener('scroll', function() {
    lastKnownScrollPosition = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(function() {
            updateScrollUI(lastKnownScrollPosition);
            ticking = false;
        });
        ticking = true;
    }
});

function updateProjectButton(scrollY) {
    const proyectsSection = document.querySelector(".header-wrp");
    const imageLink = document.querySelector(".image-link");
    if (!imageLink || !imageView || !imageLink.classList.contains("has-url")) return;
    
    if (proyectsSection) {
        const sectionTop = proyectsSection.offsetTop;
        const sectionHeight = proyectsSection.offsetHeight;
        const topLimit = sectionTop - (sectionHeight * 0.35);
        const bottomLimit = (sectionTop + sectionHeight) + (sectionHeight * -0.90);

        if (scrollY > topLimit && scrollY < bottomLimit) {
            if (imageLink.style.display !== "flex") {
                gsap.to(imageLink, { opacity: 1, pointerEvents: "all", duration: 0.3 });
                imageLink.style.display = "flex";
            }
        } else {
            gsap.to(imageLink, { opacity: 0, pointerEvents: "none", duration: 0.3 });
            imageLink.style.display = "none";
        }
    }
}
window.addEventListener('load', () => updateScrollUI(window.scrollY));


// =================================================================
// 4. SECCIÓN SERVICIOS
// =================================================================
const titles = document.querySelectorAll('.service_Title');
const service_descriptions = document.querySelectorAll('.service_description');
const icons = document.querySelectorAll('.icon-service');
const Headings = document.querySelectorAll('.service_Title h2');

titles.forEach((title, index) => {
    title.addEventListener('click', () => {
        const isActive = service_descriptions[index].classList.contains('ActiveDes');
        service_descriptions.forEach(desc => desc.classList.remove('ActiveDes'));
        icons.forEach(icon => icon.classList.remove('active'));
        Headings.forEach(Heading => Heading.classList.remove('ActiveHeading'));

        if (!isActive) {
            service_descriptions[index].classList.add('ActiveDes');
            icons[index].classList.add('active');
            Headings[index].classList.add('ActiveHeading');
        }
    });
});


// =================================================================
// 5. SECCIÓN PROYECTOS (AQUÍ ESTÁ EL BLOQUEO DE HOVER)
// =================================================================
gsap.from(".controls", { x: "20px", opacity: 0, duration: 1 }, 1.3);
gsap.from(".arrows", { opacity: 0, duration: 1 }, 1.3);
gsap.from(".header-wrp .socials, .header-wrp .arrowDown", { x: "-20px", opacity: 0, duration: 1 }, 1.3);

var imageView = false;
var currentOpenImagen;
var slide = 1;
var pauseSlider = false;
var progress = 0;

// LOGICA CONDICIONAL: Si NO es táctil, agregamos hovers. Si ES táctil, no.
if (!isTouchDevice) {
    let imgs = document.querySelectorAll(".header-wrp img");
    imgs.forEach((i) => {
        i.addEventListener("mouseenter", () => {
            if (imageView) return;
            imgs.forEach((f) => { if (f !== i) gsap.to(f, { opacity: .3 }); });
            pauseSlider = true;
        });
        i.addEventListener("mouseleave", () => {
            if (imageView) return;
            imgs.forEach((f) => gsap.to(f, { opacity: 1 }));
            pauseSlider = false;
        });
        i.addEventListener("click", selectImage);
    });
} else {
    // En móvil solo permitimos click para abrir, sin efectos de opacidad al tocar
    let imgs = document.querySelectorAll(".header-wrp img");
    imgs.forEach((i) => i.addEventListener("click", selectImage));
}

var tli = gsap.timeline();

function selectImage(img) {
    if (tli.isActive()) return;
    if (imageView) {
        closeImage(img);
        return;
    }
    
    currentOpenImagen = img;
    const parent = img.target.parentNode;
    parent.classList.add("crossCursor");
    
    tli = gsap.timeline();

    let imgs = document.querySelectorAll(".slide" + slide + " .img");
    imgs.forEach((f) => {
        if (f !== parent) tli.to(f, { opacity: 0 }, 0);
    });

    imageView = true;
    tli.to(".slide" + slide + " h2", { opacity: 0 }, 0);

    if (!parent.classList.contains("i1")) {
        tli.to(parent, { x: "-50%", y: "-50%" }, 0);
    }

    tli.to(parent, {
        width: "80vw", height: "80vh", opacity: 1, ease: "power3.out", duration: 1
    }, .5);

    const imageUrl = parent.dataset.url;
    let imageLink = document.querySelector(".image-link");
    
    if (!imageLink) {
        imageLink = document.createElement("a");
        imageLink.className = "image-link";
        imageLink.setAttribute("target", "_blank");
        imageLink.setAttribute("rel", "noopener noreferrer");
        document.body.appendChild(imageLink);
    }

    if (imageUrl && imageUrl.trim() !== "") {
        imageLink.href = imageUrl;
        imageLink.innerHTML = 'VER SITIO <svg class="icon-svg" style="width:15px;height:15px;fill:white;margin-left:5px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.004 9.414l-8.607 8.607-1.414-1.414L14.589 8H7.004V6h11v11h-2V9.414z"/></svg>';
        imageLink.classList.add("has-url");
        tli.to(imageLink, { opacity: 1, pointerEvents: "all" }, .8);
    } else {
        imageLink.classList.remove("has-url");
        imageLink.href = "#";
        gsap.to(imageLink, { opacity: 0, pointerEvents: "none", duration: 0.1 });
    }
    gsap.to(".c", { opacity: 0 });
}

function closeImage(img) {
    tli.reverse();
    imageView = false;
    img.target.parentNode.classList.remove("crossCursor");

    let imageLink = document.querySelector(".image-link");
    if (imageLink) {
        imageLink.classList.remove("active");
        imageLink.classList.remove("has-url");
        gsap.to(imageLink, { opacity: 0, pointerEvents: "none", duration: 0.3 });
    }
    gsap.to(".c", { opacity: 1 });
}

var ease = CustomEase.create("custom", "M0,0 C0.246,0.41 0.22,0.315 0.359,0.606 0.427,0.748 0.571,0.989 1,1 ");

function createSlideTimeline(slideNum) {
    let tl = gsap.timeline({ paused: slideNum !== 1 });
    const selector = `.slide${slideNum}`;
    
    const animations = [
        { sel: ".i1 img", vars: { y: "110%", scaleY: .5 }, time: .7 },
        { sel: ".i2 img", vars: { x: "110%", scaleY: .5 }, time: .2 },
        { sel: ".i3 img", vars: { y: "110%", scaleY: .5 }, time: .5 },
        { sel: ".i4 img", vars: { y: "-110%", scaleY: .5 }, time: .4 },
        { sel: ".i5 img", vars: { y: "110%", scaleY: .5 }, time: .5 },
        { sel: ".i6 img", vars: { x: "-110%", scaleY: .5 }, time: .9 }
    ];

    animations.forEach(anim => {
        tl.from(`${selector} ${anim.sel}`, {
            ...anim.vars, opacity: 0, ease: ease, duration: 1
        }, anim.time);
    });

    tl.fromTo(`${selector} .title1`, 
        { y: '40%', opacity: 0, duration: 1, ease: 'power3.out' }, 
        { y: '0%', opacity: 1 }, .9
    );
    tl.fromTo(`${selector} .title2`, 
        { y: '40%', opacity: 0, duration: 1, ease: 'power3.out' }, 
        { y: '0%', opacity: 1 }, 1.1
    );
    return tl;
}

var tl1 = createSlideTimeline(1);
var tl2 = createSlideTimeline(2);

function changeSlide(id) {
    if (imageView) closeImage(currentOpenImagen);
    window["tl" + slide].reverse(1);
    window["tl" + id].restart();
    document.querySelectorAll("header").forEach(s => s.classList.remove("active"));
    document.querySelector(".slide" + id).classList.add("active");
    slide = id;
    let controls = document.querySelectorAll(".controls ul li");
    controls.forEach(f => f.classList.remove("active"));
    if(controls[id-1]) controls[id - 1].classList.add("active");
    progress = 0;
    pauseSlider = false;
}

document.querySelectorAll(".controls ul li").forEach((control, i) => {
    control.addEventListener("click", () => changeSlide(i + 1));
});

setInterval(() => {
    if (pauseSlider) return;
    progress += .1;
    if (progress >= 8) {
        changeSlide((slide % 2) + 1);
        progress = 0;
    }
    gsap.to(".slideProgress", { scaleX: progress / 8, duration: .3 });
}, 100);

const prevArrow = document.querySelector(".arrows .icon-svg-flecha-derecha");
const nextArrow = document.querySelector(".arrows .icon-svg-flecha-izquierda");
if(prevArrow) prevArrow.addEventListener("click", () => changeSlide(slide == 1 ? 2 : slide - 1));
if(nextArrow) nextArrow.addEventListener("click", () => changeSlide((slide % 2) + 1));


// =================================================================
// 6. SKILLS SECTION (RESTAURADO A TU CÓDIGO ORIGINAL)
// =================================================================
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

// MATTER.JS - CARGA DIFERIDA (Mantenemos esta optimización porque es vital)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof Matter === 'undefined') return;

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

            const engine = Engine.create({ enableSleeping: true });
            engine.positionIterations = isMobile ? 2 : 4;
            engine.velocityIterations = isMobile ? 2 : 4;

            const world = engine.world;
            let width = container.offsetWidth;
            let height = container.offsetHeight;

            const wallThickness = 100;
            const wallHeight = height * 5;
            const ground = Bodies.rectangle(width / 2, height + wallThickness/2, width * 3, wallThickness, { isStatic: true, render: { visible: false } });
            const leftWall = Bodies.rectangle(0 - wallThickness/2, -height, wallThickness, wallHeight, { isStatic: true, render: { visible: false } });
            const rightWall = Bodies.rectangle(width + wallThickness/2, -height, wallThickness, wallHeight, { isStatic: true, render: { visible: false } });
            Composite.add(world, [ground, leftWall, rightWall]);

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
                    sleepThreshold: 15
                });
                Composite.add(world, body);
                domBodies.push({ body, element: tagEl, w, h });
            });

            const mouse = Mouse.create(container);
            mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
            mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: { stiffness: 0.2, render: { visible: false } }
            });
            Composite.add(world, mouseConstraint);

            const runner = Runner.create();
            Runner.run(runner, engine);

            Matter.Events.on(engine, 'afterUpdate', function() {
                for (let i = 0; i < domBodies.length; i++) {
                    const pair = domBodies[i];
                    const body = pair.body;
                    if (body.isSleeping) continue;
                    const { x, y } = body.position;
                    if (y > height + 200) {
                        Body.setPosition(body, { x: Math.random() * (width - 100) + 50, y: -200 });
                        Body.setVelocity(body, { x: 0, y: 0 });
                    }
                    pair.element.style.transform = `translate3d(${x - pair.w/2}px, ${y - pair.h/2}px, 0) rotate(${body.angle}rad)`;
                }
            });

            window.addEventListener('resize', () => {
                width = container.offsetWidth;
                height = container.offsetHeight;
                Body.setPosition(ground, { x: width / 2, y: height + wallThickness/2 });
                Body.setPosition(rightWall, { x: width + wallThickness/2, y: -height });
            });
        }
        sectionsData.forEach(section => {
            initPhysicsSection(section.id, section.tags);
        });

    }, 2500); 
});


// =================================================================
// 7. CONTACT SCROLL EFFECT
// =================================================================
var scrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#habilidades .grid .grid-el:last-child',
        start: 'top+=100 top',
        end: '+=300',
        scrub: 1,
    }
});
scrollTl.to("#habilidades .grid", { y: '-20%', opacity: 0 }, 0);
scrollTl.from(".contact-grid", { y: '20%', opacity: 0 }, .3);
scrollTl.from(".contact-grid .row", { y: '-100%', opacity: 0 }, .3);