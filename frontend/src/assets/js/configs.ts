const isBackendOn =
  import.meta.env.VITE_BACKEND === undefined ? true : import.meta.env.VITE_BACKEND === "true";
const githubLink = "https://github.com/GymMed/Picture-Sizer";

export { isBackendOn, githubLink };
