import type { GenericUser, UserTypeConfig } from '../types';

/** User identity cell with avatar, name, email */
export function UserIdentityCell<T extends GenericUser>({
  user,
  config,
  isDisabled,
}: {
  user: T;
  config: UserTypeConfig<T>;
  isDisabled: boolean;
}) {
  const avatarUrl = config.getAvatarUrl?.(user);
  const initials = config.getInitials(user);
  const displayName = config.getDisplayName(user);
  const email = config.getEmail(user);

  return (
    <div className="generic-table__user-cell">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className={`generic-table__avatar ${isDisabled ? 'generic-table__avatar--disabled' : ''}`}
        />
      ) : (
        <div className={`generic-table__avatar generic-table__avatar--fallback ${isDisabled ? 'generic-table__avatar--disabled' : ''}`}>
          {initials}
        </div>
      )}
      <div className="generic-table__user-info">
        <div className="generic-table__name" title={displayName}>{displayName}</div>
        <div className="generic-table__email" title={email}>{email}</div>
      </div>
    </div>
  );
}
