"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const StartAnimation = ({ onFinish }: { onFinish?: () => void }) => {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timeline = async () => {
      await delay(400);
      setStep(1);

      await delay(800);
      setStep(2);

      await delay(700);
      setStep(3);

      await delay(900);
      setExiting(true);

      await delay(1200);
      onFinish?.();
    };

    timeline();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden pointer-events-auto"
    >
      {/* BLURRED BACKGROUND */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-orange-900/50"
        animate={{
          filter: exiting
            ? "blur(20px) brightness(0.3)"
            : "blur(0px) brightness(1)",
        }}
        transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      />

      {/* FIXED POSITION MESSAGES - no layout shift */}
      <div className="relative w-full max-w-md px-6 h-48">

        {/* MESSAGE 1 - fixed position top */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              key="msg1"
              initial={{
                opacity: 0,
                scale: 0.5,
                filter: "blur(10px)",
              }}
              animate={
                exiting
                  ? {
                      scale: 8,
                      opacity: 0,
                      filter: "blur(20px)",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                    }
              }
              transition={
                exiting
                  ? {
                      duration: 1.2,
                      ease: [0.43, 0.13, 0.23, 0.96],
                    }
                  : {
                      duration: 0.7,
                      ease: [0.34, 1.56, 0.64, 1],
                    }
              }
              className="absolute top-0 right-6 flex justify-end"
            >
              <div className="px-5 py-3 rounded-2xl text-sm bg-orange-500 text-white backdrop-blur-xl border border-orange-400/30 shadow-lg shadow-orange-500/30">
                Hey 👋 Anyone here?
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TYPING BUBBLE - fixed position middle */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute top-16 left-6"
            >
              <div className="bg-white/10 px-4 py-3 rounded-2xl flex gap-1 backdrop-blur-xl border border-white/10">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MESSAGE 2 - fixed position bottom */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              key="msg2"
              initial={{
                opacity: 0,
                scale: 0.5,
                filter: "blur(10px)",
              }}
              animate={
                exiting
                  ? {
                      scale: 8,
                      opacity: 0,
                      filter: "blur(20px)",
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                    }
              }
              transition={
                exiting
                  ? {
                      duration: 1.2,
                      ease: [0.43, 0.13, 0.23, 0.96],
                      delay: 0.1,
                    }
                  : {
                      duration: 0.7,
                      ease: [0.34, 1.56, 0.64, 1],
                    }
              }
              className="absolute top-28 left-6"
            >
              <div className="px-5 py-3 rounded-2xl text-sm bg-white/10 text-white backdrop-blur-xl border border-white/10">
                Welcome to YapYard 🔥
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default StartAnimation;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));//