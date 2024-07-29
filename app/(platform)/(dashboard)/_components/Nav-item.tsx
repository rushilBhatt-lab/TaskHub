'use client';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Activity, Layout, Settings } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export type Organization = {
	id: string;
	slug: string;
	imageUrl: string;
	name: string;
};

interface Props {
	isExpanded: boolean;
	isActive: boolean;
	organization: Organization;
	onExpand: (id: string) => void;
}

const NavItem = ({ isExpanded, isActive, organization, onExpand }: Props) => {
	const router = useRouter();
	const pathname = usePathname();

	const routes = [
		{
			label: 'Boards',
			icon: <Layout className="h-4 w-4 mr-2" />,
			href: `/organization/${organization.id}`,
		},
		{
			label: 'Activity',
			icon: <Activity className="h-4 w-4 mr-2" />,
			href: `/organization/${organization.id}/activity`,
			isHidden: process.env.REACT_APP_SHOW_EXTRA_ROUTES !== 'true',
		},
		{
			label: 'Setting',
			icon: <Settings className="h-4 w-4 mr-2" />,
			href: `/organization/${organization.id}/settings`,
			isHidden: process.env.REACT_APP_SHOW_EXTRA_ROUTES !== 'true',
		},
	];

	const visibleRoutes = routes.filter((route) => route.isHidden);

	const onClick = (href: string) => {
		router.push(href);
	};

	return (
		<AccordionItem value={organization.id} className="border-none">
			<AccordionTrigger
				onClick={() => onExpand(organization.id)}
				className={cn(
					'flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline',
					isActive && !isExpanded && 'bg-sky-500/10 text-sky-700',
				)}
			>
				<div className="flex items-center gap-x-2">
					<div className="h-7 w-7 relative">
						<Image fill src={organization.imageUrl} alt="Organization Image" className="rounded-sm object-cover" />
					</div>
					<span className="font-medium text-sm">{organization.name}</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className="pt-1 text-neutral-700">
				{visibleRoutes.map((route) => (
					<Button
						key={route.href}
						size="sm"
						onClick={() => onClick(route.href)}
						className={cn('w-full font-normal justify-start pl-10 mb-1', pathname === route.href && 'bg-sky-500/10 text-sky-700')}
						variant="ghost"
					>
						{route.icon}
						{route.label}
					</Button>
				))}
			</AccordionContent>
		</AccordionItem>
	);
};

NavItem.skeleton = function SkeletonNavItem() {
	return (
		<div className="flex items-center gap-x-2">
			<div className="w-10 h-10 relative shrink-0">
				<Skeleton className="h-full w-full absolute" />
			</div>
			<Skeleton className="h-10 w-full" />
		</div>
	);
};

export default NavItem;
