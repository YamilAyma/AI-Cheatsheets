---
version: "1.0"
name: "Aqua-Archive"
description: "Skeuomorphic design system blending early 2000s OS X aesthetics with Wikipedia-level information density."

# Colors: Defining depth and materiality
colors:
  primary: "#0066CC"        # Classic Aqua Blue
  primary-light: "#6CB4EE"  # Highlight for blue elements
  primary-dark: "#1A5AA0"   # Shadow for blue elements
  surface: "#F4F4F4"        # Pinstripe background base
  surface-elevated: "#FFFFFF" # Content area / Paper
  on-surface: "#1E293B"     # Dark slate for readable text
  metal-base: "#D1D1D1"     # Brushed metal foundation
  metal-border: "#8E8E8E"   # Sharp mechanical borders
  accent: "#FFCC00"         # Notification/Star yellow

# Typography: Modern Humanist (Plus Jakarta Sans)
typography:
  headline-lg:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "32px"
    fontWeight: 800
    letterSpacing: "-0.03em"
  headline-md:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "24px"
    fontWeight: 700
  body-lg:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "1.6"
  body-md:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label-sm:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "12px"
    fontWeight: 600

# Shapes: Small radius for an engineered look
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
  lg: "8px"
  pill: "9999px"

# Spacing: Dense (8px base)
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "32px"

# Component Specifications
components:
  panel:
    background: surface-elevated
    borderRadius: md
    borderWidth: "1px"
    borderColor: "#E2E8F0"
    boxShadow: "inset 0 1px 0 #fff, 0 1px 3px rgba(0,0,0,0.1)"
  button-aqua:
    background: "linear-gradient(to bottom, #6CB4EE, #0066CC)"
    borderRadius: pill
    padding: "4px 16px"
    color: "#FFFFFF"
    fontWeight: 600
    border: "1px solid #1A5AA0"
---

# DESIGN.md — Aqua-Archive System

## Overview
Aqua-Archive is a technical design system designed for the **AI-Cheatsheets** project. It aims to transform a standard documentation site into a "Professional Knowledge Archive".

### Design Philosophy
- **Physical Feedback**: Every interactive element must look like it can be pressed, clicked, or moved.
- **Hierarchical Density**: Use nested sidebars and multi-column layouts to minimize scrolling and maximize information discovery.
- **Materiality**: Backgrounds use pinstripes, headers use metal, and content uses paper.

---

## Colors & Materiality

### The Metal Header
The top navigation uses a horizontal brushed metal texture. This isn't just a color; it's a feeling of stability.
- **Primary Metal**: `metal-base` (#D1D1D1).
- **Border**: `metal-border` (#8E8E8E) - used to separate the "hardware" from the "software" (content).

### The Aqua Action
The primary action color is Blue. It must always have a gradient to simulate a liquid capsule.
- Use `primary-light` at the top and `primary-dark` at the bottom.

---

## Typography Hierarchy
We priority **readability at small sizes** using **Plus Jakarta Sans**, a modern humanist font that captures the friendly clarity of early Apple interfaces without the overexposure of Inter.
- **Headlines**: Use heavy weights (700-800) but compact spacing.
- **Lists & Tables**: Use `body-md` (14px) as the standard for cheatsheet data to ensure high density.

---

## Layout & Grids
The system follows a **Fixed-Sidebar** model.
- **Main Column**: Max 800px for readable line lengths.
- **Sidebar**: 240px for the "Index" and "Tools".
- **Gaps**: Strict 16px (`md`) or 24px (`lg`) spacing between panels.

---

## Do's and Don'ts

### ✅ Do
- Use subtle `box-shadow` to create depth.
- Use `pinstripe` background for large empty areas.
- Ensure all text has sufficient contrast against the surface.
- Use Plus Jakarta Sans for all UI elements.

### ❌ Don't
- Use pure white backgrounds for everything; use `surface` (#F4F4F4) to frame content.
- Use "modern" large-radius corners (e.g., 24px); keep it between 4px and 8px for an OS look.
- Use flat buttons without borders.
