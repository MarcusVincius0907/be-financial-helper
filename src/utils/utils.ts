import { Category } from "src/models/category.model";
import { SerieItem, TrasactionChart } from "src/models/chart";
import { Transaction } from "src/models/transaction.model";

export function getFirstAndLastDayOfCurrentMonth(): {
  from: string;
  to: string;
} {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate the 27th of the last month
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthDate = new Date(currentYear, lastMonth, 27);

  // Calculate the 27th of the current month
  const currentMonthDate = new Date(currentYear, currentMonth, 27);

  let fyear = lastMonthDate.getFullYear();
  let fmonth = (lastMonthDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  let fday = lastMonthDate.getDate().toString().padStart(2, "0");

  let lyear = currentMonthDate.getFullYear();
  let lmonth = (currentMonthDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  let lday = currentMonthDate.getDate().toString().padStart(2, "0");

  // Create the formatted date string
  let fformattedDate = `${fyear}-${fmonth}-${fday}T00:00:00.418Z`;
  let lformattedDate = `${lyear}-${lmonth}-${lday}T00:00:00.418Z`;

  return { from: fformattedDate, to: lformattedDate };
}

/* 
  For some reason, data from Nubank has this strange format, so we need
  to manually add the cents
*/
export function formatAmountValue(amount: number): number {
  return amount / 100;
}

export function sortByDate(transacions: any): Transaction[] {
  const sortByDateDescending = (a, b) => {
    const bDate = new Date(b.date);
    const aDate = new Date(a.date);
    return Number(bDate) - Number(aDate);
  };
  return transacions.sort(sortByDateDescending);
}

export function groupByTransactionsWithCategories(
  transacions: Transaction[],
  categories: Category[]
): SerieItem[] {
  const series: SerieItem[] = [];

  const newCategories = [...categories, { _id: "default", text: "default" }];

  newCategories.forEach((category) => {
    let serie: SerieItem = {
      name: category.text,
      amount: 0,
      quantity: 0,
    };

    transacions.forEach((transaction) => {
      if (category?._id.toString() === transaction.categoryId) {
        serie.amount += Number(transaction.amount);
        serie.quantity++;
      }
    });

    serie.amount = roundNumber2Decimal(serie.amount);

    series.push(serie);
  });

  return series;
}

export function roundNumber2Decimal(value: number) {
  return Number(value.toFixed(2));
}

export function filterByDateRange(
  array: any,
  fromDate: string,
  toDate: string
) {
  return array.filter((item) => {
    const itemDate = new Date(item.date);
    const filterFromDate = new Date(fromDate);
    const filterToDate = new Date(toDate);

    // Compare dates
    return itemDate >= filterFromDate && itemDate <= filterToDate;
  });
}


export function generateDashboardData(
  transactions: Transaction[],
  categories: Category[]
): TrasactionChart {
  const descriptionCount: Record<string, number> = {};
  const categoryCount: Record<string, number> = {};
  const currentMonthExpense: Record<string, number> = {};
  const budgetByCategory: Record<string, number> = {};
  let overHundredTransactionCounter = 0;
  let highestAmountTransaction: Transaction = transactions[0];

  const calcData = (num1: number, num2: number) =>{
    return parseFloat((Number(num1) + Number(num2)).toFixed(2));
  }

  transactions.forEach(({ description, date, amount, categoryId }, index) => {

    descriptionCount[description] = (descriptionCount[description] || 0) + 1;
    categoryCount[categoryId] = calcData(categoryCount[categoryId] || 0, amount)
    budgetByCategory[categoryId] = calcData(budgetByCategory[categoryId] || 0, amount)
    
    let formattedDate = date.split("T")[0];
    currentMonthExpense[formattedDate] = calcData(currentMonthExpense[formattedDate] || 0, amount)

    if (amount > 100) overHundredTransactionCounter++;
    if (amount > highestAmountTransaction.amount) {
      highestAmountTransaction = transactions[index];
    }
  });

  let maxCount = 0;
  let mostFrequentDesc: string | null = null;

  for (const [desc, count] of Object.entries(descriptionCount)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentDesc = desc;
    }
  }

  let maxCountCat = 0;
  let mostFrequentCat: string | null = null;

  for (const [categoryId, count] of Object.entries(categoryCount)) {
    if (count > maxCountCat) {
      maxCountCat = count;
      mostFrequentCat = categoryId;
    }
  }

  const categoryMap = new Map(
    categories.map((item) => [item._id.toString(), item])
  );
  categoryMap.set("default", { text: "default", value: "", budget: 0 });

  const payload: TrasactionChart = {
    mostVisited: mostFrequentDesc,
    overHungredSpent: overHundredTransactionCounter,
    mostExpensive: highestAmountTransaction.description,
    mostSpentCategory: (categoryMap.get(mostFrequentCat)?.text || 'default'),
    lastBoughtItems: transactions.slice(0, 5),
    currentMonthExpense: Object.entries(currentMonthExpense).map(
      ([date, count]) => ({ label: date, data: count })
    ).reverse(),
    categoryChart: Object.entries(categoryCount).map(([category, count]) => ({
      label: categoryMap.get(category).text,
      data: count,
    })),
    budgetByCategory: Object.entries(budgetByCategory).map(
      ([category, count]) => ({
        category: categoryMap.get(category).text,
        current: count,
        expected: categoryMap.get(category).budget,
      })
    ),
  };

  return payload;
}

