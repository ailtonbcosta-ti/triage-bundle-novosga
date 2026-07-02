
const debug = false

export function log () {
  if (debug) {
    console.log.apply(null, arguments)
  }
}

function formatHora (date) {
  const h = ('' + date.getHours()).padStart(2, '0')
  const m = ('' + date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * Verifica se a emissão de senhas está liberada agora, de acordo com a
 * configuração local (por totem) de horário de funcionamento.
 */
export function isDentroHorario (config, now) {
  const janelas = (config && config.horarioJanelas) || []

  if (!config || !config.horarioAtivo || janelas.length === 0) {
    return true
  }

  const atual = formatHora(now)

  return janelas.some(j => atual >= j.inicio && atual <= j.fim)
}

/**
 * Horário (HH:mm) em que a emissão volta a ficar disponível hoje,
 * ou null caso não haja mais nenhuma janela a partir de agora.
 */
export function proximaAbertura (config, now) {
  const janelas = (config && config.horarioJanelas) || []
  const atual = formatHora(now)

  const proximas = janelas
    .filter(j => j.inicio > atual)
    .sort((a, b) => a.inicio.localeCompare(b.inicio))

  return proximas.length ? proximas[0].inicio : null
}
