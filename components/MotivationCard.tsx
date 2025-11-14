import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { getTodayMotivation } from '../services/motivationService';

export default function MotivationCard() {
  const [quote, setQuote] = useState<{ quote: string; author: string | null } | null>(null);

  useEffect(() => {
    getTodayMotivation().then(setQuote).catch(console.error);
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-start gap-4">
        <Quote className="w-8 h-8 flex-shrink-0 opacity-80" />
        <div>
          <p className="text-lg font-medium mb-2">{quote.quote}</p>
          {quote.author && (
            <p className="text-sm opacity-90">- {quote.author}</p>
          )}
        </div>
      </div>
    </div>
  );
}
