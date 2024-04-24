'use client'

import { useAIState, useActions, useUIState } from 'ai/rsc';
import { format, addDays, differenceInCalendarDays } from 'date-fns';

interface Stop {
  city: string;
  startDate: Date;
  endDate: Date;
  accommodation?: string;
}

interface ItineraryProps {
  itinerary: Stop[];
}

export function Itinerary({ itinerary }: ItineraryProps) {

  const { aiState, setAIState } = useAIState();
  const { updateItinerary } = useActions(); // Assuming useActions provides an appropriate method
  const [, setMessages] = useUIState(); // Assuming this sets UI-related messages

  function changeDuration(index: number, increment: boolean) {
    const updatedItinerary = aiState.itinerary.map((stop, idx) => {
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
          setMessages(currentMessages => [...currentMessages, message]);

          return updatedStop;
        }
      }
      return stop;
    });

    updateItinerary(updatedItinerary); // Assuming this action triggers a backend update or similar
  }

  return (
    <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
      <div className="text-lg text-zinc-300">Travel Itinerary</div>
      {itinerary.map((stop, index) => (
        <div key={index} className="mt-4 p-2">
          <div className="text-xl font-bold">{stop.city}</div>
          <div className="text-sm">
            {format(stop.startDate, 'MMM dd, yyyy')} - {format(stop.endDate, 'MMM dd, yyyy')}
            ({differenceInCalendarDays(stop.endDate, stop.startDate)} nights)
          </div>
          <button className="mx-2" onClick={() => changeDuration(index, false)}>-</button>
          <button className="mx-2" onClick={() => changeDuration(index, true)}>+</button>
          {stop.accommodation && (
            <div className="text-sm italic">Staying at: {stop.accommodation}</div>
          )}
        </div>
      ))}
    </div>
  );
}
