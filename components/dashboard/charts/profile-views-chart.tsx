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
      setContainerWidth(Math.max(element.clientWidth, 300));
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    setActiveIndex(null);
  }, [range, points]);

  const normalized = React.useMemo(
    () => makeRangePoints(points, range),
    [points, range]
  );

  const maxViews = Math.max(
    2,
    ...normalized.map((point) => Number(point.views || 0))
  );

  const width = containerWidth;
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
      (Number(point.views || 0) / maxViews) * chartHeight;

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
    (total, point) => total + Number(point.views || 0),
    0
  );

  const yTicks = React.useMemo(() => {
    const middle = Math.ceil(maxViews / 2);

    return [
      {
        value: maxViews,
        y: paddingTop,
      },
      {
        value: middle,
        y: paddingTop + chartHeight / 2,
      },
      {
        value: 0,
        y: baselineY,
      },
    ];
  }, [maxViews, chartHeight, baselineY]);

  function handlePointerMove(
    event: React.PointerEvent<SVGSVGElement>
  ) {
    if (!coordinates.length) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    const pointerX =
      ((event.clientX - rect.left) / rect.width) * width;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < coordinates.length; index++) {
      const distance = Math.abs(
        coordinates[index].x - pointerX
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    }

    setActiveIndex(closestIndex);
  }

  const tooltipWidth = 145;

  const tooltipLeft = activePoint
    ? Math.min(
        Math.max(activePoint.x + 10, 8),
        Math.max(width - tooltipWidth - 8, 8)
      )
    : 8;

  const tooltipTop = activePoint
    ? Math.max(
        5,
        Math.min(activePoint.y - 60, height - 70)
      )
    : 5;

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-[20px] border border-white/[0.065] bg-[#0c0c0c] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold text-white/80">
            Profile Views
          </p>

          <p className="mt-1 text-[9px] text-white/25">
            Views over the last{" "}
            <span className="text-[#5360ff]">
              {range} {range === 1 ? "day" : "days"}
            </span>
          </p>
        </div>

        {!loading && (
          <div className="text-right">
            <p className="text-[18px] font-semibold tracking-[-0.6px] text-white">
              {formatNumber(totalViews)}
            </p>

            <p className="text-[8px] uppercase tracking-[0.08em] text-white/20">
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
          <div className="h-full w-full animate-pulse rounded-[14px] bg-white/[0.02]" />
        ) : (
          <>
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
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
                    stopColor="#2832F9"
                    stopOpacity="0.22"
                  />

                  <stop
                    offset="70%"
                    stopColor="#2832F9"
                    stopOpacity="0.06"
                  />

                  <stop
                    offset="100%"
                    stopColor="#2832F9"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {yTicks.map((tick) => (
                <g key={tick.value}>
                  <line
                    x1={paddingLeft}
                    x2={width - paddingRight}
                    y1={tick.y}
                    y2={tick.y}
                    stroke="rgba(255,255,255,0.055)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  <text
                    x={paddingLeft - 12}
                    y={tick.y + 3}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.22)"
                    fontSize="9"
                  >
                    {tick.value}
                  </text>
                </g>
              ))}

              {areaPath && (
                <motion.path
                  key={`area-${range}`}
                  d={areaPath}
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

              {coordinates.length > 1 && (
                <motion.path
                  key={`line-${range}`}
                  d={linePath}
                  fill="none"
                  stroke="#2832F9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                />
              )}

              {coordinates.map((point, index) => {
                const showLabel =
                  index % labelStep === 0 ||
                  index === coordinates.length - 1;

                const showPoint =
                  range <= 7 ||
                  (range === 30 && index % 2 === 0) ||
                  (range === 90 && index % 5 === 0) ||
                  index === coordinates.length - 1;

                return (
                  <g key={point.date}>
                    {showPoint && (
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="2.5"
                        fill="#2832F9"
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
                        fill="rgba(255,255,255,0.25)"
                        fontSize="9"
                      >
                        {formatChartDate(point.date)}
                      </text>
                    )}
                  </g>
                );
              })}

              {coordinates.length === 1 && (
                <circle
                  cx={coordinates[0].x}
                  cy={coordinates[0].y}
                  r="3"
                  fill="#2832F9"
                />
              )}

              {activePoint && (
                <>
                  <line
                    x1={activePoint.x}
                    x2={activePoint.x}
                    y1={paddingTop}
                    y2={baselineY}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    vectorEffect="non-scaling-stroke"
                  />

                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="8"
                    fill="#2832F9"
                    fillOpacity="0.16"
                  />

                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="3.5"
                    fill="#2832F9"
                    stroke="white"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
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
              {activePoint && (
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
                  className="pointer-events-none absolute z-20 rounded-[11px] border border-white/[0.09] bg-[#111111]/95 px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                >
                  <p className="truncate text-[9px] font-medium text-white/35">
                    {formatTooltipDate(activePoint.date)}
                  </p>

                  <div className="mt-1.5 flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2832F9]" />

                    <span className="text-[10px] font-medium text-white/45">
                      Views
                    </span>

                    <span className="ml-auto text-[12px] font-semibold text-white">
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

function makeRangePoints(
  points: ProfileViewsPoint[],
  days: AnalyticsRange
) {
  const mapped = new Map(
    points.map((point) => [
      point.date.slice(0, 10),
      Number(point.views || 0),
    ])
  );

  const result: ProfileViewsPoint[] = [];

  for (
    let offset = days - 1;
    offset >= 0;
    offset--
  ) {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    result.push({
      date: key,
      views: mapped.get(key) ?? 0,
    });
  }

  return result;
}

function formatChartDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTooltipDate(value: string) {
  const date = new Date(`${value}T12:00:00`);

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