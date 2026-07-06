"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleDashed,
  Fingerprint,
  Gauge,
  Network,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import styles from "@/components/public-site/public-site.module.css";
import sectionStyles from "@/components/public-site/why-oso-section.module.css";
import { whyContent } from "@/data/public-site";

type NarrativeFocus = "overview" | "fragmented" | "connected";

type CapabilityItem = {
  label: string;
  icon: LucideIcon;
};

const fragmentedSignals: readonly CapabilityItem[] = [
  {
    label: "Theory",
    icon: BookOpen,
  },
  {
    label: "One-time exam",
    icon: CircleDashed,
  },
  {
    label: "Isolated event",
    icon: Trophy,
  },
] as const;

const connectedSignals: readonly CapabilityItem[] = [
  {
    label: "Practice",
    icon: Wrench,
  },
  {
    label: "Assess",
    icon: ShieldCheck,
  },
  {
    label: "Compete",
    icon: Trophy,
  },
  {
    label: "Recognise",
    icon: Fingerprint,
  },
] as const;

function WhyOsoIllustration({
  focus,
}: {
  focus: NarrativeFocus;
}) {
  const reduceMotion = useReducedMotion();
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const leftActive =
    focus === "overview" || focus === "fragmented";

  const rightActive =
    focus === "overview" || focus === "connected";

  const fragmentedOpacity =
    focus === "connected" ? 0.28 : 1;

  const connectedOpacity =
    focus === "fragmented" ? 0.3 : 1;

  return (
    <div className={sectionStyles.illustrationStage}>
      <svg
        viewBox="0 0 1440 450"
        preserveAspectRatio="xMidYMid meet"
        className={sectionStyles.storySvg}
        role="img"
        aria-label="Engineering readiness transformation from fragmented learning into connected practical progression"
      >
        <defs>
          <linearGradient
            id={`${id}-bridge`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#F6B73C"
              stopOpacity="0.24"
            />
            <stop
              offset="45%"
              stopColor="#8B5CF6"
              stopOpacity="0.88"
            />
            <stop
              offset="100%"
              stopColor="#20B8D4"
              stopOpacity="0.88"
            />
          </linearGradient>

          <linearGradient
            id={`${id}-right-path`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#2867E8"
            />
            <stop
              offset="52%"
              stopColor="#20B8D4"
            />
            <stop
              offset="100%"
              stopColor="#42B883"
            />
          </linearGradient>

          <radialGradient
            id={`${id}-readiness-core`}
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stopColor="#FFFFFF"
            />
            <stop
              offset="65%"
              stopColor="#EEF5FF"
            />
            <stop
              offset="100%"
              stopColor="#D8E8FF"
            />
          </radialGradient>

          <filter
            id={`${id}-soft-shadow`}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="14"
              floodColor="#091E42"
              floodOpacity="0.12"
            />
          </filter>
        </defs>

        <motion.g
          initial={false}
          animate={{
            opacity: fragmentedOpacity,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          <motion.path
            d="M48 82 L190 24 L270 116 L136 164Z"
            fill="#F6B73C"
            opacity="0.72"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -5, 0],
                    rotate: [-2, 1, -2],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{
              transformOrigin: "160px 94px",
            }}
          />

          <motion.path
            d="M350 28 L478 64 L432 176 L304 132Z"
            fill="#B56CFF"
            opacity="0.58"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, 5, 0],
                    rotate: [1, -2, 1],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{
              transformOrigin: "390px 102px",
            }}
          />

          <motion.rect
            x="68"
            y="128"
            width="164"
            height="116"
            rx="30"
            fill="#FFFFFF"
            stroke="#091E42"
            strokeWidth="2"
            filter={`url(#${id}-soft-shadow)`}
            animate={{
              y:
                reduceMotion || !leftActive
                  ? 0
                  : [0, -4, 0],
            }}
            transition={{
              duration: 6.5,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.rect
            x="292"
            y="76"
            width="174"
            height="120"
            rx="30"
            fill="#FFFFFF"
            stroke="#091E42"
            strokeWidth="2"
            filter={`url(#${id}-soft-shadow)`}
            animate={{
              y:
                reduceMotion || !leftActive
                  ? 0
                  : [0, 4, 0],
            }}
            transition={{
              duration: 7.2,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.rect
            x="226"
            y="266"
            width="178"
            height="112"
            rx="30"
            fill="#FFFFFF"
            stroke="#091E42"
            strokeWidth="2"
            filter={`url(#${id}-soft-shadow)`}
            animate={{
              y:
                reduceMotion || !leftActive
                  ? 0
                  : [0, -3, 0],
            }}
            transition={{
              duration: 7.8,
              repeat: reduceMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          <circle
            cx="108"
            cy="168"
            r="18"
            fill="#F6B73C"
          />
          <path
            d="M142 162H196M142 180H184M142 198H174"
            stroke="#091E42"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <circle
            cx="332"
            cy="116"
            r="18"
            fill="#B56CFF"
          />
          <path
            d="M366 112H428M366 132H416M366 152H402"
            stroke="#091E42"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <circle
            cx="266"
            cy="304"
            r="18"
            fill="#2867E8"
          />
          <path
            d="M300 300H364M300 320H352M300 340H338"
            stroke="#091E42"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <motion.path
            d="M226 206 C252 220 264 226 278 236"
            fill="none"
            stroke="#091E42"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="7 12"
            animate={
              reduceMotion
                ? undefined
                : {
                    strokeDashoffset: [0, -38],
                }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          />

          <motion.path
            d="M382 204 C376 226 364 242 350 256"
            fill="none"
            stroke="#091E42"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="7 12"
            animate={
              reduceMotion
                ? undefined
                : {
                    strokeDashoffset: [0, 38],
                }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          />

          <text
            x="250"
            y="420"
            textAnchor="middle"
            className={sectionStyles.svgSmallLabel}
          >
            KNOWLEDGE HELD APART
          </text>
        </motion.g>

        <g>
          <motion.path
            id={`${id}-bridge-path`}
            d="M500 224 C580 170 650 170 720 224 C786 274 840 274 894 224"
            fill="none"
            stroke={`url(#${id}-bridge)`}
            strokeWidth="18"
            strokeLinecap="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            transition={{
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          <motion.path
            d="M500 224 C580 170 650 170 720 224 C786 274 840 274 894 224"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray="8 16"
            strokeLinecap="round"
            animate={
              reduceMotion
                ? undefined
                : {
                    strokeDashoffset: [-48, 0],
                }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          />

          {!reduceMotion ? (
            <circle
              r="6"
              fill="#FFFFFF"
              opacity="0.95"
            >
              <animateMotion
                dur="4.4s"
                repeatCount="indefinite"
              >
                <mpath
                  href={`#${id}-bridge-path`}
                />
              </animateMotion>
            </circle>
          ) : null}

          <motion.g
            animate={{
              scale:
                focus === "overview"
                  ? 1
                  : focus === "connected"
                    ? 1.04
                    : 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 18,
            }}
            style={{
              transformOrigin: "698px 222px",
            }}
          >
            <path
              d="M650 145 H746 L776 222 L746 300 H650 L620 222Z"
              fill="#FFFFFF"
              stroke="#091E42"
              strokeWidth="2"
              filter={`url(#${id}-soft-shadow)`}
            />
            <path
              d="M666 163 H730 L752 222 L730 281 H666 L644 222Z"
              fill="#EEF5FF"
            />
            <circle
              cx="698"
              cy="222"
              r="22"
              fill="#2867E8"
            />
            <path
              d="M689 222 L696 229 L710 212"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="698"
              y="326"
              textAnchor="middle"
              className={sectionStyles.svgBridgeTitle}
            >
              PRACTICAL CAPABILITY
            </text>
            <text
              x="698"
              y="346"
              textAnchor="middle"
              className={sectionStyles.svgBridgeCaption}
            >
              BUILT THROUGH CONTINUOUS PROGRESSION
            </text>
          </motion.g>
        </g>

        <motion.g
          initial={false}
          animate={{
            opacity: connectedOpacity,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          <motion.path
            d="M948 30 L1068 78 L1012 192 L898 132Z"
            fill="#42B883"
            opacity="0.72"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: [-2, 2, -2],
                    y: [0, -5, 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{
              transformOrigin: "986px 108px",
            }}
          />

          <motion.path
            d="M1244 26 A116 116 0 0 1 1380 162 L1326 212 A68 68 0 0 0 1246 128Z"
            fill="#B56CFF"
            opacity="0.68"
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: [0, 4, 0],
                    y: [0, 4, 0],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{
              transformOrigin: "1306px 120px",
            }}
          />

          <motion.path
            d="M1240 334 L1374 296 L1410 404 L1272 430Z"
            fill="#F6B73C"
            opacity="0.72"
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -5, 0],
                    rotate: [1, -2, 1],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 8.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{
              transformOrigin: "1325px 368px",
            }}
          />

          <motion.circle
            cx="1120"
            cy="224"
            r="92"
            fill={`url(#${id}-readiness-core)`}
            stroke="#2867E8"
            strokeOpacity="0.2"
            strokeWidth="2"
            filter={`url(#${id}-soft-shadow)`}
            animate={
              reduceMotion || !rightActive
                ? undefined
                : {
                    scale: [1, 1.025, 1],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 6.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{
              transformOrigin: "1120px 224px",
            }}
          />

          <circle
            cx="1120"
            cy="224"
            r="63"
            fill="#FFFFFF"
            stroke="#091E42"
            strokeOpacity="0.06"
          />

          <text
            x="1120"
            y="204"
            textAnchor="middle"
            className={sectionStyles.svgReadinessEyebrow}
          >
            ENGINEERING
          </text>
          <text
            x="1120"
            y="230"
            textAnchor="middle"
            className={sectionStyles.svgReadinessTitle}
          >
            READINESS
          </text>
          <text
            x="1120"
            y="253"
            textAnchor="middle"
            className={sectionStyles.svgReadinessMeta}
          >
            VISIBLE · MEASURABLE · PROGRESSIVE
          </text>

          {[
            {
              id: "practice",
              x: 916,
              y: 106,
              color: "#42B883",
              label: "PRACTISE",
            },
            {
              id: "assess",
              x: 1304,
              y: 116,
              color: "#8B5CF6",
              label: "ASSESS",
            },
            {
              id: "compete",
              x: 1322,
              y: 336,
              color: "#F6B73C",
              label: "COMPETE",
            },
            {
              id: "recognise",
              x: 918,
              y: 352,
              color: "#20B8D4",
              label: "RECOGNISE",
            },
          ].map((node, index) => (
            <motion.g
              key={node.id}
              animate={
                reduceMotion || !rightActive
                  ? undefined
                  : {
                      y: [
                        0,
                        index % 2 === 0
                          ? -4
                          : 4,
                        0,
                      ],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 6.2 + index * 0.45,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              <rect
                x={node.x - 55}
                y={node.y - 42}
                width="110"
                height="84"
                rx="27"
                fill="#FFFFFF"
                stroke="#091E42"
                strokeWidth="2"
                filter={`url(#${id}-soft-shadow)`}
              />
              <rect
                x={node.x - 16}
                y={node.y - 19}
                width="32"
                height="32"
                rx="10"
                fill={node.color}
              />
              <text
                x={node.x}
                y={node.y + 61}
                textAnchor="middle"
                className={sectionStyles.svgNodeLabel}
              >
                {node.label}
              </text>
            </motion.g>
          ))}

          {[
            {
              id: "practice-line",
              d: "M978 132 C1014 154 1042 174 1068 192",
              color: "#42B883",
            },
            {
              id: "assess-line",
              d: "M1250 142 C1218 158 1190 176 1172 194",
              color: "#8B5CF6",
            },
            {
              id: "compete-line",
              d: "M1268 312 C1228 294 1194 274 1172 254",
              color: "#F6B73C",
            },
            {
              id: "recognise-line",
              d: "M976 328 C1016 298 1046 276 1068 252",
              color: "#20B8D4",
            },
          ].map((path, index) => (
            <g key={path.id}>
              <motion.path
                id={`${id}-${path.id}`}
                d={path.d}
                fill="none"
                stroke={path.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 11"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        strokeDashoffset: [-38, 0],
                    }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 3.7 + index * 0.25,
                        repeat: Infinity,
                        ease: "linear",
                      }
                }
              />

              {!reduceMotion ? (
                <circle
                  r="4"
                  fill={path.color}
                >
                  <animateMotion
                    dur={`${4.2 + index * 0.35}s`}
                    repeatCount="indefinite"
                  >
                    <mpath
                      href={`#${id}-${path.id}`}
                    />
                  </animateMotion>
                </circle>
              ) : null}
            </g>
          ))}

          <text
            x="1120"
            y="420"
            textAnchor="middle"
            className={sectionStyles.svgSmallLabel}
          >
            CAPABILITY MADE VISIBLE
          </text>
        </motion.g>
      </svg>

      <div className={sectionStyles.mobileIllustration}>
        <div className={sectionStyles.mobileFragmented}>
          <CircleDashed
            aria-hidden="true"
            className="h-6 w-6"
          />
          <span>Fragmented learning</span>
        </div>

        <ArrowRight
          aria-hidden="true"
          className="h-6 w-6"
        />

        <div className={sectionStyles.mobileConnected}>
          <Network
            aria-hidden="true"
            className="h-6 w-6"
          />
          <span>Connected progression</span>
        </div>
      </div>
    </div>
  );
}

export default function WhyOsoSection() {
  const [focus, setFocus] =
    useState<NarrativeFocus>("overview");

  return (
    <section
      id="why-oso"
      className={`${styles.section} ${sectionStyles.section} scroll-mt-24`}
      onPointerLeave={() => setFocus("overview")}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <header className={sectionStyles.header}>
          <div className={sectionStyles.eyebrow}>
            <Sparkles
              aria-hidden="true"
              className="h-4 w-4"
            />
            {whyContent.eyebrow}
          </div>

          <h2 className={sectionStyles.title}>
            {whyContent.title}
          </h2>

          <p className={sectionStyles.description}>
            {whyContent.description}
          </p>
        </header>

        <div className={sectionStyles.storySurface}>
          <WhyOsoIllustration focus={focus} />

          <div className={sectionStyles.transformationLabel}>
            <span>From isolated evidence</span>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
            <span>to continuous engineering readiness</span>
          </div>

          <div className={sectionStyles.contentGrid}>
            <article
              className={`${sectionStyles.storyPanel} ${sectionStyles.fragmentedPanel}`}
              data-active={focus === "fragmented"}
              tabIndex={0}
              onPointerEnter={() =>
                setFocus("fragmented")
              }
              onFocus={() => setFocus("fragmented")}
              onClick={() => setFocus("fragmented")}
              aria-label="Fragmented learning without a continuous ecosystem"
            >
              <div className={sectionStyles.panelHeader}>
                <div>
                  <p className={sectionStyles.fragmentedEyebrow}>
                    Without a continuous ecosystem
                  </p>

                  <h3 className={sectionStyles.panelTitle}>
                    {whyContent.from.label}
                  </h3>
                </div>

                <span className={sectionStyles.fragmentedIcon}>
                  <CircleDashed
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </div>

              <div className={sectionStyles.signalRow}>
                {fragmentedSignals.map((signal) => {
                  const Icon = signal.icon;

                  return (
                    <span
                      key={signal.label}
                      className={sectionStyles.fragmentedSignal}
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                      {signal.label}
                    </span>
                  );
                })}
              </div>

              <ul className={sectionStyles.pointList}>
                {whyContent.from.points.map((point) => (
                  <li
                    key={point}
                    className={sectionStyles.fragmentedPoint}
                  >
                    <span
                      aria-hidden="true"
                      className={sectionStyles.fragmentedBullet}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article
              className={`${sectionStyles.storyPanel} ${sectionStyles.connectedPanel}`}
              data-active={focus === "connected"}
              tabIndex={0}
              onPointerEnter={() =>
                setFocus("connected")
              }
              onFocus={() => setFocus("connected")}
              onClick={() => setFocus("connected")}
              aria-label="Connected progression through the OSO ecosystem"
            >
              <div className={sectionStyles.panelHeader}>
                <div>
                  <p className={sectionStyles.connectedEyebrow}>
                    With the OSO progression model
                  </p>

                  <h3 className={sectionStyles.connectedTitle}>
                    {whyContent.to.label}
                  </h3>
                </div>

                <span className={sectionStyles.connectedIcon}>
                  <Gauge
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </span>
              </div>

              <div className={sectionStyles.signalRow}>
                {connectedSignals.map((signal) => {
                  const Icon = signal.icon;

                  return (
                    <span
                      key={signal.label}
                      className={sectionStyles.connectedSignal}
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                      {signal.label}
                    </span>
                  );
                })}
              </div>

              <ul className={sectionStyles.pointList}>
                {whyContent.to.points.map((point) => (
                  <li
                    key={point}
                    className={sectionStyles.connectedPoint}
                  >
                    <span
                      aria-hidden="true"
                      className={sectionStyles.checkIcon}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        <div className={sectionStyles.principleStrip}>
          <p>
            <strong>OSO principle:</strong> engineering readiness becomes
            meaningful when knowledge is repeatedly applied, evaluated,
            benchmarked and recognised.
          </p>
        </div>
      </div>
    </section>
  );
}
