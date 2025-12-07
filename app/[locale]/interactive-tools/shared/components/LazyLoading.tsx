"use client";

import React, { Suspense, lazy, ComponentType } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

// Lazy loading wrapper with error boundary
export function withLazyLoading<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapper(props: P & LazyComponentProps) {
    const { fallback: customFallback, ...componentProps } = props;
    const resolvedFallback =
      customFallback ??
      fallback ??
      ((
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
        </div>
      ) as React.ReactNode);

    return (
      <Suspense fallback={resolvedFallback}>
        {/* @ts-expect-error - Complex generic type inference for lazy components */}
        <LazyComponent {...componentProps} />
      </Suspense>
    );
  };
}

// Preload component for better UX
export function preloadComponent<T>(importFn: () => Promise<T>) {
  return () => {
    importFn();
  };
}

// Lazy loading hook for dynamic imports
export function useLazyComponent<T>(importFn: () => Promise<T>) {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const component = await importFn();

        if (isMounted) {
          setComponent(component);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [importFn]);

  return { Component, isLoading, error };
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5,
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    },
    [],
  );

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex,
  };
}

// Memoized component wrapper
export function withMemoization<P extends object>(
  Component: ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean,
) {
  return React.memo(Component, areEqual);
}

// Performance monitoring component
export function PerformanceMonitor({
  children,
}: {
  children: React.ReactNode;
}) {
  const [renderTime, setRenderTime] = React.useState(0);

  React.useEffect(() => {
    const start = performance.now();

    return () => {
      const end = performance.now();
      setRenderTime(end - start);
    };
  }, []);

  if (process.env.NODE_ENV === "development") {
    return (
      <div>
        {children}
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          Render: {renderTime.toFixed(2)}ms
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
