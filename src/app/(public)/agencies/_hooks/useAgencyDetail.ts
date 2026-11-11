'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient, publicApiClient } from '@/infrastructure/api/axios-client';
import { useAuthStore } from '@/presentation/store/authStore';
import type { AgencyDetail } from '../_components/types';

export interface AgencyRatingSummary {
  averageRating: number;
  totalRatings: number;
}

export interface AgencyLead {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface AgencyResponse {
  slug: string;
  agency: AgencyDetail | null;
  error: boolean;
}

interface AgencyRatingResponse extends AgencyRatingSummary {
  agencyId: number;
}

interface UserRatingResponse {
  score: number;
  agencyId: number;
  user: object | null;
}

interface AgencyLeadState {
  agencyId: number;
  sending: boolean;
  sent: boolean;
  error: string;
}

interface CurrentRating {
  score: number;
}

const EMPTY_RATINGS: AgencyRatingSummary = { averageRating: 0, totalRatings: 0 };

export function useAgencyDetail(slug: string) {
  const { user } = useAuthStore();
  const [response, setResponse] = useState<AgencyResponse | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [ratingResponse, setRatingResponse] = useState<AgencyRatingResponse | null>(null);
  const [userRatingResponse, setUserRatingResponse] = useState<UserRatingResponse | null>(null);
  const [ratingSendingFor, setRatingSendingFor] = useState<number | null>(null);
  const [ratingMessageState, setRatingMessageState] = useState<{
    agencyId: number;
    message: string;
  } | null>(null);
  const [leadState, setLeadState] = useState<AgencyLeadState | null>(null);

  const agency = response?.slug === slug ? response.agency : null;
  const loading = response?.slug !== slug;
  const error = response?.slug === slug && response.error;
  const ratingSummary =
    ratingResponse && agency && ratingResponse.agencyId === agency.id
      ? ratingResponse
      : EMPTY_RATINGS;
  const userRating =
    userRatingResponse &&
    agency &&
    userRatingResponse.agencyId === agency.id &&
    userRatingResponse.user === user
      ? userRatingResponse.score
      : 0;
  const ratingSending = agency !== null && ratingSendingFor === agency.id;
  const ratingMessage =
    ratingMessageState && agency && ratingMessageState.agencyId === agency.id
      ? ratingMessageState.message
      : '';
  const leadSending = Boolean(agency && leadState?.agencyId === agency.id && leadState.sending);
  const leadSent = Boolean(agency && leadState?.agencyId === agency.id && leadState.sent);
  const leadError =
    leadState && agency && leadState.agencyId === agency.id ? leadState.error : '';

  useEffect(() => {
    const controller = new AbortController();

    publicApiClient
      .get<AgencyDetail>(`/public/agencies/${encodeURIComponent(slug)}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setResponse({ slug, agency: data, error: false });
        }
      })
      .catch((requestError: unknown) => {
        if (!axios.isCancel(requestError) && !controller.signal.aborted) {
          setResponse({ slug, agency: null, error: true });
        }
      });

    return () => controller.abort();
  }, [retryKey, slug]);

  useEffect(() => {
    if (!agency) return;

    let active = true;
    const ratingUrl = `/interactions/ratings/user/${agency.id}/summary`;

    publicApiClient
      .get<AgencyRatingSummary>(ratingUrl)
      .then(({ data }) => {
        if (active) setRatingResponse({ ...data, agencyId: agency.id });
      })
      .catch(() => undefined);

    if (user) {
      apiClient
        .get<CurrentRating>(`/interactions/ratings/my-rating/${agency.id}`)
        .then(({ data }) => {
          if (active) {
            setUserRatingResponse({ score: data.score, agencyId: agency.id, user });
          }
        })
        .catch(() => undefined);
    }

    return () => {
      active = false;
    };
  }, [agency, user]);

  const retry = useCallback(() => {
    setResponse(null);
    setRetryKey((current) => current + 1);
  }, []);

  const sendLead = useCallback(async (lead: AgencyLead) => {
    if (!agency) return;

    const fail = (error: string) =>
      setLeadState({ agencyId: agency.id, sending: false, sent: false, error });

    if (!lead.name.trim() || !lead.message.trim()) {
      fail('Completa tu nombre y mensaje.');
      return;
    }
    // Sin correo ni teléfono, la agencia no tendría cómo responder.
    if (!lead.email.trim() && !lead.phone.trim()) {
      fail('Deja un correo o un teléfono para que la agencia pueda responderte.');
      return;
    }

    setLeadState({ agencyId: agency.id, sending: true, sent: false, error: '' });
    try {
      await publicApiClient.post('/interactions/leads', {
        name: lead.name.trim(),
        email: lead.email.trim() || undefined,
        phone: lead.phone.trim() || undefined,
        message: lead.message.trim(),
        toAgency: agency.name,
        toAgencyId: agency.id,
        source: 'agencia_perfil',
        recipientUserId: agency.id,
      });
      setLeadState({ agencyId: agency.id, sending: false, sent: true, error: '' });
    } catch {
      fail('No pudimos enviar tu mensaje. Inténtalo nuevamente.');
    }
  }, [agency]);

  const rateAgency = useCallback(async (score: number) => {
    if (!agency) return false;
    if (!user) return false;

    const previousScore = userRating;

    setRatingSendingFor(agency.id);
    setRatingMessageState({ agencyId: agency.id, message: '' });
    setUserRatingResponse({ score, agencyId: agency.id, user });

    const refreshSummary = async () => {
      const { data } = await publicApiClient.get<AgencyRatingSummary>(
        `/interactions/ratings/user/${agency.id}/summary`,
      );
      setRatingResponse({ ...data, agencyId: agency.id });
    };

    try {
      await apiClient.post('/interactions/ratings', {
        ratedUserId: agency.id,
        score,
        comment: '',
      });
      setRatingMessageState({ agencyId: agency.id, message: 'Calificación guardada.' });
      await refreshSummary();
      return true;
    } catch (requestError: unknown) {
      const status = axios.isAxiosError(requestError) ? requestError.response?.status : undefined;
      const responseMessage = axios.isAxiosError(requestError)
        ? requestError.response?.data?.message
        : undefined;

      if (status === 409) {
        setRatingMessageState({
          agencyId: agency.id,
          message: 'Ya has calificado a esta agencia.',
        });
        // Mostrar la nota que realmente tiene guardada, no la que intentó poner.
        try {
          const { data } = await apiClient.get<CurrentRating>(
            `/interactions/ratings/my-rating/${agency.id}`,
          );
          setUserRatingResponse({ score: data.score, agencyId: agency.id, user });
        } catch {
          setUserRatingResponse({ score: previousScore, agencyId: agency.id, user });
        }
        try {
          await refreshSummary();
        } catch {
          // El resumen queda como estaba.
        }
      } else {
        setRatingMessageState({
          agencyId: agency.id,
          message: typeof responseMessage === 'string'
            ? responseMessage
            : 'No pudimos guardar tu calificación.',
        });
        // Volver a la nota anterior en lugar de dejarla en 0.
        setUserRatingResponse({ score: previousScore, agencyId: agency.id, user });
      }
      return false;
    } finally {
      setRatingSendingFor((current) => current === agency.id ? null : current);
    }
  }, [agency, user, userRating]);

  return {
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
  };
}
