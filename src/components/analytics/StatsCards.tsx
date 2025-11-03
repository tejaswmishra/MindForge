interface StatsCardsProps {
  stats: {
    totalSyllabi: number;
    totalQuizzes: number;
    averageScore: number;
    totalQuestions: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Syllabi Uploaded',
      value: stats.totalSyllabi,
      icon: '📚',
      description: 'Course materials processed',
      trend: '+12%',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20 backdrop-blur-sm',
      trendColor: 'bg-white/20 text-white/90 border-white/30'
    },
    {
      title: 'Quizzes Generated',
      value: stats.totalQuizzes,
      icon: '🧠',
      description: 'AI-powered assessments',
      trend: '+8%',
      bgGradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20 backdrop-blur-sm',
      trendColor: 'bg-white/20 text-white/90 border-white/30'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      icon: '🎯',
      description: 'Overall performance',
      trend: stats.averageScore >= 75 ? 'Excellent' : 'Improving',
      bgGradient: stats.averageScore >= 75 
        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
        : 'bg-gradient-to-br from-orange-500 to-red-500',
      textColor: 'text-white',
      iconBg: 'bg-white/20 backdrop-blur-sm',
      trendColor: 'bg-white/20 text-white/90 border-white/30'
    },
    {
      title: 'Questions Answered',
      value: stats.totalQuestions.toLocaleString(),
      icon: '✅',
      description: 'Practice completed',
      trend: '+23%',
      bgGradient: 'bg-gradient-to-br from-teal-500 to-green-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20 backdrop-blur-sm',
      trendColor: 'bg-white/20 text-white/90 border-white/30'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`
            ${card.bgGradient}
            rounded-2xl p-6
            hover:scale-105
            hover:shadow-2xl
            transition-all duration-300
            shadow-lg
            border border-white/10
            backdrop-blur-sm
            group
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${card.textColor}/80 leading-tight`}>
              {card.title}
            </h3>
            <div className={`${card.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-xl filter drop-shadow-sm">{card.icon}</span>
            </div>
          </div>
          
          {/* Main Value */}
          <div className={`text-3xl font-bold ${card.textColor} mb-3 leading-none drop-shadow-sm`}>
            {card.value}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className={`text-xs ${card.textColor}/70 leading-tight`}>
              {card.description}
            </p>
            <span className={`${card.trendColor} text-xs px-3 py-1 rounded-full font-medium border backdrop-blur-sm`}>
              {card.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}