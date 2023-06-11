const currency = (value: number | string): string => {
    return value !== undefined && !isNaN(+value) ? `$${(+value).toFixed(2)}` : '';
}

export const NumberUtil = {
    currency,
}
