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
