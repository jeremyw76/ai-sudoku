# Project Outline

## Goals

- The goal of this project is to showcase the use of Agentic AI in a dev environment.
- This project will demonstrate how an AI Agent can execute on a given design document
  outlining the architecture and design patterns to be used.
- The project itself will be a collection of well-delineated sub-projects, each acting as a space in which
  to experiment with AI collaboration in different scenarios.

## Architecture
- This project uses Node.js for a back-end and React.js for a front-end.
- Each sub-project should be separated into its own filespace in both the front- and back-ends.
- A folder for common functions, in both the front- and back-ends, may be used if needed.
- A Project Outline should be created in a sub-folder of /docs (where this file is located) for each
  of the sub-projects.

### Back-end architecture
- Each sub-project should contain its own router file.
- The main `server.js` file should only contain configuration for these individual router files.
- All route-handling logic for individual sub-projects should be contained in the sub-project router file.
- Each sub-project should contain its own `services` folder. Sub-project-specific services will live there.
- Each folder in the back-end should have its own `__tests__` folder.
- Every router file and service in the back-end needs to have a corresponding test file in the nearest `__tests__` folder.
- Back-end tests will use the Jest test framework.
    - **Important** Test warnings may not be turned off by redirecting console output.

### Front-end architecture
- The front-end will use Vite for bundling and to serve files.
- Each sub-project should have its own folder within the `src` folder.
- Each sub-project folder should have an `index.jsx` file containing the outermost
  component of the sub-project's main page.
- Each sub-project folder should have a `components` folder, containing individual JSX components
  for the sub-project's main page.
- Each sub-project folder should have a `hooks` folder for individual React hooks required by
  any of the sub-project's components or its main page.
- Any `.css` resources should live in the same folder as the page or component that requires them.
- Every folder containing JSX should have its own `__tests__` folder.
- Every JSX file should have a corresponding test file in the nearest `__tests__` folder.
- Front-end tests will use the Jest test framework.

## Constraints
- Every file must adhere to its associated linter.
- Pull requests must not be made if any tests are failing.

## 