module.exports = function(csybot, location) {
 
  
  return `
    <style>
        .loader {
          border: 5px solid black;
          border-top-color: #0e0;
          border-right-color: #0dd;
          border-bottom-color: #f90;
          border-radius: 50%;
          width: 130px;
          height: 130px;
          left:50%;
          top:50%;
          margin:-100px 0 0 -100px;
          position:absolute;
          align-items: center;
        }
        .loader img {
          align-items: center;
          height: 120px;
          width: 120px;
          animation: spinloader 2s linear infinite;
          background-repeat:no-repeat;
          background-position:center;
          vertical-align: middle;
          box-sizing: border-box;
        }
	      @keyframes spinloader {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .loaderin {
          position:fixed;
          top:0;
          left:0;
          right:0;
          bottom:0;
          background-color: #1d1e28;
          z-index:99;
        }
        .loaderin .loader span {
          margin: 0 0 0 30px;
          color: blue;
        }
    </style>

    <div class="loaderin" id="loader">
      <div class="loader" id="loaderin">
        <img src="${csybot.config.web.apipath}/libs/img/logo.png" /><br><br>
        <span id="fushs">Loading..</span>
      </div>
    </div>
  `;
}