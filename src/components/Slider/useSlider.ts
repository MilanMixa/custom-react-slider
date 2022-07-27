import React, { useCallback, useEffect, useRef, useState } from "react";

//HOOKS:
import { useStateRef, getRefValue } from "../../hooks/useStateRef";
import { getTouchEventData } from "../../hooks/useTouchEventData";

const useSlider = ({ slides, autoPlay }: any) => {
  const MIN_SWIPE_REQUIRED = 40;

  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const countRef = useRef<number>(0);
  const textBoxRef = useRef<any>(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [height, setHeight] = useState();
  const [desc, setDesc] = useState("");
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);

  const indicatorOnClick = useCallback(
    (idx: number) => {
      const containerEl = getRefValue(containerRef);
      const containerWidth = containerEl.offsetWidth;

      countRef.current = idx;
      setOffsetX(-(containerWidth * idx));
    },
    [setOffsetX]
  );

  const count = countRef.current;
  useEffect(() => {
    setDesc(slides[countRef.current].description);
  }, [count, slides]);

  useEffect(() => {
    if (desc) {
      setTimeout(() => {
        textBoxRef?.current.classList.add("text-box-animate");
        setHeight(() => textBoxRef?.current.clientHeight);
      }, 200);
    }
  }, [textBoxRef, desc]);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined;
    if (autoPlay && !isSwiping) {
      interval = setInterval(() => {
        countRef.current = countRef.current + 1;
        if (countRef.current > slides.length - 1) {
          countRef.current = 0;
        }
        indicatorOnClick(countRef.current);
      }, 3000);
    } else clearInterval(interval);
    return () => clearInterval(interval);
  }, [autoPlay, isSwiping, slides, indicatorOnClick]);

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = maxOffsetX;
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = minOffsetX;
    }

    setOffsetX(newOffsetX);
  };
  const onTouchEnd = () => {
    const currentOffsetX = getRefValue(currentOffsetXRef);
    const containerWidth = getRefValue(containerWidthRef);
    let newOffsetX = getRefValue(offsetXRef);

    const diff = currentOffsetX - newOffsetX;

    // we need to check difference in absolute/positive value (if diff is more than 40px)
    if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
      if (diff > 0) {
        // swipe to the right if diff is positive
        newOffsetX = Math.floor(newOffsetX / containerWidth) * containerWidth;
      } else {
        // swipe to the left if diff is negative
        newOffsetX = Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }
    } else {
      // remain in the current image
      newOffsetX = Math.round(newOffsetX / containerWidth) * containerWidth;
    }

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    countRef.current = Math.abs(newOffsetX / containerWidth);

    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mouseup", onTouchEnd);
    window.removeEventListener("mousemove", onTouchMove);
  };
  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    setIsSwiping(true);

    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;

    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    containerWidthRef.current = containerWidth;
    minOffsetXRef.current = containerWidth - containerEl.scrollWidth;

    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchEnd);
  };

  return {
    containerRef,
    indicatorOnClick,
    countRef,
    isSwiping,
    offsetX,
    onTouchStart,
    height,
    textBoxRef,
    desc,
  };
};

export default useSlider;
