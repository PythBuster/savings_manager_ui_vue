# Savings Manager

Savings Manager is a straightforward app for organizing savings. With its intuitive interface, you can create virtual envelopes for different savings objectives, deposit and withdraw funds easily, and transfer money between envelopes seamlessly. Set up automated savings distribution cycles to streamline your progress towards financial goals.

Check it out at the link below using its backend available at https://github.com/Jasmin68k/savings-manager-backend-js:

https://savings-manager.siliconmoon.com/

## Configuration

Create `.env.local` in root directory and set `VITE_BACKEND_URL` to the URL of the backend server.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Serve production build

```
npm run preview
```

### Run linter

```
npm run lint
```

### Run formatter

```
npm run format
```

## History

The project began with the creation of a frontend designed to complement the Python backend, inspired by its UI mockups, available at https://github.com/PythBuster/savings_manager. This backend has also been preserved at https://github.com/Jasmin68k/savings-manager-backend.

To fully implement all features initially envisioned by the original backend's author, the backend was first reimplemented, then extended upon using NodeJS/Express (see above). This included the completion of all proposed features. The frontend was developed concurrently to ensure seamless integration with the new NodeJS/Express backend, thus meeting the initial project specifications.

A version of this frontend which is not feature-complete yet remains fully API-compatible with the original Python backend is available in the `compatibility/python-backend` branch. The feature-complete version of the project is available in the `master` branch.
