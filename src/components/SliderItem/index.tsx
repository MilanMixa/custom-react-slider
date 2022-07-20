import { SliderItemType } from "../../types";

import "./SliderItem.css";

export type Props = SliderItemType;

function SliderItem({ image }: Props) {
  return (
    <li className="swiper-item">
      <img src={image} className="swiper-img" draggable={false} />
    </li>
  );
}

export default SliderItem;
