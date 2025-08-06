"use client"
import { useEffect, useState } from "react";
import clsx from "clsx";

const colors = [
  "#66D9EF", // Cian
  "#A6E22E", // Verde lima
  "#F92672", // Magenta
  "#AE81FF", // Morado
  "#FD971F", // Naranja
  "#E6DB74", // Amarillo
];

export function ColourfulText({text="components"}: {text?: string}) {
  const [currentColors, setCurrentColors] = useState(colors)
  const [count, setCount] = useState(0)

    useEffect(() => {
      const interval = setInterval(() => {
        const shuffled = [...colors].sort(() => Math.random() - 0.5)
        setCurrentColors(shuffled)
        setCount(prevCount => prevCount + 1)
      }, 5000)
      return () => clearInterval(interval)
    }, [])

    const keyframes = `
    @keyframes bounce-blur-fade {
      0% {
        transform: translateY(0px) scale(1);
        filter: blur(0px);
        opacity: 1;
      }
      50% {
        transform: translateY(-3px) scale(1.01);
        filter: blur(2px);
        opacity: 0.8;
      }
      100% {
        transform: translateY(0px) scale(1);
        filter: blur(0px);
        opacity: 1;
      }
    }
  `;

    return (
      <>
      <style>{keyframes}</style>
      {text.split("").map((char, index) => {
        // El key se actualiza con el contador para reiniciar la animación
        return (
          <span
            key={`${char}-${count}-${index}`}
            className={clsx(
              "inline-block whitespace-pre",
              // La transición de color es la clave de la animación
              "transition-colors duration-1000 ease-in-out"
            )}
            style={{
              color: currentColors[index % currentColors.length],
              animation: `bounce-blur-fade 0.5s ease-in-out forwards`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            {char}
          </span>
        );
      })}
    </>
    )
}
