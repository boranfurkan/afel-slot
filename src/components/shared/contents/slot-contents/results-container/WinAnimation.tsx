import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlusIcon from '@/assets/icons/PlusIcon';
import AfelLogo from '@/components/UI/AfelLogo';
import SlotFrenzyText from '@/components/UI/SlotFrenzyText';
import WinIndicator from '@/components/UI/WinIndicator';

const WinAnimation: React.FC = () => {
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; color: string; delay: number }[]
  >([]);

  useEffect(() => {
    const newParticles = Array(30)
      .fill(0)
      .map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 3,
        color: ['#a0c380', '#78ff00', '#ffff00', '#ffffff'][
          Math.floor(Math.random() * 4)
        ],
        delay: Math.random() * 0.5,
      }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="slot-gradient-to-right px-5 py-4 w-full flex items-center justify-center gap-4 relative overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute rounded-full z-10"
          style={{
            left: `${particle.x}%`,
            top: '100%',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{ y: 0, opacity: 1 }}
          animate={{
            y: [-120, -150],
            x: [0, (Math.random() - 0.5) * 30],
            opacity: [1, 0.8, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeOut',
          }}
        />
      ))}

      <div className="bg-[#171717]/30 backdrop-blur-sm rounded-[8px] w-1/4 min-h-[100px] flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: [1, 1.1, 1],
            rotateZ: [0, -5, 5, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'loop',
            repeatDelay: 1,
          }}
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 0px #a0c380)',
                'drop-shadow(0 0 10px #a0c380)',
                'drop-shadow(0 0 0px #a0c380)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            <WinIndicator />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-[8px] z-0"
          animate={{
            boxShadow: [
              'inset 0 0 20px rgba(160, 195, 128, 0.2)',
              'inset 0 0 40px rgba(160, 195, 128, 0.6)',
              'inset 0 0 20px rgba(160, 195, 128, 0.2)',
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </div>

      <div className="w-3/4 flex items-center justify-center gap-16 relative z-10">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            filter: [
              'drop-shadow(0 0 0px #ffffff)',
              'drop-shadow(0 0 3px #ffffff)',
              'drop-shadow(0 0 0px #ffffff)',
            ],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          <AfelLogo />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          <PlusIcon height={19} width={19} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -5, 0],
            filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          <SlotFrenzyText />
        </motion.div>
      </div>
    </div>
  );
};

export default WinAnimation;
