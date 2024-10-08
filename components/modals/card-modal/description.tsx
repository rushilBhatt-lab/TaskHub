'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { CardWithList } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { AlignLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { FormTextarea } from '@/components/form/FormTextarea';
import { FormSubmit } from '@/components/form/FormSubmit';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/useAction';
import { updateCard } from '@/actions/update-card';
import { toast } from 'sonner';
import { useEditing } from '@/hooks/useEditing';

interface DescriptionProps {
	data: CardWithList;
}

const Description = ({ data }: DescriptionProps) => {
	const queryClient = useQueryClient();
	const params = useParams();
	const { isEditing, enableEditing, disableEditing, textareaRef, formRef } = useEditing();

	const { execute, fieldErrors } = useAction(updateCard, {
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['card', data.id],
			});

			toast.success(`Card ${data.title} updated`);
			disableEditing();
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const onSubmit = (formData: FormData) => {
		const description = formData.get('description') as string;
		const boardId = params.boardId as string;

		execute({ id: data.id, description, boardId });
	};
	return (
		<div className="flex items-start gap-x-3 w-full">
			<AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
			<div className="w-full">
				<p className="font-semibold text-neutral-700 mb-2">Description</p>
				{isEditing && (
					<form action={onSubmit} ref={formRef} className="space-y-2">
						<FormTextarea
							ref={textareaRef}
							id={'description'}
							className="w-full mt-2"
							placeholder="Add more detailed description"
							defaultValue={data.description || undefined}
							errors={fieldErrors}
						/>
						<div className="flex items-center gap-x-2">
							<FormSubmit>Save</FormSubmit>
							<Button type="button" onClick={disableEditing} size="sm" variant="ghost">
								Cancel
							</Button>
						</div>
					</form>
				)}
				{!isEditing && (
					<div onClick={enableEditing} role="button" className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md">
						{data.description || 'Add a more detailed description...'}
					</div>
				)}
			</div>
		</div>
	);
};

Description.Skeleton = function DescriptionSkeleton() {
	return (
		<div className="flex items-start gap-x-3 w-full">
			<Skeleton className="h-6 w-6 bg-neutral-200" />
			<div className="w-full">
				<Skeleton className="h-6 w-34 mb-2 bg-neutral-200" />
				<Skeleton className="h-[78px] w-full mb-2 bg-neutral-200" />
			</div>
		</div>
	);
};
export default Description;
