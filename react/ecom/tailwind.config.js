module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors:{
            primary: "#fea928",
            secondary:"#ed8900"
        },
        container:{
            center:true,
            padding:{
                default:"1rem",
                sm:"3rem",
            }
        }
      },
    },
    plugins: [],
  }