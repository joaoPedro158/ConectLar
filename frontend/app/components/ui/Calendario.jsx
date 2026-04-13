"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import "../../../styles/ui/Calendario.css";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  const classes = ["calendario", className].filter(Boolean).join(" ").trim();

  const cellClasses = props.mode === "range"
    ? "calendario__celula calendario__celula--range"
    : "calendario__celula";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={classes}
      classNames={{
        months: "calendario__meses",
        month: "calendario__mes",
        caption: "calendario__legenda",
        caption_label: "calendario__legenda-rotulo",
        nav: "calendario__navegacao",
        nav_button: "calendario__navegacao-botao",
        nav_button_previous: "calendario__navegacao-botao--anterior",
        nav_button_next: "calendario__navegacao-botao--proximo",
        table: "calendario__tabela",
        head_row: "calendario__cabecalho-linha",
        head_cell: "calendario__cabecalho-celula",
        row: "calendario__linha",
        cell: cellClasses,
        day: "calendario__dia",
        day_range_start: "calendario__dia--inicio-intervalo",
        day_range_end: "calendario__dia--fim-intervalo",
        day_selected: "calendario__dia--selecionado",
        day_today: "calendario__dia--hoje",
        day_outside: "calendario__dia--fora",
        day_disabled: "calendario__dia--desabilitado",
        day_range_middle: "calendario__dia--meio-intervalo",
        day_hidden: "calendario__dia--oculto",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => {
          const iconClasses = ["calendario__icone", className].filter(Boolean).join(" ").trim();
          return <ChevronLeft className={iconClasses} {...props} />;
        },
        IconRight: ({ className, ...props }) => {
          const iconClasses = ["calendario__icone", className].filter(Boolean).join(" ").trim();
          return <ChevronRight className={iconClasses} {...props} />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
