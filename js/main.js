var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var lineWidth = 5;





autoSetCanvasSize(canvas)

listenToUser(canvas)


var eraserEnabled = false
pen.onclick = function(){
  eraserEnabled = false
  pen.classList.add('active')
  eraser.classList.remove('active')
}
eraser.onclick = function(){
  eraserEnabled = true
  eraser.classList.add('active')
  pen.classList.remove('active')
  
}
clear.onclick = function(){


  context.clearRect(0, 0, canvas.width, canvas.height);
}
download.onclick = function(){
  var url = canvas.toDataURL("image/png")
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = '我的作品'
  a.target = '_blank'
  a.click()
}

black.onclick = function(){
  context.fillStyle = 'black'
  context.strokeStyle = 'black'
  black.classList.add('active')
  red.classList.remove('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
red.onclick = function(){
  context.fillStyle = 'red'
  context.strokeStyle = 'red'
  black.classList.remove('active')
  red.classList.add('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
green.onclick = function(){
  context.fillStyle = 'green'
  context.strokeStyle = 'green'
  black.classList.remove('active')
  red.classList.remove('active')
  green.classList.add('active')
  blue.classList.remove('active')
}
blue.onclick = function(){
  context.fillStyle = 'blue'
  context.strokeStyle = 'blue'
  black.classList.remove('active')
  red.classList.remove('active')
  green.classList.remove('active')
  blue.classList.add('active')
}

thin.onclick = function(){
  lineWidth = 5
}
thick.onclick = function(){
  lineWidth = 10
}

/******/

function autoSetCanvasSize(canvas) {
  setCanvasSize()

  window.onresize = function() {
    setCanvasSize()
  }

  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight

    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}

function drawCircle(x, y, radius) {
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill()
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1) // 起点
  context.lineWidth = lineWidth
  context.lineTo(x2, y2) // 终点
  context.stroke()
  context.closePath()
}

function listenToUser(canvas) {


  var using = false
  var lastPoint = {
    x: undefined,
    y: undefined
  }
  // 特性检测
  if(document.body.ontouchstart !== undefined){
    // 触屏设备 
    canvas.ontouchstart = function(aaa){
      event.preventDefault()
      var x1 = aaa.touches[0].clientX
      var y1 = aaa.touches[0].clientY
      console.log(x1,y1)
      using = true
      if (eraserEnabled) {
        context.save()
        context.beginPath()
        context.arc(x1,y1,10,0,2*Math.PI);
        context.clip()
        context.clearRect(0,0,canvas.width,canvas.height);
        context.restore();
    } else {
        lastPoint = {
          "x": x1,
          "y": y1
        }
      }
    }
    canvas.ontouchmove = function(aaa){
      event.preventDefault()
      var x2 = aaa.touches[0].clientX
      var y2 = aaa.touches[0].clientY

      if (!using) {return}

      if (eraserEnabled) {
                
          　　　　//获取两个点之间的剪辑区域四个端点
          var asin = 10*Math.sin(Math.atan((y2-y1)/(x2-x1)));
          var acos = 10*Math.cos(Math.atan((y2-y1)/(x2-x1)))
          var x3 = x1+asin;
          var y3 = y1-acos;
          var x4 = x1-asin;
          var y4 = y1+acos;
          var x5 = x2+asin;
          var y5 = y2-acos;
          var x6 = x2-asin;
          var y6 = y2+acos;

          　　　　//保证线条的连贯，所以在矩形一端画圆
          context.save()
          context.beginPath()
          context.arc(x2,y2,10,0,2*Math.PI);
          context.clip()
          context.clearRect(0,0,canvas.width,canvas.height);
          context.restore();

          　　　　//清除矩形剪辑区域里的像素
          context.save()
          context.beginPath()
          context.moveTo(x3,y3);
          context.lineTo(x5,y5);
          context.lineTo(x6,y6);
          context.lineTo(x4,y4);
          context.closePath();
          context.clip()
          context.clearRect(0,0,canvas.width,canvas.height);
          context.restore();

          　　　　//记录最后坐标
          x1 = x2;
          y1 = y2;
      } else {
        var newPoint = {
          "x": x2,
          "y": y2
        }
        drawCircle(x2, y2,  Math.floor(lineWidth/2))
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
    canvas.ontouchend = function(){
      event.preventDefault()
      using = false
    }
  }else{
    // 非触屏设备
    canvas.onmousedown = function(aaa) {
      event.preventDefault()
      x1 = aaa.clientX
      y1 = aaa.clientY
      lastPoint = {
        "x": x1,
        "y": y1
      }
      console.log(x1,y1)
      using = true
      if (eraserEnabled) {
                
          context.save()
          context.beginPath()
          context.arc(x1,y1,10,0,2*Math.PI);
          context.clip()
          context.clearRect(0,0,canvas.width,canvas.height);
          context.restore();


      } else {

        drawCircle(x1, y1, Math.floor(lineWidth/2))

      }
    }
    canvas.onmousemove = function(aaa) {
      event.preventDefault()
       x2 = aaa.clientX
       y2 = aaa.clientY
       var newPoint = {
        "x": x2,
        "y": y2
      }
      if (!using) {return}

      if (eraserEnabled) {
        
　　　　//获取两个点之间的剪辑区域四个端点
        var asin = 10*Math.sin(Math.atan((y2-y1)/(x2-x1)));
        var acos = 10*Math.cos(Math.atan((y2-y1)/(x2-x1)))
        var x3 = x1+asin;
        var y3 = y1-acos;
        var x4 = x1-asin;
        var y4 = y1+acos;
        var x5 = x2+asin;
        var y5 = y2-acos;
        var x6 = x2-asin;
        var y6 = y2+acos;
        
　　　　//保证线条的连贯，所以在矩形一端画圆
        context.save()
        context.beginPath()
        context.arc(x2,y2,10,0,2*Math.PI);
        context.clip()
        context.clearRect(0,0,canvas.width,canvas.height);
        context.restore();
    
　　　　//清除矩形剪辑区域里的像素
        context.save()
        context.beginPath()
        context.moveTo(x3,y3);
        context.lineTo(x5,y5);
        context.lineTo(x6,y6);
        context.lineTo(x4,y4);
        context.closePath();
        context.clip()
        context.clearRect(0,0,canvas.width,canvas.height);
        context.restore();
        
　　　　//记录最后坐标
        x1 = x2;
        y1 = y2;
    }
      
    else {

        drawCircle(x2, y2, Math.floor(lineWidth/2))
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }

    }
    canvas.onmouseup = function(aaa) {
      event.preventDefault()
      using = false
    }
  }

}
console.log(1)

