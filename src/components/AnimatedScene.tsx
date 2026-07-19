import { motion } from 'framer-motion';
import type { SceneDescriptor, SceneKey, SceneMotion } from '../core/scenes';

interface AnimatedSceneProps {
  emoji: string;
  scene: SceneDescriptor;
  label?: string;
}

/**
 * Small mini-scene rendered behind a word reveal. Framer Motion drives the
 * animation on the web; the mobile app will render the same `SceneKey` with
 * its own animation stack (Reanimated / Moti) so no logic is duplicated.
 */
export default function AnimatedScene({ emoji, scene, label }: AnimatedSceneProps) {
  return (
    <div
      className={`scene scene-${scene.key}`}
      role="img"
      aria-label={label ?? 'Animated illustration'}
    >
      {renderScene(scene.key, scene.motion, emoji)}
    </div>
  );
}

function renderScene(key: SceneKey, motion: SceneMotion, emoji: string) {
  switch (key) {
    case 'road':          return <RoadScene emoji={emoji} />;
    case 'sky-flying':    return <SkyFlyingScene emoji={emoji} />;
    case 'water':         return <WaterScene emoji={emoji} bounce={motion === 'bounce'} />;
    case 'ground':        return <GroundScene emoji={emoji} motion={motion} />;
    case 'weather-rain':  return <RainScene emoji={emoji} />;
    case 'weather-snow':  return <SnowScene emoji={emoji} />;
    case 'rainbow':       return <RainbowScene emoji={emoji} />;
    case 'celestial':     return <CelestialScene emoji={emoji} motion={motion} />;
    case 'sparkles':
    default:              return <SparklesScene emoji={emoji} />;
  }
}

/* -------------------------- Shared bits -------------------------- */

function Cloud({ delay = 0, top = '20%', size = 60, duration = 12 }: {
  delay?: number; top?: string; size?: number; duration?: number;
}) {
  return (
    <motion.div
      className="scene-cloud"
      style={{ top, fontSize: size }}
      initial={{ x: '-30%' }}
      animate={{ x: '130%' }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      aria-hidden="true"
    >
      ☁️
    </motion.div>
  );
}

function Sparkle({ x, y, delay = 0 }: { x: string; y: string; delay?: number }) {
  return (
    <motion.span
      className="scene-sparkle"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], rotate: [0, 90, 180] }}
      transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      ✨
    </motion.span>
  );
}

/* -------------------------- Scenes -------------------------- */

function RoadScene({ emoji }: { emoji: string }) {
  return (
    <>
      <motion.div
        className="scene-sun"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        ☀️
      </motion.div>
      <Cloud top="18%" delay={0} duration={11} />
      <Cloud top="34%" delay={4} duration={14} size={48} />
      <div className="scene-hills" aria-hidden="true">
        <span /> <span /> <span />
      </div>
      <div className="scene-road" aria-hidden="true" />
      <motion.div
        className="scene-star-emoji vehicle"
        initial={{ x: '-30%' }}
        animate={{ x: '130%', y: [0, -3, 0, -3, 0] }}
        transition={{
          x: { duration: 5, repeat: Infinity, ease: 'linear' },
          y: { duration: 0.4, repeat: Infinity, ease: 'linear' }
        }}
      >
        {emoji}
      </motion.div>
    </>
  );
}

function SkyFlyingScene({ emoji }: { emoji: string }) {
  return (
    <>
      <motion.div className="scene-sun scene-sun-soft" aria-hidden="true">☀️</motion.div>
      <Cloud top="10%" delay={0} duration={13} size={54} />
      <Cloud top="55%" delay={3} duration={16} size={68} />
      <Cloud top="72%" delay={7} duration={11} size={44} />
      <motion.div
        className="scene-star-emoji flyer"
        initial={{ x: '-25%', y: 0 }}
        animate={{
          x: ['-25%', '30%', '65%', '125%'],
          y: [0, -22, 8, -14, 0],
          rotate: [-3, 3, -2, 4, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.div>
    </>
  );
}

function WaterScene({ emoji, bounce }: { emoji: string; bounce: boolean }) {
  return (
    <>
      <motion.div className="scene-sun scene-sun-soft" aria-hidden="true">☀️</motion.div>
      <Cloud top="18%" duration={15} size={52} />
      <div className="scene-water" aria-hidden="true">
        <div className="wave wave-1" />
        <div className="wave wave-2" />
      </div>
      {bounce ? (
        // Boats & ships: sail across the whole scene while gently tilting
        // on the waves.
        <motion.div
          className="scene-star-emoji boat"
          initial={{ x: '-40%' }}
          animate={{ x: '140%', rotate: [-4, 4, -3, 3, -4], y: [0, -6, 0, -6, 0] }}
          transition={{
            x:      { duration: 9, repeat: Infinity, ease: 'linear' },
            rotate: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            y:      { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          {emoji}
        </motion.div>
      ) : (
        // Fish / sea / river: swims back and forth just under the surface.
        <motion.div
          className="scene-star-emoji boat"
          animate={{ x: ['-35%', '35%', '-35%'], y: [0, -6, 0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.div>
      )}
    </>
  );
}

function GroundScene({ emoji, motion: m }: { emoji: string; motion: SceneMotion }) {
  return (
    <>
      <motion.div
        className="scene-sun"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      >
        ☀️
      </motion.div>
      <Cloud top="14%" duration={14} size={48} />
      <Cloud top="30%" delay={5} duration={17} size={54} />
      <div className="scene-grass" aria-hidden="true">
        <span>🌱</span><span>🌼</span><span>🌱</span><span>🌸</span><span>🌱</span>
      </div>
      {m === 'hop' ? (
        // Animals (and the frog) walk across the scene, hopping as they go.
        // Horizontal roam is slow & linear; the hop cycles quickly on top.
        <motion.div
          className="scene-star-emoji ground-actor"
          initial={{ x: '-40%' }}
          animate={{
            x: '140%',
            y: [0, -28, 0, -28, 0, -28, 0, -28, 0, -28, 0],
            scale: [1, 1.05, 1, 1.05, 1, 1.05, 1, 1.05, 1, 1.05, 1]
          }}
          transition={{
            x:     { duration: 7,   repeat: Infinity, ease: 'linear' },
            y:     { duration: 0.55, repeat: Infinity, ease: 'easeOut' },
            scale: { duration: 0.55, repeat: Infinity, ease: 'easeOut' }
          }}
        >
          {emoji}
        </motion.div>
      ) : m === 'sway' ? (
        // Trees / flowers: rooted in place, sway in the breeze.
        <motion.div
          className="scene-star-emoji ground-actor"
          animate={{ rotate: [-4, 4, -3, 3, -4], y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.div>
      ) : m === 'spin' ? (
        <motion.div
          className="scene-star-emoji ground-actor"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {emoji}
        </motion.div>
      ) : (
        <motion.div
          className="scene-star-emoji ground-actor"
          animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.div>
      )}
    </>
  );
}

function RainScene({ emoji }: { emoji: string }) {
  const drops = Array.from({ length: 14 });
  return (
    <>
      <motion.div className="scene-cloud big" style={{ top: '10%' }} aria-hidden="true">☁️</motion.div>
      {drops.map((_, i) => (
        <motion.span
          key={i}
          className="raindrop"
          style={{ left: `${(i * 7) % 100}%` }}
          initial={{ y: '-10%', opacity: 0 }}
          animate={{ y: '110%', opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.4 + (i % 3) * 0.3,
            delay: i * 0.15,
            repeat: Infinity,
            ease: 'linear'
          }}
          aria-hidden="true"
        >
          💧
        </motion.span>
      ))}
      <motion.div
        className="scene-star-emoji center"
        animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {emoji}
      </motion.div>
    </>
  );
}

function SnowScene({ emoji }: { emoji: string }) {
  const flakes = Array.from({ length: 18 });
  return (
    <>
      {flakes.map((_, i) => (
        <motion.span
          key={i}
          className="snowflake"
          style={{ left: `${(i * 6) % 100}%`, fontSize: 14 + (i % 3) * 6 }}
          initial={{ y: '-10%', opacity: 0 }}
          animate={{
            y: '110%',
            x: [0, 8, -8, 6, -6, 0],
            opacity: [0, 1, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 4 + (i % 4) * 0.6,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'linear'
          }}
          aria-hidden="true"
        >
          ❄️
        </motion.span>
      ))}
      <motion.div
        className="scene-star-emoji center"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {emoji}
      </motion.div>
    </>
  );
}

function RainbowScene({ emoji }: { emoji: string }) {
  return (
    <>
      <motion.div className="scene-sun scene-sun-soft" aria-hidden="true">☀️</motion.div>
      <div className="scene-rainbow" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span />
      </div>
      <Sparkle x="12%" y="30%" />
      <Sparkle x="82%" y="24%" delay={0.6} />
      <Sparkle x="50%" y="14%" delay={1.1} />
      <motion.div
        className="scene-star-emoji center"
        animate={{ y: [0, -10, 0], rotate: [-6, 6, -6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.div>
    </>
  );
}

function CelestialScene({ emoji, motion: m }: { emoji: string; motion: SceneMotion }) {
  const anim =
    m === 'spin'   ? { rotate: [0, 360] } :
    m === 'drift'  ? { x: [0, 12, -12, 0], y: [0, -8, 0] } :
                     { scale: [1, 1.15, 1], rotate: [-8, 8, -8] };
  const dur = m === 'spin' ? 14 : m === 'drift' ? 5 : 2.2;
  return (
    <>
      <div className="scene-night" aria-hidden="true" />
      <Sparkle x="12%" y="20%" />
      <Sparkle x="80%" y="30%" delay={0.6} />
      <Sparkle x="30%" y="70%" delay={1.1} />
      <Sparkle x="70%" y="65%" delay={1.6} />
      <motion.div
        className="scene-star-emoji center huge"
        animate={anim}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.div>
    </>
  );
}

function SparklesScene({ emoji }: { emoji: string }) {
  return (
    <>
      <Sparkle x="10%" y="20%" />
      <Sparkle x="82%" y="18%" delay={0.4} />
      <Sparkle x="15%" y="75%" delay={0.9} />
      <Sparkle x="80%" y="70%" delay={1.3} />
      <Sparkle x="48%" y="10%" delay={1.7} />
      <motion.div
        className="scene-star-emoji center"
        animate={{ y: [0, -14, 0], rotate: [-6, 6, -6], scale: [1, 1.08, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.div>
    </>
  );
}
