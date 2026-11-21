"use client";

/**
 * El robot del asistente "Pregúntale a mi IA": la puerta de entrada al chat.
 *
 * Es el mismo personaje del asistente de Smart Report IA (cabeza con visor,
 * casco, antena con luz y la placa "IA"), con la paleta del portafolio: casco
 * violeta, luz fucsia y ojos lavanda. La vida está en los ojos: siguen el
 * cursor por toda la página con un poco de inercia, parpadean (a veces dos
 * veces), se ponen felices cuando alguien se acerca y saluda con el brazo,
 * celebran el clic con estrellas, giran mientras el asistente piensa y se
 * adormecen tras un minuto sin nadie.
 *
 * De vez en cuando habla: un globo con una frase corta, que se cierra solo y
 * abre el chat si se toca. Se arrastra con mouse o dedo, se pega al borde más
 * cercano y recuerda dónde lo dejaron. Con "reducir movimiento" se queda
 * quieto, mira al frente y no habla.
 */
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

// El primer globo espera a que la persona se ubique; después, uno cada 40-65 s.
const FIRST_BUBBLE_MS = 9_000;
const BETWEEN_BUBBLES_MS = 40_000;
const BUBBLE_VISIBLE_MS = 6_500;

// Sin mover el mouse este rato, la mirada vuelve al frente; con mucho más,
// el robot se adormece.
const GAZE_IDLE_MS = 3_000;
const SLEEP_MS = 60_000;

// Cuánto se pueden mover las pupilas dentro del visor, en unidades del dibujo.
const REACH_X = 4.2;
const REACH_Y = 2.8;

// La reacción al clic dura esto; el chat se abre antes de que termine, para
// que la celebración no se sienta como espera.
const REACTION_MS = 420;
const OPEN_AFTER_MS = 220;

/** Lo que dicen los ojos. */
type Mood = "normal" | "happy" | "stars" | "thinking" | "asleep" | "surprised";

/** Dónde lo dejó la persona; `null` es su sitio de siempre, abajo a la derecha. */
type Placement = { side: "left" | "right"; y: number } | null;

const STORAGE_KEY = "portfolio:ask-robot";
// Más de esto con el botón apretado es arrastre, no clic.
const DRAG_THRESHOLD_PX = 5;
// Por debajo del encabezado fijo del sitio.
const TOP_LIMIT_PX = 80;

function readPlacement(): Placement {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as { side?: unknown; y?: unknown };
    if ((p.side === "left" || p.side === "right") && typeof p.y === "number") {
      return { side: p.side, y: p.y };
    }
  } catch {
    // Sin almacenamiento (ventana privada, bloqueado): a su sitio de siempre.
  }
  return null;
}

function savePlacement(p: Placement) {
  try {
    if (p) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Que no se recuerde no rompe nada: la próxima visita vuelve a la esquina.
  }
}

// Tras un cambio de tamaño de la ventana se espera a que se quede quieta antes
// de reacomodar el robot: al deslizar rápido en el celular la barra del
// navegador aparece y se oculta varias veces por segundo.
const RESIZE_SETTLE_MS = 150;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * El desplazamiento vertical permitido para un botón de alto `h`: nunca por
 * debajo de su sitio (0) ni por encima del encabezado. Con el tamaño de la
 * ventana y no midiendo la pantalla, así no depende del momento de un scroll.
 */
function clampY(y: number, h: number) {
  const homeTop = window.innerHeight - edgeMargin() - h;
  return Math.min(0, Math.max(y, TOP_LIMIT_PX - homeTop));
}

/** Un arrastre en curso, con mouse o con dedo. */
type PointerDrag = {
  id: number;
  startX: number;
  startY: number;
  fromX: number;
  fromY: number;
  /** Ya pasó del umbral: es arrastre y no toque */
  moving: boolean;
  /** Límites del desplazamiento; el máximo de los dos ejes es su esquina (0) */
  minX: number;
  minY: number;
};

/** Margen al borde de la ventana, el mismo de las clases right-4 / sm:right-6. */
const edgeMargin = () => (window.innerWidth >= 640 ? 24 : 16);

export function Robot({
  onOpen,
  open,
  thinking,
  label,
  bubbles,
}: {
  onOpen: () => void;
  open: boolean;
  thinking: boolean;
  /** Nombre accesible del botón */
  label: string;
  /** Frases del globo, ya traducidas; se van turnando */
  bubbles: string[];
}) {
  const reduced = !!useReducedMotion();
  const [hover, setHover] = useState(false);
  const [blink, setBlink] = useState(false);
  const [asleep, setAsleep] = useState(false);
  const [reaction, setReaction] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  // Solo decide hacia dónde sale el globo, que nunca está en el primer render:
  // leerlo aquí no descuadra la hidratación aunque el servidor no lo conozca.
  const [placement, setPlacement] = useState<Placement>(() =>
    typeof window === "undefined" ? null : readPlacement()
  );
  const button = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const pointer = useRef<PointerDrag | null>(null);

  // Desplazamiento respecto de su sitio de siempre: en x, pegado a un lado o
  // al otro; en y, lo que eligió la persona.
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);

  // La mirada: un objetivo que pone el cursor y un resorte que lo persigue, así
  // los ojos llegan con un poco de inercia en vez de saltar.
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const eyeX = useSpring(targetX, { stiffness: 180, damping: 18, mass: 0.6 });
  const eyeY = useSpring(targetY, { stiffness: 180, damping: 18, mass: 0.6 });

  const mood: Mood = dragging
    ? "surprised"
    : thinking
      ? "thinking"
      : reaction
        ? "stars"
        : hover
          ? "happy"
          : asleep
            ? "asleep"
            : "normal";

  // Seguir el cursor por toda la página, volver al frente cuando se queda
  // quieto o sale de la ventana, y dormirse tras un minuto sin nadie.
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let sleep: ReturnType<typeof setTimeout> | undefined;
    const lookAhead = () => {
      targetX.set(0);
      targetY.set(0);
    };
    const fallAsleep = () => {
      lookAhead();
      setAsleep(true);
    };
    const wake = () => {
      setAsleep(false);
      clearTimeout(sleep);
      sleep = setTimeout(fallAsleep, SLEEP_MS);
    };
    const move = (e: PointerEvent) => {
      wake();
      clearTimeout(idle);
      idle = setTimeout(lookAhead, GAZE_IDLE_MS);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = button.current?.getBoundingClientRect();
        if (!r) return;
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height * 0.38);
        // Normalizado a la pantalla: un cursor en la otra punta lleva los ojos
        // al borde del visor, y uno cerca los mueve poco.
        const nx = Math.max(-1, Math.min(1, x / (window.innerWidth * 0.45)));
        const ny = Math.max(-1, Math.min(1, y / (window.innerHeight * 0.45)));
        targetX.set(nx * REACH_X);
        targetY.set(ny * REACH_Y);
      });
    };
    const leave = (e: MouseEvent) => {
      if (!e.relatedTarget) lookAhead();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", wake, { passive: true });
    window.addEventListener("keydown", wake);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("blur", lookAhead);
    document.addEventListener("mouseout", leave);
    sleep = setTimeout(fallAsleep, SLEEP_MS);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("blur", lookAhead);
      document.removeEventListener("mouseout", leave);
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      clearTimeout(sleep);
    };
  }, [reduced, targetX, targetY]);

  // Parpadeo: cada 2,5-5 s al azar, y una de cada cuatro veces, doble. A ritmo
  // fijo se nota la máquina.
  useEffect(() => {
    if (reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const close = (at: number) => {
      timers.push(setTimeout(() => setBlink(true), at));
      timers.push(setTimeout(() => setBlink(false), at + 120));
    };
    let next: ReturnType<typeof setTimeout>;
    const schedule = () => {
      next = setTimeout(
        () => {
          close(0);
          if (Math.random() < 0.25) close(260);
          schedule();
        },
        2500 + Math.random() * 2500
      );
    };
    schedule();
    return () => {
      clearTimeout(next);
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  // El globo: de vez en cuando, nunca con el chat abierto ni con movimiento
  // reducido, y solo con la pestaña a la vista.
  const bubblesRef = useRef(bubbles);
  useEffect(() => {
    bubblesRef.current = bubbles;
  }, [bubbles]);
  useEffect(() => {
    if (reduced || open) return;
    let index = 0;
    let show: ReturnType<typeof setTimeout>;
    let hide: ReturnType<typeof setTimeout>;
    const schedule = (wait: number) => {
      show = setTimeout(() => {
        const list = bubblesRef.current;
        if (document.visibilityState !== "visible" || !list.length) {
          return schedule(BETWEEN_BUBBLES_MS);
        }
        setBubble(list[index % list.length]!);
        index += 1;
        hide = setTimeout(() => setBubble(null), BUBBLE_VISIBLE_MS);
        schedule(BETWEEN_BUBBLES_MS + Math.random() * 25_000);
      }, wait);
    };
    schedule(FIRST_BUBBLE_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      // Al abrir el chat, el globo que estuviera se va.
      setBubble(null);
    };
  }, [reduced, open]);

  // Coloca el robot donde dice `p`, dentro de la ventana. Se usa al soltarlo,
  // al cargar la página y cuando la ventana cambia de tamaño. Se calcula con el
  // tamaño de la ventana y del botón, sin medir posiciones en pantalla: así el
  // resultado no depende del momento de un scroll en que se mida.
  const place = useCallback(
    (p: Placement, smooth: boolean) => {
      const b = button.current;
      if (!b) return;
      const m = edgeMargin();
      const x = p?.side === "left" ? -(window.innerWidth - 2 * m - b.offsetWidth) : 0;
      const y = clampY(p?.y ?? 0, b.offsetHeight);
      if (smooth && !reduced) {
        animate(dx, x, { type: "spring", stiffness: 380, damping: 30 });
        animate(dy, y, { type: "spring", stiffness: 380, damping: 30 });
      } else {
        dx.set(x);
        dy.set(y);
      }
    },
    [dx, dy, reduced]
  );

  // Al montar: recupera dónde lo dejaron, y se reacomoda cuando la ventana
  // termina de cambiar de tamaño (girar el teléfono, redimensionar). Anclado
  // abajo, mientras la barra del navegador sube y baja el robot conserva su
  // distancia al borde inferior sin que haga falta tocarlo.
  useEffect(() => {
    place(readPlacement(), false);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!pointer.current) place(readPlacement(), false);
      }, RESIZE_SETTLE_MS);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [place]);

  // Al soltarlo: se pega al borde más cercano con un muelle y se recuerda. Si
  // cae cerca de su esquina de siempre, vuelve a ser "su sitio".
  const drop = useCallback(() => {
    setDragging(false);
    const b = button.current;
    if (!b) return;
    const centerX = window.innerWidth - edgeMargin() - b.offsetWidth / 2 + dx.get();
    const side = centerX < window.innerWidth / 2 ? "left" : "right";
    // Se guarda ya acotada: si no, al crecer la ventana (la barra del navegador
    // que se oculta) el robot subía solo hacia la altura sin acotar.
    const y = clampY(dy.get(), b.offsetHeight);
    const next: Placement = side === "right" && y > -24 ? null : { side, y };
    setPlacement(next);
    savePlacement(next);
    place(next, true);
  }, [dx, dy, place]);

  // Arrastre propio con Pointer Events, igual con mouse que con dedo: más de
  // 5 px con el botón apretado es arrastre y si no, es un toque que abre el chat.
  // No usa el drag de Motion: con límites dados por un elemento, Motion vuelve
  // a medir y reubica lo arrastrado en cada cambio de tamaño de la ventana, y en
  // el celular, al deslizar rápido, la barra del navegador lo dispara una y otra
  // vez: el robot saltaba hasta arriba o al medio de la pantalla y volvía.
  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragged.current = false;
    const b = e.currentTarget;
    const m = edgeMargin();
    // Si todavía se estaba acomodando en el borde, se agarra desde donde está
    dx.stop();
    dy.stop();
    pointer.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      fromX: dx.get(),
      fromY: dy.get(),
      moving: false,
      minX: -(window.innerWidth - 2 * m - b.offsetWidth),
      minY: TOP_LIMIT_PX - (window.innerHeight - m - b.offsetHeight),
    };
    try {
      b.setPointerCapture(e.pointerId);
    } catch {
      // Sin captura el arrastre igual funciona mientras el puntero siga encima
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = pointer.current;
    if (!d || d.id !== e.pointerId) return;
    const ox = e.clientX - d.startX;
    const oy = e.clientY - d.startY;
    if (!d.moving) {
      if (Math.hypot(ox, oy) <= DRAG_THRESHOLD_PX) return;
      d.moving = true;
      // Lo que siga ya no es un toque: al soltar no abre el chat
      dragged.current = true;
      setDragging(true);
    }
    dx.set(clamp(d.fromX + ox, d.minX, 0));
    dy.set(clamp(d.fromY + oy, d.minY, 0));
  };

  const endPointer = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = pointer.current;
    if (!d || d.id !== e.pointerId) return;
    pointer.current = null;
    if (d.moving) drop();
  };

  // El clic: estrellas en los ojos y un "boing", y el chat se abre a los
  // 220 ms, antes de que acabe la celebración. Sin movimiento, abre al instante.
  // Un arrastre que termina sobre el botón también dispara "click": ese no abre.
  const onClick = () => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    setHover(false);
    if (reduced) return onOpen();
    setReaction(true);
    setTimeout(onOpen, OPEN_AFTER_MS);
    setTimeout(() => setReaction(false), REACTION_MS);
  };

  const float = !reduced && !hover && !asleep && !dragging;
  // El globo sale hacia donde haya sitio: a la derecha si el robot está a la
  // izquierda, y debajo si lo subieron cerca del encabezado.
  const bubbleRight = placement?.side === "left";
  const bubbleBelow =
    placement !== null && typeof window !== "undefined" && window.innerHeight + placement.y < 360;

  return (
    <>
      <motion.div
        className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
        animate={{ scale: open ? 0.6 : 1, opacity: open ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        style={{ pointerEvents: open ? "none" : undefined }}
      >
        <motion.div className="relative" style={{ x: dx, y: dy }}>
          <AnimatePresence>
            {bubble && !open && !asleep && !dragging ? (
              <motion.button
                type="button"
                key={bubble}
                onClick={onClick}
                initial={{ opacity: 0, y: bubbleBelow ? -8 : 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: bubbleBelow ? -4 : 4, scale: 0.95 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                // El globo no es otro botón "Pregúntale a mi IA": su nombre es
                // lo que dice. Va suelto sobre el robot para que su ancho no lo
                // empuje al salir.
                className={cn(
                  "bg-card/95 text-card-foreground absolute w-max max-w-60 overflow-hidden rounded-2xl border px-3.5 py-2.5 text-left text-sm shadow-lg backdrop-blur",
                  bubbleBelow ? "top-full mt-2" : "bottom-full mb-2",
                  bubbleRight ? "left-2" : "right-2",
                  bubbleBelow
                    ? bubbleRight
                      ? "rounded-tl-sm"
                      : "rounded-tr-sm"
                    : bubbleRight
                      ? "rounded-bl-sm"
                      : "rounded-br-sm"
                )}
              >
                {bubble}
                {/* El borde con brillo de Magic UI, en la paleta del sitio */}
                {!reduced ? (
                  <BorderBeam
                    size={60}
                    duration={3.2}
                    colorFrom="var(--primary)"
                    colorTo="#d946ef"
                    borderWidth={1.5}
                  />
                ) : null}
              </motion.button>
            ) : null}
          </AnimatePresence>

          <motion.button
            ref={button}
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onLostPointerCapture={endPointer}
            // Un arrastre soltado fuera del botón no dispara "click": que no se
            // coma el siguiente Enter
            onKeyDown={() => {
              dragged.current = false;
            }}
            // Solo el mouse cuenta como "acercarse": un toque dispara pointerenter
            // sin pointerleave y el robot se quedaba saludando
            onPointerEnter={(e) => setHover(e.pointerType === "mouse")}
            onPointerLeave={() => setHover(false)}
            // Sin onFocus: el foco se queda en el botón tras un clic, un arrastre
            // o al cerrar el chat, y el robot seguía saludando con el mouse lejos.
            // Con teclado se ve el anillo de foco, que es lo que hace falta.
            className={cn(
              "group focus-visible:ring-primary focus-visible:ring-offset-background relative block size-18 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:size-21",
              // El dedo que lo toca lo arrastra (como en Smart Report), sin menú
              // contextual ni selección al mantenerlo presionado
              "touch-none select-none [-webkit-touch-callout:none]",
              dragging ? "cursor-grabbing" : "cursor-grab"
            )}
            onContextMenu={(e) => e.preventDefault()}
            // El "boing" del clic.
            animate={reaction ? { scale: [1, 0.86, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Halo suave detrás: separa al robot de lo que tenga abajo, y crece
                cuando alguien se acerca. */}
            <span
              className={cn(
                "bg-primary/15 dark:bg-primary/25 absolute inset-2 rounded-full blur-xl transition-all duration-300",
                hover && !reduced && "bg-primary/25 dark:bg-primary/35 inset-0"
              )}
            />
            <motion.div
              className="relative size-full"
              animate={
                float
                  ? { y: [0, -6, 0], rotate: 0, scale: 1 }
                  : dragging && !reduced
                    ? // Agarrado: se levanta un poco, sin ladearse.
                      { y: -6, rotate: 0, scale: 1.06 }
                    : // Al acercarse alguien, un saltito de saludo.
                      { y: hover && !reduced ? -9 : 0, rotate: 0, scale: 1 }
              }
              transition={
                float
                  ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                  : { type: "spring", stiffness: 420, damping: 14 }
              }
            >
              <RobotDrawing
                mood={mood}
                blink={blink && (mood === "normal" || mood === "happy")}
                waving={hover && !reduced}
                eyeX={eyeX}
                eyeY={eyeY}
                reduced={reduced}
              />
              {/* Las "z" del sueño, saliendo de la cabeza */}
              <AnimatePresence>{mood === "asleep" && !reduced ? <Zzz /> : null}</AnimatePresence>
            </motion.div>
            {/* La sombra en el suelo se achica cuando el robot sube */}
            <motion.span
              className="bg-foreground/15 absolute -bottom-1 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full blur-[2px]"
              animate={
                float
                  ? { scaleX: [1, 0.8, 1], opacity: [0.6, 0.35, 0.6] }
                  : dragging
                    ? { scaleX: 1.5, opacity: 0.3 }
                    : { scaleX: 1, opacity: 0.6 }
              }
              transition={
                float ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }
              }
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}

function Zzz() {
  return (
    <motion.span
      aria-hidden
      className="text-primary pointer-events-none absolute -top-1 right-1 font-semibold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ fontSize: 10 + i * 3, right: i * 7 }}
          animate={{ y: [0, -22], x: [0, 6], opacity: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
        >
          z
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * El mismo robot, chico y sin seguir el cursor, para el panel del chat. Con el
 * chat abierto el flotante se esconde, y es justo cuando el asistente piensa:
 * aquí es donde se ve que piensa.
 */
export function RobotMini({ thinking, className }: { thinking: boolean; className?: string }) {
  const reduced = !!useReducedMotion();
  const still = useMotionValue(0);
  return (
    <span className={cn("inline-block size-8 shrink-0", className)}>
      <RobotDrawing
        mood={thinking ? "thinking" : "normal"}
        blink={false}
        waving={false}
        eyeX={still}
        eyeY={still}
        reduced={reduced}
      />
    </span>
  );
}

// Paleta del portafolio: violeta (primary) y fucsia. El cuerpo cambia con el
// tema para contrastar con el fondo (ver --robot-body-* en globals.css).
const BODY_TOP = "var(--robot-body-top)";
const BODY_MID = "var(--robot-body-mid)";
const BODY_BOTTOM = "var(--robot-body-bottom)";
const BODY_EDGE = "var(--robot-body-edge)";
const EYE = "#c4b5fd";
const STAR = "#f0abfc";
const ACCENT = "#d946ef";
const CENTERS = [31, 49];
const CY = 40;

/**
 * El dibujo, en una caja de 80 x 88.
 */
function RobotDrawing({
  mood,
  blink,
  waving,
  eyeX,
  eyeY,
  reduced,
}: {
  mood: Mood;
  blink: boolean;
  waving: boolean;
  eyeX: MotionValue<number>;
  eyeY: MotionValue<number>;
  reduced: boolean;
}) {
  // Ids propios por dibujo: hay varios robots en la página (el flotante y los
  // del chat) y con ids repetidos los degradados apuntarían al de otro.
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `robot-${n}-${u}`;
  const happy = mood === "happy" || mood === "stars";

  return (
    <svg viewBox="0 0 80 88" className="size-full drop-shadow-md" aria-hidden>
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BODY_TOP} />
          <stop offset="0.55" stopColor={BODY_MID} />
          <stop offset="1" stopColor={BODY_BOTTOM} />
        </linearGradient>
        <linearGradient id={id("helmet")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="var(--primary)" />
        </linearGradient>
        <linearGradient id={id("badge")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor={ACCENT} />
        </linearGradient>
        <radialGradient id={id("light")}>
          <stop offset="0" stopColor="#fae8ff" />
          <stop offset="1" stopColor={ACCENT} />
        </radialGradient>
        <radialGradient id={id("pupil")} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f5f3ff" />
          <stop offset="0.55" stopColor={EYE} />
          <stop offset="1" stopColor="#8b5cf6" />
        </radialGradient>
        <radialGradient id={id("visor")} cx="0.5" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#231d33" />
          <stop offset="1" stopColor="#0d0b14" />
        </radialGradient>
        <clipPath id={id("clip")}>
          <rect x="18" y="29" width="44" height="22" rx="11" />
        </clipPath>
      </defs>

      {/* Brazo izquierdo, quieto */}
      <rect
        x="11"
        y="58"
        width="8"
        height="16"
        rx="4"
        fill={`url(#${id("body")})`}
        stroke={BODY_EDGE}
      />
      {/* Brazo derecho: saluda. Gira desde el hombro */}
      <motion.g
        style={{ originX: "66px", originY: "60px" }}
        animate={waving ? { rotate: [0, -150, -120, -150, -130] } : { rotate: 0 }}
        transition={waving ? { duration: 1.1, ease: "easeInOut" } : { duration: 0.3 }}
      >
        <rect
          x="61"
          y="58"
          width="8"
          height="16"
          rx="4"
          fill={`url(#${id("body")})`}
          stroke={BODY_EDGE}
        />
      </motion.g>

      {/* Cuerpo con la placa IA */}
      <rect
        x="18"
        y="54"
        width="44"
        height="28"
        rx="12"
        fill={`url(#${id("body")})`}
        stroke={BODY_EDGE}
      />
      <rect x="29" y="61" width="22" height="13" rx="6.5" fill={`url(#${id("badge")})`} />
      <text
        x="40"
        y="70.6"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        letterSpacing="0.5"
      >
        IA
      </text>

      {/* La cabeza: ladea al saludar y cabecea cuando duerme */}
      <motion.g
        style={{ originX: "40px", originY: "52px" }}
        animate={{ rotate: waving ? -8 : mood === "asleep" && !reduced ? 6 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
      >
        {/* Antena con su luz: destella, y más cuando alguien se acerca */}
        <line
          x1="40"
          y1="12"
          x2="40"
          y2="6"
          stroke="var(--foreground)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <motion.circle
          cx="40"
          cy="5"
          r="3.2"
          fill={`url(#${id("light")})`}
          // Se agranda con el radio y no con scale: dentro de un SVG el origen
          // del scale se calcula aparte y la luz se despegaba de la antena.
          animate={
            reduced
              ? {}
              : happy
                ? { r: [3.2, 4.8, 3.9], opacity: 1 }
                : mood === "asleep"
                  ? { opacity: 0.35, r: 3.2 }
                  : { opacity: [1, 0.45, 1], r: 3.2 }
          }
          transition={
            reduced
              ? {}
              : happy
                ? { duration: 0.35 }
                : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {!reduced && mood !== "asleep" ? (
          <motion.circle
            cx="40"
            cy="5"
            r="3.2"
            fill="none"
            stroke={ACCENT}
            strokeWidth="1"
            animate={{ r: [3.2, happy ? 10 : 7.5], opacity: [0.8, 0] }}
            transition={{ duration: happy ? 0.9 : 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        ) : null}

        {/* Cabeza */}
        <rect
          x="14"
          y="17"
          width="52"
          height="38"
          rx="19"
          fill={`url(#${id("body")})`}
          stroke={BODY_EDGE}
        />

        {/* Casco violeta con su franja clara */}
        <path d="M17 26 C 19 11, 61 11, 63 26 Z" fill={`url(#${id("helmet")})`} />
        <rect x="12" y="24" width="56" height="4.5" rx="2.25" fill="#6d28d9" />
        <path
          d="M24 21 L 56 21"
          stroke="#f5f3ff"
          strokeOpacity="0.85"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Visor oscuro con los ojos */}
        <rect x="18" y="29" width="44" height="22" rx="11" fill={`url(#${id("visor")})`} />
        <g clipPath={`url(#${id("clip")})`}>
          <Eyes mood={mood} blink={blink} eyeX={eyeX} eyeY={eyeY} reduced={reduced} id={id} />
        </g>
        {/* Brillo del visor, encima de todo */}
        <path
          d="M23 33 Q 26 31 31 31"
          stroke="#ffffff"
          strokeOpacity="0.22"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Mejillas que se encienden cuando está feliz */}
        <AnimatePresence>
          {happy ? (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ellipse cx="22" cy="49" rx="3" ry="1.6" fill={STAR} opacity="0.55" />
              <ellipse cx="58" cy="49" rx="3" ry="1.6" fill={STAR} opacity="0.55" />
            </motion.g>
          ) : null}
        </AnimatePresence>
      </motion.g>
    </svg>
  );
}

/** Los ojos, según el gesto. Todo dentro del visor (recortado a su forma). */
function Eyes({
  mood,
  blink,
  eyeX,
  eyeY,
  reduced,
  id,
}: {
  mood: Mood;
  blink: boolean;
  eyeX: MotionValue<number>;
  eyeY: MotionValue<number>;
  reduced: boolean;
  id: (n: string) => string;
}) {
  if (mood === "thinking") {
    // Pensando: cada ojo es un anillo que gira.
    return (
      <>
        {CENTERS.map((cx) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={CY}
            r="4.4"
            fill="none"
            stroke={EYE}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="16 12"
            style={{ originX: `${cx}px`, originY: `${CY}px` }}
            animate={reduced ? {} : { rotate: 360 }}
            transition={reduced ? {} : { duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </>
    );
  }

  if (mood === "stars") {
    // El clic: estrellas que aparecen de golpe y giran un poco.
    return (
      <>
        {CENTERS.map((cx) => (
          <motion.path
            key={cx}
            d={star(cx, CY, 6.2, 2.6)}
            fill={STAR}
            style={{ originX: `${cx}px`, originY: `${CY}px` }}
            initial={{ scale: 0.2, rotate: -40 }}
            animate={{ scale: [0.2, 1.25, 1], rotate: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        ))}
      </>
    );
  }

  if (mood === "happy") {
    // Feliz: ojos en arco, como ^ ^.
    return (
      <>
        {CENTERS.map((cx) => (
          <motion.path
            key={cx}
            d={`M${cx - 5} ${CY + 2.2} Q ${cx} ${CY - 5.5} ${cx + 5} ${CY + 2.2}`}
            fill="none"
            stroke={EYE}
            strokeWidth="2.8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.18 }}
          />
        ))}
      </>
    );
  }

  if (mood === "surprised") {
    // Agarrado: ojos muy abiertos, pupila chica en el centro.
    return (
      <>
        {CENTERS.map((cx) => (
          <motion.g
            key={cx}
            style={{ originX: `${cx}px`, originY: `${CY}px` }}
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
          >
            <circle cx={cx} cy={CY} r="6.6" fill="none" stroke={EYE} strokeWidth="2.2" />
            <circle cx={cx} cy={CY} r="2.4" fill={EYE} />
            <circle cx={cx - 1.6} cy={CY - 1.8} r="1.2" fill="#ffffff" />
          </motion.g>
        ))}
      </>
    );
  }

  if (mood === "asleep") {
    // Dormido: párpados caídos, una línea curva hacia abajo.
    return (
      <>
        {CENTERS.map((cx) => (
          <path
            key={cx}
            d={`M${cx - 5} ${CY} Q ${cx} ${CY + 3.2} ${cx + 5} ${CY}`}
            fill="none"
            stroke={EYE}
            strokeOpacity="0.75"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ))}
      </>
    );
  }

  // Normal: pupilas grandes con su reflejo, que siguen al cursor y parpadean.
  return (
    <motion.g style={{ x: eyeX, y: eyeY }}>
      {CENTERS.map((cx) => (
        <motion.g
          key={cx}
          style={{ originX: `${cx}px`, originY: `${CY}px` }}
          animate={{ scaleY: blink ? 0.08 : 1 }}
          transition={{ duration: 0.06, ease: "easeInOut" }}
        >
          {/* Resplandor alrededor de la pupila */}
          <circle cx={cx} cy={CY} r="7.5" fill={EYE} opacity="0.18" />
          <circle cx={cx} cy={CY} r="5.4" fill={`url(#${id("pupil")})`} />
          {/* El reflejo: lo que hace que un ojo parezca vivo */}
          <circle cx={cx - 1.9} cy={CY - 2} r="1.7" fill="#ffffff" />
          <circle cx={cx + 1.8} cy={CY + 1.9} r="0.7" fill="#ffffff" opacity="0.7" />
        </motion.g>
      ))}
    </motion.g>
  );
}

/** Una estrella de cinco puntas centrada en (cx, cy). */
function star(cx: number, cy: number, outer: number, inner: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    points.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${points.join(" L")} Z`;
}
