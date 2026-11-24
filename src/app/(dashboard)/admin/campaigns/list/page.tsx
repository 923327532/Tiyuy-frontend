/**
 * Alias heredado: el listado de campañas vive en /admin/campaigns.
 * Se mantiene la ruta solo para no romper enlaces o marcadores antiguos.
 */

import { redirect } from 'next/navigation';

export default function AdminCampaignsListPage() {
  redirect('/admin/campaigns');
}
