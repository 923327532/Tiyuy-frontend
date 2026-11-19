'use client';

interface ProfileMenuIdentityProps {
  fullName: string;
  email: string;
  roleType: string;
}

export function ProfileMenuIdentity({
  fullName,
  email,
  roleType,
}: ProfileMenuIdentityProps) {
  return (
    <>
      <div className="hidden text-right lg:block">
        <p className="max-w-[150px] truncate text-sm font-semibold text-white">
          {fullName}
        </p>

        <p className="max-w-[150px] truncate text-xs text-slate-400">
          {email}
        </p>
      </div>

      <span
        className="
          hidden whitespace-nowrap
          rounded-full border border-white/10
          bg-white/[0.07] px-2.5 py-1
          text-[10px] font-semibold capitalize
          text-slate-200
          xl:block
        "
      >
        {roleType}
      </span>
    </>
  );
}
