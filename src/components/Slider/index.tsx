// TYPES:
import { SliderItemType, TextItemType } from "../../types";

// STYLES:
import "./Slider.css";

// COMPONENTS:
import SliderItem from "../SliderItem";

// HOOKS
import useSlider from "./useSlider";
import SliderTitle from "../SliderTitle";

export type Props = {
  slides: Array<SliderItemType>;
  text: TextItemType;
  imageWidth?: number;
  layout: string;
  autoPlay?: { isOn: boolean; delay: number };
};

function Slider({ slides, text, imageWidth, layout, autoPlay }: Props) {
  const {
    containerRef,
    indicatorOnClick,
    countRef,
    isSwiping,
    offsetX,
    onTouchStart,
    height,
    textBoxRef,
    desc,
  } = useSlider({ slides, autoPlay });

  return (
    <div className={`sliderFont slider-${layout}`}>
      <SliderTitle layout={layout} imageWidth={imageWidth} text={text} />
      <div className="swiper-wrapper">
        <div
          className="swiper-container"
          onTouchStart={onTouchStart}
          onMouseDown={onTouchStart}
          style={{ maxWidth: `${imageWidth}px` }}
        >
          <ul
            ref={containerRef}
            className={`swiper-list ${isSwiping ? "is-swiping" : ""}`}
            style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
          >
            {slides.map((item, idx) => (
              <SliderItem key={idx} {...item} />
            ))}
          </ul>
          <ul className="swiper-indicator">
            {slides.map((_item, idx) => (
              <li
                key={idx}
                className={`swiper-indicator-item ${
                  countRef.current === idx ? "active" : ""
                }`}
                onClick={() => indicatorOnClick(idx)}
              />
            ))}
          </ul>
        </div>
        <div className={`text-div-${layout}`} style={{ height: `${height}px` }}>
          <p
            className="text-box"
            ref={textBoxRef}
            key={`desc${countRef.current}`}
          >
            {desc}
          </p>
        </div>
        <span className={`counter-${layout}`}>
          0{countRef.current + 1}/0{slides.length}
        </span>
      </div>
    </div>
  );
}

export default Slider;
