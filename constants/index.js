const CONTRACT_STATES = ['Pendiente', 'En curso', 'Finalizado']
const CONTRACT_ROLES = ['INQUILINO', 'GARANTE']
const MONTHS_IN_SPANISH = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const EXPIRED_CONTRACT_TEXT_KEY = 'TEXT_VEN_CONT'

const MAIL_MOTIVE = {
  EXPIRED_CONTRACT: 'VENCIMIENTO DE CONTRATO',
  DEBT: 'DEUDA',
}

module.exports = {
  CONTRACT_STATES,
  CONTRACT_ROLES,
  MONTHS_IN_SPANISH,
  EXPIRED_CONTRACT_TEXT_KEY,
  MAIL_MOTIVE,
}
