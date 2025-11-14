import { useEffect, useState } from 'react';
import { Droplets, Dumbbell, Activity } from 'lucide-react';
import { getTodayTasks, updateWaterIntake, updatePushups, updateLegStretch, DailyTask } from '../services/dailyTasksService';

export default function DailyTasks() {
  const [tasks, setTasks] = useState<DailyTask | null>(null);
  const [waterInput, setWaterInput] = useState('');

  const loadTasks = async () => {
    try {
      const data = await getTodayTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addWater = async (amount: number) => {
    if (!tasks) return;
    const newAmount = tasks.water_intake_ml + amount;
    await updateWaterIntake(newAmount);
    loadTasks();
  };

  const handleWaterInput = async () => {
    const amount = parseInt(waterInput);
    if (amount && amount > 0) {
      await addWater(amount);
      setWaterInput('');
    }
  };

  const updatePushupsCount = async (type: 'morning' | 'evening', value: number) => {
    await updatePushups(type, value);
    loadTasks();
  };

  const toggleStretch = async (time: 'morning' | 'noon' | 'evening') => {
    if (!tasks) return;
    const currentValue = tasks[`${time}_leg_stretch` as keyof DailyTask] as boolean;
    await updateLegStretch(time, !currentValue);
    loadTasks();
  };

  if (!tasks) return <div className="text-center">Yükleniyor...</div>;

  const waterPercent = Math.min((tasks.water_intake_ml / 2500) * 100, 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Günlük Görevler</h2>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Su Tüketimi (Hedef: 2500 mL)</h3>
          </div>
          <div className="mb-3">
            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {tasks.water_intake_ml} mL / 2500 mL
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addWater(250)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              +250 mL
            </button>
            <button
              onClick={() => addWater(500)}
              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
            >
              +500 mL
            </button>
            <input
              type="number"
              value={waterInput}
              onChange={(e) => setWaterInput(e.target.value)}
              placeholder="Özel miktar"
              className="px-3 py-2 border rounded-lg flex-1"
            />
            <button
              onClick={handleWaterInput}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Ekle
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Şınav (Hedef: 50+50)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sabah</label>
              <input
                type="number"
                value={tasks.morning_pushups}
                onChange={(e) => updatePushupsCount('morning', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Akşam</label>
              <input
                type="number"
                value={tasks.evening_pushups}
                onChange={(e) => updatePushupsCount('evening', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Toplam: {tasks.morning_pushups + tasks.evening_pushups} / 100
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Bacak Esnetme (2 dk)</h3>
          </div>
          <div className="space-y-2">
            {(['morning', 'noon', 'evening'] as const).map((time) => {
              const labels = { morning: 'Sabah', noon: 'Öğle', evening: 'Akşam' };
              const isCompleted = tasks[`${time}_leg_stretch` as keyof DailyTask] as boolean;
              return (
                <button
                  key={time}
                  onClick={() => toggleStretch(time)}
                  className={`w-full px-4 py-2 rounded-lg transition ${
                    isCompleted
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {labels[time]} {isCompleted && '✓'}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
