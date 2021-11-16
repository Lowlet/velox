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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
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

$(function ()
{
    $('body').show();

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
