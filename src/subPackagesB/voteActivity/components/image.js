export function palette({url, code,avtar,text1}) {
  return ({
    "width": "750px",
    "height": "1150px",
    "background": "#ffffff",
    "views": [
      {
      "type": "image",
      "url": url,
      "css": {
        "width": "750px",
        "height": "1150px",
        "top": "0px",
        "left": "0px",
      }
    },
      {
        "type": "qrcode",
        "content": code,
        "css": {
          "color": "#000000",
          "background": "#ffffff",
          "width": "100px",
          "height": "100px",
          "bottom": "18px",
          "right": "50px",
        }
      },
      {
        "type": "image",
        "url": avtar,
        "css": {
          "width": "304px",
          "height": "400px",
          "top": "316px",
          "left": "226px",
          "borderRadius": "16px",
          "borderWidth": "10px",
          "borderColor": "#FDE2A8",
        }
      },
      {
        "type": "text",
        "text": text1,
        "css": {
          "color": "#F7DAB9",
          "width": "750px",
          "height": "40px",
          "top": "758px",
          "left": "0px",
          "fontSize": "36px",
          "fontWeight": "bold",
          "lineHeight": "40px",
          "textAlign": "center"
        }
      }
    ]
  });
}
