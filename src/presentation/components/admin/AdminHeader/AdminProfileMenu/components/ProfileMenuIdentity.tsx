'use client';

interface ProfileMenuIdentityProps {
  fullName: string;
  email: string;
}

export function ProfileMenuIdentity({
  fullName,
  email,
}: ProfileMenuIdentityProps) {
  return (
    <>
      <div className="hidden text-right lg:block">
        <p className="max-w-[150px] truncate text-sm font-semibold text-[var(--text-admin-sidebar)]">
          {fullName}
        </p>

        <p className="max-w-[150px] truncate text-xs text-[var(--text-admin-sidebar-muted)]">
          {email}
        </p>
      </div>
    </>
  );
}
