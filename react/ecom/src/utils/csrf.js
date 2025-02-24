export function getCsrfToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  }
  

  console.log("CSRF Token:", getCsrfToken());