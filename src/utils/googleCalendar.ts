import { Schedule } from '../types';

export async function syncWithGoogleCalendar(schedules: Schedule[], accessToken: string): Promise<void> {
  const calendarId = 'primary'; // Uses the user's primary calendar
  
  for (const schedule of schedules) {
    const event = {
      summary: schedule.text,
      start: {
        dateTime: new Date(schedule.scheduledFor).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(new Date(schedule.scheduledFor).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  }
}
