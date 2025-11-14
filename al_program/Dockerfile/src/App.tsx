import React from 'react';
import AIAssistant from './components/AIAssistant';
import DailyTasks from './components/DailyTasks';
import MotivationCard from './components/MotivationCard';
import NetTracker from './components/NetTracker';
import StudySchedule from './components/StudySchedule';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <MotivationCard />
      <DailyTasks />
      <NetTracker />
      <StudySchedule />
      <AIAssistant />
    </div>
  );
}
