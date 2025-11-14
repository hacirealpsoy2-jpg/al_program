import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { getWeekSchedule, toggleTopicComplete } from '../services/studyService';

interface ScheduleItem {
  id: string;
  week_number: number;
  day_number: number;
  subject: string;
  topic: string;
  completed: boolean;
}

export default function StudySchedule() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSchedule = async () => {
    try {
      const data = await getWeekSchedule(currentWeek);
      setSchedule(data || []);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [currentWeek]);

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await toggleTopicComplete(id, !completed);
      loadSchedule();
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Haftalık Çalışma Programı
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
            disabled={currentWeek === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Önceki
          </button>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
            Hafta {currentWeek}
          </span>
          <button
            onClick={() => setCurrentWeek(Math.min(24, currentWeek + 1))}
            disabled={currentWeek === 24}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Sonraki
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : (
        <div className="space-y-3">
          {schedule.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 transition ${
                item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-600">
                      {days[item.day_number - 1]}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.subject === 'İngilizce'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.subject}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium">{item.topic}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.id, item.completed)}
                  className="flex-shrink-0 ml-4"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
