const events = [
    'focus',
    'keydown',
    'beforeinput',
    'keypress',
    'input',
    'change',
    'keyup',
];

const dispatchNativeKeyboardEvent = (
    element: Document | HTMLElement,
    code: string,
    options: Record<string, any> = {},
) => {
    const defaultKeyMapObj = {
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        location: KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
    };
    const keyMap = {
        ControlLeft: {
            ...defaultKeyMapObj,
            code: 'ControlLeft',
            key: 'Control',
            keyCode: 17,
            ctrlKey: true,
            location: KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        },
        Enter: {
            ...defaultKeyMapObj,
            code: 'Enter',
            key: 'Enter',
            keyCode: 13,
        },
        Escape: {
            ...defaultKeyMapObj,
            code: 'Escape',
            key: 'Escape',
            keyCode: 27,
        },
        // Windows Key
        MetaLeft: {
            ...defaultKeyMapObj,
            code: 'MetaLeft',
            key: 'Meta',
            keyCode: 91,
            metaKey: true,
            location: KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        },
        NumpadEnter: {
            ...defaultKeyMapObj,
            code: 'NumpadEnter',
            key: 'Enter',
            keyCode: 13,
            location: KeyboardEvent.DOM_KEY_LOCATION_NUMPAD,
        },
        ShiftLeft: {
            ...defaultKeyMapObj,
            code: 'ShiftLeft',
            key: 'Shift',
            keyCode: 16,
            shiftKey: true,
            location: KeyboardEvent.DOM_KEY_LOCATION_LEFT,
        },
        Space: {
            ...defaultKeyMapObj,
            code: 'Space',
            key: ' ',
            keyCode: 32,
        },
        Tab: {
            ...defaultKeyMapObj,
            code: 'Tab',
            key: 'Tab',
            keyCode: 9,
        },
    };
    const lookup = () => Object.entries(keyMap).find(([key, value]) => key === code);
    const keyData = lookup();
    const attributes = {
        bubbles: true,
        cancelable: true,
        charCode: 0,
        ...keyData,
        ...options,
    };

    events.forEach(event => {
        element.dispatchEvent(new KeyboardEvent(event, attributes));
    });
};

export default dispatchNativeKeyboardEvent;
