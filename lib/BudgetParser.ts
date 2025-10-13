import { Transaction } from "../models/types";

const LINE_START_DEFAULT = 1;

export const parse = (fileContent: string, categories: string[][]) => {
    const result: Transaction[] = [];
    fileContent.split(/\r?\n/).forEach((line, lineIndex) => {
        if (lineIndex < LINE_START_DEFAULT) return;

        const lineArr = line.split("|");
        const date = lineArr[0];

        if (!date) return;
        const amount = parseFloat(lineArr[2]?.replace(/,/g, ""));
        const type = lineArr[3] === "D" ? "debit" : "credit";
        const document = lineArr[4]?.trim();
        const contragent = lineArr[5]?.trim();
        const reason = lineArr[6]?.trim();
        const info = lineArr[7]?.trim();
        const category = getTransactionCategory(
            contragent,
            document,
            reason,
            info,
            categories,
        );

        result.push({
            date,
            amount,
            type,
            document,
            contragent,
            reason,
            info,
            category,
        });
    });
    return result;
};

const match = (str: string, pattern: string) => str.indexOf(pattern) !== -1;

const getTransactionCategory = (
    contragent: string,
    document: string,
    reason: string,
    info: string,
    categories: string[][],
) => {
    let result = "Без Категория";
    categories.forEach((category: string[]) => {
        category.forEach((pattern: string, pIndex: number) => {
            if (pIndex === 0) return;
            if (
                match(contragent, pattern) ||
                match(document, pattern) ||
                match(info, pattern) ||
                match(reason, pattern)
            )
                result = category[0];
        });
    });
    return result;

    // Categories.forEach((value) => {
    //     const title = value[0]
    //     const amount = getCategoryAmount(title, results)
    //     const details = getCategoryDetails(title, results)
    //     const percentage = Math.round((amount / spend) * 100)
    //     table.push({ title, amount, details, percentage })
    // })
};

export const getCategoryTransactions = (
    category: string,
    transactions: Transaction[],
) => transactions.filter((item) => item.category === category);

export const getCategoryAmount = (
    transactions: Transaction[],
    type: "credit" | "debit",
) =>
    transactions.reduce(
        (prev, curr) => prev + (curr.type === type ? curr.amount : 0),
        0,
    );
