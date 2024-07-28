'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Board } from '@prisma/client';
import { FormInput } from '@/components/form/FormInput';
import { useAction } from '@/hooks/useAction';
import { updateBoard } from '@/actions/update-board';
import { toast } from 'sonner';
import { useEditing } from '@/hooks/useEditing';

interface BoardTitleFormProps {
	data: Board;
}
const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
	const [title, setTitle] = useState(data.title);
	const { isEditing, enableEditing, disableEditing, inputRef, formRef } = useEditing();
	const { execute } = useAction(updateBoard, {
		onSuccess: (data) => {
			toast.success(`Board "${data.title}" updated`);
			setTitle(data.title);
			disableEditing();
		},

		onError: (error) => {
			toast.error(error);
		},
	});

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string;

		execute({ title, id: data.id });
	};

	const onBlur = () => {
		formRef.current?.requestSubmit();
	};
	if (isEditing) {
		return (
			<form ref={formRef} action={onSubmit} className="flex items-center gap-x-2">
				<FormInput
					ref={inputRef}
					id="title"
					onBlur={onBlur}
					defaultValue={title}
					className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
				/>
			</form>
		);
	}
	return (
		<Button variant="transparent" className="font-bold text-lg h-auto w-auto p-1 px-2" onClick={enableEditing}>
			{title}
		</Button>
	);
};

export default BoardTitleForm;
