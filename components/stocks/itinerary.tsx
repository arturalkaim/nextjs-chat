'use client'

import { useState } from 'react';
import { format } from 'date-fns';

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
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

  function handleSelectStop(stop: Stop) {
    setSelectedStop(stop);
  }

  return (
    <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
      <div className="text-lg text-zinc-300">Travel Itinerary</div>
      {itinerary.map((stop, index) => (
        <div
          key={index}
          className="mt-4 p-2 cursor-pointer hover:bg-zinc-700"
          onClick={() => handleSelectStop(stop)}
        >
          <div className="text-xl font-bold">{stop.city}</div>
          <div className="text-sm">
            {format(stop.startDate, 'MMM dd, yyyy')} - {format(stop.endDate, 'MMM dd, yyyy')}
          </div>
          {stop.accommodation && (
            <div className="text-sm italic">Staying at: {stop.accommodation}</div>
          )}
        </div>
      ))}
      {selectedStop && (
        <div className="mt-4 p-4 rounded bg-zinc-800">
          <h3 className="text-lg font-bold">Details for {selectedStop.city}</h3>
          <p>Date: {format(selectedStop.startDate, 'MMM dd, yyyy')} to {format(selectedStop.endDate, 'MMM dd, yyyy')}</p>
          {selectedStop.accommodation && <p>Accommodation: {selectedStop.accommodation}</p>}
        </div>
      )}
    </div>
  );
}
