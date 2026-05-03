import { AccountPanel } from "../features/profile/AccountPanel";
import { ProfileDescriptionForm } from "../features/profile/ProfileDescriptionForm";
import { KnowledgeUploadForm } from "../features/profile/KnowledgeUploadForm";
import { LabelTable } from "../features/labels/LabelTable";
import { LoadingState, ErrorState } from "../components/common/States";
import { useProfileSettings } from "../hooks/useProfileSettings";

export const ProfilePage = () => {
  const { data, isLoading, error } = useProfileSettings();

  if (isLoading) return <LoadingState label="Loading profile settings" />;
  if (error) return <ErrorState message="Could not load profile settings." />;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Profile Settings</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
          Profile & Rules
        </h1>
      </div>

      <AccountPanel profile={data?.profile} />
      <ProfileDescriptionForm profile={data?.profile} />
      <KnowledgeUploadForm />
      <LabelTable labels={data?.labels || []} />
    </div>
  );
};
