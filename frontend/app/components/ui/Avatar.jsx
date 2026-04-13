"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import "../../../styles/ui/Avatar.css";

function Avatar({
  className,
  ...props
}) {
  const classesFinais = [
    "avatar",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={classesFinais}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}) {
  const classesFinais = [
    "avatar__imagem",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={classesFinais}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  const classesFinais = [
    "avatar__alternativa",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={classesFinais}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
