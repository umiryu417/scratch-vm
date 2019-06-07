const test = require('tap').test;
const Worker = require('tiny-worker');

const dispatch = require('../../src/dispatch/central-dispatch');
const VirtualMachine = require('../../src/virtual-machine');

const Sprite = require('../../src/sprites/sprite');
const RenderedTarget = require('../../src/sprites/rendered-target');

// By default Central Dispatch works with the Worker class built into the browser. Tell it to use TinyWorker instead.
dispatch.workerClass = Worker;

class TestInternalExtension {
    constructor () {
        this.status = {};
        this.status.constructorCalled = true;
    }

    getInfo () {
        this.status.getInfoCalled = true;
        return {
            id: 'testInternalExtension',
            name: 'Test Internal Extension',
            blocks: [
                {
                    opcode: 'go'
                }
            ],
            menus: {
                simpleMenu: this._buildAMenu(),
                dynamicMenu: '_buildDynamicMenu'
            }
        };
    }

    go () {
        this.status.goCalled = true;
    }

    _buildAMenu () {
        this.status.buildMenuCalled = true;
        return ['abcd', 'efgh', 'ijkl'];
    }

    _buildDynamicMenu () {
        this.status.buildDynamicMenuCalled = true;
        return [1, 2, 3, 4, 6];
    }
}

test('internal extension', t => {
    const vm = new VirtualMachine();

    const extension = new TestInternalExtension();
    t.ok(extension.status.constructorCalled);

    t.notOk(extension.status.getInfoCalled);
    vm.extensionManager._registerInternalExtension(extension);
    t.ok(extension.status.getInfoCalled);

    const func = vm.runtime.getOpcodeFunction('testInternalExtension_go');
    t.type(func, 'function');

    t.notOk(extension.status.goCalled);
    func();
    t.ok(extension.status.goCalled);

    // There should be 2 menus - one is an array, one is the function to call.
    t.equal(vm.runtime._blockInfo[0].menus.length, 2);
    // First menu has 3 items.
    t.equal(
        vm.runtime._blockInfo[0].menus[0].json.args0[0].options.length, 3);
    // Second menu is a dynamic menu and therefore should be a function.
    t.type(
        vm.runtime._blockInfo[0].menus[1].json.args0[0].options, 'function');

    t.end();
});

test('load sync', t => {
    const vm = new VirtualMachine();
    vm.extensionManager.loadExtensionIdSync('coreExample');
    t.ok(vm.extensionManager.isExtensionLoaded('coreExample'));

    t.equal(vm.runtime._blockInfo.length, 1);

    // blocks should be an array of two items: a button pseudo-block and a reporter block.
    t.equal(vm.runtime._blockInfo[0].blocks.length, 2);
    t.type(vm.runtime._blockInfo[0].blocks[0].info, 'object');
    t.type(vm.runtime._blockInfo[0].blocks[0].info.func, 'MAKE_A_VARIABLE');
    t.equal(vm.runtime._blockInfo[0].blocks[0].info.blockType, 'button');
    t.type(vm.runtime._blockInfo[0].blocks[1].info, 'object');
    t.equal(vm.runtime._blockInfo[0].blocks[1].info.opcode, 'exampleOpcode');
    t.equal(vm.runtime._blockInfo[0].blocks[1].info.blockType, 'reporter');

    // Test the opcode function
    t.equal(vm.runtime._blockInfo[0].blocks[1].info.func(), 'no stage yet');

    const sprite = new Sprite(null, vm.runtime);
    sprite.name = 'Stage';
    const stage = new RenderedTarget(sprite, vm.runtime);
    stage.isStage = true;
    vm.runtime.targets = [stage];

    t.equal(vm.runtime._blockInfo[0].blocks[1].info.func(), 'Stage');

    t.end();
});
