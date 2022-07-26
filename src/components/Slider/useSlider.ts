import React, { useEffect, useRef, useState } from "react";

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
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  console.log(currentIdx, "current idx");
  const textBoxRef = useRef<any>(0);
  const [height, setHeight] = useState();

  const [desc, setDesc] = useState("");

  useEffect(() => {
    setDesc(slides[currentIdx].description);
  }, [currentIdx, slides]);

  useEffect(() => {
    if (desc) {
      setTimeout(() => {
        textBoxRef?.current.classList.add("text-box-animate");
        setHeight(() => textBoxRef?.current.clientHeight);
      }, 200);
    }
  }, [textBoxRef, desc]);

  useEffect(() => {
    let counter = 0;
    let interval: NodeJS.Timer | undefined = undefined;
    if (autoPlay && !isSwiping) {
      interval = setInterval(() => {
        counter = counter + 1;
        if (counter > slides.length - 1) {
          counter = 0;
        }
        console.log(counter, "counter");

        indicatorOnClick(counter);
        setCurrentIdx(counter);
      }, 2000);
    } else clearInterval(interval);
    return () => clearInterval(interval);
  }, [autoPlay, isSwiping, slides]);

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
    setCurrentIdx(Math.abs(newOffsetX / containerWidth));

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
  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    setCurrentIdx(idx);
    setOffsetX(-(containerWidth * idx));
  };

  return {
    containerRef,
    indicatorOnClick,
    currentIdx,
    isSwiping,
    offsetX,
    onTouchStart,
    height,
    textBoxRef,
    desc,
  };
};

export default useSlider;
