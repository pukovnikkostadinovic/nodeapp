var socket = io.connect('http://localhost:3000');
//var socket = io.connect('http://yeti.cf:80');

var ctx = document.getElementById('line_chart_temp').getContext('2d')
var ctx1 = document.getElementById('line_chart_humid').getContext('2d')
var ctx2 = document.getElementById('bar_chart').getContext('2d')
    var hdata = {
      labels: [0],
      datasets: [{
        data: [0],
        label: 'Temperature 1',
        fill: false,
        //backgroundColor: '#fdfefe',
        borderColor:'#ff6600'
      },
      {
        data: [0],
        label: 'Temperature 2',
        backgroundColor: '#fdfefe',
        fill: false,
        borderColor:'#2c3e50'
      }]
    }
		var temp_data = {
      labels: [0],
      datasets: [{
        data: [0],
        label: 'Temperature',
        fill: false,
        //backgroundColor: '#fdfefe',
        borderColor:'#ff6600'
      }]
    };
		var temp_options=  {
			reponsive:true,
      animation: {
      duration: 1400,
      easing:'linear',
			scales:{
				yAxes: [
					{
						display:true,
						ticks:{
							//beginAtZero:true,
							min:10,
							steps: 11,
							stepValue: 1,
							max:35
						}
					}
				]
			}
    }
	};
    var bar_data = {
      labels:["TEmp1","Temp2"],
      datasets: [
      {
        label:['temp1'],
        data:[0],
        fill:false,
        backgroundColor:'#ff6600'
      },
      {
        label:['temp2'],
        data:[0],
        fill: false,
        backgroundColor:'#2c3e50'
      }]
    }
    var optionsAnimations = {
			reponsive:true,
      animation: {
      duration: 1400,
      easing:'linear'
    } }
    var chart = new Chart(ctx, {
      type: 'line',
      data: temp_data,
      options: temp_options
    });
    var bar_chart = new Chart(ctx2, {
      type:'bar',
      data:bar_data,
      options:{
        scales:{
          yAxes: [
            {
              display:true,
              ticks:{
                beginAtZero:true,
                //min:0,
                steps: 11,
                stepValue: 1,
                max:11
              }
            }
          ]
        },
        responsive:false,
        animation:{
          duration: 100,
          easing:'linear'
        }
      }
    });
    socket.on('temperature', function (value) {
      var length = temp_data.labels.length
      if (length >= 30) {
        temp_data.datasets[0].data.shift()
        //temp_data.datasets[1].data.shift()
        temp_data.labels.shift()
      }

      temp_data.labels.push(moment().format('HH:mm:ss'))
      temp_data.datasets[0].data.push(value.temp1)
      //temp_data.datasets[1].data.push(value.temp2)

      bar_data.datasets[0].data.shift()
      //bar_data.datasets[1].data.shift()
      bar_data.datasets[0].data.push(value.temp1);
      //bar_data.datasets[1].data.push(value.temp2);
      bar_chart.update(0);
      chart.update();

    })
