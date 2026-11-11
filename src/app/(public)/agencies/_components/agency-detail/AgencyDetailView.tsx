import type { AgencyDetail } from '../types';
import type { AgencyLead, AgencyRatingSummary } from '../../_hooks/useAgencyDetail';
import AgencyContactPanel from './AgencyContactPanel';
import AgencyDescription from './AgencyDescription';
import AgencyProfileHeader from './AgencyProfileHeader';
import AgencyRatingPanel from './AgencyRatingPanel';

interface Props {
  agency: AgencyDetail;
  userLoggedIn: boolean;
  ratings: AgencyRatingSummary;
  userRating: number;
  ratingSending: boolean;
  ratingMessage: string;
  onRate: (score: number) => Promise<boolean>;
  leadSending: boolean;
  leadSent: boolean;
  leadError: string;
  onSendLead: (lead: AgencyLead) => Promise<void>;
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
}: Props) {
  return (
    <div className="min-h-screen bg-[#F4F0EA] font-sans text-stone-800 antialiased">
      <AgencyProfileHeader agency={agency} ratings={ratings} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Columna izquierda: información de la agencia y valoraciones */}
          <div className="space-y-10 lg:col-span-8">
            <AgencyDescription agency={agency} />
            <AgencyRatingPanel
              agencyName={agency.name}
              ratings={ratings}
              userRating={userRating}
              userLoggedIn={userLoggedIn}
              sending={ratingSending}
              message={ratingMessage}
              onRate={onRate}
            />
          </div>

          {/* Columna derecha: formulario de contacto */}
          <aside className="space-y-5 lg:col-span-4" aria-label="Contacto de la agencia">
            <AgencyContactPanel
              agency={agency}
              sending={leadSending}
              sent={leadSent}
              error={leadError}
              onSend={onSendLead}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
