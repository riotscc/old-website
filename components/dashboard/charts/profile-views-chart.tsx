"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

export type AnalyticsRange = 1 | 7 | 30 | 90;

export type ProfileViewsPoint = {
  date: string;
  views: number;
};

export default function ProfileViewsChart({
  points,
  loading,
  range,
}: {
  points: ProfileViewsPoint[];
  loading: boolean;
  range: AnalyticsRange;
}) {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [containerWidth, setContainerWidth] = React.useState(760);

  React.useEffect(() => {
    const element = chartContainerRef.current;

    if (!element) {
      return;
    }

    const updateWidth = () => {
      const width = element.getBoundingClientRect().width;

      if (width > 0) {
        setContainerWidth(width);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);

    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  React.useEffect(() => {
    setActiveIndex(null);
  }, [range, points]);

  const normalized = React.useMemo(() => {
    return [...points]
      .map((point) => ({
        date: String(point.date).slice(0, 10),
        views: Number(point.views ?? 0),
      }))
      .filter((point) => point.date)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [points]);

  const maxViews = Math.max(
    1,
    ...normalized.map((point) => Number(point.views || 0))
  );

  const width = Math.max(containerWidth, 300);
  const height = 220;

  const paddingLeft = 42;
  const paddingRight = 18;
  const paddingTop = 20;
  const paddingBottom = 36;

  const chartWidth = Math.max(
    width - paddingLeft - paddingRight,
    1
  );

  const chartHeight = height - paddingTop - paddingBottom;
  const baselineY = paddingTop + chartHeight;

  const coordinates = normalized.map((point, index) => {
    const x =
      normalized.length === 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft +
          (chartWidth * index) /
            Math.max(normalized.length - 1, 1);

    const y =
      paddingTop +
      chartHeight -
      (point.views / maxViews) * chartHeight;

    return {
      ...point,
      x,
      y,
    };
  });

  const linePath = coordinates
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath =
    coordinates.length > 1
      ? `${linePath} L ${
          coordinates[coordinates.length - 1].x
        } ${baselineY} L ${coordinates[0].x} ${baselineY} Z`
      : "";

  const labelStep =
    range === 1
      ? 1
      : range === 7
        ? 1
        : range === 30
          ? 5
          : 15;

  const activePoint =
    activeIndex !== null
      ? coordinates[activeIndex] ?? null
      : null;

  const totalViews = normalized.reduce(
    (total, point) => total + point.views,
    0
  );

  const yMax =
    maxViews <= 2
      ? 2
      : Math.ceil(maxViews);

  const yTicks = [
    {
      value: yMax,
      y: paddingTop,
    },
    {
      value: Math.round(yMax / 2),
      y: paddingTop + chartHeight / 2,
    },
    {
      value: 0,
      y: baselineY,
    },
  ];

  const plottedCoordinates = coordinates.map((point) => {
    const y =
      paddingTop +
      chartHeight -
      (point.views / yMax) * chartHeight;

    return {
      ...point,
      y,
    };
  });

  const plottedLinePath = plottedCoordinates
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const plottedAreaPath =
    plottedCoordinates.length > 1
      ? `${plottedLinePath} L ${
          plottedCoordinates[plottedCoordinates.length - 1].x
        } ${baselineY} L ${plottedCoordinates[0].x} ${baselineY} Z`
      : "";

  const plottedActivePoint =
    activeIndex !== null
      ? plottedCoordinates[activeIndex] ?? null
      : null;

  function handlePointerMove(
    event: React.PointerEvent<SVGSVGElement>
  ) {
    if (!plottedCoordinates.length) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    if (!rect.width) {
      return;
    }

    const pointerX =
      ((event.clientX - rect.left) / rect.width) * width;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (
      let index = 0;
      index < plottedCoordinates.length;
      index++
    ) {
      const distance = Math.abs(
        plottedCoordinates[index].x - pointerX
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }

    setActiveIndex(closestIndex);
  }

  const tooltipWidth = 150;

  const tooltipLeft = plottedActivePoint
    ? Math.min(
        Math.max(plottedActivePoint.x + 12, 8),
        Math.max(width - tooltipWidth - 8, 8)
      )
    : 8;

  const tooltipTop = plottedActivePoint
    ? Math.max(
        5,
        Math.min(plottedActivePoint.y - 62, height - 72)
      )
    : 5;

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[20px] border border-black/[0.08] bg-white p-5 dark:border-white/[0.065] dark:bg-[#0c0c0c]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-black/80 dark:text-white/80">
            Profile Views
          </p>

          <p className="mt-1 text-[9px] text-black/35 dark:text-white/25">
            Views over the last{" "}
            <span className="text-[#CEC8EA]">
              {range} {range === 1 ? "day" : "days"}
            </span>
          </p>
        </div>

        {!loading && (
          <div className="text-right">
            <p className="text-[18px] font-semibold tracking-[-0.6px] text-black dark:text-white">
              {formatNumber(totalViews)}
            </p>

            <p className="text-[8px] uppercase tracking-[0.08em] text-black/30 dark:text-white/20">
              total views
            </p>
          </div>
        )}
      </div>

      <div
        ref={chartContainerRef}
        className="relative mt-5 h-[220px] w-full"
      >
        {loading ? (
          <div className="h-full w-full animate-pulse rounded-[14px] bg-black/[0.035] dark:bg-white/[0.02]" />
        ) : normalized.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-[10px] text-black/35 dark:text-white/25">
              No analytics data available.
            </p>
          </div>
        ) : (
          <>
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${width} ${height}`}
              className="block h-full w-full touch-none"
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setActiveIndex(null)}
              onPointerDown={handlePointerMove}
            >
              <defs>
                <linearGradient
                  id="profile-views-area"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  x2="0"
                  y1={paddingTop}
                  y2={baselineY}
                >
                  <stop
                    offset="0%"
                    stopColor="#CEC8EA"
                    stopOpacity="0.22"
                  />

                  <stop
                    offset="70%"
                    stopColor="#CEC8EA"
                    stopOpacity="0.06"
                  />

                  <stop
                    offset="100%"
                    stopColor="#CEC8EA"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {yTicks.map((tick, index) => (
                <g key={`${tick.value}-${index}`}>
                  <line
                    x1={paddingLeft}
                    x2={width - paddingRight}
                    y1={tick.y}
                    y2={tick.y}
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    className="text-black/[0.08] dark:text-white/[0.055]"
                  />

                  <text
                    x={paddingLeft - 12}
                    y={tick.y + 3}
                    textAnchor="end"
                    fill="currentColor"
                    fontSize="9"
                    className="text-black/35 dark:text-white/25"
                  >
                    {tick.value}
                  </text>
                </g>
              ))}

              {plottedAreaPath && (
                <motion.path
                  key={`area-${range}-${totalViews}`}
                  d={plottedAreaPath}
                  fill="url(#profile-views-area)"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                />
              )}

              {plottedCoordinates.length > 1 && (
                <motion.path
                  key={`line-${range}-${totalViews}`}
                  d={plottedLinePath}
                  fill="none"
                  stroke="#CEC8EA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{
                    pathLength: 0,
                    opacity: 0,
                  }}
                  animate={{
                    pathLength: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              )}

              {plottedCoordinates.map((point, index) => {
                const showLabel =
                  index % labelStep === 0 ||
                  index === plottedCoordinates.length - 1;

                const showPoint =
                  range <= 7 ||
                  (range === 30 && index % 2 === 0) ||
                  (range === 90 && index % 5 === 0) ||
                  index === plottedCoordinates.length - 1;

                return (
                  <g key={`${point.date}-${index}`}>
                    {showPoint && (
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="2.5"
                        fill="#CEC8EA"
                        opacity={
                          activeIndex === index ? 0 : 1
                        }
                      />
                    )}

                    {showLabel && (
                      <text
                        x={point.x}
                        y={height - 8}
                        textAnchor="middle"
                        fill="currentColor"
                        fontSize="9"
                        className="text-black/40 dark:text-white/25"
                      >
                        {formatChartDate(point.date)}
                      </text>
                    )}
                  </g>
                );
              })}

              {plottedCoordinates.length === 1 && (
                <circle
                  cx={plottedCoordinates[0].x}
                  cy={plottedCoordinates[0].y}
                  r="3.5"
                  fill="#CEC8EA"
                />
              )}

              {plottedActivePoint && (
                <>
                  <line
                    x1={plottedActivePoint.x}
                    x2={plottedActivePoint.x}
                    y1={paddingTop}
                    y2={baselineY}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    vectorEffect="non-scaling-stroke"
                    className="text-black/20 dark:text-white/15"
                  />

                  <circle
                    cx={plottedActivePoint.x}
                    cy={plottedActivePoint.y}
                    r="8"
                    fill="#CEC8EA"
                    fillOpacity="0.16"
                  />

                  <circle
                    cx={plottedActivePoint.x}
                    cy={plottedActivePoint.y}
                    r="3.5"
                    fill="#CEC8EA"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    className="text-white"
                  />
                </>
              )}

              <rect
                x={paddingLeft}
                y={paddingTop}
                width={chartWidth}
                height={chartHeight}
                fill="transparent"
              />
            </svg>

            <AnimatePresence>
              {plottedActivePoint && activePoint && (
                <motion.div
                  key={activePoint.date}
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                    y: 3,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.1,
                  }}
                  style={{
                    left: tooltipLeft,
                    top: tooltipTop,
                    width: tooltipWidth,
                  }}
                  className="pointer-events-none absolute z-20 rounded-[11px] border border-black/[0.08] bg-white/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:border-white/[0.09] dark:bg-[#111111]/95 dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                >
                  <p className="truncate text-[9px] font-medium text-black/45 dark:text-white/35">
                    {formatTooltipDate(activePoint.date)}
                  </p>

                  <div className="mt-1.5 flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#CEC8EA]" />

                    <span className="text-[10px] font-medium text-black/55 dark:text-white/45">
                      Views
                    </span>

                    <span className="ml-auto text-[12px] font-semibold text-black dark:text-white">
                      {formatNumber(activePoint.views)}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

function formatChartDate(value: string) {
  const parts = value.slice(0, 10).split("-");

  if (parts.length !== 3) {
    return value;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(year, month - 1, day, 12, 0, 0);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTooltipDate(value: string) {
  const parts = value.slice(0, 10).split("-");

  if (parts.length !== 3) {
    return value;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const date = new Date(year, month - 1, day, 12, 0, 0);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}