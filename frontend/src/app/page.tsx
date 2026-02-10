"use client";

import Link from "next/link";
import { Navbar } from "@/sections/core/desing-system/Navbar/navbar";
import { AppTitle } from "@/sections/core/components/AppTitle";
import { supportedStores } from "@/data/supportedStores";
import { Hero } from "@/sections/core/components/hero/Hero";
import { Card } from "@/sections/core/desing-system/card/Card";
import { CardHeader } from "@/sections/core/desing-system/card/CardHeader";
import { CardContent } from "@/sections/core/desing-system/card/CardContent";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={`flex flex-col ${styles.page}`}>
      <Navbar>
        <Navbar.Left>
          <AppTitle />
        </Navbar.Left>
        <Navbar.Right>
          <ul className={`flex items-center gap-3 ${styles.navbarList}`}>
            <li>
              <Link
                href="/signin"
                className={`inline-flex items-center justify-center ${styles.signinBtn}`}
              >
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </Navbar.Right>
      </Navbar>
      <Hero />
      <section className={styles.supportedStores}>
        <h2 className="text-center font-bold -tracking-wide m-0 lg:text-4xl">
          Tiendas compatibles
        </h2>
        {/* StoreCard */}
        <div className="grid gap-6 lg:grid-cols-3">
          {supportedStores.map((store) => (
            <Card
              key={store.name}
              orientation="vertical"
              bgColor={store.bgColor}
            >
              <CardHeader>
                <span className="lg:text-xl -tracking-wide font-bold text-[#009de0]">
                  {store.name}
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-5 text-gray-100 font-light">
                  {store.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className={`flex items-center justify-center ${styles.footer}`}>
        <p className={styles.text}>
          © 2025 Price Watch — Hecho con ❤️ en México
        </p>
      </footer>
    </div>
  );
}
