import { supabase } from '../lib/supabase';

export const STUDY_SCHEDULE_6_MONTHS = [
  { week: 1, day: 1, subject: 'İngilizce', topic: 'Present Simple Tense - Geniş Zaman' },
  { week: 1, day: 2, subject: 'Python', topic: 'Python Temelleri - Değişkenler ve Veri Tipleri' },
  { week: 1, day: 3, subject: 'İngilizce', topic: 'Present Continuous Tense - Şimdiki Zaman' },
  { week: 1, day: 4, subject: 'Python', topic: 'Operatörler ve Matematiksel İşlemler' },
  { week: 1, day: 5, subject: 'İngilizce', topic: 'Vocabulary - Daily Routines (Günlük Rutinler)' },
  { week: 1, day: 6, subject: 'Python', topic: 'Koşullu İfadeler (if-elif-else)' },
  { week: 1, day: 7, subject: 'İngilizce', topic: 'Reading Practice - Short Texts' },

  { week: 2, day: 1, subject: 'Python', topic: 'Döngüler (for ve while)' },
  { week: 2, day: 2, subject: 'İngilizce', topic: 'Past Simple Tense - Geçmiş Zaman' },
  { week: 2, day: 3, subject: 'Python', topic: 'Listeler ve Liste İşlemleri' },
  { week: 2, day: 4, subject: 'İngilizce', topic: 'Past Continuous Tense' },
  { week: 2, day: 5, subject: 'Python', topic: 'String İşlemleri ve Metodları' },
  { week: 2, day: 6, subject: 'İngilizce', topic: 'Vocabulary - Education (Eğitim)' },
  { week: 2, day: 7, subject: 'Python', topic: 'Tuple ve Dictionary Veri Yapıları' },

  { week: 3, day: 1, subject: 'İngilizce', topic: 'Future Tenses - Gelecek Zaman' },
  { week: 3, day: 2, subject: 'Python', topic: 'Fonksiyonlar - Temel Kavramlar' },
  { week: 3, day: 3, subject: 'İngilizce', topic: 'Modal Verbs (can, could, may, might)' },
  { week: 3, day: 4, subject: 'Python', topic: 'Fonksiyonlar - Parameters ve Return' },
  { week: 3, day: 5, subject: 'İngilizce', topic: 'Vocabulary - Technology (Teknoloji)' },
  { week: 3, day: 6, subject: 'Python', topic: 'Lambda Fonksiyonları' },
  { week: 3, day: 7, subject: 'İngilizce', topic: 'Reading Comprehension Practice' },

  { week: 4, day: 1, subject: 'Python', topic: 'Dosya İşlemleri - Okuma ve Yazma' },
  { week: 4, day: 2, subject: 'İngilizce', topic: 'Present Perfect Tense' },
  { week: 4, day: 3, subject: 'Python', topic: 'Exception Handling (Hata Yönetimi)' },
  { week: 4, day: 4, subject: 'İngilizce', topic: 'Past Perfect Tense' },
  { week: 4, day: 5, subject: 'Python', topic: 'Modüller ve Import' },
  { week: 4, day: 6, subject: 'İngilizce', topic: 'Vocabulary - Health (Sağlık)' },
  { week: 4, day: 7, subject: 'Python', topic: 'OOP - Sınıflar ve Objeler' },
];

export async function initializeStudySchedule() {
  const { data: existingData } = await supabase
    .from('study_schedule')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existingData) {
    return;
  }

  const scheduleData = STUDY_SCHEDULE_6_MONTHS.map(item => ({
    week_number: item.week,
    day_number: item.day,
    subject: item.subject,
    topic: item.topic,
    completed: false,
  }));

  const { error } = await supabase
    .from('study_schedule')
    .insert(scheduleData);

  if (error) {
    console.error('Error initializing schedule:', error);
  }
}

export async function getWeekSchedule(weekNumber: number) {
  const { data, error } = await supabase
    .from('study_schedule')
    .select('*')
    .eq('week_number', weekNumber)
    .order('day_number');

  if (error) throw error;
  return data;
}

export async function toggleTopicComplete(id: string, completed: boolean) {
  const { error } = await supabase
    .from('study_schedule')
    .update({ completed })
    .eq('id', id);

  if (error) throw error;
}
