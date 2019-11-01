import { PixelRatio } from 'react-native'

const fontSize = PixelRatio.getPixelSizeForLayoutSize(8)

export const overlay = `
<html>
<header>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  
  <style>
    html {
      font-size: ${fontSize}px;
    }
  
    .btn {
      position: absolute;
      display: block;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      text-decoration: none;
      width: 2rem;
      height: 10rem;
      text-align: center;
    }
  
    .left {
      left: 0;
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
    
    .right {
      right: 0;
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
    }
    
    .text {
      top: 0;
      bottom: 0;
      font-size: 1rem;
      position: absolute;
      display: inline-block;
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
  </style>
</header>

<body>
   <a href='sodyosdk://handleCloseSodyoScanner'>Close</a>
   
   <a class='btn left' href='sodyosdk://handlePressLeft'>
     <span class='text'>Left</span>
   </a>
   <a class='btn right' href='sodyosdk://handlePressRight'>
     <span class='text'>Right</span>
   </a>
</body>
</html>
`
