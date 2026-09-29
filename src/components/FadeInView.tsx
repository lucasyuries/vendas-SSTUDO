// ============================================================================
// Animações de entrada
// ----------------------------------------------------------------------------
// Todas respeitam a preferência de movimento reduzido do sistema.
//
// A regra CSS em styles.css não basta sozinha: ela zera transições declaradas
// em CSS, e estas são calculadas em JavaScript pelo framer-motion, que passa ao
// largo dela.
//
// ATENÇÃO ao formato da correção. A primeira tentativa desligava a animação
// passando `initial={false}` e `whileInView={undefined}`. Isso deixou o
// framer-motion sem nenhum alvo de estilo, e os elementos travaram em
// opacidade zero: com movimento reduzido ativo, seções inteiras ficavam
// invisíveis. O defeito atingia exatamente quem a preferência deveria
// proteger.
//
// A forma correta é sempre declarar os dois estados. Com movimento reduzido, o
// estado inicial já é o final — nada se move porque não há distância entre
// eles, e não porque a animação foi removida.
// ============================================================================

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface FadeInViewProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}

export function FadeInView({
  children,
  delay = 0,
  duration = 0.5,
  y = 24,
  className,
  ...rest
}: FadeInViewProps) {
  const semMovimento = useReducedMotion();
  const visivel = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={semMovimento ? visivel : { opacity: 0, y }}
      whileInView={visivel}
      viewport={{ once: true, amount: 0.2 }}
      transition={semMovimento ? { duration: 0 } : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface FadeInStaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function FadeInStagger({ children, staggerDelay = 0.1, className }: FadeInStaggerProps) {
  const semMovimento = useReducedMotion();

  return (
    <motion.div
      initial={semMovimento ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        visible: {
          transition: { staggerChildren: semMovimento ? 0 : staggerDelay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({
  children,
  className,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const semMovimento = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: semMovimento ? { opacity: 1, y: 0 } : { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: semMovimento ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
