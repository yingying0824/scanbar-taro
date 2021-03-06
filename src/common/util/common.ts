import dayJs from 'dayjs';

export function dateHelper(date: number): string {
  return dayJs(date).format('YYYY-MM-DD');
}

interface ConsoleUtilConfig {
  title: string;
  env?: string;
}

export class ConsoleUtil {
  private title: string;
  private env: string;
  constructor (options: ConsoleUtilConfig) {
    this.init(options);
  }

  public console = (...arg: any[]) => {
    if (this.env !== 'production') {
      console.log(`---- ${this.title} ----`);
      console.log(arg);
    }
  }
  
  private init = (options: ConsoleUtilConfig) => {
    const { title, env } = options;
    this.title = title;
    this.env = env || 'development';
  }

}

/**
 * @todo [返回该年份的所有月份]
 */
export function createMonth (year: number = 2020) {
  const month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => {
    return {
      month: item + 1,
      monthStr: `${year}年${item + 1}月`,
      startDate: new Date(year, item, 1),
      endDate: new Date(year, item, getMonthEndDate(item, year)),
    };
  });
  return month;
}

export function getMonthEndDate(month: number, year: number) {
  switch (month + 1) {
    case 2: {
      if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
        return 29;
      } else {
        return 28;
      }
    }
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12: {
      return 31;
    }
    default: {
      return 30;
    }
  }
}