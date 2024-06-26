'use client'
import type { AI } from '@/lib/chat/actions'
import { useState } from 'react'
import { useAIState, useActions, useUIState } from 'ai/rsc';
import { format, addDays, differenceInCalendarDays } from 'date-fns';

interface Stop {
  city: string;
  startDate: Date;
  endDate: Date;
  accommodation?: string;
}

export interface ItineraryProps {
  itinerary: Stop[];
  title: string;
}

export function Itinerary({props: {itinerary, title }}: {props: ItineraryProps}) {

  const { updateItinerary } = useActions(); // Assuming useActions provides an appropriate method
  const [, setMessages] = useUIState(); // Assuming this sets UI-related messages
  const [it, setItinerary] = useState<Stop[]>(itinerary);

  function changeDuration(index: number, increment: boolean) {
    const updatedItinerary = it.map((stop, idx) => {
      if (idx === index) {
        const newEndDate = increment ? addDays(stop.endDate, 1) : addDays(stop.endDate, -1);
        const numNights = differenceInCalendarDays(newEndDate, stop.startDate);
        if (numNights >= 1) {
          // Update the itinerary stop
          const updatedStop = { ...stop, endDate: newEndDate };

          // Create a system message about the change
          const message = {
            role: 'system',
            content: `[User has changed the duration of nights in ${stop.city} to ${numNights}]`,
            id: new Date().toISOString() // Unique identifier for the message
          };

          // Optionally update the UI messages for immediate feedback
          setMessages((currentMessages: any) => [...currentMessages, message]);

          return updatedStop;
        }
      }
      return stop;
    });

    updateItinerary(updatedItinerary, title); // Assuming this action triggers a backend update or similar
    setItinerary(updatedItinerary);
  }

  return (
    <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
      <div className="text-lg text-zinc-300">{title}</div>
      {it.map((stop, index) => (
        <div key={index} className="mt-4 p-2 flex justify-between">
          <div>
            <div className="text-xl font-bold">{stop.city}</div>
            <div className="text-sm">
              {format(stop.startDate, 'MMM dd, yyyy')} - {format(stop.endDate, 'MMM dd, yyyy')}
              ({differenceInCalendarDays(stop.endDate, stop.startDate)} nights)
            </div>
            {stop.accommodation && (
              <div className="text-sm italic">Staying at: {stop.accommodation}</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button className="rounded bg-red-500 px-2 py-1 text-white" onClick={() => changeDuration(index, false)}>-</button>
            <button className="rounded bg-green-500 px-2 py-1 text-white" onClick={() => changeDuration(index, true)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
