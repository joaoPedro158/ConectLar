import React from "react";
import "../../../styles/ui/Cartao.css";

function Card({ className, ...props }) {
  const classesFinais = [
    "cartao",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      data-slot="card"
      className={classesFinais}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  const classesFinais = [
    "cartao__cabecalho",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      data-slot="card-header"
      className={classesFinais}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  const classesFinais = [
    "cartao__titulo",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <h4
      data-slot="card-title"
      className={classesFinais}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  const classesFinais = [
    "cartao__descricao",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <p
      data-slot="card-description"
      className={classesFinais}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  const classesFinais = [
    "cartao__acao",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      data-slot="card-action"
      className={classesFinais}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  const classesFinais = [
    "cartao__conteudo",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      data-slot="card-content"
      className={classesFinais}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  const classesFinais = [
    "cartao__rodape",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      data-slot="card-footer"
      className={classesFinais}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
