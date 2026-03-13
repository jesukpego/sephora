// Enregistrement du plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- Animation d'Introduction avec la main ---
// --- Animation d'Introduction Façon Framer ---
const introTl = gsap.timeline({
    onComplete: () => {
        // Rétablir le scroll et cacher l'overlay
        document.body.style.overflowY = "auto";
        gsap.set("#intro-animation", { display: "none" });

        // Lancer l'animation principale du Hero
        heroTl.play();
    }
});

// 1. Le bouton "Tirer" apparaît (effet rebond)
introTl.to(".grab-button", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "elastic.out(1, 0.5)"
})
    // 2. Le curseur (flèche) arrive sur le bouton
    .to(".custom-cursor", {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        duration: 1,
        ease: "power3.inOut"
    })
    // 3. Changement de curseur : la main saisit (Fist)
    .set(".cursor-svg.arrow", { display: "none" })
    .set(".cursor-svg.hand", { display: "block" })
    // Petit écrasement du bouton pour simuler la pression
    .to(".grab-button", {
        scale: 0.95,
        duration: 0.1
    })
    // 4. La main tire le bouton vers le bas avec étirement (Spring Drag)
    .to([".custom-cursor", ".grab-button"], {
        y: 150, // Tirer vers le bas
        duration: 0.8,
        ease: "power2.inOut"
    }, "drag")
    .to(".grab-button", {
        scaleY: 1.4, // Étirement vertical
        scaleX: 0.8, // Compression horizontale
        duration: 0.8,
        ease: "power2.inOut"
    }, "drag")
    // 5. Relâchement ! La main disparaît/lâche
    .set(".cursor-svg.hand", { display: "none" })
    .set(".cursor-svg.arrow", { display: "block", opacity: 0 })
    // 6. Le bouton "Snap" (Revient violemment)
    .to(".grab-button", {
        y: 0,
        scaleY: 1,
        scaleX: 1,
        duration: 0.6,
        ease: "elastic.out(1.2, 0.3)" // Fort effet d'élastique
    })
    // 7. Explosion fond pour révéler le site
    .to("#intro-animation", {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut"
    }, "-=0.2");

// --- Timeline principale pour le chargement de la page (Hero Section) ---
// Mise en pause initiale pour attendre la fin de l'intro
const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });

// Animation du texte d'introduction (Hero)
heroTl.to(".framer-text", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    stagger: 0.15,
    delay: 0.2
});

// Animation lente des glows en arrière-plan (Parallax/Float effect)
gsap.to(".glow-1", {
    y: "random(-50, 50)",
    x: "random(-50, 50)",
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

gsap.to(".glow-2", {
    y: "random(-50, 50)",
    x: "random(-50, 50)",
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});

// Animations au défilement (ScrollTrigger) pour les cartes
gsap.utils.toArray('.reveal-up').forEach((elem, i) => {

    // Décalage pour créer un effet de cascade si les éléments sont proches
    const delay = elem.classList.contains('delay-1') ? 0.2 :
        elem.classList.contains('delay-2') ? 0.4 : 0;

    gsap.to(elem, {
        scrollTrigger: {
            trigger: elem,
            start: "top 85%", // Déclenchement quand le haut de l'élément atteint 85% de la fenêtre
            toggleActions: "play reverse play reverse" // Joue à l'aller, s'inverse au retour
        },
        y: 0,
        opacity: 1,
        duration: 1,
        delay: delay,
        ease: "power3.out"
    });
});

// Animation d'apparition/échelle pour la section finale
gsap.to(".reveal-scale", {
    scrollTrigger: {
        trigger: ".final-section",
        start: "top 75%",
        toggleActions: "play none none reverse"
    },
    scale: 1,
    opacity: 1,
    duration: 1.2,
    ease: "back.out(1.7)"
});

// --- Section Awwwards: Interactive Scroll Grab ---
const awwwardsTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".awwwards-section",
        start: "top top",     // Commence quand le haut de la section touche le haut de l'écran
        end: "+=2500",        // L'animation dure pendant 2500px de défilement (Scroll virtuel très long)
        pin: true,            // Épingle la section à l'écran pendant le scroll
        scrub: 1,             // Lisse l'animation liée au défilement
    }
});

// Phase 1 : La main se déplace vers le cadeau
awwwardsTl.to(".scroll-hand", {
    top: "40%",               // Rejoindre l'objet (grab-target top)
    left: "30%",              // Rejoindre l'objet (grab-target left)
    duration: 3,
    ease: "power1.inOut"
})
    // Phase 2 : Moment Clé - La main se ferme sur le cadeau
    .to(".hand-open", { opacity: 0, duration: 0.1 }, "grab")
    .to(".hand-closed", { display: "block", opacity: 1, duration: 0.1 }, "grab")
    // Squeeze visuel de l'objet et de la main pour simuler la préhension
    .to([".scroll-hand", ".grab-target"], {
        scale: 0.9,
        duration: 0.5
    }, "grab+=0.1")
    // Phase 3 : La main tire le cadeau avec elle (Translation + Rotation) vers le centre
    .to([".scroll-hand", ".grab-target"], {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 1.5,
        rotation: 12,             // Rotation dynamique
        duration: 5,
        ease: "power2.inOut"
    })
    // Le titre apparaît
    .to(".awwwards-title", {
        opacity: 1,
        scale: 1.1,
        duration: 2
    }, "-=3")
    // Phase 4 : Disparition (La main tombe, le cadeau explose en fade)
    .to(".scroll-hand", {
        top: "150%",              // La main lâche et tombe hors champ
        rotation: -20,
        duration: 3
    }, "drop")
    .to(".grab-target", {
        scale: 4,                 // L'objet zoome vers la caméra
        opacity: 0,
        duration: 3
    }, "drop");


// Interaction subtile sur les cartes au mouvement de la souris
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Modifier les variables CSS pour un effet de brillance "Follow Cursor" (si ajouté au CSS plus tard)
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Animation du bouton final au clic
document.querySelector('.primary-btn').addEventListener('click', function () {
    gsap.to(this, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
            // Action à l'anniversaire (ex: Explosion de confettis)
            alert("Joyeux Anniversaire Sephora ! ✨🎉");
        }
    });
});
