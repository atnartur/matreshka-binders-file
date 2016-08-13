import makeElement from 'makeelement';
import bindNode from '../../../matreshka_refactoring/src/bindnode';
import on from '../../../matreshka_refactoring/src/on';
import file from '../../src/file';
import createSpy from './createspy';

describe('file binder', () => {
    const { Event, Blob } = window;

    it('allows to bind file input', done => {
        const obj = {};
        const node = makeElement('input', {
            type: 'file',
            multiple: false
        });
        const handler = createSpy(evt => {
			expect(obj.file.readerResult).toEqual('foo');
            expect(handler).toHaveBeenCalledTimes(1);
            done();
		});

        Object.defineProperty(node, 'files', {
			value: [
				new Blob(['foo'], {
					type: 'text/plain'
				})
			]
		});

        bindNode(obj, 'file', node, file('text'));

		on(obj, 'change:file', handler);

		node.dispatchEvent(new Event('change'));
    });

    it('allows to bind file input with multiple=true', done => {
        const obj = {};
        const node = makeElement('input', {
            type: 'file',
            multiple: true
        });
        const handler = createSpy(evt => {
            expect(handler).toHaveBeenCalledTimes(1);
			expect(obj.files[0].readerResult).toEqual('foo');
            expect(obj.files[1].readerResult).toEqual('bar');
            done();
		});

        Object.defineProperty(node, 'files', {
			value: [
                new Blob(['foo'], {
					type: 'text/plain'
				}),
                new Blob(['bar'], {
					type: 'text/plain'
				})
			]
		});

        bindNode(obj, 'files', node, file('text'));

		on(obj, 'change:files', handler);

		node.dispatchEvent(new Event('change'));
    });

    it('allows to bind file input with no reading', done => {
        const obj = {};
        const node = makeElement('input', {
            type: 'file',
            multiple: false
        });
        const handler = createSpy(evt => {
			expect(obj.file.readerResult).toEqual(undefined);
            expect(handler).toHaveBeenCalledTimes(1);
            done();
		});

        Object.defineProperty(node, 'files', {
			value: [
				new Blob(['foo'], {
					type: 'text/plain'
				})
			]
		});

        bindNode(obj, 'file', node, file());

		on(obj, 'change:file', handler);

		node.dispatchEvent(new Event('change'));
    });

    it('assigns null to bound property if files are not esist', () => {
        const obj = {};
        const node = makeElement('input', {
            type: 'file',
            multiple: false
        });

        Object.defineProperty(node, 'files', {
			value: []
		});

        bindNode(obj, 'file', node, file('text'));

		node.dispatchEvent(new Event('change'));

        expect(obj.file).toEqual(null);
    });

    it('throws an error if filereader method does not exist', () => {
        const obj = {};
        const node = makeElement('input', {
            type: 'file',
            multiple: false
        });

        Object.defineProperty(node, 'files', {
			value: []
		});

        expect(() => {
            bindNode(obj, 'file', node, file('wat'));
        }).toThrow();
    });
});