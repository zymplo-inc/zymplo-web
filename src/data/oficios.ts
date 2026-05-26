/**
 * Zymplo · 28 ofícios MEI BR + cuentapropistas LATAM
 * R-AISEO programmatic SEO · 28 × 14 = 392 páginas auto-generadas
 * Last updated: 2026-05-25
 */
export type OficioSlug =
  | 'eletricista' | 'encanador' | 'pedreiro' | 'pintor' | 'marceneiro' | 'gesseiro' | 'serralheiro'
  | 'cabeleireira' | 'manicure' | 'depiladora' | 'esteticista' | 'barbeiro' | 'massagista'
  | 'confeiteira' | 'marmiteira' | 'food-truck' | 'acaiteria'
  | 'mecanico' | 'lavador-carros' | 'borracheiro' | 'mototaxi'
  | 'tecnico-celular' | 'tecnico-ar-condicionado'
  | 'diarista' | 'cuidador' | 'baba'
  | 'costureira' | 'fotografo';

export interface Oficio {
  slug: OficioSlug;
  emoji: string;
  category: 'construcao' | 'beleza' | 'alimentacao' | 'auto' | 'tech' | 'cuidado' | 'criativo';
  // Localized name per language (pt = BR · es = LATAM · en = US)
  name: { pt: string; es: string; en: string };
  // Plural for headers
  plural: { pt: string; es: string; en: string };
  // 3-4 dolores específicos del ofício (problemas que Zymplo resuelve)
  pains: { pt: string[]; es: string[]; en: string[] };
  // 4 use cases específicos
  uses: { pt: string[]; es: string[]; en: string[] };
  // Average ticket range (USD-equivalent for context · not used in copy)
  avgTicketUsd: { min: number; max: number };
}

export const OFICIOS: Record<OficioSlug, Oficio> = {
  // CONSTRUCAO · 7 ofícios (25% IBGE share)
  'eletricista': {
    slug: 'eletricista', emoji: '⚡', category: 'construcao',
    name: { pt: 'eletricista', es: 'electricista', en: 'electrician' },
    plural: { pt: 'eletricistas', es: 'electricistas', en: 'electricians' },
    pains: {
      pt: ['Cliente esquece de pagar', 'Não emito nota fiscal', 'Perco serviços por telefone', 'Não sei quanto entrou no mês'],
      es: ['El cliente olvida pagar', 'No emito factura', 'Pierdo servicios por teléfono', 'No sé cuánto entró en el mes'],
      en: ['Clients forget to pay', "Don't issue invoices", 'Lose jobs via phone', "Don't know monthly income"],
    },
    uses: {
      pt: ['Cobrar instalação · automático', 'Emitir NFS-e em 30s', 'Lembrar visita técnica', 'Resumo financeiro fim de mês'],
      es: ['Cobrar instalación · automático', 'Emitir comprobante en 30s', 'Recordar visita técnica', 'Resumen mensual financiero'],
      en: ['Auto-bill installations', 'Issue invoice in 30s', 'Schedule service visits', 'Monthly income summary'],
    },
    avgTicketUsd: { min: 30, max: 300 },
  },
  'encanador': {
    slug: 'encanador', emoji: '🔧', category: 'construcao',
    name: { pt: 'encanador', es: 'plomero', en: 'plumber' },
    plural: { pt: 'encanadores', es: 'plomeros', en: 'plumbers' },
    pains: {
      pt: ['Cliente paga atrasado', 'Esqueço orçamento dado', 'Perco emergências fora horário', 'Sem nota fiscal cliente reclama'],
      es: ['Cliente paga tarde', 'Olvido presupuesto dado', 'Pierdo emergencias fuera de hora', 'Sin comprobante cliente reclama'],
      en: ['Clients pay late', 'Forget given quotes', 'Miss after-hours emergencies', 'No invoice clients complain'],
    },
    uses: {
      pt: ['Orçamento por WhatsApp', 'Cobrar urgências automatic', 'Comprovante MEI imediato', 'Agenda visitas técnicas'],
      es: ['Presupuesto por WhatsApp', 'Cobrar urgencias automatic', 'Comprobante inmediato', 'Agenda visitas técnicas'],
      en: ['Quote via WhatsApp', 'Auto-bill emergencies', 'Instant invoice', 'Schedule visits'],
    },
    avgTicketUsd: { min: 25, max: 250 },
  },
  'pedreiro': {
    slug: 'pedreiro', emoji: '🧱', category: 'construcao',
    name: { pt: 'pedreiro', es: 'albañil', en: 'mason' },
    plural: { pt: 'pedreiros', es: 'albañiles', en: 'masons' },
    pains: {
      pt: ['Obras longas · cobrança parcial', 'Cliente quer nota mas não dou', 'Material que falta', 'Não controlo gastos obra'],
      es: ['Obras largas · cobro parcial', 'Cliente quiere comprobante no doy', 'Material que falta', 'No controlo gastos obra'],
      en: ['Long jobs · partial billing', 'Clients want invoice you skip', 'Missing materials', 'No expense tracking'],
    },
    uses: {
      pt: ['Cobrar parcelas por etapa', 'Emitir NFS-e da obra', 'Registrar gasto material', 'Resumo mensal entrada/saída'],
      es: ['Cobrar parcial por etapa', 'Emitir comprobante de obra', 'Registrar gasto material', 'Resumen mensual'],
      en: ['Bill in stages', 'Issue job invoices', 'Track materials', 'Monthly summary'],
    },
    avgTicketUsd: { min: 100, max: 5000 },
  },
  'pintor': {
    slug: 'pintor', emoji: '🎨', category: 'construcao',
    name: { pt: 'pintor', es: 'pintor', en: 'painter' },
    plural: { pt: 'pintores', es: 'pintores', en: 'painters' },
    pains: { pt: ['Tinta paga adiantado · cliente atrasa', 'Sem nota perdo cliente PJ', 'Não sei lucro real'], es: ['Pintura paga adelantado · cliente atrasa', 'Sin comprobante pierdo cliente B2B', 'No sé ganancia real'], en: ['Paint paid upfront · client delays', 'No invoice lose corporate clients', 'No real profit visibility'] },
    uses: { pt: ['Cobrar 50% antes · 50% após', 'NFS-e instantânea', 'Lucro pintura por m²'], es: ['Cobrar 50% antes · 50% después', 'Comprobante instantáneo', 'Margen por m²'], en: ['50% upfront · 50% on completion', 'Instant invoice', 'Margin per sqm'] },
    avgTicketUsd: { min: 50, max: 500 },
  },
  'marceneiro': {
    slug: 'marceneiro', emoji: '🪵', category: 'construcao',
    name: { pt: 'marceneiro', es: 'carpintero', en: 'carpenter' },
    plural: { pt: 'marceneiros', es: 'carpinteros', en: 'carpenters' },
    pains: { pt: ['Móveis sob medida · cliente desiste', 'Sinal pequeno · risco', 'Nota difícil para PF'], es: ['Muebles a medida · cliente abandona', 'Seña pequeña · riesgo', 'Comprobante difícil para PF'], en: ['Custom furniture · clients ghost', 'Small deposits · risky', 'Hard to invoice individuals'] },
    uses: { pt: ['Sinal 30% via Pix', 'Orçamento + 3D por WA', 'NFS-e MEI direto'], es: ['Seña 30% por Pix/transferencia', 'Presupuesto + render 3D por WA', 'Comprobante directo'], en: ['30% deposit via Zelle/Wise', '3D render quote via WA', 'Direct invoice'] },
    avgTicketUsd: { min: 100, max: 2000 },
  },
  'gesseiro': {
    slug: 'gesseiro', emoji: '🏠', category: 'construcao',
    name: { pt: 'gesseiro', es: 'enlucidor', en: 'plasterer' },
    plural: { pt: 'gesseiros', es: 'enlucidores', en: 'plasterers' },
    pains: { pt: ['Cliente PJ pede nota', 'Forro paga em 30 dias · esqueço'], es: ['Cliente empresa pide comprobante', 'Cliente paga en 30 días · olvido'], en: ['Corporate clients need invoices', 'Net-30 payments forgotten'] },
    uses: { pt: ['NFS-e MEI automático', 'Lembrete cobrança 30d'], es: ['Comprobante automático', 'Recordatorio cobro a 30d'], en: ['Auto-invoice', '30-day payment reminders'] },
    avgTicketUsd: { min: 40, max: 400 },
  },
  'serralheiro': {
    slug: 'serralheiro', emoji: '🔩', category: 'construcao',
    name: { pt: 'serralheiro', es: 'herrero', en: 'metalworker' },
    plural: { pt: 'serralheiros', es: 'herreros', en: 'metalworkers' },
    pains: { pt: ['Portões grandes · risco se cliente desistir', 'Material aço subiu · cotação venceu'], es: ['Trabajos grandes · riesgo abandono cliente', 'Acero subió · cotización venció'], en: ['Large jobs · client abandonment risk', 'Steel prices spike · quotes expire'] },
    uses: { pt: ['Sinal 40% obrigatório', 'Cotação válida 7d auto'], es: ['Seña 40% obligatoria', 'Cotización válida 7d auto'], en: ['40% mandatory deposit', '7-day quote expiry auto'] },
    avgTicketUsd: { min: 80, max: 1500 },
  },

  // BELEZA · 6 ofícios (20% IBGE share)
  'cabeleireira': {
    slug: 'cabeleireira', emoji: '💇', category: 'beleza',
    name: { pt: 'cabeleireira', es: 'peluquera', en: 'hairstylist' },
    plural: { pt: 'cabeleireiras', es: 'peluqueras', en: 'hairstylists' },
    pains: { pt: ['Cliente cancela sem avisar', 'Faltas custam caro', 'Agenda WhatsApp manual', 'Lucro real desconhecido'], es: ['Cliente cancela sin avisar', 'Faltas cuestan caro', 'Agenda WhatsApp manual', 'Margen real desconocido'], en: ['Client no-shows', 'Cancellations hurt', 'Manual WhatsApp scheduling', "Unknown real margin"] },
    uses: { pt: ['Confirmação 24h antes', 'Sinal pequeno anti-falta', 'Comissão produto automatic', 'Lucro mensal real'], es: ['Confirmación 24h antes', 'Seña anti-falta', 'Comisión producto auto', 'Margen mensual real'], en: ['24h confirmation', 'Anti-no-show deposit', 'Auto product commission', 'Real monthly margin'] },
    avgTicketUsd: { min: 15, max: 150 },
  },
  'manicure': {
    slug: 'manicure', emoji: '💅', category: 'beleza',
    name: { pt: 'manicure', es: 'manicurista', en: 'manicurist' },
    plural: { pt: 'manicures', es: 'manicuristas', en: 'manicurists' },
    pains: { pt: ['Agenda cheia · cliente falta', 'Cobrar 1h antes do agendamento'], es: ['Agenda llena · cliente falta', 'Cobrar 1h antes de la cita'], en: ['Full schedule · no-shows', 'Pre-pay 1h before appointment'] },
    uses: { pt: ['Sinal 30% via Pix', 'Lembrete 24h + 2h auto'], es: ['Seña 30% por Pix', 'Recordatorio 24h + 2h auto'], en: ['30% deposit', '24h + 2h reminders'] },
    avgTicketUsd: { min: 10, max: 60 },
  },
  'depiladora': {
    slug: 'depiladora', emoji: '🌸', category: 'beleza',
    name: { pt: 'depiladora', es: 'depiladora', en: 'wax-specialist' },
    plural: { pt: 'depiladoras', es: 'depiladoras', en: 'wax-specialists' },
    pains: { pt: ['Pacotes meses · cliente esquece pagamento', 'Faltas perdem horário'], es: ['Paquetes meses · cliente olvida pago', 'Faltas pierden horario'], en: ['Monthly packages · forgotten payments', 'No-shows lose slots'] },
    uses: { pt: ['Cobrar pacote 5 sessões', 'Sinal anti-falta'], es: ['Cobrar paquete 5 sesiones', 'Seña anti-falta'], en: ['5-session package billing', 'Anti-no-show deposit'] },
    avgTicketUsd: { min: 15, max: 80 },
  },
  'esteticista': {
    slug: 'esteticista', emoji: '✨', category: 'beleza',
    name: { pt: 'esteticista', es: 'esteticista', en: 'esthetician' },
    plural: { pt: 'esteticistas', es: 'esteticistas', en: 'estheticians' },
    pains: { pt: ['Procedimentos longos · cliente desiste', 'Pacotes parcelados'], es: ['Procedimientos largos · cliente abandona', 'Paquetes en cuotas'], en: ['Long procedures · abandonment', 'Installment packages'] },
    uses: { pt: ['Sinal 40% pacote', 'Cobrança parcelada Pix automatic'], es: ['Seña 40% paquete', 'Cobranza en cuotas Pix auto'], en: ['40% package deposit', 'Auto installment billing'] },
    avgTicketUsd: { min: 30, max: 200 },
  },
  'barbeiro': {
    slug: 'barbeiro', emoji: '💈', category: 'beleza',
    name: { pt: 'barbeiro', es: 'barbero', en: 'barber' },
    plural: { pt: 'barbeiros', es: 'barberos', en: 'barbers' },
    pains: { pt: ['Cliente vem sem horário', 'Cortar sem agenda quebra organização'], es: ['Cliente viene sin cita', 'Cortar sin agenda rompe organización'], en: ['Walk-ins disrupt scheduling', 'Unscheduled cuts break flow'] },
    uses: { pt: ['Reserva fácil WhatsApp', 'Confirmação automática'], es: ['Reserva fácil WhatsApp', 'Confirmación automática'], en: ['Easy WhatsApp booking', 'Auto-confirmation'] },
    avgTicketUsd: { min: 10, max: 50 },
  },
  'massagista': {
    slug: 'massagista', emoji: '💆', category: 'beleza',
    name: { pt: 'massagista', es: 'masajista', en: 'massage-therapist' },
    plural: { pt: 'massagistas', es: 'masajistas', en: 'massage-therapists' },
    pains: { pt: ['Sessão 60min · falta cliente perde 60min', 'Pacotes 10 sessões controlo Excel'], es: ['Sesión 60min · falta cliente pierde hora', 'Paquetes 10 sesiones controlo Excel'], en: ['60-min sessions · no-show loses hour', '10-session packages tracked in Excel'] },
    uses: { pt: ['Sinal 50% anti-falta', 'Pacote 10 sessões automático'], es: ['Seña 50% anti-falta', 'Paquete 10 sesiones automático'], en: ['50% anti-no-show', 'Auto 10-session package'] },
    avgTicketUsd: { min: 30, max: 150 },
  },

  // ALIMENTACAO · 4 ofícios (18% IBGE share)
  'confeiteira': {
    slug: 'confeiteira', emoji: '🎂', category: 'alimentacao',
    name: { pt: 'confeiteira', es: 'repostera', en: 'cake-maker' },
    plural: { pt: 'confeiteiras', es: 'reposteras', en: 'cake-makers' },
    pains: { pt: ['Bolos por encomenda · cliente desiste 1 dia antes', 'Ingredientes comprados perdidos'], es: ['Tortas por encargo · cliente abandona 1 día antes', 'Ingredientes comprados perdidos'], en: ['Custom cakes · client cancels 1 day before', 'Wasted ingredients'] },
    uses: { pt: ['Sinal 50% obrigatório', 'Cobrança restante 24h antes entrega'], es: ['Seña 50% obligatoria', 'Cobranza resto 24h antes entrega'], en: ['50% mandatory deposit', 'Final payment 24h before delivery'] },
    avgTicketUsd: { min: 25, max: 250 },
  },
  'marmiteira': {
    slug: 'marmiteira', emoji: '🍱', category: 'alimentacao',
    name: { pt: 'marmiteira', es: 'tartera', en: 'meal-prep-cook' },
    plural: { pt: 'marmiteiras', es: 'tarteras', en: 'meal-prep-cooks' },
    pains: { pt: ['Plano mensal · cobrança esquecida', 'Pedidos diários sem controle'], es: ['Plan mensual · cobro olvidado', 'Pedidos diarios sin control'], en: ['Monthly plans · forgotten billing', 'Daily orders untracked'] },
    uses: { pt: ['Cobrança mensal automática Pix', 'Lista pedidos diários WA'], es: ['Cobranza mensual automática', 'Lista pedidos diarios WA'], en: ['Auto monthly billing', 'Daily orders via WA'] },
    avgTicketUsd: { min: 50, max: 300 },
  },
  'food-truck': {
    slug: 'food-truck', emoji: '🚚', category: 'alimentacao',
    name: { pt: 'food truck', es: 'food truck', en: 'food-truck-owner' },
    plural: { pt: 'food trucks', es: 'food trucks', en: 'food-truck-owners' },
    pains: { pt: ['Eventos com pré-pagamento · controle perdido', 'Material/insumo dia evento'], es: ['Eventos con pre-pago · control perdido', 'Material/insumo día evento'], en: ['Event prepayments · tracking lost', 'Event-day supplies'] },
    uses: { pt: ['Cobrar evento antecipado', 'Gasto material auto registrado'], es: ['Cobrar evento por adelantado', 'Gasto material auto registrado'], en: ['Pre-bill events', 'Auto-track supplies'] },
    avgTicketUsd: { min: 200, max: 3000 },
  },
  'acaiteria': {
    slug: 'acaiteria', emoji: '🍇', category: 'alimentacao',
    name: { pt: 'açaiteira', es: 'heladero', en: 'acai-shop-owner' },
    plural: { pt: 'açaiterias', es: 'heladerías', en: 'acai-shops' },
    pains: { pt: ['Delivery em alta · pedidos perdidos no caos', 'Cobrar entrega Pix manual'], es: ['Delivery alto · pedidos perdidos', 'Cobrar delivery manual'], en: ['Delivery high volume · orders lost', 'Manual delivery billing'] },
    uses: { pt: ['Pedidos por WA · catálogo automatic', 'Pix delivery automatic'], es: ['Pedidos por WA · catálogo auto', 'Pago delivery automático'], en: ['WA orders + auto catalog', 'Auto delivery payment'] },
    avgTicketUsd: { min: 5, max: 50 },
  },

  // AUTO/MOTO · 4 ofícios (8% IBGE share)
  'mecanico': {
    slug: 'mecanico', emoji: '🔧', category: 'auto',
    name: { pt: 'mecânico', es: 'mecánico', en: 'mechanic' },
    plural: { pt: 'mecânicos', es: 'mecánicos', en: 'mechanics' },
    pains: { pt: ['Orçamento aprovado verbal · cliente reclama valor', 'Peças sem nota · gasto invisível'], es: ['Presupuesto aprobado verbal · cliente reclama valor', 'Repuestos sin comprobante · gasto invisible'], en: ['Verbal quote approval · client disputes', 'Untracked parts purchases'] },
    uses: { pt: ['Orçamento PDF WhatsApp · aprovação registrada', 'Gasto peças automatic'], es: ['Presupuesto PDF WA · aprobación registrada', 'Gasto repuestos auto'], en: ['PDF quote via WA · approval tracked', 'Auto parts expense'] },
    avgTicketUsd: { min: 40, max: 1500 },
  },
  'lavador-carros': {
    slug: 'lavador-carros', emoji: '🚗', category: 'auto',
    name: { pt: 'lavador de carros', es: 'lavador de autos', en: 'car-detailer' },
    plural: { pt: 'lavadores de carros', es: 'lavadores de autos', en: 'car-detailers' },
    pains: { pt: ['Cliente recorrente sem cadastro', 'Pacote 4 lavagens controlo papel'], es: ['Cliente recurrente sin registro', 'Paquete 4 lavadas controlo papel'], en: ['Recurring clients unregistered', 'Wash package tracked on paper'] },
    uses: { pt: ['Pacote 4 lavagens automatic', 'Lembrete mensal por placa'], es: ['Paquete 4 lavadas automatic', 'Recordatorio mensual por matrícula'], en: ['Auto 4-wash package', 'Monthly reminders by plate'] },
    avgTicketUsd: { min: 5, max: 40 },
  },
  'borracheiro': {
    slug: 'borracheiro', emoji: '🛞', category: 'auto',
    name: { pt: 'borracheiro', es: 'gomero', en: 'tire-shop-owner' },
    plural: { pt: 'borracheiros', es: 'gomeros', en: 'tire-shops' },
    pains: { pt: ['Cliente paga em dinheiro · sem registro', 'Estoque pneus pesado'], es: ['Cliente paga en efectivo · sin registro', 'Stock neumáticos pesado'], en: ['Cash payments unrecorded', 'Heavy tire inventory'] },
    uses: { pt: ['Registrar caixa WhatsApp', 'Stock pneu por modelo'], es: ['Registrar caja por WhatsApp', 'Stock por modelo'], en: ['Track cash via WhatsApp', 'Inventory by model'] },
    avgTicketUsd: { min: 20, max: 400 },
  },
  'mototaxi': {
    slug: 'mototaxi', emoji: '🛵', category: 'auto',
    name: { pt: 'mototaxi', es: 'motociclista', en: 'motorcycle-courier' },
    plural: { pt: 'mototaxis', es: 'motociclistas', en: 'motorcycle-couriers' },
    pains: { pt: ['Corridas cobradas Pix · controle perdido', 'Combustível gasto sem registro'], es: ['Viajes cobrados Pix · control perdido', 'Combustible sin registro'], en: ['Trip payments untracked', 'Fuel expenses lost'] },
    uses: { pt: ['Cobrar corrida automatic', 'Gasto combustível diário'], es: ['Cobrar viaje automatic', 'Gasto combustible diario'], en: ['Auto-bill trips', 'Daily fuel tracking'] },
    avgTicketUsd: { min: 3, max: 30 },
  },

  // TECH REPAROS · 2 ofícios (7% IBGE share)
  'tecnico-celular': {
    slug: 'tecnico-celular', emoji: '📱', category: 'tech',
    name: { pt: 'técnico de celular', es: 'técnico de celular', en: 'phone-repair-tech' },
    plural: { pt: 'técnicos de celular', es: 'técnicos de celular', en: 'phone-repair-techs' },
    pains: { pt: ['Peça importada · entrega 7d · cliente impaciente', 'Garantia 30d esquecida'], es: ['Repuesto importado · entrega 7d · cliente impaciente', 'Garantía 30d olvidada'], en: ['Imported parts · 7d delivery · impatient clients', 'Forgotten 30d warranties'] },
    uses: { pt: ['Status entrega WA automatic', 'Lembrete fim garantia 30d'], es: ['Status entrega WA auto', 'Recordatorio fin garantía 30d'], en: ['Auto delivery status WA', '30d warranty expiry reminder'] },
    avgTicketUsd: { min: 20, max: 200 },
  },
  'tecnico-ar-condicionado': {
    slug: 'tecnico-ar-condicionado', emoji: '❄️', category: 'tech',
    name: { pt: 'técnico de ar-condicionado', es: 'técnico de aire acondicionado', en: 'ac-technician' },
    plural: { pt: 'técnicos de ar-condicionado', es: 'técnicos de aire', en: 'ac-technicians' },
    pains: { pt: ['Verão lotado · agenda perdida', 'Limpeza anual cliente esquece'], es: ['Verano completo · agenda perdida', 'Limpieza anual cliente olvida'], en: ['Summer fully booked · scheduling lost', 'Annual cleaning clients forget'] },
    uses: { pt: ['Lembrete limpeza anual', 'Cobrar visita técnica + manutenção'], es: ['Recordatorio limpieza anual', 'Cobrar visita técnica + mantenimiento'], en: ['Annual cleaning reminder', 'Bill visit + maintenance'] },
    avgTicketUsd: { min: 30, max: 400 },
  },

  // CUIDADO · 3 ofícios (12% IBGE share)
  'diarista': {
    slug: 'diarista', emoji: '🧹', category: 'cuidado',
    name: { pt: 'diarista', es: 'empleada doméstica', en: 'house-cleaner' },
    plural: { pt: 'diaristas', es: 'empleadas domésticas', en: 'house-cleaners' },
    pains: { pt: ['Diária ou mensalista · controle separado', 'Pagamento atrasa em metade dos clientes'], es: ['Diaria o mensual · control separado', 'Pago atrasa en mitad de clientes'], en: ['Daily or monthly · separate tracking', 'Half of clients pay late'] },
    uses: { pt: ['Cobrar mensal automatic dia X', 'Lembrete diária 2x semana'], es: ['Cobrar mensual auto día X', 'Recordatorio limpieza 2x semana'], en: ['Auto monthly billing day X', 'Twice-weekly cleaning reminder'] },
    avgTicketUsd: { min: 15, max: 80 },
  },
  'cuidador': {
    slug: 'cuidador', emoji: '🩺', category: 'cuidado',
    name: { pt: 'cuidador de idoso', es: 'cuidador de adultos mayores', en: 'elderly-caregiver' },
    plural: { pt: 'cuidadores de idoso', es: 'cuidadores de mayores', en: 'elderly-caregivers' },
    pains: { pt: ['Turno noturno custa mais · esqueço calcular', 'Família paga em atraso'], es: ['Turno nocturno cuesta más · olvido calcular', 'Familia paga atrasado'], en: ['Night shifts cost more · forget to calculate', 'Family pays late'] },
    uses: { pt: ['Calcular turno noturno automatic', 'Cobrar família semanal'], es: ['Calcular turno nocturno auto', 'Cobrar familia semanal'], en: ['Auto night-shift premium', 'Weekly family billing'] },
    avgTicketUsd: { min: 30, max: 200 },
  },
  'baba': {
    slug: 'baba', emoji: '👶', category: 'cuidado',
    name: { pt: 'babá', es: 'niñera', en: 'nanny' },
    plural: { pt: 'babás', es: 'niñeras', en: 'nannies' },
    pains: { pt: ['Horas extras · esqueço cobrar', 'Pais atrasam pagamento'], es: ['Horas extras · olvido cobrar', 'Padres atrasan pago'], en: ['Overtime forgotten', 'Parents pay late'] },
    uses: { pt: ['Registrar horas + horas extras', 'Cobrar quinzenal automatic'], es: ['Registrar horas + extras', 'Cobrar quincenal auto'], en: ['Hours + overtime tracking', 'Auto bi-weekly billing'] },
    avgTicketUsd: { min: 20, max: 150 },
  },

  // CRIATIVO · 2 ofícios (5% IBGE share)
  'costureira': {
    slug: 'costureira', emoji: '🧵', category: 'criativo',
    name: { pt: 'costureira', es: 'costurera', en: 'seamstress' },
    plural: { pt: 'costureiras', es: 'costureras', en: 'seamstresses' },
    pains: { pt: ['Ajuste pequeno · cliente leva mas não paga', 'Vestido sob medida abandono'], es: ['Arreglo chico · cliente lleva no paga', 'Vestido a medida abandono'], en: ['Small alterations · clients take but skip payment', 'Custom dress abandonment'] },
    uses: { pt: ['Pagamento na entrega obrigatório', 'Sinal 30% sob medida'], es: ['Pago en entrega obligatorio', 'Seña 30% a medida'], en: ['Mandatory payment on delivery', '30% custom deposit'] },
    avgTicketUsd: { min: 5, max: 200 },
  },
  'fotografo': {
    slug: 'fotografo', emoji: '📸', category: 'criativo',
    name: { pt: 'fotógrafo', es: 'fotógrafo', en: 'photographer' },
    plural: { pt: 'fotógrafos', es: 'fotógrafos', en: 'photographers' },
    pains: { pt: ['Casamentos · pacote alto · cliente cancela', 'Edição entrega 30d · paga só após'], es: ['Bodas · paquete alto · cliente cancela', 'Edición entrega 30d · paga solo después'], en: ['Weddings · high package · cancellations', 'Editing 30d · paid only after delivery'] },
    uses: { pt: ['Sinal 30% casamento', 'Cobrar 50% antes edição', 'NFS-e MEI automatic'], es: ['Seña 30% bodas', 'Cobrar 50% antes edición', 'Comprobante automático'], en: ['30% wedding deposit', '50% before editing', 'Auto invoice'] },
    avgTicketUsd: { min: 50, max: 3000 },
  },
};

export const OFICIO_SLUGS = Object.keys(OFICIOS) as OficioSlug[];

export function getOficio(slug: OficioSlug): Oficio | null {
  return OFICIOS[slug] ?? null;
}

// Helper: language family per country slug
export function getLang(countrySlug: string): 'pt' | 'es' | 'en' {
  if (countrySlug === 'br') return 'pt';
  if (countrySlug === 'us') return 'en';
  return 'es';
}
