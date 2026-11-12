
const CHART_COLORS = [
    '#3B82F6', // Azul
    '#F59E0B', // Âmbar
    '#10B981', // Verde
    '#EF4444', // Vermelho
    '#8B5CF6', // Roxo
    '#EC4899', // Rosa
    '#06B6D4', // Ciano
    '#F97316', // Laranja
    '#84CC16', // Lima
    '#6366F1', // Índigo
    '#14B8A6', // Turquesa
    '#A855F7', // Violeta
];

export function getChartColor(index: number): string {
    return CHART_COLORS[index % CHART_COLORS.length];
}
