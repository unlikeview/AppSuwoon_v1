import * as THREE from 'three'
import deviceChecker from './deviceChecker.js'
import { val, momentum} from './deviceChecker.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import Gray from '../static/textures/matcaps/Red.png';
import Orange from '../static/textures/matcaps/Brown.png';
import Green from '../static/textures/matcaps/Green.png';

import bg from '../static/textures/matcaps/bg.png';
import bg1 from '../static/textures/matcaps/bg1.png';
import bg2 from '../static/textures/matcaps/bg2.png';

/**
 * Base
 */
// Debug
//const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

deviceChecker();


// Scene
//const scene = new THREE.Scene()
const scenes = [
    {
        bg : bg,
        matcap : Gray,
        geometry : new THREE.TorusGeometry(0.1, 0.01, 32, 64)
    },
    {
        bg : bg1,
        matcap : Green,
        geometry : new THREE.TorusGeometry(0.3, 0.2, 32, 64)
    },
    {
        bg : bg2,
        matcap : Orange,
        geometry : new THREE.TorusGeometry(0.3, 0.2, 32, 64)
    }
]

function createScene(background,matcap,geometry){
    let scene = new THREE.Scene();

    let bgTexture = new THREE.TextureLoader().load(background);
    scene.background = bgTexture;
    let material = new THREE.MeshMatcapMaterial({
        matcap : new THREE.TextureLoader().load(matcap)
    });
    let geo = geometry;
    let mesh = new THREE.Mesh(geo,material);

    for(let index = 0; index < 100; index ++){
        let random = new THREE.Vector3().randomDirection();
        let clone = mesh.clone();
        clone.position.copy(random);
        clone.rotation.x = Math.random();
        clone.rotation.y = Math.random(); 
        scene.add(clone)
    }

    return scene;
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Fonts
 */
const fontLoader = new FontLoader()

// fontLoader.load(
//     '/fonts/helvetiker_regular.typeface.json',
//     (font) =>
//     {
//         // Material
//         const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

//         // Text
//         const textGeometry = new TextGeometry(
//             'SuwoonGyo World',
//             {
//                 font: font,
//                 size: 0.5,
//                 height: 0.2,
//                 curveSegments: 12,
//                 bevelEnabled: true,
//                 bevelThickness: 0.03,
//                 bevelSize: 0.02,
//                 bevelOffset: 0,
//                 bevelSegments: 5
//             }
//         )
//         textGeometry.center()

//         const text = new THREE.Mesh(textGeometry, material)
//         scene.add(text)

//         // Donuts
//         const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

//         for(let i = 0; i < 100; i++)
//         {
//             const donut = new THREE.Mesh(donutGeometry, material)
//             donut.position.x = (Math.random() - 0.5) * 10
//             donut.position.y = (Math.random() - 0.5) * 10
//             donut.position.z = (Math.random() - 0.5) * 10
//             donut.rotation.x = Math.random() * Math.PI
//             donut.rotation.y = Math.random() * Math.PI
//             const scale = Math.random()
//             donut.scale.set(scale, scale, scale)

//             scene.add(donut)
//         }
//     }
// )


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 10;

// // Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true


scenes.forEach((o,index) => {
    o.scene = createScene(o.bg,o.matcap,o.geometry);

    renderer.compile(o.scene,camera);
    o.target = new THREE.WebGLRenderTarget(sizes.width, sizes.height);
})


let aspect =1;
let postScene = new THREE.Scene();
let orthoCamera = null;

function initpost(){

    let frustumSize = 1;
    orthoCamera = new THREE.OrthographicCamera(frustumSize*aspect/-2,frustumSize*aspect/2,frustumSize/2,frustumSize/-2,-1000,1000);
    let material = new THREE.ShaderMaterial({
        side : THREE.DoubleSide,
        uniforms : {
            uTexture1 : {value : new THREE.TextureLoader().load(bg)},
            uTexture2 : {value : new THREE.TextureLoader().load(bg)},
        },

        vertexShader : vertexShader,
        fragmentShader : fragmentShader
    });

    let quad = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        material
    )

    postScene.add(quad);

}
initpost();


/**
 * Animate
 */


const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // // Update controls
    // controls.update()

    // Render
    // renderer.render(scenes[0].scene, camera)
    renderer.render(postScene,orthoCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    console.log(momentum);
    if(Math.abs(momentum)>0.01)
    {
        camera.position.z -= momentum;
    }else
    {
        return;
    }

       
}

tick()