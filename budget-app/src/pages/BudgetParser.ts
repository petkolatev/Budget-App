import { Transaction } from './budgetSlice'

const LINE_START_DEFAULT = 1

export const Categories = [
    ['Хранителни Покупки', 'Alex Trade', 'BILLA', 'METRO', 'LIDL', 'KAUFLAND', 'ALEX TRADE', 'STOP4ETO', '#DM', 'Metro Cash & Carry',
        'BAHARICA', 'T-MARKET', 'LILLY', 'EBAG.BG', 'PRI RENA BAKERY', 'DZHOTO', 'PETROZARA'],
    ['Здраве', 'SOPHARMACY', 'FARMA VISION', 'PHARMACY DARA 5 PLO', 'FRAMAR', 'MARESHKI'],
    ['Транспорт', 'GAZPROM', 'OMV', 'SCHELL', 'PETROL', 'SHELL', 'INSAOIL', 'VAS OIL', 'LUKOIL', 'GAS STATIONS EKO', 'MOTION SERVICE', 'API BG TOLL', 'СКОРПИОН ИНС ООД', 'ITS VINETKI SOF'],
    ['Ресторанти', 'JAGERHOF', 'HAPPY BAR & GRILL', 'JAPONICA', 'Q BAR', 'HAPPY BAR&GRILL', 'JEGERHOF', 'PLPLAZ', 'DOMINOS', 'UGOVSKIA',
        'WEST COFFE PLAZA', 'GaleriaStara', 'GRAFIT', 'VIKTORIA', 'TORRO GRANDE', 'CONFETTI', 'EDO SUSH', 'BAR DINUR', 'TAMSHOUSE', 
        'LA KUCHINA', 'Glovo'],
    ['Банки', 'Теглене ПОС', 'FIB_ATM', 'UNICREDIT', 'ALLIANZ', 'Теглене ПОС BUL VASIL APRILOV'],
    ['За работа', 'AY STAYL', 'КОМФОРТ', 'АВАНСОВО ДОД', 'ДЗПО', 'ДОО', 'ЗОВ', 'REGIONAL BUSINESS', 'Regus Kamenitza Park'],
    ['Ежемесечни', 'МАТЕЙ', 'Бистра', 'EPAY A1 MOBILE', 'ИЗИПЕЙ', 'ATHLETIC FITNESS'],
    ['Revolut','Revolut'],
    ['Пазаруване', 'HITA', 'PEPCO', 'STUDIO MODERNA SOF', 'SPEEDY', 'TECHNOPOLIS', 'answear.bg', 'HUMANA', 'SPORT VISION', 'JUMBO', 
        'TOM TAILOR', 'JAGERSHOP', 'PEPKO', 'ECONT', 'ART 93', 'H&M', 'ART 93', 'KRISTI STIL', 'SPIDI'],
    ['Хоби', 'WEEKEND WOODWORKER', 'OZONE.BG', 'DECATLON', 'EVENTIM'],
    ['Апартамент', 'Период.плащ.Нар.кред.превод', 'Такса за периодично плащане', 'Погасяване главница кредит',
        'Погасяване редовна лихва кредит', 'PRAKTIKER', 'BRICOLAGE', 'BAUMAX', 'HOMEMAX', 'TULS OOD', 'HIPERMARKET RILA', 'PARKET STYLE',
        'TOPLIVO', 'IZIDOR', 'СЪЛИВЕР'],
    ['Чужбина', 'Плащане чрез ПОС чужбина'],
    ['Такси', 'Такса за операция от тип', 'Такса Нар.превод,IB', 'Такса за нареден', 'Такса поддръжка карта'],
    ['Без Категория']
]

export const parse = (fileContent: string) => {
    const result: Transaction[] = []
    fileContent.split(/\r?\n/)
        .forEach((line, lineIndex) => {
            if (lineIndex < LINE_START_DEFAULT)
                return

            const lineArr = line.split('|')
            const date = lineArr[0]
            // Remove empty line
            if (!date)
                return
            const amount = parseFloat(lineArr[2]?.replace(/,/g, ''))
            const type = lineArr[3] === 'D' ? 'debit' : 'credit'
            const document = lineArr[4]?.trim()
            const contragent = lineArr[5]?.trim()
            const reason = lineArr[6]?.trim()
            const info = lineArr[7]?.trim()
            const category = getTransactionCategory(contragent, document, reason, info)

            result.push({ date, amount, type, document, contragent, reason, info, category })
        })
    return result
}

const match = (str: string, pattern: string) => str.indexOf(pattern) !== -1

const getTransactionCategory = (contragent: string, document: string, reason: string, info: string) => {
    let result = 'Без Категория'
    Categories.forEach((category) => {
        category.forEach((pattern, pIndex) => {
            if (pIndex === 0)
                return
            if (match(contragent, pattern) || match(document, pattern) || match(info, pattern) || match(reason, pattern))
                result = category[0]
        })
    })
    return result

    // Categories.forEach((value) => {
    //     const title = value[0]
    //     const amount = getCategoryAmount(title, results)
    //     const details = getCategoryDetails(title, results)
    //     const percentage = Math.round((amount / spend) * 100)
    //     table.push({ title, amount, details, percentage })
    // })
}

export const getCategoryTransactions = (category: string, transactions: Transaction[]) =>
    transactions.filter((item) => item.category === category)

export const getCategoryAmount = (transactions: Transaction[], type: 'credit' | 'debit') =>
    transactions.reduce((prev, curr) => prev + (curr.type === type ? curr.amount : 0), 0)
