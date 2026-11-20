import type { GroupItem } from '../../types';
import { isChannelItem } from '../../types';

export function GroupIdentityCell({ item }: { item: GroupItem }) {
  return (
    <div className="users-table__user-cell">
      {item.avatar ? (
        <img src={item.avatar} alt="" className="users-table__avatar" />
      ) : (
        <div className="users-table__avatar users-table__avatar--fallback">
          {item.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="users-table__user-info">
        <div className="users-table__email" title={item.name}>
          {item.name}
        </div>
        <div className="users-table__name" title={item.description}>
          {item.description || (isChannelItem(item) ? `Canal de ${item.city}` : 'Grupo de la red social')}
        </div>
      </div>
    </div>
  );
}
