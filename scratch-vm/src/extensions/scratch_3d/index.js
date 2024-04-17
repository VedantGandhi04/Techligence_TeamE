const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const THREE = require('three')
const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls.js');
const woodurl = require("./images/metal.png")


class Scratch3ML2ScratchBlocks {
  constructor(runtime) {
    this.runtime = runtime;

    // Initialize Three.js scene, camera, and renderer
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Initialize objects and lights
    this.objects = [];
    this.lights = [];
    this.objectslist=[{text: 'any', value: "any"}];

    // Add AmbientLight
    this.ambientLight = null;

    // Add DirectionalLight
    this.directionalLight = null;

    // Bind methods to ensure proper 'this' context
    this.createCanvas = this.createCanvas.bind(this);
    this.addCube = this.addCube.bind(this);
    this.addSphere = this.addSphere.bind(this);
    this.moveObject = this.moveObject.bind(this);
    this.rotateObject = this.rotateObject.bind(this);
    this.scaleObject = this.scaleObject.bind(this);
    this.setCameraPosition = this.setCameraPosition.bind(this);
    this.pointCameraAt = this.pointCameraAt.bind(this);
    this.setCameraZoom = this.setCameraZoom.bind(this);
    this.addPointLight = this.addPointLight.bind(this);
    this.applyTexture = this.applyTexture.bind(this);
    this.forever = this.forever.bind(this);
    // this.renderScene = this.renderScene.bind(this);

    // Initialize OrbitControls
    this.controls = null

  }

  getInfo() {
    return {
      id: '3dscratch',
      name: '3D Engine',
      blocks: [
        {
            opcode: 'intialize',
            blockType: BlockType.COMMAND,
            text: 'Initialize 3D Scene',
        },
        {
            opcode: 'removeScene',
            blockType: BlockType.COMMAND,
            text: 'Remove 3D Scene',
        },
        {
            opcode: 'createCanvas',
            blockType: BlockType.COMMAND,
            text: 'Create 3D canvas (width: [WIDTH], height: [HEIGHT], background: [BACKGROUND])),',
            arguments: {

                WIDTH: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 480
                },
                HEIGHT: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 360
                },
                BACKGROUND: {
                    type: ArgumentType.COLOR,
                    defaultValue: '#FFFFFF'
                },

            }
        },
        {
            opcode: 'addCube',
            blockType: BlockType.COMMAND,
            text: 'Add [OBJECT] (Size: [SIZE], Color: [COLOR]) at (X: [X], Y: [Y], Z: [Z])',
            arguments: {
                OBJECT: {
                    type: ArgumentType.STRING,
                    menu: 'objects',
                    defaultValue: 'Cube'
                },
                SIZE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                },
                COLOR: {
                    type: ArgumentType.COLOR,
                    defaultValue: '#FF0000'
                },
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                }
            }
        },
        {
            opcode: 'addSphere',
            blockType: BlockType.COMMAND,
            text: 'Add [OBJECT] (Radius: [RADIUS], Color: [COLOR]) at (X: [X], Y: [Y], Z: [Z])',
            arguments: {
                OBJECT: {
                    type: ArgumentType.STRING,
                    menu: 'objects',
                    defaultValue: 'shpere'
                },
                RADIUS: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                },
                COLOR: {
                    type: ArgumentType.COLOR,
                    defaultValue: '#FF0000'
                },
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                }
            }
        },
        {
            opcode: 'moveObject',
            blockType: BlockType.COMMAND,
            text: 'Move [OBJECT] by (X: [X], Y: [Y], Z: [Z])',
            arguments: {
                OBJECT: {
                    type: ArgumentType.STRING,
                    menu: 'objects'
                },
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: -1
                }
            }
        },
        {
            opcode: 'rotateObject',
            blockType: BlockType.COMMAND,
            text: 'Rotate [OBJECT] around [AXIS] by [ANGLE] degrees',
            arguments: {
                OBJECT: {
                    type: ArgumentType.STRING,
                    menu: 'objects'
                },
                AXIS: {
                    type: ArgumentType.STRING,
                    menu: 'axes',
                    defaultValue: 'Y-axis'
                },
                ANGLE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 45
                }
            }
        },
        {
            opcode: 'scaleObject',
            blockType: BlockType.COMMAND,
            text: 'Scale [OBJECT] by (X: [X], Y: [Y], Z: [Z])',
            arguments: {
                OBJECT: {
                    type: ArgumentType.STRING,
                    menu: 'objects'
                },
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 2
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 2
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 2
                }
            }
        },
        {
            opcode: 'setCameraPosition',
            blockType: BlockType.COMMAND,
            text: 'Set camera position to (X: [X], Y: [Y], Z: [Z])',
            arguments: {
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 5
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 5
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 5
                }
            }
        },
        {
            opcode: 'pointCameraAt',
            blockType: BlockType.COMMAND,
            text: 'Point camera at (X: [X], Y: [Y], Z: [Z])',
            arguments: {
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                }
            }
        },
        {
            opcode: 'setCameraZoom',
            blockType: BlockType.COMMAND,
            text: 'Set camera zoom to [ZOOM]',
            arguments: {
                ZOOM: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 2
                }
            }
        },
        {
            opcode: 'addPointLight',
            blockType: BlockType.COMMAND,
            text: 'Add [LIGHT] at (X: [X], Y: [Y], Z: [Z]) with color [COLOR] and intensity [INTENSITY]',
            arguments: {
                LIGHT: {
                    type: ArgumentType.STRING,
                    menu: 'lights',
                    defaultValue: 'Point Light'
                },
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 10
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 10
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 10
                },
                COLOR: {
                    type: ArgumentType.COLOR,
                    defaultValue: '#FFFFFF'
                },
                INTENSITY: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                }
            }
        },
        {
            opcode: 'applyTexture',
            blockType: BlockType.COMMAND,
            text: 'Apply texture [TEXTURE] to [OBJECT]',
            arguments: {
                TEXTURE: {
                    type: ArgumentType.STRING,
                    menu: 'textures',
                    defaultValue: 'Wood'
                },
                OBJECT: {
                    type: ArgumentType.STRING,
                    menu: 'objects'
                }
            }
        },
        {
            opcode: 'forever',
            blockType: BlockType.HAT,
            text: 'Forever [SUBSTACK]',
            arguments: {
                SUBSTACK: {
                    type: ArgumentType.ARRAY,
                    defaultValue: [
                        {
                            opcode: 'rotateObject',
                            arguments: {
                                OBJECT: {
                                    type: ArgumentType.STRING,
                                    menu: 'objects',
                                    defaultValue: 'Object1'
                                },
                                AXIS: {
                                    type: ArgumentType.STRING,
                                    menu: 'axes',
                                    defaultValue: 'Y-axis'
                                },
                                ANGLE: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 1
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            opcode: 'setSpeed',
            blockType: BlockType.COMMAND,
            text: 'Set [MOTION_TYPE] of [VALUE] to [OBJECT] around [AXIS]',
            arguments: {
                MOTION_TYPE: {
                    type: ArgumentType.STRING,
                    menu: 'motionTypes',
                    defaultValue: 'Forward Speed'
                },
                VALUE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 10
                },
                OBJECT: {
                    type: ArgumentType.STRING,
                    menu: 'objects',
                    defaultValue: 'Object1'
                },
                AXIS: {
                    type: ArgumentType.STRING,
                    menu: 'axes',
                    defaultValue: 'Y-axis'
                },
            }
        },
    ],
        menus: {
            motionTypes: {
                acceptReporters: true,
                items: [
                    {
                        text: 'Forward Speed',
                        value: 'Forward Speed'
                    },
                    // {
                    //     text: 'Directional Speed',
                    //     value: 'Directional Speed'
                    // },
                    // {
                    //     text: 'Side Move Speed',
                    //     value: 'Side Move Speed'
                    // },
                    // {
                    //     text: 'Rising Speed',
                    //     value: 'Rising Speed'
                    // },
                    // {
                    //     text: 'Forward Acceleration',
                    //     value: 'Forward Acceleration'
                    // },
                    // {
                    //     text: 'Gravity',
                    //     value: 'Gravity'
                    // },
                    {
                        text: 'Rotation',
                        value: 'Rotation'
                    },
                ]
            },
            objects: {
                acceptReporters: true,
                items: 'getobjectlist'
                },
            axes: {
                aceptReporters: true,
                    items: [
                            {
                            text: 'X-axis',
                            value: 'X-axis'
                            },
                            {
                            text: 'Y-axis',
                            value: 'Y-axis'
                            },
                            {
                            text: 'Z-axis',
                            value: 'Z-axis'
                            }
                        ]
                    },
            lights: {
                    acceptReporters: true,
                        items: [
                            {
                                text: 'Point Light',
                                value: 'Point Light'
                                }
                                ]
                                },
                                textures: {
                                acceptReporters: true,
                                items: [
                                {
                                text: 'Wood',
                                value: 'Wood'
                            }
                            ]
                    }
                                }
        };
    }
    
    getobjectlist() {
        
        return this.objectslist;
    }

    setSpeed(args) {
        const { MOTION_TYPE, VALUE , OBJECT, AXIS} = args;

        let speed = VALUE;
    
        switch (MOTION_TYPE) {
            case 'Forward Speed':
                // Handle forward speed logic
                switch (AXIS) {
                    case 'X-axis':
                        const animatex = () => {
                            requestAnimationFrame(animatex);
                            OBJECT.position.x += speed*0.01;
                            this.renderer.render(this.scene, this.camera);
                          };
                        
                          animatex();
                      
                        break;
                    case 'Y-axis':
                        const animatey = () => {
                            requestAnimationFrame(animatey);
                            OBJECT.position.y += speed*0.01;
                            this.renderer.render(this.scene, this.camera);
                          };
                        
                          animatey();
                        break;
                    case 'Z-axis':
                        const animatez = () => {
                            requestAnimationFrame(animatez);
                            OBJECT.position.z += speed*0.01;
                            this.renderer.render(this.scene, this.camera);
                          };
                        
                          animatez();
                        break;
                }
                break;
            case 'Rotation':
                switch (AXIS) {
                    case 'X-axis':
                        const animatex = () => {
                            requestAnimationFrame(animatex);
                            OBJECT.rotation.x += speed*0.01;
                            this.renderer.render(this.scene, this.camera);
                          };
                        
                          animatex();
                      
                        break;
                    case 'Y-axis':
                        const animatey = () => {
                            requestAnimationFrame(animatey);
                            OBJECT.rotation.y += speed * 0.01;
                            this.renderer.render(this.scene, this.camera);
                          };
                        
                          animatey();
                        break;
                    case 'Z-axis':
                        const animatez = () => {
                            requestAnimationFrame(animatez);
                            OBJECT.rotation.z += speed * 0.01;
                            this.renderer.render(this.scene, this.camera);
                          };
                        
                          animatez();
                        break;
                }
                // Handle directional speed logic
                break;
            // ... handle other motion types
            default:
                break;
        }
    }
    intialize(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0,0,5);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(480, 360);
        document.body.appendChild(this.renderer.domElement);
        this.objects = [];
        this.lights = [];
        this.objectslist=[{text: 'any', value: "any"}];
        // Add AmbientLight
        this.ambientLight = new THREE.AmbientLight(0x404040,40);
        this.scene.add(this.ambientLight);

        // Add DirectionalLight
        // this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        // this.directionalLight.position.set(5, 5, 5);
        // this.scene.add(this.directionalLight);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // For smooth camera movement
        this.controls.dampingFactor = 0.25;
        this.controls.rotateSpeed = 0.35; // Adjust the rotation speed as needed
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
            // Update controls
            this.controls.update();
        };
        animate();
    }

    removeScene(){
        document.body.removeChild(this.renderer.domElement);
    }

    createCanvas(args) {
        const { WIDTH, HEIGHT, BACKGROUND } = args;
        this.scene.background = new THREE.Color(BACKGROUND);
        this.renderer.setSize(WIDTH, HEIGHT);
    }
    
    addCube(args) {
        
    const { SIZE, COLOR, X, Y, Z } = args;
        
  
    // Create a cube
    const geometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
    const material = new THREE.MeshStandardMaterial({ color: COLOR });
    const cube = new THREE.Mesh(geometry, material);
    cube.material.needsUpdate = true;
    cube.position.set(X, Y, Z);
    this.scene.add(cube);
    this.objects.push(cube);
    this.objectslist.push({ text: `Cube ${this.objects.length}`, value: cube });

    console.log(cube);
    
    // // Render the scene
    // this.renderer.render(this.scene, this.camera);
    }
    
    addSphere(args) {
        const { RADIUS, COLOR, X, Y, Z } = args;
        const geometry = new THREE.SphereGeometry(RADIUS, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: COLOR });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(X, Y, Z);
        sphere.material.needsUpdate = true;
        this.scene.add(sphere);
        this.objects.push(sphere);
        this.objectslist.push({ text: `Sphere ${this.objects.length}`, value: sphere});

    }
    
    moveObject(args) {
        const { OBJECT, X, Y, Z } = args;
        OBJECT.position.x += X;
        OBJECT.position.y += Y;
        OBJECT.position.z += Z;
    }
    
    rotateObject(args) {
        const { OBJECT, AXIS, ANGLE } = args;
        const radians = Math.PI * ANGLE / 180;
        switch (AXIS) {
            case 'X-axis':
                OBJECT.rotateX(radians);
                break;
            case 'Y-axis':
                OBJECT.rotateY(radians);
                break;
            case 'Z-axis':
                OBJECT.rotateZ(radians);
                break;
        }
    }
    
    scaleObject(args) {
        const { OBJECT, X, Y, Z } = args;
        OBJECT.scale.set(X, Y, Z);
    }
    
    setCameraPosition(args) {
        const { X, Y, Z } = args;
        this.camera.position.set(X, Y, Z);
    }
    
    pointCameraAt(args) {
        const { X, Y, Z } = args;
        this.camera.lookAt(new THREE.Vector3(X, Y, Z));
    }
    
    setCameraZoom(args) {
        const { ZOOM } = args;
        this.camera.zoom = ZOOM;
        this.camera.updateProjectionMatrix();
    }
    
    addPointLight(args) {
        const { X, Y, Z, COLOR, INTENSITY } = args;
        const light = new THREE.PointLight(COLOR, INTENSITY);
        light.position.set(X, Y, Z);
        this.scene.add(light);
        this.lights.push(light);

        console.log(light);
    }
    
    applyTexture(args) {
        const { TEXTURE, OBJECT } = args;
    const textureLoader = new THREE.TextureLoader();

    // Define a mapping between texture names and texture file paths
    const textureMap = {
        'Wood': 'https://global.discourse-cdn.com/standard17/uploads/threejs/optimized/2X/8/8079529706d44d8af139269d59439bdbe3d3adad_2_500x500.jpeg',
        'Metal': 'https://static.vecteezy.com/system/resources/thumbnails/007/408/014/small/stylish-panoramic-background-silver-steel-metal-texture-vector.jpg',
        // Add more texture mappings as needed
    };

    // Get the texture file path from the texture map
    const texturePath = textureMap[TEXTURE];

    if (texturePath) {
        textureLoader.load(texturePath, (texture) => {
            // Apply the texture to the object's material
            const material = new THREE.MeshStandardMaterial({
                map: texture,
            });
            OBJECT.material = material;
        }, undefined, (error) => {
            console.error('An error occurred while loading the texture:', error);
        });
    } else {
        console.warn(`Texture "${TEXTURE}" not found in the texture map.`);
    }
    }
    
    forever(args) {
        const { SUBSTACK } = args;
        const animate = () => {
            requestAnimationFrame(animate);
            SUBSTACK.forEach(block => {
                switch (block.opcode) {
                    case 'rotateObject':
                        this.rotateObject(block.arguments);
                        break;
                    // Add more cases for other blocks in the SUBSTACK
                }
            });
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}

exports.blockClass = Scratch3ML2ScratchBlocks;
module.exports = Scratch3ML2ScratchBlocks;
