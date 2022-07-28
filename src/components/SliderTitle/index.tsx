import { TextItemType } from "../../types";
import "./SliderTitle.css";

export type SliderTitleProps = {
  text: TextItemType;
  imageWidth?: number;
  layout: string;
};

const SliderTitle = ({ layout, imageWidth, text }: SliderTitleProps) => {
  const { textHeading, textTitle, textSubtitle } = text;
  return (
    <div className={`title-${layout}`} style={{ maxWidth: `${imageWidth}px` }}>
      <span className={`span-${layout}`}></span>
      <p className="features">{textHeading}</p>
      <p className="main-title">{textTitle}</p>
      <p className="descriptionTitle">{textSubtitle}</p>
      <span className={`span-${layout}`}></span>
    </div>
  );
};

export default SliderTitle;
