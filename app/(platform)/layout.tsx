import { ModalProvider } from '@/components/providers/ModelProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider>
			<QueryProvider>
				<Toaster />
				<ModalProvider />
				{children}
			</QueryProvider>
		</ClerkProvider>
	);
};

export default PlatformLayout;
