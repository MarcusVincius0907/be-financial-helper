export interface TrasactionChart {
    labels: string[];
    series: SerieItem[];
}

export interface SerieItem {
    name: string;
    amount: number;
    quantity: number;
}