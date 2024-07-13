import { Separator } from '@/components/ui/separator';
import Info from './_components/Info';
import List from './_components/board-list';

const OrganizationIdPage = async () => {
  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 mmd:px-4">
        <List />
      </div>
    </div>
  );
};

export default OrganizationIdPage;
