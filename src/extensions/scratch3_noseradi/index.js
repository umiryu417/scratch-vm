const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
// const log = require('../../util/log');
// const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/png;base64,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';
const BLETimeout = 6000;

// /**
//  * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
//  * @type {number}
//  */
// const BLESendInterval = 100;

/**
 * Enum for noseradi protocol.
 * FIXME: プロトコルのURLをここに書く
 * @readonly
 * @enum {string}
 */
const NOSERADI_UUID = {
    search_service: 'f7fce500-7a0b-4b89-a675-a79137223e2c',
    body_service: 'f7fce510-7a0b-4b89-a675-a79137223e2c',
    body_charactics: 'f7fce518-7a0b-4b89-a675-a79137223e2c',
    extra_surbo_service: 'f7fce520-7a0b-4b89-a675-a79137223e2c',
    extra_surbo_charactics: 'f7fce521-7a0b-4b89-a675-a79137223e2c'
};

/**
 * Manage communication with a Noseradi peripheral over a Scrath Link client socket.
 */
class Noseradi {

    /**
     * Construct a Noseradi communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * The most recently received value for each sensor.
         * @type {Object.<string, number>}
         * @private
         */
        this._sensors = {
            analog1: 0,
            analog2: 0
        };


        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;

        /**
         * A flag that is true while we are busy sending data to the BLE socket.
         * @type {boolean}
         * @private
         */
        this._busy = false;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

        this.disconnect = this.disconnect.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the X axis.
     */
    get getAnalogIn1 () {
        return this._sensors.analog1;
    }

    /**
     * @return {number} - the latest value received for the tilt sensor's tilt about the Y axis.
     */
    get getAnalogIn2 () {
        return this._sensors.analog2;
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [NOSERADI_UUID.search_service]}
            ],
            optionalServices: [NOSERADI_UUID.body_service, NOSERADI_UUID.extra_surbo_service]
        }, this._onConnect);
    }

    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    /**
     * Disconnect from the Noseradi.
     */
    disconnect () {
        window.clearInterval(this._timeoutID);
        if (this._ble) {
            this._ble.disconnect();
        }
    }

    /**
     * Return true if connected to the Noseradi.
     * @return {boolean} - whether the Noseradi is connected.
     */
    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }

    /**
     *
     * @param {Uint8} servo1 - サーボ出力１(0:free,1-254,255:not change)
     * @param {Uint8} servo2 - サーボ出力２(0:free,1-254,255:not change)
     * @param {Uint8} led1 - LED出力1(0, 1, 255:not change)
     * @param {Uint8} led2 - LED出力1(0, 1, 255:not change)
     */
    bodyServiceSend (servo1, servo2, led1, led2) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const output = new Uint8Array(4);
        output[0] = servo1;
        output[1] = servo2;
        output[2] = led1;
        output[3] = led2;
        if (output[0] < 0x00 || output[0] > 0xff) {
            output[0] = 0xff;
        }
        if (output[1] < 0x00 || output[1] > 0xff) {
            output[1] = 0xff;
        }
        if (output[2] !== 0x00 && output[2] !== 0x01) {
            output[2] = 0xff;
        }
        if (output[3] !== 0x00 && output[3] !== 0x01) {
            output[3] = 0xff;
        }
        const data = Base64Util.uint8ArrayToBase64(output);

        this._ble.write(NOSERADI_UUID.body_service, NOSERADI_UUID.body_charactics, data, 'base64', false).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

    /**
     *
     * @param {Uint8Array} output - output full Servo and LED
     */
    extraServoSend (output) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        for (let i = 1; i <= 16; i++) {
            if (output[i] < 0x00 || output[i] > 0xff) {
                output[i] = 0xff;
            }
        }

        const data = Base64Util.uint8ArrayToBase64(output);
        // eslint-disable-next-line max-len
        this._ble.write(NOSERADI_UUID.extra_surbo_service, NOSERADI_UUID.extra_surbo_charactics, data, 'base64', false).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */
    _onConnect () {
        // this._ble.read(NOSERADI_UUID.service, NOSERADI_UUID.rxChar, true, this._onMessage);
        // this._timeoutID = window.setInterval(this.disconnect, BLETimeout);
    }

    /**
     * Process the sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _onMessage (base64) {
        // parse data
        const data = Base64Util.base64ToUint8Array(base64);

        this._sensors.analog1 = data[0];
        this._sensors.analog2 = data[1];

        // cancel disconnect timeout and start a new one
        window.clearInterval(this._timeoutID);
        this._timeoutID = window.setInterval(this.disconnect, BLETimeout);
    }

    // /**
    //  * @param {number} pin - the pin to check touch state.
    //  * @return {number} - the latest value received for the touch pin states.
    //  * @private
    //  */
    // _checkPinState (pin) {
    //     return this._sensors.touchPins[pin];
    // }
}

/**
 *
 */
const NoseradiBodyLEDs = {
    LED1: 'LED1',
    LED2: 'LED2'
};

const NoseradiLedOuts = {
    ON: 1,
    OFF: 0
};

/**
 *
 */
const NoseradiBodyServos = {
    SERVO1: 'Servo1',
    SERVO2: 'Servo2'
};

// /**
//  * Enum for noseradi pin states.
//  * @readonly
//  * @enum {string}
//  */
// const NoseradiPinState = {
//     ON: 'on',
//     OFF: 'off'
// };

/**
 * Scratch 3.0 blocks to interact with a Noseradi peripheral.
 */
class Scratch3NoseradiBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'noseradi';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'noseradi';
    }

    get BODY_LED_PORT_MENU () {
        return [
            {
                text: 'LED1',
                value: NoseradiBodyLEDs.LED1
            },
            {
                text: 'LED2',
                value: NoseradiBodyLEDs.LED2
            }
        ];
    }

    get BODY_SERVO_PORT_MENU () {
        return [
            {
                text: 'サーボ1',
                value: NoseradiBodyServos.SERVO1
            },
            {
                text: 'サーボ2',
                value: NoseradiBodyServos.SERVO2
            }
        ];
    }

    get LED_OUTPUT_MENU () {
        return [
            {
                text: 'ON',
                value: NoseradiLedOuts.ON
            },
            {
                text: 'OFF',
                value: NoseradiLedOuts.OFF
            }
        ];
    }

    /**
     * Construct a set of Noseradi blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new Noseradi peripheral instance
        this._peripheral = new Noseradi(this.runtime, Scratch3NoseradiBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3NoseradiBlocks.EXTENSION_ID,
            name: Scratch3NoseradiBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'outputLED',
                    text: formatMessage({
                        id: 'noseradi.outputLED',
                        default: '本体の [BODY_LED] を [BODY_LED_OUT] にする',
                        description: ''
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BODY_LED: {
                            type: ArgumentType.STRING,
                            menu: 'bodyLedNo',
                            defaultValue: NoseradiBodyLEDs.LED1
                        },
                        BODY_LED_OUT: {
                            type: ArgumentType.NUMBER,
                            menu: 'ledOutVal',
                            defaultValue: NoseradiLedOuts.ON
                        }
                    }
                },
                {
                    opcode: 'outputBodyServo',
                    text: formatMessage({
                        id: 'noseradi.outputBodyServo',
                        default: '本体の [BODY_SERVO] に [BODY_SERVO_OUT] を出力する',
                        description: ''
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BODY_SERVO: {
                            type: ArgumentType.STRING,
                            menu: 'bodyServoNo',
                            defaultValue: NoseradiBodyServos.SERVO1
                        },
                        BODY_SERVO_OUT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'outputBodyLEDs',
                    text: formatMessage({
                        id: 'noseradi.outputBodyLEDs',
                        default: '本体のLED1を [LED_OUTPUT1] LED2を [LED_OUTPUT2] にする',
                        description: ''
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LED_OUTPUT1: {
                            type: ArgumentType.NUMBER,
                            menu: 'ledOutVal',
                            defaultValue: NoseradiLedOuts.ON
                        },
                        LED_OUTPUT2: {
                            type: ArgumentType.NUMBER,
                            menu: 'ledOutVal',
                            defaultValue: NoseradiLedOuts.ON
                        }
                    }
                },
                {
                    opcode: 'outputBodyServos',
                    text: formatMessage({
                        id: 'noseradi.outputBodyServos',
                        default: '本体のサーボ1に [SERVO_OUTPUT1] サーボ2に [SERVO_OUTPUT2] を出力する',
                        description: 'output servo'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SERVO_OUTPUT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO_OUTPUT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'outputBody',
                    text: formatMessage({
                        id: 'noseradi.outputBody',
                        // eslint-disable-next-line max-len
                        default: '本体のサーボ1に [SERVO_OUTPUT1] サーボ2に [SERVO_OUTPUT2] を出力し、LED1を [LED_OUTPUT1] LED2を [LED_OUTPUT2] にする',
                        description: 'output servo'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SERVO_OUTPUT1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO_OUTPUT2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        LED_OUTPUT1: {
                            type: ArgumentType.NUMBER,
                            menu: 'ledOutVal',
                            defaultValue: NoseradiLedOuts.ON
                        },
                        LED_OUTPUT2: {
                            type: ArgumentType.NUMBER,
                            menu: 'ledOutVal',
                            defaultValue: NoseradiLedOuts.ON
                        }
                    }
                },
                {
                    opcode: 'outputExtraServo4',
                    text: formatMessage({
                        id: 'noseradi.outputExtraServo4',
                        // eslint-disable-next-line max-len
                        default: '拡張サーボ [DEV_NO] に [SERVO0] [SERVO1] [SERVO2] [SERVO3] を出力する',
                        description: 'output servo'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DEV_NO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO0: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'outputExtraServo',
                    text: formatMessage({
                        id: 'noseradi.outputExtraServo',
                        // eslint-disable-next-line max-len
                        default: '拡張サーボ [DEV_NO] に [SERVO0] [SERVO1] [SERVO2] [SERVO3] [SERVO4] [SERVO5] [SERVO6] [SERVO7] [SERVO8] [SERVO9] [SERVO10] [SERVO11] [SERVO12] [SERVO13] [SERVO14] [SERVO15] を出力する',
                        description: 'output servo'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DEV_NO: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO0: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO3: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO4: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO5: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO6: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO7: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO8: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO9: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO10: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO11: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO12: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO13: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO14: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SERVO15: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                bodyLedNo: this.BODY_LED_PORT_MENU,
                bodyServoNo: this.BODY_SERVO_PORT_MENU,
                ledOutVal: this.LED_OUTPUT_MENU
            }
        };
    }

    /**
     * Output selected LED.
     * @param {object} args - the block's arguments.
     */
    outputLED (args) {
        if (args.BODY_LED === NoseradiBodyLEDs.LED1) {
            this._peripheral.bodyServiceSend(0xff, 0xff, args.BODY_LED_OUT, 0xff);
        }
        this._peripheral.bodyServiceSend(0xff, 0xff, 0xff, args.BODY_LED_OUT);
    }

    /**
     * Output selected LED.
     * @param {object} args - the block's arguments.
     */
    outputBodyServo (args) {
        if (args.BODY_SERVO === NoseradiBodyServos.SERVO1) {
            this._peripheral.bodyServiceSend(args.BODY_SERVO_OUT, 0xff, 0xff, 0xff);
        }
        this._peripheral.bodyServiceSend(0xff, args.BODY_SERVO_OUT, 0xff, 0xff);
    }

    /**
     * Output full body led.
     * @param {object} args - output full LED
     */
    outputBodyLEDs (args) {
        this._peripheral.bodyServiceSend(0xff, 0xff, args.LED_OUTPUT1, args.LED_OUTPUT2);
    }

    /**
     *
     * @param {object} args - output full Servo
     */
    outputBodyServos (args) {
        this._peripheral.bodyServiceSend(args.SERVO_OUTPUT1, args.SERVO_OUTPUT2, 0xff, 0xff);
    }

    /**
     *
     * @param {object} args - output full Servo and LED
     */
    outputBody (args) {
        this._peripheral.bodyServiceSend(args.SERVO_OUTPUT1, args.SERVO_OUTPUT2, args.LED_OUTPUT1, args.LED_OUTPUT2);
    }

    /**
     *
     * @param {object} args - output full Servo and LED
     */
    outputExtraServo4 (args) {
        const output = new Uint8Array(17);
        output[0] = args.DEV_NO;
        output[1] = args.SERVO0;
        output[2] = args.SERVO1;
        output[3] = args.SERVO2;
        output[4] = args.SERVO3;
        for (let i = 5; i <= 16; i++) {
            output[i] = 255;
        }
        this._peripheral.extraServoSend(output);
    }

    /**
     *
     * @param {object} args - output full Servo and LED
     */
    outputExtraServo (args) {
        const output = new Uint8Array(17);
        output[0] = args.DEV_NO;
        output[1] = args.SERVO0;
        output[2] = args.SERVO1;
        output[3] = args.SERVO2;
        output[4] = args.SERVO3;
        output[5] = args.SERVO4;
        output[6] = args.SERVO5;
        output[7] = args.SERVO6;
        output[8] = args.SERVO7;
        output[9] = args.SERVO8;
        output[10] = args.SERVO9;
        output[11] = args.SERVO10;
        output[12] = args.SERVO11;
        output[13] = args.SERVO12;
        output[14] = args.SERVO13;
        output[15] = args.SERVO14;
        output[16] = args.SERVO15;
        this._peripheral.extraServoSend(output);
    }

}

module.exports = Scratch3NoseradiBlocks;
