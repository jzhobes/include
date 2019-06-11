/* global HTMLLinkElement, HTMLScriptElement, global, afterAll, beforeEach, describe, expect, it, require */
const include = require('./index');

const appendChild = jest.fn();
Object.defineProperty(global.document, 'querySelector', {
    value: jest.fn(() => {
        return {
            appendChild
        };
    }),
    writable: true
});

describe('#include', () => {
    afterAll(() => {
        jest.resetAllMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates a script element if URL ends in .js', () => {
        include('test.js');
        const element = appendChild.mock.calls[0][0];
        expect(element).toBeInstanceOf(HTMLScriptElement);
    });

    it('creates a link element if URL ends in .css', () => {
        include('test.css');
        const element = appendChild.mock.calls[0][0];
        expect(element).toBeInstanceOf(HTMLLinkElement);
    });
});
