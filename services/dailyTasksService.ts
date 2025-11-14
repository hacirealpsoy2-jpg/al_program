import { supabase } from '../lib/supabase';

export interface DailyTask {
  id: string;
  date: string;
  water_intake_ml: number;
  morning_pushups: number;
  evening_pushups: number;
  morning_leg_stretch: boolean;
  noon_leg_stretch: boolean;
  evening_leg_stretch: boolean;
}

export async function getTodayTasks(): Promise<DailyTask | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('date', today)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!data) {
    const { data: newData, error: insertError } = await supabase
      .from('daily_tasks')
      .insert({ date: today })
      .select()
      .single();

    if (insertError) throw insertError;
    return newData;
  }

  return data;
}

export async function updateWaterIntake(amount: number) {
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('daily_tasks')
    .upsert({ date: today, water_intake_ml: amount }, { onConflict: 'date' });

  if (error) throw error;
}

export async function updatePushups(type: 'morning' | 'evening', count: number) {
  const today = new Date().toISOString().split('T')[0];
  const field = type === 'morning' ? 'morning_pushups' : 'evening_pushups';

  const { error } = await supabase
    .from('daily_tasks')
    .upsert({ date: today, [field]: count }, { onConflict: 'date' });

  if (error) throw error;
}

export async function updateLegStretch(time: 'morning' | 'noon' | 'evening', done: boolean) {
  const today = new Date().toISOString().split('T')[0];
  const field = `${time}_leg_stretch`;

  const { error } = await supabase
    .from('daily_tasks')
    .upsert({ date: today, [field]: done }, { onConflict: 'date' });

  if (error) throw error;
}
