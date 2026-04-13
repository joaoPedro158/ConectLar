"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import "../../../styles/ui/Deslizador.css";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  const classes = ["deslizador", className].filter(Boolean).join(" ").trim();

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={classes}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="deslizador__trilha"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="deslizador__intervalo"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="deslizador__indicador"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
