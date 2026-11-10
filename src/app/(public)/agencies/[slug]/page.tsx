'use client';

import { useParams } from 'next/navigation';
import { useAuthStore } from '@/presentation/store/authStore';
import AgencyDetailView from '../_components/agency-detail/AgencyDetailView';
import {
  AgencyDetailErrorState,
  AgencyDetailLoadingState,
} from '../_components/agency-detail/AgencyDetailStates';
import { useAgencyDetail } from '../_hooks/useAgencyDetail';

export default function AgencyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const user = useAuthStore((state) => state.user);
  const {
    agency,
    loading,
    error,
    retry,
    ratingSummary,
    userRating,
    ratingSending,
    ratingMessage,
    rateAgency,
    leadSending,
    leadSent,
    leadError,
    sendLead,
  } = useAgencyDetail(slug);

  if (loading) return <AgencyDetailLoadingState />;
  if (error || !agency) {
    return <AgencyDetailErrorState isError={error} onRetry={retry} />;
  }

  return (
    <AgencyDetailView
      key={agency.id}
      agency={agency}
      userLoggedIn={Boolean(user)}
      ratings={ratingSummary}
      userRating={userRating}
      ratingSending={ratingSending}
      ratingMessage={ratingMessage}
      onRate={rateAgency}
      leadSending={leadSending}
      leadSent={leadSent}
      leadError={leadError}
      onSendLead={sendLead}
    />
  );
}
