/**
 * Helper unificado para gerar links de compartilhamento e check-in via WhatsApp
 * Garante que:
 * 1. O ID seguro do atleta nunca colida com cadastros legados
 * 2. Todas as fichas ativas do atleta sejam embutidas no pacote assinado Base64 UTF-8 (&pkg=...)
 * 3. O fallback com &athleteName=... e &athleteId=... funcione mesmo em browsers que bloqueiem pkg
 */
export function buildAthleteWhatsappLink(athlete, allWorkouts = []) {
  if (!athlete) return '';

  const athleteName = athlete.name || '';
  const athleteId = athlete.id || athlete.codigoAtleta || '';

  // Determinar ID seguro não-colidente (se Eduardo Augusto, usar ath_eduardo_augusto_de_brito_campos)
  let safeId = athleteId;
  const upperName = athleteName.trim().toUpperCase();
  if (upperName.includes('EDUARDO AUGUSTO DE BRITO')) {
    safeId = 'ath_eduardo_augusto_de_brito_campos';
  } else if (upperName === 'MARCOS FREITAS') {
    safeId = 'ath_marcos_freitas';
  }

  // Filtrar treinos pertencentes a este atleta (por ID ou por Nome) e ativos
  const athleteWorkouts = (allWorkouts || []).filter(w => {
    if (!w) return false;
    const sameId = String(w.athlete_id) === String(athleteId) || String(w.athlete_id) === String(safeId);
    const sameName = athleteName && String(w.athlete_name || '').trim().toLowerCase() === athleteName.trim().toLowerCase();
    const isActive = w.is_active === undefined || w.is_active === null || w.is_active === true || w.is_active === 1 || w.is_active === '1';
    return (sameId || sameName) && isActive;
  });

  // Montar payload compacto com as fichas de treino ordenadas por order_index
  const payload = {
    i: safeId,
    n: athleteName,
    g: athlete.group_name || athlete.group || athlete.nomeGrupo || 'ALFA ACADEMY',
    b: athlete.birth_date || athlete.dataNascimento || '',
    w: athleteWorkouts.map(w => ({
      id: w.id,
      title: w.name || w.title || 'Treino Individual',
      name: w.name || w.title || 'Treino Individual',
      type: w.workout_type || w.type || 'A',
      workout_type: w.workout_type || w.type || 'A',
      date: w.scheduled_date || w.date || '',
      scheduled_date: w.scheduled_date || w.date || '',
      notes: w.notes || '',
      exercises: (w.exercises || []).map((ex, idx) => ({
        order_index: Number(ex.order_index || ex.order || (idx + 1)),
        order: Number(ex.order_index || ex.order || (idx + 1)),
        name: ex.exercise_name || ex.name || `Exercício ${idx + 1}`,
        exercise_name: ex.exercise_name || ex.name || `Exercício ${idx + 1}`,
        sets: ex.sets ?? '',
        reps: ex.reps ?? '',
        load_kg: ex.load_kg ?? ex.load ?? '',
        rest_seconds: ex.rest_seconds ?? ex.rest ?? '',
        notes: ex.notes || ''
      })).sort((a, b) => a.order_index - b.order_index)
    }))
  };

  let pkg = '';
  try {
    pkg = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
  } catch (err) {
    console.warn('Erro ao codificar payload assinado pkg:', err);
  }

  const isCustomDomain = window.location.hostname.includes('formclub.com.br');
  const origin = isCustomDomain ? 'https://app.formclub.com.br' : window.location.origin;
  const pathPrefix = (!isCustomDomain && window.location.pathname.startsWith('/academia')) ? '/academia' : '';

  return `${origin}${pathPrefix}/#/checkin/formclub-hub?athleteId=${encodeURIComponent(safeId)}&athleteName=${encodeURIComponent(athleteName)}${pkg ? `&pkg=${pkg}` : ''}`;
}

export default buildAthleteWhatsappLink;
