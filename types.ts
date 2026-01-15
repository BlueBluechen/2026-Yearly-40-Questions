export interface Question {
  id: number;
  part: number;
  text: string;
}

export type Answers = Record<number, string>;

export enum AppState {
  WELCOME = 'WELCOME',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  PROCESSING = 'PROCESSING',
  REPORT = 'REPORT'
}

export interface AIReportData {
  keywords: string[];
  summaryCards: {
    title: string;
    content: string;
  }[];
}

export enum ReportMode {
  PRINTER = 'PRINTER', // 打印机卡片
  NOTEBOOK = 'NOTEBOOK' // 手写体笔记
}