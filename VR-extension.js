(function(Scratch) {
    'use strict';

    class VRExtension {
        constructor() {
            this.xrSession = null;
            this.scene = null;
            this.renderer = null;
            this.camera = null;
            this.objects = {};
            this.initWebXR();
        }

        getInfo() {
            return {
                id: 'vrExtension',
                name: 'VRExtension',
                blocks: [
                    {
                        opcode: 'setVRBackgroundColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set VR background color [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#00ff00'
                            }
                        }
                    },
                    {
                        opcode: 'createVRObject',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create VR object [NAME] of type [TYPE]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'object'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'cube'
                            }
                        }
                    },
                    {
                        opcode: 'moveVRObject',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'move VR object [NAME] to x: [X] y: [Y] z: [Z]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'object'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'rotateVRObject',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'rotate VR object [NAME] by [DEGREES] degrees around [AXIS]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'object'
                            },
                            DEGREES: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 90
                            },
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'y'
                            }
                        }
                    },
                    {
                        opcode: 'scaleVRObject',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'scale VR object [NAME] by x: [X] y: [Y] z: [Z]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'object'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'changeVRObjectColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change color of VR object [NAME] to [COLOR]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'object'
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#ff0000'
                            }
                        }
                    },
                    {
                        opcode: 'labelVRObject',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'label VR object [NAME] with [LABEL]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'object'
                            },
                            LABEL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'label'
                            }
                        }
                    }
                ],
                menus: {}
            };
        }

        initWebXR() {
            if ('xr' in navigator) {
                navigator.xr.requestSession('immersive-vr').then((session) => {
                    this.xrSession = session;
                    this.setupScene();
                }).catch((err) => {
                    console.error('Failed to create XR session:', err);
                });
            } else {
                console.error('WebXR is not supported in this browser.');
            }
        }

        setupScene() {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            animate();
        }

        setVRBackgroundColor(args) {
            console.log('VR Background Color:', args.COLOR);
            if (this.scene) {
                this.scene.background = new THREE.Color(args.COLOR);
            }
        }

        createVRObject(args) {
            console.log('Create VR Object:', args.NAME, args.TYPE);
            let object;
            switch (args.TYPE) {
                case 'cube':
                    object = new THREE.Mesh(
                        new THREE.BoxGeometry(),
                        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
                    );
                    break;
                // Add more types as needed
                default:
                    console.error('Unknown object type:', args.TYPE);
                    return;
            }
            object.name = args.NAME;
            this.scene.add(object);
            this.objects[args.NAME] = object;
        }

        moveVRObject(args) {
            console.log(`Move ${args.NAME} to (${args.X}, ${args.Y}, ${args.Z})`);
            const object = this.objects[args.NAME];
            if (object) {
                object.position.set(args.X, args.Y, args.Z);
            }
        }

        rotateVRObject(args) {
            console.log(`Rotate ${args.NAME} by ${args.DEGREES} degrees around ${args.AXIS}`);
            const object = this.objects[args.NAME];
            if (object) {
                const radians = THREE.Math.degToRad(args.DEGREES);
                switch (args.AXIS) {
                    case 'x':
                        object.rotation.x = radians;
                        break;
                    case 'y':
                        object.rotation.y = radians;
                        break;
                    case 'z':
                        object.rotation.z = radians;
                        break;
                    default:
                        console.error('Unknown axis:', args.AXIS);
                }
            }
        }

        scaleVRObject(args) {
            console.log(`Scale ${args.NAME} by (${args.X}, ${args.Y}, ${args.Z})`);
            const object = this.objects[args.NAME];
            if (object) {
                object.scale.set(args.X, args.Y, args.Z);
            }
        }

        changeVRObjectColor(args) {
            console.log(`Change color of ${args.NAME} to ${args.COLOR}`);
            const object = this.objects[args.NAME];
            if (object && object.material) {
                object.material.color.set(args.COLOR);
            }
        }

        labelVRObject(args) {
            console.log(`Label ${args.NAME} with ${args.LABEL}`);
            const object = this.objects[args.NAME];
            if (object) {
                object.userData.label = args.LABEL;
            }
        }
    }

    // Register the extension
    Scratch.extensions.register(new VRExtension());
})(Scratch);