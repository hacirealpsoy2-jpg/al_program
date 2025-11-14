import { useState } from 'react';
import { MessageCircle, Send, Youtube, Loader2 } from 'lucide-react';
import { askGemini } from '../services/geminiService';
import { searchYouTube, YouTubeVideo } from '../services/youtubeService';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  videos?: YouTubeVideo[];
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const videos = await searchYouTube(`${userMessage} türkçe eğitim`, 3);

      let context = '';
      if (videos.length > 0) {
        context = `İlgili YouTube videoları:\n${videos
          .map((v) => `- ${v.title} (${v.channelTitle})`)
          .join('\n')}`;
      }

      const answer = await askGemini(userMessage, context);

      await supabase.from('questions').insert({
        question: userMessage,
        answer: answer,
        sources: videos.map((v) => ({
          videoId: v.videoId,
          title: v.title,
          channelTitle: v.channelTitle,
        })),
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer, videos: videos },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">AI Asistan</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">TYT-AYT, İngilizce veya Python hakkında her şeyi sorabilirsiniz!</p>
            <p className="text-sm">YouTube videoları ve Gemini AI ile desteklenmektedir.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {msg.videos && msg.videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Youtube className="w-4 h-4" />
                    İlgili Videolar:
                  </div>
                  {msg.videos.map((video) => (
                    <a
                      key={video.videoId}
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-lg p-2 hover:shadow-md transition"
                    >
                      <div className="flex gap-2">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {video.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{video.channelTitle}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bir şey sorun..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
