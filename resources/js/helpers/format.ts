export function formatCurrency(amount: number){
    return `R$ ${amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}
