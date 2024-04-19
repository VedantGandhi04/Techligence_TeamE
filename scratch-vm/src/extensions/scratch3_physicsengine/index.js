const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast')
const formatMessage = require('format-message');
const blockIconURI = 'data:image/png;base64,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';


const Runtime = require('../../engine/runtime.js');
const RenderedTarget = require('../../sprites/rendered-target.js');
const Box2D = require('../../extensions/scratch3_physicsengine/box2d_es6');
const b2World = Box2D.Dynamics.b2World;
const b2Vec2 = Box2D.Common.Math.b2Vec2;
const b2AABB = Box2D.Collision.b2AABB;
const b2BodyDef = Box2D.Dynamics.b2BodyDef;
const b2Body = Box2D.Dynamics.b2Body;
const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
// const b2Fixture = Box2D.Dynamics.b2Fixture;
// const b2Fixture = Box2D.Dynamics.b2Fixture;
const b2Contact = Box2D.Dynamics.Contacts.b2Contact;
// const b2MassData = Box2D.Collision.Shapes.b2MassData;
const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
// const b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
const b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
const b2Math = Box2D.Common.Math.b2Math;

let world; let zoom;
const fixDef = new b2FixtureDef();
const bodyDef = new b2BodyDef();

// const uid_seq = 0;
// let ujidSeq = 0;

const prevPos = {};
/**
 * Active b2Body/s in the world.
 * @type {Object.<string,*>}
 */
const bodies = {};
// const joints = {};
const pinned = {}; // Map of IDs to pinned joints
/**
 * The runtime instantiating this block package.
 * @type {Array}
 */
const stageBodies = [];

// const categorySeq = 1;
// const categories = {default: 1};

const bodyCategoryBits = 1;
const bodyMaskBits = 1;
// const noCollideSeq = 0;

const toRad = Math.PI / 180;

// Used to record the scroll position of all sprites
const _scroll = new b2Vec2(0, 0);

const STAGE_TYPE_OPTIONS = {
    BOXED: 'boxed',
    FLOOR: 'floor',
    OPEN: 'open'
};

const SPACE_TYPE_OPTIONS = {
    WORLD: 'world',
    STAGE: 'stage',
    RELATIVE: 'relative'
};

const WHERE_TYPE_OPTIONS = {
    ANY: 'any',
    FEET: 'feet'
};

const SHAPE_TYPE_OPTIONS = {
    COSTUME: 'costume',
    CIRCLE: 'circle',
    SVG_POLYGON: 'svg',
    ALL: 'all'
};

const _definePolyFromHull = function (hullPoints) {
    fixDef.shape = new b2PolygonShape();

    const vertices = [];

    let prev = null;
    for (let i = hullPoints.length - 1; i >= 0; i--) {
    // for (let i = 0; i < hullPoints.length; i++) {
        const b2Vec = new b2Vec2(hullPoints[i].x / zoom, hullPoints[i].y / zoom);
        if (prev !== null && b2Math.SubtractVV(b2Vec, prev).LengthSquared() > Number.MIN_VALUE) {
            vertices.push(b2Vec);
        }
        prev = b2Vec;
    }

    fixDef.shape.SetAsArray(vertices);
};

const _placeBody = function (id, x, y, dir) {
    if (bodies[id]) {
        world.DestroyBody(bodies[id]);
    }

    fixDef.filter.categoryBits = bodyCategoryBits;
    fixDef.filter.maskBits = bodyMaskBits;

    bodyDef.position.x = (x + _scroll.x) / zoom;
    bodyDef.position.y = (y + _scroll.y) / zoom;
    bodyDef.angle = (90 - dir) * toRad;

    const body = world.CreateBody(bodyDef);
    body.uid = id;
    body.CreateFixture(fixDef);
    bodies[id] = body;
    return body;
};

const _applyForce = function (id, ftype, x, y, dir, pow) {
    const body = bodies[id];
    if (!body) {
        return;
    }

    dir = (90 - dir) * toRad;

    if (ftype === 'Impulse') {

        const center = body.GetLocalCenter(); // get the mass data from you body

        body.ApplyImpulse({x: pow * Math.cos(dir), y: pow * Math.sin(dir)},
            body.GetWorldPoint({x: (x / zoom) + center.x, y: (y / zoom) + center.y}));
    } else if (ftype === 'World Impulse') {
        body.ApplyForce({x: pow * Math.cos(dir), y: pow * Math.sin(dir)},
            {x: x / zoom, y: y / zoom});
    }
};

// ['', 'Define Spring Length: %n Damping: %n  Freq: %n', '_defineSpring', 100, 0.5, 8],
const defSpring = {len: 100, damp: 0.7, freq: 5};
const _defineSpring = function (len, damp, freq) {
    defSpring.len = len < 0.1 ? 0.1 : len / zoom;
    defSpring.damp = damp < 0 ? 0.7 : damp;
    defSpring.freq = freq > 0 ? freq : 5;
};

const _createJointOfType = function (jName, typ, bodyID, x, y, bodyID2, x2, y2) {

    // if (jName.length > 0) ext.destroyJoint(jName);

    if (!bodyID) bodyID = null;
    if (!bodyID2) bodyID2 = null;
    if (!bodyID && !bodyID2) {
        return null;
    }

    const body = bodyID ? bodies[bodyID] : world.GetGroundBody();
    const body2 = bodyID2 ? bodies[bodyID2] : world.GetGroundBody();

    if (!body || !body2) return null;

    let md;
    switch (typ) {
    case 'Spring':
        md = new Box2D.Dynamics.Joints.b2DistanceJointDef();
        md.length = defSpring.len;
        md.dampingRatio = defSpring.damp;
        md.frequencyHz = defSpring.freq;
        md.bodyA = body;
        md.bodyB = body2;
        md.localAnchorA = {x: x / zoom, y: y / zoom};
        md.localAnchorB = {x: x2 / zoom, y: y2 / zoom};
        break;

    case 'Rotating':
        md = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
        md.bodyA = body;
        md.bodyB = body2;
        md.localAnchorA = {x: x / zoom, y: y / zoom};
        if (x2 === null) {
            if (body2) {
                md.localAnchorB = body2.GetLocalPoint(body.GetPosition()); // Wheel Type Joint...
            } else {
                md.localAnchorB = body.GetWorldPoint({x: (x / zoom), y: (y / zoom)});
            }
        } else {
            md.localAnchorB = {x: x2 / zoom, y: y2 / zoom};
        }
        break;

    case 'Mouse':
        md = new b2MouseJointDef();
        if (bodyID) {
            md.bodyB = body;
            md.target.Set(x / zoom, y / zoom);
        } else {
            md.bodyB = body2;
            md.target.Set(x2 / zoom, y2 / zoom);
        }
        md.bodyA = world.GetGroundBody();
        md.collideConnected = true;
        md.maxForce = 300.0 * body.GetMass();
        break;
    }

    // md.collideConnected = true;
    // md.maxForce = 300.0 * body.GetMass();
    const joint = world.CreateJoint(md);
    if (bodyID) {
        body.SetAwake(true);
    }
    if (bodyID2) {
        body2.SetAwake(true);
    }

    // if (!jName) {
    //     ujidSeq++;
    //     jName = `_${ujidSeq}`;
    // }
    // joints[jName] = joint;
    return joint;
};

/**
 * Set the X and Y coordinates (No Fencing)
 * @param {!RenderedTarget} rt the renderedTarget.
 * @param {!number} x New X coordinate, in Scratch coordinates.
 * @param {!number} y New Y coordinate, in Scratch coordinates.
 * @param {?boolean} force Force setting X/Y, in case of dragging
 */
const _setXY = function (rt, x, y, force) {
    if (rt.isStage) return;
    if (rt.dragging && !force) return;
    const oldX = rt.x;
    const oldY = rt.y;
    if (rt.renderer) {
        // const position = rt.renderer.getFencedPositionOfDrawable(rt.drawableID, [x, y]);
        rt.x = x; // position[0];
        rt.y = y; // position[1];

        rt.renderer.updateDrawableProperties(rt.drawableID, {
            position: [x, y]
        });
        if (rt.visible) {
            rt.emit(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, rt);
            rt.runtime.requestRedraw();
        }
    } else {
        rt.x = x;
        rt.y = y;
    }
    rt.emit(RenderedTarget.EVENT_TARGET_MOVED, rt, oldX, oldY, force);
    rt.runtime.requestTargetsUpdate(rt);
};

const createStageBody = function () {
    const body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);
    stageBodies.push(body);
};

const _setStageType = function (type) {

    // Clear down previous stage
    if (stageBodies.length > 0) {
        for (const stageBodyID in stageBodies) {
            world.DestroyBody(stageBodies[stageBodyID]);
            delete stageBodies[stageBodyID];
        }
    }

    // Build up new stage
    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape();
    bodyDef.angle = 0;

    if (type === STAGE_TYPE_OPTIONS.BOXED) {
        fixDef.shape.SetAsBox(250 / zoom, 10 / zoom); // Bottom wall
        bodyDef.position.Set(0, -190 / zoom);
        createStageBody();

        fixDef.shape.SetAsBox(250 / zoom, 10 / zoom); // Top wall
        bodyDef.position.Set(0, 190 / zoom);
        createStageBody();

        fixDef.shape.SetAsBox(10 / zoom, 800 / zoom); // Left wall
        bodyDef.position.Set(-250 / zoom, 540 / zoom);
        createStageBody();

        fixDef.shape.SetAsBox(10 / zoom, 800 / zoom); // Right wall
        bodyDef.position.Set(250 / zoom, 540 / zoom);
        createStageBody();

    } else if (type === STAGE_TYPE_OPTIONS.FLOOR) {
        fixDef.shape.SetAsBox(5000 / zoom, 100 / zoom);
        bodyDef.position.Set(0, -280 / zoom);
        createStageBody();
        bodyDef.position.Set(-10000, -280 / zoom);
        createStageBody();
        bodyDef.position.Set(10000, -280 / zoom);
        createStageBody();
        bodyDef.position.Set(-20000, -280 / zoom);
        createStageBody();
        bodyDef.position.Set(20000, -280 / zoom);
        createStageBody();
    }

    bodyDef.type = b2Body.b2_dynamicBody;

    for (const bodyID in bodies) {
        bodies[bodyID].SetAwake(true);
    }
};

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len

/**
 * Class for the music-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

class Scratch3Physicsengine {
    constructor(runtime) {

        this.runtime = runtime;

        // Clear target motion state values when the project starts.
        this.runtime.on(Runtime.PROJECT_START, this.reset.bind(this));

        world = new b2World(
            new b2Vec2(0, -10), // gravity (10)
            true // allow sleep
        );

        zoom = 50; // scale;

        this.map = {};

        fixDef.density = 1.0; // 1.0
        fixDef.friction = 0.5; // 0.5
        fixDef.restitution = 0.2; // 0.2

        _setStageType(STAGE_TYPE_OPTIONS.BOXED);

        this.video = document.createElement('video');
        this.video.autoplay = true;

        this.interval = 1000;
        this.minInterval = 100;

        const media = navigator.mediaDevices.getUserMedia({
            video: {
                width: 360,
                height: 360
            },
            audio: false
        });

        media.then(stream => {
            this.video.srcObject = stream;
        });

        

        
      

        
        

        this.runtime.ioDevices.video.enableVideo();

        this.devices = [{ text: 'default', value: '' }];
        try {
            navigator.mediaDevices.enumerateDevices().then(media => {
                for (const device of media) {
                    if (device.kind === 'videoinput') {
                        this.devices.push({
                            text: device.label,
                            value: device.deviceId
                        });
                    }
                }
            });
        } catch {
            console.error('failed to load media devices!');
        }

        let script = document.createElement('script');
        script.src = 'https://stretch3.github.io/ml5-library/ml5.min.js';
        document.head.appendChild(script);
    }

    reset () {
        for (const body in bodies) {
            if (pinned[body.uid]) {
                world.DestroyJoint(pinned[body.uid]);
                delete pinned[body.uid];
            }
            world.DestroyBody(bodies[body]);
            delete bodies[body];
            delete prevPos[body];
        }

        // todo: delete joins?
    }

    /**
     * The key to load & store a target's music-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.Griffpatch';
    }

    /**
     * Initialize the result of image classification.
     */
    initImageProbableLabels() {
        this.imageProbableLabels = [];
    }

    initSoundProbableLabels() {
        this.soundProbableLabels = [];
    }

    getInfo() {

        return {
            id: 'physicsengine',
            name: 'Physics Engine',
            blockIconURI: blockIconURI,
            blocks: [
                
                {
                    opcode: 'setStage',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setStage',
                        default: 'setup stage [stageType]',
                        description: 'Set the stage type'
                    }),
                    arguments: {
                        stageType: {
                            type: ArgumentType.STRING,
                            menu: 'StageTypes',
                            defaultValue: STAGE_TYPE_OPTIONS.BOXED
                        }
                    }
                },
                
                {
                    opcode: 'setGravity',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setGravity',
                        default: 'set gravity to x: [gx] y: [gy]',
                        description: 'Set the gravity'
                    }),
                    arguments: {
                        gx: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        gy: {
                            type: ArgumentType.NUMBER,
                            defaultValue: -10
                        }
                    }
                },

                '---',

                {
                    opcode: 'setPhysics',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setPhysics',
                        default: 'enable for [shape] mode [mode]',
                        description: 'Enable Physics for this Sprite'
                    }),
                    arguments: {
                        shape: {
                            type: ArgumentType.STRING,
                            menu: 'ShapeTypes',
                            defaultValue: 'costume'
                        },
                        mode: {
                            type: ArgumentType.STRING,
                            menu: 'EnableModeTypes',
                            defaultValue: 'normal'
                        }
                    }
                },
                // {
                //     opcode: 'setPhysics',
                //     blockType: BlockType.COMMAND,
                //     text: formatMessage({
                //         id: 'griffpatch.setPhysics',
                //         default: 'enable physics for sprite [shape]',
                //         description: 'Enable Physics for this Sprite'
                //     }),
                //     arguments: {
                //         shape: {
                //             type: ArgumentType.STRING,
                //             menu: 'ShapeTypes',
                //             defaultValue: 'costume'
                //         }
                //     }
                // },
                // {
                //     opcode: 'setPhysicsAll',
                //     blockType: BlockType.COMMAND,
                //     text: formatMessage({
                //         id: 'griffpatch.setPhysicsAll',
                //         default: 'enable physics for all sprites',
                //         description: 'Enable Physics For All Sprites'
                //     })
                // },
                //
                '---',

                {
                    opcode: 'doTick',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.doTick',
                        default: 'step simulation',
                        description: 'Run a single tick of the physics simulation'
                    })
                },

                '---',

                {
                    opcode: 'setPosition',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setPosition',
                        default: 'go to x: [x] y: [y] [space]',
                        description: 'Position Sprite'
                    }),
                    arguments: {
                        x: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        y: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        space: {
                            type: ArgumentType.STRING,
                            menu: 'SpaceTypes',
                            defaultValue: 'world'
                        }
                    }
                },


                '---',


                // applyForce (target, ftype, x, y, dir, pow) {
                // applyAngForce (target, pow) {

                {
                    opcode: 'setVelocity',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setVelocity',
                        default: 'set velocity to sx: [sx] sy: [sy]',
                        description: 'Set Velocity'
                    }),
                    arguments: {
                        sx: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        sy: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'changeVelocity',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.changeVelocity',
                        default: 'change velocity by sx: [sx] sy: [sy]',
                        description: 'Change Velocity'
                    }),
                    arguments: {
                        sx: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        sy: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getVelocityX',
                    text: formatMessage({
                        id: 'griffpatch.getVelocityX',
                        default: 'x velocity',
                        description: 'get the x velocity'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getVelocityY',
                    text: formatMessage({
                        id: 'griffpatch.getVelocityY',
                        default: 'y velocity',
                        description: 'get the y velocity'
                    }),
                    blockType: BlockType.REPORTER
                },

                '---',

                {
                    opcode: 'applyForce',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.applyForce',
                        default: 'push with force [force] in direction [dir]',
                        description: 'Push this object in a given direction'
                    }),
                    arguments: {
                        force: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 25
                        },
                        dir: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'applyAngForce',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.applyAngForce',
                        default: 'spin with force [force]',
                        description: 'Push this object in a given direction'
                    }),
                    arguments: {
                        force: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        }
                    }
                },

                '---',

                {
                    opcode: 'setStatic',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setStatic',
                        default: 'set fixed [static]',
                        description: 'Sets whether this block is static or dynamic'
                    }),
                    arguments: {
                        static: {
                            type: ArgumentType.STRING,
                            menu: 'StaticTypes',
                            defaultValue: 'static'
                        }
                    }
                },
                // {
                //     opcode: 'setDensity',
                //     blockType: BlockType.COMMAND,
                //     text: formatMessage({
                //         id: 'griffpatch.setDensity',
                //         default: 'set density [density]',
                //         description: 'Set the density of the object'
                //     }),
                //     arguments: {
                //         density: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 1
                //         }
                //     }
                // },
                {
                    opcode: 'setProperties',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setProperties',
                        default: 'set density [density] roughness [friction] bounce [restitution]',
                        description: 'Set the density of the object'
                    }),
                    arguments: {
                        density: {
                            type: ArgumentType.NUMBER,
                            menu: 'DensityTypes',
                            defaultValue: 100
                        },
                        friction: {
                            type: ArgumentType.NUMBER,
                            menu: 'FrictionTypes',
                            defaultValue: 50
                        },
                        restitution: {
                            type: ArgumentType.NUMBER,
                            menu: 'RestitutionTypes',
                            defaultValue: 20
                        }
                    }
                },
                // {
                //     opcode: 'pinSprite',
                //     blockType: BlockType.COMMAND,
                //     text: formatMessage({
                //         id: 'griffpatch.pinSprite',
                //         default: 'pin to world at sprite\'s x: [x] y: [y]',
                //         description: 'Pin the sprite'
                //     }),
                //     arguments: {
                //         x: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         },
                //         y: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 0
                //         }
                //     }
                // },

                '---',

                {
                    opcode: 'getTouching',
                    text: formatMessage({
                        id: 'griffpatch.getTouching',
                        default: 'touching [where]',
                        description: 'get the name of any sprites we are touching'
                    }),
                    blockType: BlockType.REPORTER,
                    arguments: {
                        where: {
                            type: ArgumentType.STRING,
                            menu: 'WhereTypes',
                            defaultValue: 'any'
                        }
                    }
                },

                // Scene Scrolling -------------------

                '---',

                {
                    opcode: 'setScroll',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.setScroll',
                        default: 'set scroll x: [ox] y: [oy]',
                        description: 'Sets whether this block is static or dynamic'
                    }),
                    arguments: {
                        ox: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        oy: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'changeScroll',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'griffpatch.changeScroll',
                        default: 'change scroll by x: [ox] y: [oy]',
                        description: 'Sets whether this block is static or dynamic'
                    }),
                    arguments: {
                        ox: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        oy: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getScrollX',
                    text: formatMessage({
                        id: 'griffpatch.getScrollX',
                        default: 'x scroll',
                        description: 'get the x scroll'
                    }),
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getScrollY',
                    text: formatMessage({
                        id: 'griffpatch.getScrollY',
                        default: 'y scroll',
                        description: 'get the y scroll'
                    }),
                    blockType: BlockType.REPORTER
                },
            ],
            menus: {
                StageTypes: this.STAGE_TYPE_MENU,
                SpaceTypes: this.SPACE_TYPE_MENU,
                WhereTypes: this.WHERE_TYPE_MENU,
                ShapeTypes: this.SHAPE_TYPE_MENU,
                EnableModeTypes: this.ENABLE_TYPES_TYPE_MENU,
                StaticTypes: this.STATIC_TYPE_MENU,
                FrictionTypes: this.FRICTION_TYPE_MENU,
                RestitutionTypes: this.RESTITUTION_TYPE_MENU,
                DensityTypes: this.DENSITY_TYPE_MENU,
            }
        };
    }

    

    get STAGE_TYPE_MENU () {
        return [
            {text: 'boxed stage', value: STAGE_TYPE_OPTIONS.BOXED},
            {text: 'open (with floor)', value: STAGE_TYPE_OPTIONS.FLOOR},
            {text: 'open (no floor)', value: STAGE_TYPE_OPTIONS.OPEN}
        ];
    }

    get SPACE_TYPE_MENU () {
        return [
            {text: 'in world', value: SPACE_TYPE_OPTIONS.WORLD},
            {text: 'on stage', value: SPACE_TYPE_OPTIONS.STAGE},
            {text: 'relative', value: SPACE_TYPE_OPTIONS.RELATIVE}
        ];
    }

    get WHERE_TYPE_MENU () {
        return [
            {text: 'any', value: WHERE_TYPE_OPTIONS.ANY},
            {text: 'feet', value: WHERE_TYPE_OPTIONS.FEET}
        ];
    }

    get SHAPE_TYPE_MENU () {
        return [
            {text: 'this costume', value: SHAPE_TYPE_OPTIONS.COSTUME},
            {text: 'this circle', value: SHAPE_TYPE_OPTIONS.CIRCLE},
            {text: 'this polygon', value: SHAPE_TYPE_OPTIONS.SVG_POLYGON},
            {text: 'all sprites', value: SHAPE_TYPE_OPTIONS.ALL}
        ];
    }

    get ENABLE_TYPES_TYPE_MENU () {
        return [
            {text: 'normal', value: 'normal'},
            {text: 'precision', value: 'bullet'}
        ];
    }

    get STATIC_TYPE_MENU () {
        return [
            {text: 'free', value: 'dynamic'},
            {text: 'fixed in place', value: 'static'},
            {text: 'fixed (but can rotate)', value: 'pinned'}
        ];
    }

    get DENSITY_TYPE_MENU () {
        return [
            {text: 'very light', value: '25'},
            {text: 'light', value: '50'},
            {text: 'normal', value: '100'},
            {text: 'heavy', value: '200'},
            {text: 'very heavy', value: '400'}
        ];
    }

    get FRICTION_TYPE_MENU () {
        return [
            {text: 'none', value: '0'},
            {text: 'smooth', value: '20'},
            {text: 'normal', value: '50'},
            {text: 'rough', value: '75'},
            {text: 'extremely rough', value: '100'}
        ];
    }

    get RESTITUTION_TYPE_MENU () {
        return [
            {text: 'none', value: '0'},
            {text: 'little', value: '10'},
            {text: 'normal', value: '20'},
            {text: 'quite bouncy', value: '40'},
            {text: 'very bouncy', value: '70'},
            {text: 'unstable', value: '100'}
        ];
    }

    /**
     * Play a drum sound for some number of beats.
     * @property {number} x - x offset.
     * @property {number} y - y offset.
     */
    doTick () { // args, util) {
        // this._playDrumForBeats(args.DRUM, args.BEATS, util);
        // if (util.runtime.audioEngine === null) return;
        // if (util.target.sprite.soundBank === null) return;

        // const dx = Cast.toNumber(args.x);
        // const dy = Cast.toNumber(args.y);

        // const allTargets = this.runtime.targets;
        // if (allTargets === null) return;
        // for (let i = 0; i < allTargets.length; i++) {
        //     const target = allTargets[i];
        //     if (!target.isStage) {
        //         target.setXY(target.x + dx, target.y + dy);
        //     }
        // }

        // util.target.setXY(util.target.x + dx, util.target.y + dy);

        // Matter.Engine.update(this.engine, 1000 / 30);
        this._checkMoved();

        // world.Step(1 / 30, 10, 10);
        world.Step(1 / 30, 10, 10);
        world.ClearForces();

        for (const targetID in bodies) {
            const body = bodies[targetID];
            const target = this.runtime.getTargetById(targetID);
            if (!target) {
                // Drop target from simulation
                world.DestroyBody(body);
                delete bodies[targetID];
                delete prevPos[targetID];
                continue;
            }

            const position = body.GetPosition();

            _setXY(target, (position.x * zoom) - _scroll.x, (position.y * zoom) - _scroll.y);
            if (target.rotationStyle === RenderedTarget.ROTATION_STYLE_ALL_AROUND) {
                target.setDirection(90 - (body.GetAngle() / toRad));
            }

            prevPos[targetID] = {x: target.x, y: target.y, dir: target.direction};
        }
    }

    _checkMoved () {
        for (const targetID in bodies) {
            const body = bodies[targetID];
            const target = this.runtime.getTargetById(targetID);
            if (!target) {
                // Drop target from simulation
                world.DestroyBody(body);
                delete bodies[targetID];
                delete prevPos[targetID];
                continue;
            }

            const prev = prevPos[targetID];
            const fixedRotation = target.rotationStyle !== RenderedTarget.ROTATION_STYLE_ALL_AROUND;

            if (prev && (prev.x !== target.x || prev.y !== target.y)) {
                const pos = new b2Vec2((target.x + _scroll.x) / zoom, (target.y + _scroll.y) / zoom);
                this._setPosition(body, pos);
                if (!fixedRotation) {
                    body.SetAngle((90 - target.direction) * toRad);
                }
                body.SetAwake(true);
            } else if (!fixedRotation && prev && prev.dir !== target.direction) {
                body.SetAngle((90 - target.direction) * toRad);
                body.SetAwake(true);
            }
        }
    }

    /**
     * Play a drum sound for some number of beats.
     * @property {number} x - x offset.
     * @property {number} y - y offset.
     */
    setPhysicsAll () {

        const allTargets = this.runtime.targets;
        if (allTargets === null) return;
        for (let i = 0; i < allTargets.length; i++) {
            const target = allTargets[i];
            if (!target.isStage && !bodies[target.id]) {
                this.setPhysicsFor(target);
            }
        }

    }

    /**
     * Play a drum sound for some number of beats.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @property {string} shape - the shape
     */
    setPhysics (args, util) {
        // this._playDrumForBeats(args.DRUM, args.BEATS, util);
        // if (util.runtime.audioEngine === null) return;
        // if (util.target.sprite.soundBank === null) return;

        // const dx = Cast.toNumber(args.x);
        // const dy = Cast.toNumber(args.y);

        if (args.shape === SHAPE_TYPE_OPTIONS.ALL) {
            this.setPhysicsAll();
            return;
        }

        const target = util.target;
        const body = this.setPhysicsFor(target, args.shape);
        if (body) {
            body.SetBullet(args.mode === 'bullet');
        }
    }

    setPhysicsFor (target, shape) {

        const r = this.runtime.renderer;
        const drawable = r._allDrawables[target.drawableID];

        // Tell the Drawable about its updated convex hullPoints, if necessary.
        if (drawable.needsConvexHullPoints()) {
            const points = r._getConvexHullPointsForDrawable(target.drawableID);
            drawable.setConvexHullPoints(points);
        }

        // if (drawable._transformDirty) {
        //     drawable._calculateTransform();
        // }
        // const points = drawable._getTransformedHullPoints();
        //
        // const hullPoints = [];
        // for (const i in points) {
        //     hullPoints.push({x: points[i][0] - target.x, y: points[i][1] - target.y});
        // }

        const points = drawable._convexHullPoints;
        const scaleX = drawable.scale[0] / 100;
        const scaleY = drawable.scale[1] / -100; // Flip Y for hulls
        const offset = drawable.skin.rotationCenter;
        let allHulls = null;

        if (shape === SHAPE_TYPE_OPTIONS.CIRCLE) {
            fixDef.shape = new b2CircleShape();
            const size = drawable.skin.size;
            fixDef.shape.SetRadius((((size[0] * Math.abs(scaleX)) + (size[1] * Math.abs(scaleY))) / 4.0) / zoom);
            // fixDef.shape.SetRadius((drawable.getBounds().width / 2) / zoom);
        } else if (shape === SHAPE_TYPE_OPTIONS.SVG_POLYGON) {
            const svg = drawable._skin._svgRenderer._svgTag;

            // recurse through childNodes of type 'g', looking for type 'path'

            const hullPoints = [];
            if (svg) {
                this._fetchPolygonPointsFromSVG(svg, hullPoints, offset[0], offset[1], scaleX, scaleY);
            }

            _definePolyFromHull(hullPoints[0]);
            allHulls = hullPoints;

        } else {
            const hullPoints = [];
            for (const i in points) {
                hullPoints.push({x: (points[i][0] - offset[0]) * scaleX, y: (points[i][1] - offset[1]) * scaleY});
            }

            _definePolyFromHull(hullPoints);
        }

        const fixedRotation = target.rotationStyle !== RenderedTarget.ROTATION_STYLE_ALL_AROUND;
        const body = _placeBody(target.id, target.x, target.y, fixedRotation ? 90 : target.direction);
        if (target.rotationStyle !== RenderedTarget.ROTATION_STYLE_ALL_AROUND) {
            body.SetFixedRotation(true);
        }

        if (allHulls) {
            for (let i = 1; i < allHulls.length; i++) {
                _definePolyFromHull(allHulls[i]);
                body.CreateFixture(fixDef);
            }
        }

        return body;
    }

    /**
     *
     * @param svg the svg element
     * @param {Array} hullPointsList array of points
     * @private
     */
    _fetchPolygonPointsFromSVG (svg, hullPointsList, ox, oy, scaleX, scaleY) {
        if (svg.tagName === 'g' || svg.tagName === 'svg') {
            if (svg.hasChildNodes()) {
                for (const node of svg.childNodes) {
                    this._fetchPolygonPointsFromSVG(node, hullPointsList, ox, oy, scaleX, scaleY);
                }
            }
            return;
        }

        if (svg.tagName !== 'path') {
            return;
        }
        // This is it boys! Get that svg data :)
        // <path xmlns="http://www.w3.org/2000/svg" d="M 1 109.7118 L 1 1.8097 L 60.3049 38.0516 L 117.9625 1.8097 L 117.9625 109.7118 L 59.8931 73.8817 Z "
        //  data-paper-data="{&quot;origPos&quot;:null}" stroke-width="2" fill="#9966ff"/>

        let fx; let fy;

        const hullPoints = [];
        hullPointsList.push(hullPoints);

        const tokens = svg.getAttribute('d').split(' ');
        for (let i = 0; i < tokens.length;) {
            const token = tokens[i++];
            if (token === 'M' || token === 'L') {
                const x = Cast.toNumber(tokens[i++]);
                const y = Cast.toNumber(tokens[i++]);
                hullPoints.push({x: (x - ox) * scaleX, y: (y - oy) * scaleY});
                if (token === 'M') {
                    fx = x;
                    fy = y;
                }
            }
            if (token === 'Z') {
                hullPoints.push({x: (fx - ox) * scaleX, y: (fy - oy) * scaleY});
            }
        }
    }

    applyForce (args, util) {
        _applyForce(util.target.id, 'Impulse', 0, 0,
            Cast.toNumber(args.dir), Cast.toNumber(args.force));
    }

    applyAngForce (args, util) {
        let body = bodies[util.target.id];
        if (!body) {
            body = this.setPhysicsFor(util.target);
        }

        body.ApplyTorque(-Cast.toNumber(args.force));
    }

    setDensity (args, util) {
        let body = bodies[util.target.id];
        if (!body) {
            body = this.setPhysicsFor(util.target);
        }

        body.GetFixtureList().SetDensity(Cast.toNumber(args.density));
        body.ResetMassData();
    }

    setProperties (args, util) {
        let body = bodies[util.target.id];
        if (!body) {
            body = this.setPhysicsFor(util.target);
        }

        body.GetFixtureList().SetDensity(Cast.toNumber(args.density) / 100.0);
        body.GetFixtureList().SetFriction(Cast.toNumber(args.friction) / 100.0);
        body.GetFixtureList().SetRestitution(Cast.toNumber(args.restitution) / 100.0);
        body.ResetMassData();
    }

    pinSprite (args, util) {
        if (!bodies[util.target.id]) {
            this.setPhysicsFor(util.target);
        }

        const x = Cast.toNumber(args.x);
        const y = Cast.toNumber(args.y);

        _createJointOfType(null, 'Rotating', util.target.id, x, y, null, null, null);
    }

    /**
     * Set's the sprites position.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @property {number} x - x offset.
     * @property {number} y - y offset.
     * @property {string} space - Space type (SPACE_TYPE_OPTIONS)
     */
    setPosition (args, util) {
        const x = Cast.toNumber(args.x);
        const y = Cast.toNumber(args.y);
        const body = bodies[util.target.id];

        switch (args.space) {
        case SPACE_TYPE_OPTIONS.STAGE:
            _setXY(util.target, x, y); // Position on stage (after scroll)
            if (body) {
                this._setPosition(body, new b2Vec2((x + _scroll.x) / zoom, (y + _scroll.y) / zoom));
            }
            break;
        case SPACE_TYPE_OPTIONS.RELATIVE: {
            _setXY(util.target, util.target.x + x, util.target.x + y);
            if (body) {
                const pos = body.GetPosition();
                const pos2 = new b2Vec2(pos.x + (x / zoom), pos.y + (y / zoom));
                this._setPosition(body, pos2);
            }
            break;
        }
        default:
            _setXY(util.target, x - _scroll.x, y - _scroll.y);
            if (body) {
                this._setPosition(body, new b2Vec2(x / zoom, y / zoom));
            }
        }
    }

    _setPosition (body, pos2) {
        const md = pinned[body.uid];
        if (md) {
            world.DestroyJoint(md);
            pinned[body.uid] = _createJointOfType(null, 'Rotating', body.uid, 0, 0, null, pos2.x * zoom, pos2.y * zoom);
        }
        body.SetPosition(pos2);
        // if (md) {
        //     pinned[body.uid] = _createJointOfType(null, 'Rotating', body.uid, 0, 0, null, null, null);
        // }
    }

    /**
     * Set the sprites velocity.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @property {number} sx - speed x.
     * @property {number} sy - speed y.
     */
    setVelocity (args, util) {
        let body = bodies[util.target.id];
        if (!body) {
            body = this.setPhysicsFor(util.target);
        }

        body.SetAwake(true);

        const x = Cast.toNumber(args.sx);
        const y = Cast.toNumber(args.sy);
        const force = new b2Vec2(x, y);
        force.Multiply(30 / zoom);
        body.SetLinearVelocity(force);
    }

    /**
     * Change the sprites velocity.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @property {number} sx - speed x.
     * @property {number} sy - speed y.
     */
    changeVelocity (args, util) {
        let body = bodies[util.target.id];
        if (!body) {
            body = this.setPhysicsFor(util.target);
        }

        body.SetAwake(true);

        const x = Cast.toNumber(args.sx);
        const y = Cast.toNumber(args.sy);
        const force = new b2Vec2(x, y);
        force.Multiply(30 / zoom);
        force.Add(body.GetLinearVelocity());
        body.SetLinearVelocity(force);
    }

    /**
     * Get the current tempo.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {boolean} - the current tempo, in beats per minute.
     */
    getStatic (args, util) {
        const body = bodies[util.target.id];
        if (!body) {
            return false;
        }
        const type = body.GetType();
        return type === b2Body.b2_staticBody;
    }

    /**
     * Get the current tempo.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {number} - the current x velocity.
     */
    getVelocityX (args, util) {
        const body = bodies[util.target.id];
        if (!body) {
            return 0;
        }
        const x = body.GetLinearVelocity().x;
        return (x * zoom) / 30;
    }

    /**
     * Get the current tempo.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @return {boolean} - the current y velocity.
     */
    getVelocityY (args, util) {
        const body = bodies[util.target.id];
        if (!body) {
            return 0;
        }
        const y = body.GetLinearVelocity().y;
        return (y * zoom) / 30;
    }

    /**
     * Sets the static property
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     * @property {string} static - static or not
     */
    setStatic (args, util) {
        const target = util.target;
        let body = bodies[util.target.id];
        if (!body) {
            body = this.setPhysicsFor(target);
        }
        body.SetType(args.static === 'static' ? b2Body.b2_staticBody : b2Body.b2_dynamicBody);

        const pos = new b2Vec2((target.x + _scroll.x) / zoom, (target.y + _scroll.y) / zoom);
        const fixedRotation = target.rotationStyle !== RenderedTarget.ROTATION_STYLE_ALL_AROUND;
        body.SetPositionAndAngle(pos, fixedRotation ? 0 : ((90 - target.direction) * toRad));

        if (args.static === 'pinned') {

            // Find what's behind the sprite (pin to that)
            const point = new b2AABB();
            point.lowerBound.SetV(pos);
            point.upperBound.SetV(pos);
            let body2ID = null;
            world.QueryAABB(fixture => {
                const body2 = fixture.GetBody();
                if (body2 !== body && fixture.TestPoint(pos.x, pos.y)){
                    body2ID = body2.uid;
                    return false;
                }
                return true;
            }, point);

            pinned[target.id] = _createJointOfType(null, 'Rotating', target.id, 0, 0, body2ID, null, null);
        } else {
            const pin = pinned[target.id];
            if (pin) {
                world.DestroyJoint(pin);
                // delete joints[pin.I];
                delete pinned[target.id];
            }
        }
    }

    /**
     * Sets the sprite offset
     * @param {object} args - the block arguments.
     * @property {number} ox - x offset.
     * @property {number} oy - y offset.
     */
    setScroll (args) {
        this._checkMoved();
        _scroll.x = Cast.toNumber(args.ox);
        _scroll.y = Cast.toNumber(args.oy);
        this._repositionBodies();
    }

    /**
     * Sets the sprite offset
     * @param {object} args - the block arguments.
     * @property {number} ox - x offset.
     * @property {number} oy - y offset.
     */
    changeScroll (args) {
        this._checkMoved();
        _scroll.x += Cast.toNumber(args.ox);
        _scroll.y += Cast.toNumber(args.oy);
        this._repositionBodies();
    }

    /**
     * Get the scroll x.
     * @return {number} - the current x velocity.
     */
    getScrollX () {
        return _scroll.x;
    }

    /**
     * Get the scroll x.
     * @return {number} - the current x velocity.
     */
    getScrollY () {
        return _scroll.y;
    }

    _repositionBodies () {
        for (const targetID in bodies) {
            const body = bodies[targetID];
            const target = this.runtime.getTargetById(targetID);
            if (target) {
                const position = body.GetPosition();
                _setXY(target, (position.x * zoom) - _scroll.x, (position.y * zoom) - _scroll.y);
                prevPos[targetID] = {x: target.x, y: target.y, dir: target.direction};
            }
        }
    }

    getTouching (args, util) {
        const target = util.target;
        const body = bodies[target.id];
        if (!body) {
            return '';
        }
        const where = args.where;
        let touching = '';
        const contacts = body.GetContactList();
        for (let ce = contacts; ce; ce = ce.next) {
            // noinspection JSBitwiseOperatorUsage
            if (ce.contact.m_flags & b2Contact.e_islandFlag) {
                continue;
            }
            if (ce.contact.IsSensor() === true ||
                ce.contact.IsEnabled() === false ||
                ce.contact.IsTouching() === false) {
                continue;
            }
            const contact = ce.contact;
            const fixtureA = contact.GetFixtureA();
            const fixtureB = contact.GetFixtureB();
            const bodyA = fixtureA.GetBody();
            const bodyB = fixtureB.GetBody();

            // const myFix = touchingB ? fixtureA : fixtureB;

            const touchingB = bodyA === body;
            if (where !== 'any') {
                const man = new Box2D.Collision.b2WorldManifold();
                contact.GetWorldManifold(man);
                // man.m_points
                // const mx = man.m_normal.x;
                // const my = man.m_normal.y;

                if (where === 'feet') {
                    // if (my > -0.6) {
                    //     continue;
                    // }

                    const fixture = body.GetFixtureList();
                    const y = man.m_points[0].y;
                    if (y > (fixture.m_aabb.lowerBound.y * 0.75) + (fixture.m_aabb.upperBound.y * 0.25)) {
                        continue;
                    }

                    // const lp = body.GetLocalPoint(man.m_points[0]).Normalize();
                    // if (lp.y)
                }
            }

            const other = touchingB ? bodyB : bodyA;
            const uid = other.uid;
            const target2 = uid ? this.runtime.getTargetById(uid) : this.runtime.getTargetForStage();
            if (target2) {
                const name = target2.sprite.name;
                if (touching.length === 0) {
                    touching = name;
                } else {
                    touching += `,${name}`;
                }
            }
        }
        return touching;
    }

    /**
     * Sets the stage
     * @param {object} args - the block arguments.
     * @property {number} stageType - Stage Type.
     */
    setStage (args) {
        _setStageType(args.stageType);
    }

    /**
     * Sets the gravity
     * @param {object} args - the block arguments.
     * @property {number} gx - Gravity x.
     * @property {number} gy - Gravity y.
     */
    setGravity (args) {
        world.SetGravity(new b2Vec2(Cast.toNumber(args.gx), Cast.toNumber(args.gy)));
        for (const bodyID in bodies) {
            bodies[bodyID].SetAwake(true);
        }
    }
}

module.exports = Scratch3Physicsengine;
