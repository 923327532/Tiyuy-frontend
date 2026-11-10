'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AgencyDetail } from '../types';
import type { AgencyLead, AgencyRatingSummary } from '../../_hooks/useAgencyDetail';
import AgencyActivityMetrics from './AgencyActivityMetrics';
import AgencyAuthModal from './AgencyAuthModal';
import AgencyContactPanel from './AgencyContactPanel';
import AgencyDescription from './AgencyDescription';
import AgencyProfileHeader from './AgencyProfileHeader';
import AgencyRatingPanel from './AgencyRatingPanel';

interface AgencyDetailViewProps {
  agency: AgencyDetail;
  userLoggedIn: boolean;
  ratings: AgencyRatingSummary;
  userRating: number;
  ratingSending: boolean;
  ratingMessage: string;
  onRate: (score: number) => void;
  leadSending: boolean;
  leadSent: boolean;
  leadError: string;
  onSendLead: (lead: AgencyLead) => void;
}

export default function AgencyDetailView({
  agency,
  userLoggedIn,
  ratings,
  userRating,
  ratingSending,
  ratingMessage,
  onRate,
  leadSending,
  leadSent,
  leadError,
  onSendLead,
}: AgencyDetailViewProps) {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const requireAuthentication = () => setShowAuthModal(true);
  const continueToAuthentication = () => {
    setShowAuthModal(false);
    router.push('/profile-selector');
  };

  return (
    <main className="min-h-screen bg-[var(--bg-secondary)]">
      <AgencyProfileHeader agency={agency} />
      <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
        <AgencyActivityMetrics agency={agency} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <AgencyDescription description={agency.description} />
            <AgencyRatingPanel
              ratings={ratings}
              userRating={userRating}
              userLoggedIn={userLoggedIn}
              sending={ratingSending}
              message={ratingMessage}
              onRate={(score) => {
                if (!userLoggedIn) {
                  requireAuthentication();
                  return;
                }
                onRate(score);
              }}
            />
          </div>
          <aside>
            <AgencyContactPanel
              agency={agency}
              userLoggedIn={userLoggedIn}
              sending={leadSending}
              sent={leadSent}
              error={leadError}
              onRequireAuthentication={requireAuthentication}
              onSend={onSendLead}
            />
          </aside>
        </div>
      </div>
      <AgencyAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onContinue={continueToAuthentication}
      />
    </main>
  );
}
