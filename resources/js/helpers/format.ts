export function formatCurrency(amount?: number, compact?: boolean) {
    if (!amount) return '-';

    return compact
        ? new Intl.NumberFormat('pt-BR', {
              notation: 'compact',
              maximumFractionDigits: 1,
          }).format(amount)
        : amount.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
          });
}
