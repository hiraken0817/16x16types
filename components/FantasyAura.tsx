// 決定的な粒子配置（ビルド時固定、JSなしでCSSアニメーションのみ）。結果画面と同じ生成式。
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left: 8 + ((i * 37) % 84),
  duration: 4 + ((i * 13) % 5),
  delay: (i * 7) % 6,
  size: 2 + (i % 3),
}));

export default function FantasyAura() {
  return (
    <div className="quiz-fantasy-bg" aria-hidden="true">
      <div className="quiz-fantasy-aura" />
      {PARTICLES.map((p, i) => (
        <i
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
