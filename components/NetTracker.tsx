import { useState, useEffect } from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { addNet, getNets, ExamNet } from '../services/netService';

export default function NetTracker() {
  const [examType, setExamType] = useState<'TYT' | 'AYT'>('TYT');
  const [nets, setNets] = useState<ExamNet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    correct: 0,
    wrong: 0,
  });

  const TYT_SUBJECTS = ['Türkçe', 'Matematik', 'Sosyal Bilimler', 'Fen Bilimleri'];
  const AYT_SUBJECTS = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Edebiyat', 'Tarih', 'Coğrafya'];

  const loadNets = async () => {
    try {
      const data = await getNets(examType);
      setNets(data || []);
    } catch (error) {
      console.error('Error loading nets:', error);
    }
  };

  useEffect(() => {
    loadNets();
  }, [examType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNet(examType, formData.subject, formData.correct, formData.wrong);
      setFormData({ subject: '', correct: 0, wrong: 0 });
      setShowForm(false);
      loadNets();
    } catch (error) {
      console.error('Error adding net:', error);
    }
  };

  const subjects = examType === 'TYT' ? TYT_SUBJECTS : AYT_SUBJECTS;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-600" />
          Net Takibi
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Net Ekle
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setExamType('TYT')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            examType === 'TYT'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          TYT
        </button>
        <button
          onClick={() => setExamType('AYT')}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            examType === 'AYT'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          AYT
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ders</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Ders Seçin</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doğru</label>
              <input
                type="number"
                min="0"
                value={formData.correct}
                onChange={(e) => setFormData({ ...formData, correct: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yanlış</label>
              <input
                type="number"
                min="0"
                value={formData.wrong}
                onChange={(e) => setFormData({ ...formData, wrong: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {nets.length === 0 ? (
          <p className="text-center text-gray-500">Henüz net kaydı yok</p>
        ) : (
          nets.map((net) => (
            <div key={net.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{net.subject}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(net.date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{net.net.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    D: {net.correct} | Y: {net.wrong}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
