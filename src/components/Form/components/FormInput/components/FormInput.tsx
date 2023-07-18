import React, {
    ChangeEvent,
    FocusEvent,
    KeyboardEvent,
    memo,
    MouseEvent,
    RefObject,
    useEffect,
    useRef,
} from 'react';
import { classNames, dispatchNativeKeyboardEvent, isArrayEmpty } from '../../../../../common';
import { DefaultPropsType, PropsType, StateType } from '../types';
import useSetStateAsync from '../../../../../hooks/useSetStateAsync';
import FormField from '../../FormField';
import FormLabel from '../../FormLabel';
import FormFieldRenderer, { defaultProps as defaultFormFieldRendererProps } from '../../FormField/components/FormFieldRenderer';
import FormFieldAlerts from '../../FormField/components/FormFieldAlerts';
import FormFieldHelp from '../../FormField/components/FormFieldHelp';
import ResizeGripper from '../../../../ResizeGripper';
import { ReactComponent as ShowSvg } from '../assets/show.svg';
import { ReactComponent as HideSvg } from '../assets/hide.svg';
import '../styles/form-input.scss';

const DEFAULT_STATE: StateType = {
    isPasswordVisible: false,
    isTabbingBackwards: false,
    isMouseOver: false,
    hasFocus: false,
};

export const defaultProps: DefaultPropsType = {
    alertMessages: null,
    autoComplete: '',
    autoFocus: false,
    className: '',
    componentRef: null,
    disabled: false,
    elementOrder: defaultFormFieldRendererProps.order,
    helpMessage: null,
    label: null,
    maxLength: 0,
    name: '',
    placeholder: '',
    resize: 'both',
    required: false,
    rows: 2,
    showPasswordToggle: false,
    type: 'text',
    value: '',
    onBlur: () => {},
    onChange: () => {},
};

const FormInput = ({
    alertMessages = defaultProps.alertMessages,
    autoComplete = defaultProps.autoComplete,
    autoFocus = defaultProps.autoFocus,
    className = defaultProps.className,
    componentRef = defaultProps.componentRef,
    disabled = defaultProps.disabled,
    elementOrder = defaultProps.elementOrder,
    helpMessage = defaultProps.helpMessage,
    id,
    label = defaultProps.label,
    maxLength = defaultProps.maxLength,
    name = defaultProps.name,
    placeholder = defaultProps.placeholder,
    resize = defaultProps.resize,
    required = defaultProps.required,
    rows = defaultProps.rows,
    showPasswordToggle = defaultProps.showPasswordToggle,
    type = defaultProps.type,
    value = defaultProps.value,
    onBlur = defaultProps.onBlur,
    onChange = defaultProps.onChange,
}: PropsType) => {
    const ref = componentRef || useRef<Nullable<HTMLInputElement | HTMLTextAreaElement>>(null);
    const wrapperRef = useRef<Nullable<HTMLDivElement>>(null);
    const focusRef = useRef<boolean>(false);
    const [state, setState] = useSetStateAsync(FormInput.DEFAULT_STATE);
    const helpId = `${id}-help`;
    const alertsId = `${id}-alerts`;

    const togglePasswordVisibility = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        await setState(prevState => ({ isPasswordVisible: !prevState.isPasswordVisible }));
    };
    const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.stopPropagation();

        setState({ hasFocus: false });
        onBlur(event);
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.stopPropagation();

        onChange(event.target.value, event);
    };
    const handleFocus = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.stopPropagation();

        setState({ hasFocus: true });
    };
    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.stopPropagation();

        // Pass the event on to the wrapper, so it handles tabbing backwards correctly.
        if (event.key === 'Tab' && event.shiftKey) {
            await setState({ isTabbingBackwards: true });

            wrapperRef.current!.focus();
            dispatchNativeKeyboardEvent(document, 'ShiftLeft');
            dispatchNativeKeyboardEvent(document, 'Tab', { shiftKey: true });

            await setState({ isTabbingBackwards: false });
        }
    };
    const handleWrapperFocus = (/* event: FocusEvent<HTMLDivElement> */) => {
        if (!state.isTabbingBackwards) {
            ref.current!.focus();
        }
    };
    const handleButtonFocus = (event: FocusEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };
    const handleButtonBlur = (event: FocusEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };
    const handleMouseEnter = () => {
        setState({ isMouseOver: true });
    };
    const handleMouseLeave = () => {
        setState({ isMouseOver: false });
    };
    const handleVerticalGripperMove = (distanceMoved: number) => {
        const rect = ref.current!.getBoundingClientRect();

        ref.current!.style.height = `${rect.height + distanceMoved}px`;
    };
    const handleHorizontalGripperMove = (distanceMoved: number) => {
        const rect = ref.current!.getBoundingClientRect();

        ref.current!.style.width = `${rect.width + distanceMoved}px`;
    };
    const buildDescribedBy = () => {
        const describedBy: string[] = [];

        if (helpMessage) {
            describedBy.push(helpId);
        }

        if (alertMessages) {
            describedBy.push(alertsId);
        }

        return describedBy.join(' ');
    };
    const renderGrippers = () => {
        if (!state.isMouseOver && !state.hasFocus) {
            return null;
        }

        switch (resize) {
            case 'horizontal':
                return <ResizeGripper type={ resize } onMove={ handleHorizontalGripperMove } />;
            case 'vertical':
                return <ResizeGripper type={ resize } onMove={ handleVerticalGripperMove } />;
            case 'both':
                return (
                    <>
                        <ResizeGripper key="vertical" type="vertical" onMove={ handleVerticalGripperMove } />
                        <ResizeGripper key="horizontal" type="horizontal" onMove={ handleHorizontalGripperMove } />
                    </>
                );
            case 'none':
            default:
                return null;
        }
    };
    const renderInput = () => {
        const { isPasswordVisible } = state;

        return (
            <>
                <input
                    aria-describedby={ buildDescribedBy() }
                    aria-disabled={ disabled }
                    autoComplete={ autoComplete }
                    className="form-input__input"
                    disabled={ disabled }
                    id={ id }
                    maxLength={ maxLength === 0 ? void 0 : maxLength }
                    name={ name || id }
                    placeholder={ placeholder }
                    ref={ ref as RefObject<HTMLInputElement> }
                    type={ type === 'password' && isPasswordVisible ? 'text' : type }
                    value={ value }
                    onBlur={ handleBlur }
                    onChange={ handleChange }
                    onFocus={ handleFocus }
                    onKeyDown={ handleKeyDown }
                />
                {showPasswordToggle && (
                    <div className="form-input__toggle-password">
                        <button
                            title={ `${isPasswordVisible ? 'Hide' : 'Show'} Password` }
                            type="button"
                            onBlur={ handleButtonBlur }
                            onClick={ togglePasswordVisibility }
                            onFocus={ handleButtonFocus }
                        >
                            {isPasswordVisible ? <HideSvg /> : <ShowSvg />}
                        </button>
                    </div>
                )}
            </>
        );
    };
    const renderTextArea = () => (
        <>
            <textarea
                aria-describedby={ buildDescribedBy() }
                aria-disabled={ disabled }
                autoComplete={ autoComplete }
                className="form-input__input"
                disabled={ disabled }
                id={ id }
                maxLength={ maxLength === 0 ? void 0 : maxLength }
                name={ name || id }
                placeholder={ placeholder }
                ref={ ref as RefObject<HTMLTextAreaElement> }
                rows={ rows }
                value={ value }
                onBlur={ handleBlur }
                onChange={ handleChange }
                onFocus={ handleFocus }
                onKeyDown={ handleKeyDown }
            />
            {renderGrippers()}
        </>
    );
    const render = () => {
        const hasError = Array.isArray(alertMessages) &&
            !isArrayEmpty(alertMessages) &&
            Boolean(alertMessages.find(({ severity }) => severity === 'error'));

        return (
            <FormField>
                <div
                    className={ classNames('form-input', className, {
                        'form-input--disabled': disabled,
                        'form-input--has-error': hasError,
                    }) }
                >
                    <FormFieldRenderer
                        order={ elementOrder }
                        label={ label && <FormLabel htmlFor={ id } required={ required }>{label}</FormLabel> }
                        help={ helpMessage && <FormFieldHelp id={ helpId }>{helpMessage}</FormFieldHelp> }
                        element={ (
                            <div
                                className="form-input__input-wrapper"
                                ref={ wrapperRef }
                                role="button"
                                tabIndex={ 0 }
                                onFocus={ handleWrapperFocus }
                                onMouseEnter={ type === 'textarea' ? handleMouseEnter : void 0 }
                                onMouseLeave={ type === 'textarea' ? handleMouseLeave : void 0 }
                            >
                                {type === 'textarea' ? renderTextArea() : renderInput()}
                            </div>
                        ) }
                        error={ alertMessages && (
                            <FormFieldAlerts
                                htmlFor={ id }
                                id={ alertsId }
                                messages={ alertMessages }
                            />
                        ) }
                    />
                </div>
            </FormField>
        );
    };

    useEffect(() => {
        if (autoFocus && !focusRef.current) {
            ref.current?.focus();
        }

        focusRef.current = true;
    }, []);

    useEffect(() => {
        const resizableClass = 'form-input__input-wrapper--resizable-width';

        if (type === 'textarea') {
            const width = parseInt(getComputedStyle(ref.current!).width, 10);

            ref.current!.style.width = `${width}px`;
            wrapperRef.current!.classList.add(resizableClass);
            return;
        }

        ref.current!.removeAttribute('style');
        wrapperRef.current!.classList.remove(resizableClass);
    }, [type]);

    return render();
};

FormInput.displayName = 'FormInput';

FormInput.DEFAULT_STATE = DEFAULT_STATE;

export default memo<PropsType>(FormInput);
