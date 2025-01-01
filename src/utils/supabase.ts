import { createClient } from '@supabase/supabase-js';
import { RPMData, Schedule } from '../types';

// Ensure environment variables exist
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please click "Connect to Supabase" button to set up your project.'
  );
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function uploadToSupabase(data: Record<string, RPMData>): Promise<void> {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('Please log in to sync data');
  }

  const { error } = await supabase
    .from('rpm_data')
    .upsert({ 
      id: user.data.user.id,
      data: data 
    });

  if (error) throw error;
}

export async function downloadFromSupabase(): Promise<Record<string, RPMData>> {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('Please log in to sync data');
  }

  const { data, error } = await supabase
    .from('rpm_data')
    .select('data')
    .eq('id', user.data.user.id)
    .single();

  if (error) throw error;
  return data.data;
}

export async function addSchedule(itemId: string, text: string, scheduledFor: Date): Promise<Schedule> {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('Please log in to schedule items');
  }

  const { data, error } = await supabase
    .from('schedules')
    .insert({
      user_id: user.data.user.id,
      item_id: itemId,
      text,
      scheduled_for: scheduledFor.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    itemId: data.item_id,
    text: data.text,
    scheduledFor: new Date(data.scheduled_for),
    createdAt: new Date(data.created_at),
  };
}

export async function getSchedules(): Promise<Schedule[]> {
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    throw new Error('Please log in to view schedules');
  }

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('user_id', user.data.user.id)
    .order('scheduled_for', { ascending: true });

  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    itemId: item.item_id,
    text: item.text,
    scheduledFor: new Date(item.scheduled_for),
    createdAt: new Date(item.created_at),
  }));
}
