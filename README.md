# 🛒 Price Watch Platform — Backend
**Node.js · Clean Architecture (Hexagonal) · TypeScript · PostgreSQL + DrizzleORM · JWT Auth · Scraper (Puppeteer)**

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Drizzle](https://img.shields.io/badge/ORM-DrizzleORM-lightgrey)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Architecture](https://img.shields.io/badge/Architecture-Hexagonal-important)

---

## 📌 Resumen del Proyecto

Este backend implementa una **plataforma de monitoreo de precios en e-commerce**:

✅ **Arquitectura Hexagonal / DDD**  
✅ **Autenticación segura con JWT (vía cookies httpOnly)**  
✅ **Scraper de productos** (Amazon / Liverpool)
✅ **Control de monitoreo por usuario**
✅ **Historial de precios**  
✅ **PostgreSQL + Drizzle ORM**  
✅ **Totalmente dockerizado**
✅ **Tests unitarios + integración (Jest)** 

---

## 🏗️ Arquitectura General
```bash
src/
├── modules/          # Contiene la lógica de negocio modularizada (Módulos)
│   ├── auth/         # Módulo: Autenticación de Usuarios
│   │   ├── application/  # Caso de Uso (Lógica de orquestación)
│   │   ├── domain/       # Entidades y Reglas de Negocio (El 'Core')
│   │   └── infra/        # Adaptadores (Bases de datos, APIs externas, etc.)
│   ├── products/     # Módulo: Gestión de Productos
│   │   ├── application/
│   │   ├── domain/
│   │   └── infra/
│   └── scraper/      # Módulo: Web Scraper
│       ├── application/
│       ├── domain/
│       └── infra/
└── shared/           # Elementos transversales que se usan en todo el proyecto
    └── utils/

- **Domain:** Entidades, Value Objects, reglas de negocio  
- **Application:** Use cases, puertos  
- **Infrastructure:** Controladores, routers, repositorios, Drizzle, scrapers  
```
---

## 🚀 Features principales

### 🔐 Autenticación
- Registro y login con hashing seguro (bcrypt)
- Tokens JWT almacenados en **cookies httpOnly**
- Middleware de autorización y protección de rutas

### 🛒 Gestión de Productos
- Guardado de productos monitoreados por usuario  
- Previas (preview) sin guardar  
- Historial de precios  
- Upsert inteligente por URL + usuario  
- Estados del monitoreo (Active, Paused, Disabled)

### 🤖 Scraper
- Puppeteer con:
  - Rotación de user agents
  - Retries
  - Extracción rápida (5–8s por producto)

---

# 🛒 Price Watch Platform — Frontend  
**Next.js 14 (App Router) · TypeScript · Redux Toolkit · RTK Query · TailwindCSS**

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-teal)

---

## 🎯 Resumen del Proyecto

Este frontend implementa la interfaz del sistema de monitoreo de precios:

✅ Registro / Login  
✅ Autenticación con cookies httpOnly  
✅ Redux Toolkit + RTK Query para consumo del backend  
✅ Dashboard del usuario  
✅ Agregar productos al monitoreo  
✅ Vista de productos monitoreados  
✅ Arquitectura modular escalable  
✅ UI limpia con TailwindCSS

---

## 🏗️ Arquitectura General
```bash
src/
├── app/                  # Directorio principal de ruteo (Next.js App Router)
│   ├── (auth)/           # Grupo de rutas o layouts relacionados con Autenticación
│   ├── dashboard/        # Rutas específicas del panel de control
│   ├── products/         # Rutas para la gestión de productos
│
├── Auth/                 # Módulo de Autenticación (Lógica, hooks, servicios)
│
├── Products/             # Módulo de Productos (Lógica, hooks, servicios)
│
├── states/               # Manejo global del estado (ej. Redux Toolkit, Zustand)
│   ├── api/              # Lógica de manejo de peticiones (ej. RTK Query)
│   │   ├── baseApi.ts    # Configuración base para la API
│   │   └── apiSlice.ts   # Slices específicos de la API
│   └── apiSlice.ts       # Slices de estado global (no relacionados con la API)
│
├── components/           # Componentes UI reutilizables (Botones, Tarjetas, etc.)
├── constants/            # Valores inmutables y de configuración global
└── utils/                # Funciones auxiliares (helpers)

```
