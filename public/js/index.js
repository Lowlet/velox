import * as THREE from 'https://cdn.skypack.dev/three@0.132.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/meshopt_decoder.module.js';
import { EXRLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/EXRLoader.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js';
import { SSRPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/SSRPass.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/shaders/FXAAShader.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/postprocessing/ShaderPass.js';
import gsap from 'https://cdn.skypack.dev/gsap@3.8.0';
import $ from 'https://cdn.skypack.dev/jquery@3.6.0';

let canvas, clock, scene, camera, renderer, mixer, composer, ssr, fxaa, stats;
const selects = [];

const positions = [
    [-29, 10.2, 9.3],
    [3.2, 11.5, 10.6],
    [-10.9, 5.6, -10.4]
];
const rotations = [
    [-1, -0.7, -0.8],
    [-1.5, 0, 1],
    [-2.6, -0.4, -2.9]
];
let currentPosition = 0;
let benefitsShown;
let infoShown;

init();
update();

function init()
{
    canvas = document.getElementById('canvas');

    clock = new THREE.Clock();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-29, 10.2, 9.3);
    camera.rotation.set(-1, -0.7, -0.8);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.outputEncoding = THREE.LinearEncoding;
    //renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.physicallyCorrectLights = true;

    //Screen Space Reflections
    ssr = new SSRPass({ renderer, scene, camera, width: innerWidth, height: innerHeight, encoding: THREE.sRGBEncoding, groundReflector: false, selects: selects });
    ssr.thickness = 0.02;
    ssr.infiniteThick = false;
    ssr.maxDistance = 1;
    ssr.opacity = 0.5;

    //FXAA
    fxaa = new ShaderPass(FXAAShader);
    fxaa.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    fxaa.renderToScreen = false;

    //Composer
    composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(ssr);
    composer.addPass(fxaa);

    const loadingManager = new THREE.LoadingManager();

    new EXRLoader().load('/public/img/background.exr', (texture) =>
    {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = new THREE.Color(0x0548b5);
        scene.environment = texture;
        scene.fog = new THREE.FogExp2(0x0548b5, 0.06);

        const gltfLoader = new GLTFLoader(loadingManager);
        gltfLoader.setMeshoptDecoder(MeshoptDecoder);
        gltfLoader.load('/public/mdl/bg_cubes.glb', (gltf) =>
        {
            scene.add(gltf.scene);

            mixer = new THREE.AnimationMixer(gltf.scene);

            gltf.animations.forEach((clip) =>
            {
                const action = mixer.clipAction(clip);
                action.setDuration(30);
                action.setLoop(THREE.LoopRepeat);
                action.play();
            });

            gltf.scene.traverse(function (child)
            {
                if (child.isMesh)
                {
                    selects.push(child);
                }
            });
        });
    });

    loadingManager.onLoad = () =>
    {
        $('.canvas-blocker').fadeOut('slow');
    }

    window.addEventListener('resize', onWindowResize);
}

function update()
{
    requestAnimationFrame(update);
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    //composer.render();
    renderer.render(scene, camera);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function tweenCamera(position, rotation)
{
    gsap.to(camera.position, { x: position[0], y: position[1], z: position[2], duration: 1.5, ease: 'power3.inOut' });
    gsap.to(camera.rotation, { x: rotation[0], y: rotation[1], z: rotation[2], duration: 1.5, ease: 'power3.inOut' });
}

const pos = { x: 0, y: 0 };

const saveCursorPosition = function (x, y)
{
    pos.x = (x / window.innerWidth).toFixed(2);
    pos.y = (y / window.innerHeight).toFixed(2);
    document.documentElement.style.setProperty('--x', -pos.x);
    document.documentElement.style.setProperty('--y', pos.y);
}

setInterval(function ()
{
    var tempscroll = $(window).scrollTop();
    setTimeout(function ()
    {
        if (tempscroll == $(window).scrollTop())
        {
            $('.benefits__cube-01').addClass('pause-anim');
            $('.benefits__cube-02').addClass('pause-anim');
            $('.benefits__cube-03').addClass('pause-anim');
            $('.benefits__cube-04').addClass('pause-anim');
            $('.benefits__cube-05').addClass('pause-anim');
            $('.benefits__cube-06').addClass('pause-anim');
            $('.benefits__cube-07').addClass('pause-anim');
            $('.benefits__cube-08').addClass('pause-anim');
            $('.benefits__cube-09').addClass('pause-anim');
        }
        else
        {
            $('.benefits__cube-01').removeClass('pause-anim');
            $('.benefits__cube-02').removeClass('pause-anim');
            $('.benefits__cube-03').removeClass('pause-anim');
            $('.benefits__cube-04').removeClass('pause-anim');
            $('.benefits__cube-05').removeClass('pause-anim');
            $('.benefits__cube-06').removeClass('pause-anim');
            $('.benefits__cube-07').removeClass('pause-anim');
            $('.benefits__cube-08').removeClass('pause-anim');
            $('.benefits__cube-09').removeClass('pause-anim');
        }
    }, 75);

}, 100);

document.addEventListener('mousemove', e => { saveCursorPosition(e.clientX, e.clientY); })

$(function ()
{
    $('body').show();

    $('.intro__title').addClass('intro__title-anim');
    $('.intro__subtitle').addClass('intro__subtitle-anim');

    $('#header__btn-menu').on('click', () =>
    {
        $('.header-menu').addClass('header-menu--open')
        $('body').addClass("fixed-position");
    });

    $('#header-menu__btn-close').on('click', () =>
    {
        $('.header-menu').removeClass('header-menu--open')
        $('body').removeClass("fixed-position");
    });

    $(window).on('scroll', () =>
    {
        if ($('.benefits').offset().top - $(window).scrollTop() < window.innerHeight / 2)
        {
            $('.benefits__title').addClass('benefits__title-anim');
            $('.benefits__subtitle').addClass('benefits__subtitle-anim');
        }

        if (!benefitsShown)
        {
            if ($('.benefits').offset().top - $(window).scrollTop() < window.innerHeight / 3)
            {
                benefitsShown = true;
                currentPosition = currentPosition + 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
        else
        {
            if ($('.benefits').offset().top - $(window).scrollTop() > window.innerHeight / 3)
            {
                benefitsShown = false;
                currentPosition = currentPosition - 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
        if (!infoShown)
        {
            if ($('.info').offset().top - $(window).scrollTop() < window.innerHeight / 2)
            {
                infoShown = true;
                currentPosition = currentPosition + 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
        else
        {
            if ($('.info').offset().top - $(window).scrollTop() > window.innerHeight / 2)
            {
                infoShown = false;
                currentPosition = currentPosition - 1;
                tweenCamera(positions[currentPosition], rotations[currentPosition]);
            }
        }
    });
});

