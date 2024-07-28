import { ElementRef, useRef, useState } from 'react';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

export const useEditing = () => {
	const [isEditing, setIsEditing] = useState(false);
	const formRef = useRef<ElementRef<'form'>>(null);
	const textareaRef = useRef<ElementRef<'textarea'>>(null);
	const inputRef = useRef<ElementRef<'input'>>(null);

	const focusEditableElement = () => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		} else if (textareaRef.current) {
			textareaRef.current.focus();
		}
	};

	const enableEditing = () => {
		setIsEditing(true);
		setTimeout(() => {
			focusEditableElement();
		});
	};

	const disableEditing = () => {
		setIsEditing(false);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			disableEditing();
		}
	};

	useEventListener('keydown', onKeyDown);
	useOnClickOutside(formRef, disableEditing);

	return {
		isEditing,
		enableEditing,
		disableEditing,
		textareaRef,
		formRef,
		inputRef,
	};
};
