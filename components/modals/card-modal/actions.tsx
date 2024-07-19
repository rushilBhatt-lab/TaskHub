'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CardWithList } from '@/types';
import { Copy, TrashIcon } from 'lucide-react';
import React from 'react';
import { useAction } from '@/hooks/useAction';
import { copyCard } from '@/actions/copy-card';
import { deleteCard } from '@/actions/delete-card';
import { useParams } from 'next/navigation';
import { useCardModal } from '@/hooks/use-card-modal';
import { toast } from 'sonner';

interface ActiionsProps {
	data: CardWithList;
}
const Actions = ({ data }: ActiionsProps) => {
	const params = useParams();
	const cardModal = useCardModal();

	const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(copyCard, {
		onSuccess: (data) => {
			toast.success(`Card "${data.title}" copied`);
			cardModal.onClose();
		},

		onError: (error) => {
			toast.error(error);
		},
	});
	const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(deleteCard, {
		onSuccess: (data) => {
			toast.success(`Card "${data.title}" deleted`);
			cardModal.onClose();
		},

		onError: (error) => {
			toast.error(error);
		},
	});

	const onCopy = () => {
		const boardId = params.boardId as string;

		executeCopyCard({
			id: data.id,
			boardId,
		});
	};

	const onDelete = () => {
		const boardId = params.boardId as string;

		executeDeleteCard({
			id: data.id,
			boardId,
		});
	};
	return (
		<div className="space-y-2 mt-2">
			<p className="text-xs font-semibold">Actions</p>
			<Button variant="gray" className="w-full justify-start" size="inline" onClick={onCopy} disabled={isLoadingCopy}>
				<Copy className="h-4 w-4 mr-2" />
				Copy
			</Button>
			<Button variant="gray" className="w-full justify-start" size="inline" onClick={onDelete} disabled={isLoadingDelete}>
				<TrashIcon className="h-4 w-4 mr-2" />
				Delete
			</Button>
		</div>
	);
};

Actions.Skeleton = function ActionSkeleton() {
	return (
		<div className="space-y-2 mt-2">
			<Skeleton className="w-20 h-4 bg-netural-200" />
			<Skeleton className="w-full h-8 bg-netural-200" />
			<Skeleton className="w-full h-8 bg-netural-200" />
		</div>
	);
};

export default Actions;
