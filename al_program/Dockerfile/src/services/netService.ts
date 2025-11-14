import { supabase } from '../lib/supabase';

export interface ExamNet {
  id: string;
  date: string;
  exam_type: string;
  subject: string;
  correct: number;
  wrong: number;
  net: number;
}

export async function addNet(examType: string, subject: string, correct: number, wrong: number) {
  const { error } = await supabase
    .from('exam_nets')
    .insert({
      exam_type: examType,
      subject: subject,
      correct: correct,
      wrong: wrong,
    });

  if (error) throw error;
}

export async function getNets(examType?: string) {
  let query = supabase
    .from('exam_nets')
    .select('*')
    .order('date', { ascending: false });

  if (examType) {
    query = query.eq('exam_type', examType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getNetStatistics(examType: string) {
  const { data, error } = await supabase
    .from('exam_nets')
    .select('subject, correct, wrong, net')
    .eq('exam_type', examType);

  if (error) throw error;

  const stats: { [key: string]: { total: number; avg: number } } = {};

  data?.forEach((item) => {
    if (!stats[item.subject]) {
      stats[item.subject] = { total: 0, avg: 0 };
    }
    stats[item.subject].total += parseFloat(item.net);
  });

  Object.keys(stats).forEach((subject) => {
    const count = data?.filter((item) => item.subject === subject).length || 1;
    stats[subject].avg = stats[subject].total / count;
  });

  return stats;
}
