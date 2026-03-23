# Movie Collection Manager (Angular Assessment)

## Overview

This project is a modern Angular application that allows users to search for movies using the TMDB API and organize them into personalized collections. It was developed to demonstrate best practices in frontend development, architecture, state management, and modern Angular features.

## Key Features

- **Movie Search & Discovery:** Real-time search using the TMDB API with debounced inputs, error handling, and pagination.
- **Collection Management:** Users can create, view, and manage custom movie collections.
- **Batch Operations:** Select multiple movies from search results to add them to a collection simultaneously.
- **Persistent Storage:** Custom wrapper around Browser Local/Session Storage to securely persist collections across reloads.
- **Modal Routing:** Movie details are displayed using auxiliary routes and dialogs for a seamless user experience.

## Tech Stack & Architecture

- **Framework:** Angular (Standalone Components, modern Control Flow)
- **Reactivity:** Angular Signals (`signal`, `computed`, `toSignal`) & RxJS for robust asynchronous data streams.
- **UI/UX:** Angular Material & SCSS for a clean, responsive, and accessible interface.
- **Architecture:** Feature-Sliced Design (FSD) approach. The application is modularized into `core`, `features`, and `shared` directories to ensure scalability and separation of concerns.
- **Change Detection:** Strictly `OnPush` change detection across components to maximize performance and prevent unnecessary re-renders.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.io/cli) installed globally (`npm install -g @angular/cli`)

### Installation

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set up your TMDB API Key:
   Ensure you have a valid TMDB API key. Update the `src/environments/environment.ts` file with your API credentials.
   
   > **Security Note:** Storing API keys directly in frontend routing or environment files is an anti-pattern for production applications, as they are inevitably exposed in the client-side bundle. For the scope of this frontend assessment and ease of local evaluation, the key is placed in `environment.ts`. In a true production scenario, I would implement a BFF (Backend-for-Frontend) pattern or an API Gateway. The frontend would call our own secure backend, which would then attach the secretly-stored API key to the request and act as a proxy to the TMDB API.


### Development Server

Run the application locally:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


## Design Decisions & Trade-offs

- **Signals + RxJS Interop:** I leveraged Angular Signals (`toSignal`) to manage local component state synchronously and efficiently, while reserving RxJS for complex asynchronous operations (like debounced API calls along with `switchMap`). This provides the best of both worlds.
- **State Management:** For this scale, a heavyweight state management library (like NgRx) would be overkill. State is managed via specialized services combined with reactive Signals, adhering to the principle of "keep it simple, but scalable."
- **Modular vs Standalone:** I opted for Standalone Components (eliminating `NgModules`), which is the modern Angular standard, reducing boilerplate and making the dependency graph explicitly clear per component.
- **Strict Typing:** TypeScript's strict mode is utilized to catch errors at compile time, utilizing interfaces for API models and strict type checks across component logic.