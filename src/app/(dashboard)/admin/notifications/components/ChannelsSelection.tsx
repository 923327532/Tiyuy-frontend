'use client';

import { Mail, Smartphone } from 'lucide-react';

interface ChannelsSelectionProps {
  newNotification: {
    sendEmail: boolean;
    sendInApp: boolean;
  };
  setNewNotification: React.Dispatch<React.SetStateAction<any>>;
}

export function ChannelsSelection({ newNotification, setNewNotification }: ChannelsSelectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Canales</label>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={newNotification.sendEmail}
            onChange={(e) => setNewNotification((prev: any) => ({ ...prev, sendEmail: e.target.checked }))}
            className="mr-2 shrink-0"
          />
          <span className="text-sm text-gray-700">Email (Brevo)</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={newNotification.sendInApp}
            onChange={(e) => setNewNotification((prev: any) => ({ ...prev, sendInApp: e.target.checked }))}
            className="mr-2 shrink-0"
          />
          <span className="text-sm text-gray-700">Notificación en App</span>
        </label>
      </div>
    </div>
  );
}