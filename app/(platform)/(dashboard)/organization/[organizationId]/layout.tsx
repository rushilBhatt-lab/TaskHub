import { auth } from '@clerk/nextjs';
import { OrgControl } from './_components/org-control';
import { startCase } from 'lodash';

export async function generateMetaData() {
  const { orgSlug } = auth();
  return {
    title: startCase(orgSlug || 'organization'),
  };
}

const OrganizationIdLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      <OrgControl />
      {children}
    </div>
  );
};

export default OrganizationIdLayout;
